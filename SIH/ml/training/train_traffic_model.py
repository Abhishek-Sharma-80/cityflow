import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

def generate_realistic_traffic_dataset(n_samples=5000):
    """
    Generate structured transportation dataset based on physical urban traffic dynamics:
    - Fundamental diagram of traffic flow (speed-density relationship)
    - Diurnal peak hour dynamics (morning & evening rush hours)
    - Weather factors (precipitation, visibility, temperature)
    - Incident impacts and road capacity features
    """
    np.random.seed(42)
    
    # 1. Temporal features
    hour = np.random.randint(0, 24, n_samples)
    day_of_week = np.random.randint(0, 7, n_samples) # 0=Mon, 6=Sun
    is_weekend = (day_of_week >= 5).astype(int)
    
    # Rush hour intensity function
    morning_rush = np.exp(-((hour - 9) ** 2) / 4) * (1 - is_weekend * 0.5)
    evening_rush = np.exp(-((hour - 18) ** 2) / 6) * (1 - is_weekend * 0.3)
    rush_intensity = np.clip(morning_rush + evening_rush, 0, 1.2)
    
    # 2. Road characteristics
    speed_limit = np.random.choice([30, 50, 60, 80], size=n_samples, p=[0.15, 0.45, 0.25, 0.15])
    lanes = np.random.choice([1, 2, 3, 4], size=n_samples, p=[0.2, 0.4, 0.3, 0.1])
    base_capacity = lanes * 650 # vehicles per hour
    
    # 3. Weather features
    temperature = np.random.uniform(15, 42, n_samples) # Celsius
    rain_mm = np.random.exponential(scale=1.5, size=n_samples)
    rain_mm = np.where(rain_mm < 0.2, 0, rain_mm) # 0 for dry weather
    visibility_km = np.clip(10 - rain_mm * 0.8 + np.random.normal(0, 0.5, n_samples), 1.0, 10.0)
    
    # 4. Incident & bottleneck factors
    active_incidents = np.random.choice([0, 1, 2], size=n_samples, p=[0.85, 0.12, 0.03])
    road_work_present = np.random.choice([0, 1], size=n_samples, p=[0.92, 0.08])
    
    # 5. Current traffic volume & baseline speed
    volume = (base_capacity * (0.2 + 0.6 * rush_intensity + np.random.normal(0, 0.05, n_samples))).clip(50, base_capacity * 1.3)
    volume_capacity_ratio = volume / base_capacity
    
    # Speed calculation based on Greenshields & BPR traffic flow model
    speed_reduction_congestion = 1.0 / (1.0 + 0.15 * (volume_capacity_ratio ** 4))
    speed_reduction_rain = np.where(rain_mm > 5, 0.82, np.where(rain_mm > 0, 0.92, 1.0))
    speed_reduction_incident = np.where(active_incidents == 2, 0.45, np.where(active_incidents == 1, 0.70, 1.0))
    speed_reduction_roadwork = np.where(road_work_present == 1, 0.75, 1.0)
    
    actual_speed = speed_limit * speed_reduction_congestion * speed_reduction_rain * speed_reduction_incident * speed_reduction_roadwork
    actual_speed += np.random.normal(0, 1.8, n_samples)
    actual_speed = np.clip(actual_speed, 5.0, speed_limit)
    
    # 6. Future speed targets: 15m, 30m, 60m ahead
    # Speed will tend to evolve according to rush hour curve change
    future_hour_15m = (hour + 0.25) % 24
    future_rush_15m = np.exp(-((future_hour_15m - 9)**2)/4) + np.exp(-((future_hour_15m - 18)**2)/6)
    delta_rush_15m = future_rush_15m - rush_intensity
    
    speed_15m = np.clip(actual_speed - (delta_rush_15m * 12.0) + np.random.normal(0, 1.5, n_samples), 5.0, speed_limit)
    speed_30m = np.clip(actual_speed - (delta_rush_15m * 20.0) + np.random.normal(0, 2.5, n_samples), 5.0, speed_limit)
    speed_60m = np.clip(actual_speed - (delta_rush_15m * 28.0) + np.random.normal(0, 3.5, n_samples), 5.0, speed_limit)
    
    df = pd.DataFrame({
        'hour': hour,
        'day_of_week': day_of_week,
        'is_weekend': is_weekend,
        'speed_limit': speed_limit,
        'lanes': lanes,
        'temperature': temperature,
        'rain_mm': rain_mm,
        'visibility_km': visibility_km,
        'active_incidents': active_incidents,
        'road_work_present': road_work_present,
        'current_speed': actual_speed,
        'target_speed_15m': speed_15m,
        'target_speed_30m': speed_30m,
        'target_speed_60m': speed_60m,
    })
    return df

def train_and_evaluate():
    print("Generating training dataset for Urban Traffic Dynamics...")
    df = generate_realistic_traffic_dataset(6000)
    
    feature_cols = [
        'hour', 'day_of_week', 'is_weekend', 'speed_limit', 'lanes',
        'temperature', 'rain_mm', 'visibility_km', 'active_incidents',
        'road_work_present', 'current_speed'
    ]
    
    # Chronological train/test split to prevent temporal data leakage
    split_idx = int(len(df) * 0.8)
    train_df = df.iloc[:split_idx]
    test_df = df.iloc[split_idx:]
    
    X_train = train_df[feature_cols]
    X_test = test_df[feature_cols]
    
    models = {}
    metrics = {}
    
    for horizon in ['15m', '30m', '60m']:
        target_col = f'target_speed_{horizon}'
        y_train = train_df[target_col]
        y_test = test_df[target_col]
        
        print(f"\nTraining Gradient Boosting Regressor for {horizon} horizon...")
        model = GradientBoostingRegressor(
            n_estimators=120,
            learning_rate=0.08,
            max_depth=5,
            random_state=42
        )
        model.fit(X_train, y_train)
        
        y_pred = model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        
        # Feature importances
        importances = dict(zip(feature_cols, [round(float(x), 4) for x in model.feature_importances_]))
        
        print(f"Metrics for {horizon}:")
        print(f"  MAE:  {mae:.2f} km/h")
        print(f"  RMSE: {rmse:.2f} km/h")
        print(f"  R2:   {r2:.4f}")
        
        models[horizon] = model
        metrics[horizon] = {
            'mae': round(float(mae), 3),
            'rmse': round(float(rmse), 3),
            'r2': round(float(r2), 4),
            'feature_importance': importances
        }
    
    os.makedirs('ml/models', exist_ok=True)
    
    # Save models and metadata
    for horizon, model in models.items():
        joblib.dump(model, f'ml/models/traffic_model_{horizon}.joblib')
        
    metadata = {
        'model_name': 'CityFlow LightGBM/GBR Urban Traffic Predictor',
        'version': '1.0.0-SIH2026',
        'architecture': 'Gradient Boosting Regressor',
        'features': feature_cols,
        'horizons': ['15m', '30m', '60m'],
        'dataset_samples': len(df),
        'metrics': metrics
    }
    
    with open('ml/models/traffic_model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
        
    print("\n[SUCCESS] Traffic prediction models & metadata saved to ml/models/")

if __name__ == '__main__':
    train_and_evaluate()