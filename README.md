# AI-Based Cyber Threat Detection in Unidirectional IP Traffic

An AI/ML-based cybersecurity system that analyzes network traffic and classifies it as **Normal** or **Attack** using the **UNSW-NB15 dataset** and a **Random Forest classifier**.

## Project Overview

Network traffic can contain malicious patterns that may indicate cyber attacks. This project uses machine learning to analyze network traffic features and automatically identify potential threats.

The system consists of:

* **UNSW-NB15** network traffic dataset
* **Random Forest** machine learning model
* **Flask** backend API
* **React + Vite** frontend dashboard
* Real-time-style traffic analysis using records from the official testing dataset

## System Architecture

```text
UNSW-NB15 Dataset
        ↓
Data Preprocessing
        ↓
Feature Encoding
        ↓
Random Forest Model
        ↓
Flask REST API
        ↓
React Dashboard
        ↓
Normal / Attack Detection
```

## Machine Learning

### Dataset

The project uses the **UNSW-NB15** cybersecurity dataset.

The dataset contains network traffic features such as:

* Protocol
* Connection state
* Source and destination packets
* Source and destination bytes
* Traffic rate
* Duration
* TCP-related features
* Connection statistics

The current model performs **binary classification**:

```text
0 → NORMAL
1 → ATTACK
```

The original dataset also contains attack categories such as:

* Generic
* Exploits
* Fuzzers
* DoS
* Reconnaissance
* Analysis
* Backdoor
* Shellcode
* Worms

These categories are displayed as the original dataset labels; the current ML model itself performs binary Normal/Attack classification.

## Model

The project uses a **Random Forest Classifier**.

Preprocessing includes:

* Removal of `id` and `attack_cat`
* One-hot encoding of categorical features
* Numerical feature processing
* Stratified train/test splitting

### Official Test Set Results

Evaluation was performed on the official UNSW-NB15 testing set containing **82,332 records**.

| Metric        |     Result |
| ------------- | ---------: |
| Test Accuracy | **87.09%** |
| Attack Recall | **98.45%** |
| Normal Recall | **73.18%** |

### Interpretation

The model correctly identifies a high proportion of attack traffic, with an **attack recall of 98.45%**.

The overall test accuracy is **87.09%**.

Individual prediction confidence values shown by the dashboard represent the model's probability estimate for a particular traffic record and should not be confused with the overall test accuracy.

## Web Dashboard

The React dashboard provides:

* Network traffic analysis
* AI prediction
* Model confidence
* Dataset category information
* Threat monitoring history
* Model performance metrics
* System status

## Technology Stack

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib

### Backend

* Flask
* Flask-CORS
* REST API

### Frontend

* React
* Vite
* JavaScript
* CSS

### Dataset

* UNSW-NB15

### Version Control

* Git
* GitHub

## Project Structure

```text
AI-CYBER-THREAT-DETECTION/
│
├── backend/
│   ├── app.py
│   ├── check_dataset.py
│   ├── evaluate_model.py
│   ├── predict_test.py
│   ├── test.py
│   ├── test_api.py
│   ├── test_real_record.py
│   └── train_model.py
│
├── dataset/
│   ├── UNSW_NB15_training-set.csv
│   └── UNSW_NB15_testing-set.csv
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── model/
│   ├── random_forest_model.pkl
│   └── preprocessor.pkl
│
├── .gitignore
└── README.md
```

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/aarthiyajam/AI-CYBER-THREAT-DETECTION.git
cd AI-CYBER-THREAT-DETECTION
```

### 2. Set up the Python backend

```bash
cd backend
python -m venv .venv
```

Activate the environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
python -m pip install pandas numpy scikit-learn joblib flask flask-cors requests
```

Start the backend:

```bash
python app.py
```

The API runs at:

```text
http://127.0.0.1:5000
```

### 3. Start the React frontend

Open a **new terminal** in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite in the terminal.

## API Endpoints

### Health Check

```text
GET /
```

Returns the API status and model information.

### Sample Traffic

```text
GET /sample
```

Returns a randomly selected record from the UNSW-NB15 testing dataset.

### Prediction

```text
POST /predict
```

Accepts network traffic features and returns:

```json
{
  "prediction": "ATTACK",
  "confidence": 98.5
}
```

## Future Improvements

Potential future improvements include:

* Multi-class attack category prediction
* Real-time packet capture
* Live network traffic monitoring
* More advanced ML/deep learning models
* Model comparison and benchmarking
* Alert notifications
* Database-based threat history
* Improved false-positive reduction

## Disclaimer

This project is developed for educational and research purposes using the UNSW-NB15 dataset. It is a prototype and should not be treated as a production-grade network security system.

## Author

**Aarthi Yajaman**

B.Tech Computer Science and Engineering
