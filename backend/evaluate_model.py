import pandas as pd
import joblib

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)


# ============================================================
# 1. LOAD MODEL
# ============================================================

print("Loading trained model...")

model = joblib.load("../model/random_forest_model.pkl")
preprocessor = joblib.load("../model/preprocessor.pkl")

print("Model loaded successfully!")


# ============================================================
# 2. LOAD OFFICIAL TEST DATASET
# ============================================================

print("\nLoading testing dataset...")

df = pd.read_csv("../dataset/UNSW_NB15_testing-set.csv")

print("Testing dataset loaded!")
print("Rows:", len(df))


# ============================================================
# 3. PREPARE FEATURES AND TARGET
# ============================================================

y = df["label"]

X = df.drop(
    columns=["id", "attack_cat", "label"]
)


# ============================================================
# 4. PREPROCESS
# ============================================================

print("\nPreprocessing test data...")

X_processed = preprocessor.transform(X)

print("Preprocessing completed!")


# ============================================================
# 5. PREDICT
# ============================================================

print("\nRunning predictions...")

y_pred = model.predict(X_processed)

print("Predictions completed!")


# ============================================================
# 6. ACCURACY
# ============================================================

accuracy = accuracy_score(y, y_pred)

print("\n" + "=" * 60)
print("TEST SET RESULTS")
print("=" * 60)

print("\nAccuracy:", accuracy)


# ============================================================
# 7. CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:")

print(
    classification_report(
        y,
        y_pred,
        target_names=["Normal", "Attack"]
    )
)


# ============================================================
# 8. CONFUSION MATRIX
# ============================================================

print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y,
        y_pred
    )
)


# ============================================================
# 9. SUMMARY
# ============================================================

print("\n" + "=" * 60)
print("EVALUATION COMPLETED")
print("=" * 60)