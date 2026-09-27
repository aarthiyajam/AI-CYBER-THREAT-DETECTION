import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

import joblib


# ============================================================
# 1. LOAD DATASET
# ============================================================

print("Loading UNSW-NB15 dataset...")

file_path = "../dataset/UNSW_NB15_training-set.csv"

df = pd.read_csv(file_path)

print("Dataset loaded!")
print("Rows:", len(df))
print("Columns:", len(df.columns))


# ============================================================
# 2. REMOVE UNNECESSARY COLUMNS
# ============================================================

print("\nRemoving unnecessary columns...")

# 'id' is just a record number.
# 'attack_cat' directly tells us the attack category,
# so we remove it because our first model predicts only
# Normal vs Attack.

df = df.drop(columns=["id", "attack_cat"])

print("Remaining columns:", len(df.columns))


# ============================================================
# 3. SEPARATE FEATURES AND TARGET
# ============================================================

X = df.drop(columns=["label"])

y = df["label"]

print("\nFeatures:", X.shape)
print("Target:", y.shape)


# ============================================================
# 4. IDENTIFY CATEGORICAL COLUMNS
# ============================================================

categorical_columns = [
    "proto",
    "service",
    "state"
]

print("\nCategorical columns:")
print(categorical_columns)


# ============================================================
# 5. IDENTIFY NUMERICAL COLUMNS
# ============================================================

numerical_columns = [
    column for column in X.columns
    if column not in categorical_columns
]

print("\nNumber of numerical columns:", len(numerical_columns))


# ============================================================
# 6. ENCODE CATEGORICAL DATA
# ============================================================

print("\nPreparing data preprocessing...")

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            ),
            categorical_columns
        )
    ],
    remainder="passthrough"
)


# ============================================================
# 7. TRAIN / TEST SPLIT
# ============================================================

print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# ============================================================
# 8. PREPROCESS THE DATA
# ============================================================

print("\nEncoding categorical features...")

X_train_processed = preprocessor.fit_transform(X_train)

X_test_processed = preprocessor.transform(X_test)

print("Preprocessing completed!")

print("Processed training shape:", X_train_processed.shape)
print("Processed testing shape:", X_test_processed.shape)


# ============================================================
# 9. CREATE RANDOM FOREST MODEL
# ============================================================

print("\nCreating Random Forest model...")

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)


# ============================================================
# 10. TRAIN MODEL
# ============================================================

print("\nTraining Random Forest...")
print("Please wait...")

model.fit(X_train_processed, y_train)

print("Model training completed!")


# ============================================================
# 11. MAKE PREDICTIONS
# ============================================================

print("\nMaking predictions...")

y_pred = model.predict(X_test_processed)


# ============================================================
# 12. CHECK ACCURACY
# ============================================================

accuracy = accuracy_score(y_test, y_pred)

print("\n" + "=" * 60)
print("MODEL RESULTS")
print("=" * 60)

print("\nAccuracy:", accuracy)


# ============================================================
# 13. CLASSIFICATION REPORT
# ============================================================

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# ============================================================
# 14. CONFUSION MATRIX
# ============================================================

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# ============================================================
# 15. SAVE MODEL
# ============================================================

print("\nSaving model...")

joblib.dump(model, "../model/random_forest_model.pkl")

joblib.dump(
    preprocessor,
    "../model/preprocessor.pkl"
)

print("\nModel saved successfully!")

print("Saved files:")
print("../model/random_forest_model.pkl")
print("../model/preprocessor.pkl")

print("\n" + "=" * 60)
print("PROJECT STEP COMPLETED!")
print("=" * 60)