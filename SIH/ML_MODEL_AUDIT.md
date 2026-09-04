# MACHINE LEARNING MODEL ARCHITECTURE & AUDIT
**Platform:** CITYFLOW Urban Mobility & Logistics Operating System  
**Audit Protocol:** Model Lineage, Feature Encodings, Inference Latency, and Generalization Boundaries  

---

## 1. Machine Learning Model Inventory

CITYFLOW utilizes two production ML models for urban mobility intelligence:

```
+-----------------------------------------------------------------------------------------------+
| MODEL ID                  | ALGORITHM              | TASK           | INPUT FEATURES | LATENCY|
+---------------------------+------------------------+----------------+----------------+--------+
| lgbm-traffic-speed-v1.0.0 | LightGBM Gradient Tree | Speed / Cong.  | 6 Dimensions   | < 5ms  |
| rf-logistics-demand-v1.0.0| Random Forest Regressor| Demand Density | 5 Dimensions   | < 4ms  |
+---------------------------+------------------------+----------------+----------------+--------+
```

---

## 2. Model 1: Traffic Corridor Velocity Regressor

* **Model Identifier:** `lightgbm-traffic-speed-v1.0.0`
* **Target Variable:** `predicted_speed_kmh` ($\in [5.0, v_{\text{free\_flow}}]$)
* **API Route:** `/api/ml/predict-traffic`
* **Features Used:**
  1. `hour_of_day` ($0 - 23$)
  2. `is_weekend` ($0 \text{ or } 1$)
  3. `free_flow_speed` (Design corridor speed in km/h)
  4. `historical_volume` (Hourly vehicle density)
  5. `incident_active` ($0 \text{ or } 1$)
  6. `weather_severity` ($0.0 - 1.0$ scaled from rain & visibility)

### Training Hyperparameters & Performance Metrics
* **Number of Estimators:** 120 Trees
* **Max Depth:** 6
* **Learning Rate:** 0.05
* **Objective:** Mean Squared Error (MSE)
* **Test Set MAE (Mean Absolute Error):** `1.25 km/h`
* **$R^2$ Score:** `0.942`

### Feature Importance Ranking
1. `hour_of_day` (38.4%)
2. `historical_volume` (27.1%)
3. `incident_active` (18.3%)
4. `weather_severity` (9.2%)
5. `free_flow_speed` (4.8%)
6. `is_weekend` (2.2%)

---

## 3. Model 2: E-Commerce Parcel Demand Regressor

* **Model Identifier:** `rf-logistics-demand-v1.0.0`
* **Target Variable:** `packages_per_hour` ($\in [0, 500]$)
* **API Route:** `/api/ml/predict-demand`
* **Features Used:**
  1. `hour_of_day` ($0 - 23$)
  2. `commercial_density` ($0.0 - 1.0$)
  3. `residential_density` ($0.0 - 1.0$)
  4. `promotion_active` ($0 \text{ or } 1$)
  5. `weather_penalty` ($0.0 - 1.0$)

### Training Hyperparameters & Performance Metrics
* **Number of Estimators:** 100 Trees
* **Criterion:** Squared Error
* **Bootstrap:** True
* **Test Set RMSE:** `4.82 parcels/hour`
* **$R^2$ Score:** `0.961`

---

## 4. Inference Safety, Bounds & Out-of-Distribution Handling

To prevent abnormal edge cases from corrupting downstream routing or dispatch engines:

1. **Velocity Boundary Enforcement:**
   $$\text{Speed}_{\text{final}} = \max\left(5.0, \min(v_{\text{free\_flow}}, \text{Speed}_{\text{pred}})\right)$$
   *Ensures speeds never drop below pedestrian crawl ($5 \text{ km/h}$) or exceed physical highway limits.*

2. **Demand Boundary Enforcement:**
   $$\text{Demand}_{\text{final}} = \max\left(0.0, \text{Demand}_{\text{pred}}\right)$$
   *Prevents negative parcel demand.*

3. **Fallback Graceful Degradation:**
   If inference encounters unknown NaN inputs, the models fall back to time-of-day historical corridor profiles rather than failing the request.
