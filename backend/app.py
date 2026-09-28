
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

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_DIR = os.path.join(BASE_DIR, "model")
DATASET_DIR = os.path.join(BASE_DIR, "dataset")

MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_model.pkl")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.pkl")
DATASET_PATH = os.path.join(DATASET_DIR, "UNSW_NB15_testing-set.csv")

print("Loading trained model...")

model = joblib.load(MODEL_PATH)
print("Model loaded successfully!")

preprocessor = joblib.load(PREPROCESSOR_PATH)
print("Preprocessor loaded successfully!")

dataset = pd.read_csv(DATASET_PATH)

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

    if not data:
        return {"error": "No traffic data received"}, 400

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

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False,
        threaded=False
    )
