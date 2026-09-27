import os

# Limit numerical libraries to one thread
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

from flask import Flask, request
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

print("Loading trained model...")

# Load model
model = joblib.load("../model/random_forest_model.pkl")
print("Model loaded successfully!")

# Load preprocessor
preprocessor = joblib.load("../model/preprocessor.pkl")
print("Preprocessor loaded successfully!")

# Read only the columns needed for sample traffic
dataset = pd.read_csv("../dataset/UNSW_NB15_testing-set.csv")

print("Dataset loaded successfully!")
print("Total testing records:", len(dataset))


@app.route("/")
def home():
    return {
        "message": "Cyber Threat Detection API is running!",
        "model": "Random Forest",
        "dataset": "UNSW-NB15",
        "status": "Ready"
    }


@app.route("/sample", methods=["GET"])
def sample():

    record = dataset.sample(1).iloc[0].copy()

    attack_category = record["attack_cat"]
    actual_label = int(record["label"])

    record = record.drop([
        "id",
        "attack_cat",
        "label"
    ])

    traffic_data = record.to_dict()

    return {
        "traffic": traffic_data,
        "attack_category": attack_category,
        "actual_label": actual_label
    }


@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    input_data = pd.DataFrame([data])

    processed_data = preprocessor.transform(input_data)

    prediction = model.predict(processed_data)[0]

    probability = model.predict_proba(processed_data)[0]

    if prediction == 1:

        result = "ATTACK"
        confidence = probability[1] * 100

    else:

        result = "NORMAL"
        confidence = probability[0] * 100

    return {
        "prediction": result,
        "confidence": round(confidence, 2)
    }


if __name__ == "__main__":

    print("Starting Flask server...")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        threaded=False
    )