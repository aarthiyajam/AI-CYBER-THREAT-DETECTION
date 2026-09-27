# AI-Based Cyber Threat Detection in Unidirectional IP Traffic

An AI/ML-based cybersecurity system that analyzes network traffic and classifies it as **Normal** or **Attack** using the **UNSW-NB15 dataset** and a **Random Forest classifier**.

## Project Overview

Network traffic can contain malicious patterns that may indicate cyber attacks. This project uses machine learning to analyze network traffic features and automatically identify potential threats.

The system consists of:

* **UNSW-NB15** network traffic dataset
* **Random Forest** machine learning model
* **Flask** backend API
* **React + Vite** frontend dashboard
* Real network traffic analysis using records from the UNSW-NB15 testing dataset

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

These categories are displayed as the original dataset labels. The current machine learning model itself performs binary **Normal vs Attack** classification.

## Model

The project uses a **Random Forest Classifier**.

### Preprocessing

The preprocessing pipeline includes:

* Removal of `id`
* Removal of `attack_cat` from model input
* One-hot encoding of categorical features
* Processing of numerical features
* Stratified train/test splitting

The trained model and preprocessing pipeline are stored in the `model/` directory.

## Official Test Set Results

The model was evaluated using the official UNSW-NB15 testing set containing **82,332 records**.

| Metric        |     Result |
| ------------- | ---------: |
| Test Accuracy | **87.09%** |
| Attack Recall | **98.45%** |
| Normal Recall | **73.18%** |

### Interpretation

The model achieved an overall test accuracy of **87.09%**.

The **98.45% attack recall** indicates that a high proportion of attack records in the official testing set were correctly identified.

The **73.18% normal recall** indicates the proportion of normal records correctly classified as normal.

Individual prediction confidence values displayed by the dashboard are probability estimates for individual traffic records and are different from the overall test accuracy.

## Web Dashboard

The React dashboard provides:

* Network traffic analysis
* AI prediction
* Model confidence
* Dataset category information
* Threat monitoring history
* Model performance metrics
* System status
* Real-time-style analysis of sampled test records

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
│   ├── public/
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

### 1. Clone the Repository

```bash
git clone https://github.com/aarthiyajam/AI-CYBER-THREAT-DETECTION.git
cd AI-CYBER-THREAT-DETECTION
```

### 2. Set Up the Python Backend

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install the required Python packages:

```bash
python -m pip install pandas numpy scikit-learn joblib flask flask-cors requests
```

Start the Flask backend:

```bash
python app.py
```

The API will run at:

```text
http://127.0.0.1:5000
```

### 3. Start the React Frontend

Open a **new terminal** in the project root.

Navigate to the frontend:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL displayed by Vite in the terminal.

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

Accepts network traffic features and returns the model prediction and confidence.

Example response:

```json
{
  "prediction": "ATTACK",
  "confidence": 98.5
}
```

## Model Output

The model provides two possible classifications:

### NORMAL

The analyzed traffic is classified as normal based on the learned patterns.

### ATTACK

The analyzed traffic is classified as potential attack traffic based on the learned patterns.

The dashboard also displays the original UNSW-NB15 `attack_cat` value associated with sampled test records. This is the dataset's original category and is not a prediction from the current binary classifier.

## Future Improvements

Potential future improvements include:

* Multi-class attack category prediction
* Real-time packet capture
* Live network traffic monitoring
* Additional machine learning model comparison
* Deep learning approaches
* False-positive reduction
* Alert notifications
* Database-based threat history
* Network flow visualization
* Improved security monitoring features

## Limitations

* The current model performs binary classification rather than multi-class attack identification.
* The dashboard analyzes sampled records from the UNSW-NB15 testing dataset rather than capturing live network packets.
* The system is intended as an educational/research prototype and is not a production-grade intrusion detection system.

## Disclaimer

This project is developed for educational and research purposes using the UNSW-NB15 dataset. It is a prototype and should not be treated as a production-grade network security system.

## Author

**Aarthi Yajaman**

B.Tech Computer Science and Engineering
