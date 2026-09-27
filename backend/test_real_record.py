import pandas as pd
import requests

# Load real UNSW-NB15 testing data
df = pd.read_csv("../dataset/UNSW_NB15_testing-set.csv")

print("Dataset loaded!")
print("Total records:", len(df))

# Take the first real network traffic record
record = df.iloc[0].copy()

# Remove columns not used by our model
record = record.drop(["id", "attack_cat", "label"])

# Convert to dictionary
data = record.to_dict()

print("\nSending real record to AI model...")

# Send record to Flask API
response = requests.post(
    "http://127.0.0.1:5000/predict",
    json=data
)

print("\nAI Response:")
print(response.json())