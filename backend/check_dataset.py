import pandas as pd

file_path = "../dataset/UNSW_NB15_training-set.csv"

df = pd.read_csv(file_path)

print("Dataset loaded successfully!")
print("Number of rows:", len(df))
print("Number of columns:", len(df.columns))

print("\nColumn names:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head())
print("\nTarget column:")
print(df["label"].value_counts())

print("\nAttack categories:")
print(df["attack_cat"].value_counts())