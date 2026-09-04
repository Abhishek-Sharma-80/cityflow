import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib

def generate_demand_dataset(n_samples=4000):
    np.random.seed(101)
    
    hour = np.random.randint(0, 24, n_samples)
    day_of_week = np.random.randint(0, 7, n_samples)
    is_weekend = (day_of_week >= 5).astype(int)
    
    zone_type = np.random.choice([0, 1, 2], size=n_samples, p=[0.4, 0.35, 0.25]) # 0=Commercial, 1=Residential, 2=Industrial
    
    # Base diurnal curves for different zones
    comm_demand = np.exp(-((hour - 14) ** 2) / 12) * 80 + np.exp(-((hour - 19) ** 2) / 6) * 60
    res_demand = np.exp(-((hour - 10) ** 2) / 8) * 40 + np.exp(-((hour - 20) ** 2) / 10) * 90
    ind_demand = np.exp(-((hour - 11) ** 2) / 10) * 110
    
    raw_demand = np.where(zone_type == 0, comm_demand, np.where(zone_type == 1, res_demand, ind_demand))
    
    # Modifiers
    weekend_modifier = np.where(is_weekend == 1, np.where(zone_type == 1, 1.35, 0.55), 1.0)
    rain_mm = np.random.exponential(scale=1.2, size=n_samples)
    rain_modifier = 1.0 + (rain_mm * 0.08) # Delivery demand surges during rain
    
    total_demand = raw_demand * weekend_modifier * rain_modifier + np.random.normal(0, 5, n_samples)
    total_demand = np.clip(total_demand, 5.0, 300.0)
    
    df = pd.DataFrame({
        'hour': hour,
        'day_of_week': day_of_week,
        'is_weekend': is_weekend,
        'zone_type': zone_type,
        'rain_mm': rain_mm,
        'demand_packages_per_hr': total_demand
    })
    return df

def train_demand():
    print("Training Logistics & Urban Demand Model...")
    df = generate_demand_dataset(5000)
    
    features = ['hour', 'day_of_week', 'is_weekend', 'zone_type', 'rain_mm']
    split = int(len(df) * 0.8)
    
    X_train, X_test = df[features].iloc[:split], df[features].iloc[split:]
    y_train, y_test = df['demand_packages_per_hr'].iloc[:split], df['demand_packages_per_hr'].iloc[split:]
    
    model = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)
    
    print(f"Demand Model Metrics:")
    print(f"  MAE:  {mae:.2f} pkgs/hr")
    print(f"  RMSE: {rmse:.2f} pkgs/hr")
    print(f"  R2:   {r2:.4f}")
    
    os.makedirs('ml/models', exist_ok=True)
    joblib.dump(model, 'ml/models/demand_model.joblib')
    
    meta = {
        'model_name': 'CityFlow Random Forest Demand Estimator',
        'version': '1.0.0-SIH2026',
        'features': features,
        'metrics': {
            'mae': round(float(mae), 3),
            'rmse': round(float(rmse), 3),
            'r2': round(float(r2), 4),
            'feature_importance': dict(zip(features, [round(float(x), 4) for x in model.feature_importances_]))
        }
    }
    with open('ml/models/demand_model_metadata.json', 'w') as f:
        json.dump(meta, f, indent=2)
        
    print("[SUCCESS] Demand model saved.")

if __name__ == '__main__':
    train_demand()