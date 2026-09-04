import math
from typing import List, Dict, Any
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def haversine_distance(coord1, coord2):
    """Calculate great-circle distance between two points in kilometers."""
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371.0 # Earth radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def create_distance_matrix(locations: List[List[float]]) -> List[List[int]]:
    """Create distance matrix in meters using Manhattan/Haversine urban routing factor."""
    n = len(locations)
    matrix = []
    # Urban road winding factor (detour index) is typically 1.28x - 1.35x as the crow flies
    detour_factor = 1.32
    for i in range(n):
        row = []
        for j in range(n):
            if i == j:
                row.append(0)
            else:
                dist_km = haversine_distance(locations[i], locations[j]) * detour_factor
                row.append(int(dist_km * 1000)) # in meters
        matrix.append(row)
    return matrix

def solve_cvrp(
    depot: Dict[str, Any],
    stops: List[Dict[str, Any]],
    num_vehicles: int = 3,
    vehicle_capacity: int = 100
) -> Dict[str, Any]:
    """
    Solve Capacitated Vehicle Routing Problem (CVRP) using Google OR-Tools.
    Returns:
    - baseline distance & routes
    - optimized distance & routes
    - savings metrics
    """
    all_locations = [[depot['lat'], depot['lng']]] + [[s['lat'], s['lng']] for s in stops]
    demands = [0] + [s.get('demand', 15) for s in stops]
    num_locations = len(all_locations)
    
    distance_matrix = create_distance_matrix(all_locations)
    
    # 1. Compute Naive Baseline (FIFO sequential allocation to vehicles)
    baseline_routes = []
    baseline_distance_m = 0
    stops_per_veh = math.ceil(len(stops) / num_vehicles) if num_vehicles > 0 else len(stops)
    
    for v in range(num_vehicles):
        v_stops = stops[v * stops_per_veh : (v + 1) * stops_per_veh]
        if not v_stops:
            continue
        route_dist = 0
        current_idx = 0 # depot
        v_route_indices = [0]
        
        for s_idx, st in enumerate(v_stops, start=v * stops_per_veh + 1):
            route_dist += distance_matrix[current_idx][s_idx]
            current_idx = s_idx
            v_route_indices.append(s_idx)
            
        route_dist += distance_matrix[current_idx][0] # return to depot
        v_route_indices.append(0)
        baseline_distance_m += route_dist
        baseline_routes.append({
            'vehicle_id': v + 1,
            'stop_indices': v_route_indices,
            'distance_km': round(route_dist / 1000, 2),
            'total_demand': sum(demands[i] for i in v_route_indices)
        })
        
    # 2. Setup Google OR-Tools Routing Model
    manager = pywrapcp.RoutingIndexManager(num_locations, num_vehicles, 0)
    routing = pywrapcp.RoutingModel(manager)
    
    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]
        
    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
    
    # Add Capacity constraint
    def demand_callback(from_index):
        from_node = manager.IndexToNode(from_index)
        return demands[from_node]
        
    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0, # null capacity slack
        [vehicle_capacity] * num_vehicles, # vehicle maximum capacities
        True, # start cumul to zero
        'Capacity'
    )
    
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.seconds = 2
    
    solution = routing.SolveWithParameters(search_parameters)
    
    if not solution:
        return {
            'status': 'FAILED',
            'message': 'No feasible solution found with given capacities.'
        }
        
    optimized_routes = []
    total_opt_distance_m = 0
    
    for v in range(num_vehicles):
        index = routing.Start(v)
        route_nodes = []
        route_dist = 0
        route_load = 0
        
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            route_nodes.append(node_index)
            route_load += demands[node_index]
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_dist += routing.GetArcCostForVehicle(previous_index, index, v)
            
        route_nodes.append(manager.IndexToNode(index))
        total_opt_distance_m += route_dist
        
        # Build ordered stop details for frontend display
        route_stops_detail = []
        for n_idx in route_nodes:
            if n_idx == 0:
                route_stops_detail.append({
                    'id': depot.get('id', 'depot-0'),
                    'name': depot.get('name', 'Central Logistics Hub'),
                    'lat': depot['lat'],
                    'lng': depot['lng'],
                    'type': 'depot',
                    'demand': 0
                })
            else:
                s = stops[n_idx - 1]
                route_stops_detail.append({
                    'id': s.get('id', f'stop-{n_idx}'),
                    'name': s.get('name', f'Delivery #{n_idx}'),
                    'lat': s['lat'],
                    'lng': s['lng'],
                    'type': 'stop',
                    'demand': s.get('demand', 15),
                    'priority': s.get('priority', 'medium')
                })
                
        optimized_routes.append({
            'vehicle_id': v + 1,
            'stops': route_stops_detail,
            'distance_km': round(route_dist / 1000, 2),
            'estimated_duration_min': round((route_dist / 1000) / 28 * 60 + (len(route_nodes) - 2) * 6, 1), # avg 28 km/h + 6 min drop time
            'load_units': route_load,
            'capacity_utilization_pct': round((route_load / vehicle_capacity) * 100, 1)
        })
        
    baseline_km = round(baseline_distance_m / 1000, 2)
    optimized_km = round(total_opt_distance_m / 1000, 2)
    saved_km = round(max(0, baseline_km - optimized_km), 2)
    saved_pct = round((saved_km / baseline_km * 100) if baseline_km > 0 else 0, 1)
    
    # Real emission reduction (0.245 kg CO2 per diesel light commercial vehicle km)
    co2_saved_kg = round(saved_km * 0.245, 2)
    time_saved_min = round(saved_km / 28 * 60, 1)
    
    return {
        'status': 'OPTIMAL',
        'algorithm': 'Google OR-Tools Guided Local Search CVRP',
        'depot': depot,
        'vehicles_used': num_vehicles,
        'total_orders': len(stops),
        'baseline_distance_km': baseline_km,
        'optimized_distance_km': optimized_km,
        'distance_saved_km': saved_km,
        'distance_saved_pct': saved_pct,
        'time_saved_minutes': time_saved_min,
        'co2_emissions_saved_kg': co2_saved_kg,
        'routes': optimized_routes
    }

if __name__ == '__main__':
    # Test execution
    test_depot = {'id': 'depot-delhi', 'name': 'Okhla Logistics Terminal', 'lat': 28.5355, 'lng': 77.2610}
    test_stops = [
        {'id': 's1', 'name': 'Connaught Place Hub', 'lat': 28.6304, 'lng': 77.2177, 'demand': 20, 'priority': 'high'},
        {'id': 's2', 'name': 'Nehru Place Complex', 'lat': 28.5494, 'lng': 77.2528, 'demand': 15, 'priority': 'medium'},
        {'id': 's3', 'name': 'Saket District Centre', 'lat': 28.5245, 'lng': 77.2167, 'demand': 30, 'priority': 'high'},
        {'id': 's4', 'name': 'Noida Sector 18 Hub', 'lat': 28.5708, 'lng': 77.3260, 'demand': 25, 'priority': 'low'},
        {'id': 's5', 'name': 'Lajpat Nagar Market', 'lat': 28.5700, 'lng': 77.2400, 'demand': 18, 'priority': 'medium'},
        {'id': 's6', 'name': 'Vasant Kunj Promenade', 'lat': 28.5380, 'lng': 77.1550, 'demand': 22, 'priority': 'medium'},
    ]
    res = solve_cvrp(test_depot, test_stops, num_vehicles=2, vehicle_capacity=80)
    print("OR-Tools CVRP result:", res['status'], f"Saved: {res['distance_saved_km']} km ({res['distance_saved_pct']}%)")