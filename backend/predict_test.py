import pandas as pd
import joblib


# ============================================================
# 1. LOAD SAVED MODEL AND PREPROCESSOR
# ============================================================

print("Loading trained model...")

model = joblib.load("../model/random_forest_model.pkl")
preprocessor = joblib.load("../model/preprocessor.pkl")

print("Model loaded successfully!")


# ============================================================
# 2. LOAD TEST DATA
# ============================================================

print("\nLoading test dataset...")

df = pd.read_csv("../dataset/UNSW_NB15_testing-set.csv")

print("Test dataset loaded!")
print("Rows:", len(df))


# ============================================================
# 3. SEPARATE FEATURES AND TARGET
# ============================================================

# Save the actual labels for comparison
y_actual = df["label"]

# Remove columns that were not used during training
X = df.drop(columns=["id", "attack_cat", "label"])


# ============================================================
# 4. PREPROCESS THE TEST DATA
# ============================================================

print("\nPreprocessing test data...")

X_processed = preprocessor.transform(X)

print("Preprocessing completed!")


# ============================================================
# 5. MAKE PREDICTIONS
# ============================================================

print("\nMaking predictions...")

predictions = model.predict(X_processed)

print("Predictions completed!")


# ============================================================
# 6. SHOW FIRST 20 PREDICTIONS
# ============================================================

print("\n" + "=" * 60)
print("FIRST 20 PREDICTIONS")
print("=" * 60)

for i in range(20):

    actual = y_actual.iloc[i]
    predicted = predictions[i]

    actual_text = "NORMAL" if actual == 0 else "ATTACK"
    predicted_text = "NORMAL" if predicted == 0 else "ATTACK"

    print(
        f"Record {i + 1}: "
        f"Actual = {actual_text} | "
        f"Predicted = {predicted_text}"
    )


# ============================================================
# 7. SUMMARY
# ============================================================

normal_predictions = (predictions == 0).sum()
attack_predictions = (predictions == 1).sum()

print("\n" + "=" * 60)
print("PREDICTION SUMMARY")
print("=" * 60)

print("Predicted Normal:", normal_predictions)
print("Predicted Attack:", attack_predictions)

print("\nPrediction test completed successfully!")