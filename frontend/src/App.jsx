import { useState } from "react";
import "./App.css";

function App() {
  const [traffic, setTraffic] = useState(null);
  const [result, setResult] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeTraffic = async () => {
    try {
      setLoading(true);
      setError("");

      // Step 1: Get a real traffic record from UNSW-NB15
      const sampleResponse = await fetch(
        "http://127.0.0.1:5000/sample"
      );

      if (!sampleResponse.ok) {
        throw new Error("Could not fetch traffic data");
      }

      const sampleData = await sampleResponse.json();

      // Step 2: Send traffic to Random Forest model
      const predictResponse = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sampleData.traffic),
        }
      );

      if (!predictResponse.ok) {
        throw new Error("Prediction failed");
      }

      const prediction = await predictResponse.json();

      // Step 3: Generate alert when an attack is detected
      if (prediction.prediction === "ATTACK") {
        alert(
          `🚨 CYBER THREAT DETECTED!\n\n` +
          `Protocol: ${sampleData.traffic.proto}\n` +
          `Category: ${sampleData.attack_category}\n` +
          `Confidence: ${prediction.confidence}%`
        );
      }

      // Step 4: Display traffic information
      setTraffic(sampleData.traffic);
      setResult(prediction);

      setDatasetInfo({
        category: sampleData.attack_category,
        actualLabel: sampleData.actual_label,
      });

      // Step 5: Add result to threat history
      const newRecord = {
        time: new Date().toLocaleTimeString(),
        protocol: sampleData.traffic.proto,
        status: prediction.prediction,
        category: sampleData.attack_category,
        confidence: prediction.confidence,
      };

      setHistory((previous) => {
        return [newRecord, ...previous].slice(0, 10);
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const threatCount = history.filter(
    (item) => item.status === "ATTACK"
  ).length;

  const normalCount = history.filter(
    (item) => item.status === "NORMAL"
  ).length;

  const threatRate =
    history.length > 0
      ? Math.round((threatCount / history.length) * 100)
      : 0;

  const categoryCounts = {};

  history.forEach((item) => {
    const category = item.category || "Unknown";

    categoryCounts[category] =
      (categoryCounts[category] || 0) + 1;
  });

  const categoryEntries = Object.entries(categoryCounts);

  return (
    <div className="app">

      {/* HEADER */}
      <header className="top-header">

        <div className="brand-area">

          <div className="brand-icon">
            AI
          </div>

          <div>
            <h1>AI Cyber Threat Detection</h1>

            <p>
              UNSW-NB15 Network Traffic Analysis using Random Forest
            </p>
          </div>

        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>

      </header>


      <main className="dashboard">

        {/* PROJECT INFORMATION */}
        <section className="info-grid">

          <div className="info-card">
            <span className="info-label">MODEL</span>

            <strong>
              Random Forest
            </strong>

            <span className="info-sub">
              Machine Learning Classifier
            </span>
          </div>


          <div className="info-card">
            <span className="info-label">DATASET</span>

            <strong>
              UNSW-NB15
            </strong>

            <span className="info-sub">
              Network Traffic Dataset
            </span>
          </div>


          <div className="info-card">
            <span className="info-label">CLASSIFICATION</span>

            <strong>
              Binary
            </strong>

            <span className="info-sub">
              Normal vs Attack
            </span>
          </div>

        </section>


        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              A
            </div>

            <div>
              <span>
                Total Analyzed
              </span>

              <strong>
                {history.length}
              </strong>
            </div>

          </div>


          <div className="stat-card danger-stat">

            <div className="stat-icon">
              !
            </div>

            <div>
              <span>
                Threats Detected
              </span>

              <strong>
                {threatCount}
              </strong>
            </div>

          </div>


          <div className="stat-card safe-stat">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <span>
                Normal Traffic
              </span>

              <strong>
                {normalCount}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              %
            </div>

            <div>
              <span>
                Threat Rate
              </span>

              <strong>
                {threatRate}%
              </strong>
            </div>

          </div>

        </section>


        {/* ANALYZER HEADER */}
        <section className="analyzer-header">

          <div>

            <span className="section-kicker">
              LIVE ANALYSIS
            </span>

            <h2>
              Network Traffic Analysis
            </h2>

            <p>
              Analyze real UNSW-NB15 traffic records and detect
              potential cyber threats using the trained Random
              Forest model.
            </p>

          </div>


          <button
            className="analyze-button"
            onClick={analyzeTraffic}
            disabled={loading}
          >

            {loading
              ? "Analyzing..."
              : "Analyze Traffic"}

            {!loading && (
              <span>
                →
              </span>
            )}

          </button>

        </section>


        {/* ERROR */}
        {error && (

          <div className="error-card">

            <strong>
              Analysis Error
            </strong>

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ANALYSIS RESULTS */}
        {traffic && result && (

          <>

            <section className="analysis-grid">

              {/* TRAFFIC DETAILS */}
              <div className="panel traffic-panel">

                <div className="panel-header">

                  <div>

                    <span className="section-kicker">
                      LIVE TRAFFIC
                    </span>

                    <h3>
                      Analyzed Traffic Details
                    </h3>

                  </div>

                  <span className="live-badge">
                    REAL DATA
                  </span>

                </div>


                <div className="traffic-metrics">

                  <div className="traffic-metric">
                    <span>
                      Protocol
                    </span>

                    <strong>
                      {traffic.proto}
                    </strong>
                  </div>


                  <div className="traffic-metric">
                    <span>
                      Connection State
                    </span>

                    <strong>
                      {traffic.state}
                    </strong>
                  </div>


                  <div className="traffic-metric">
                    <span>
                      Source Packets
                    </span>

                    <strong>
                      {traffic.spkts}
                    </strong>
                  </div>


                  <div className="traffic-metric">
                    <span>
                      Destination Packets
                    </span>

                    <strong>
                      {traffic.dpkts}
                    </strong>
                  </div>


                  <div className="traffic-metric">
                    <span>
                      Source Bytes
                    </span>

                    <strong>
                      {traffic.sbytes}
                    </strong>
                  </div>


                  <div className="traffic-metric">
                    <span>
                      Destination Bytes
                    </span>

                    <strong>
                      {traffic.dbytes}
                    </strong>
                  </div>


                  <div className="traffic-metric">
                    <span>
                      Traffic Rate
                    </span>

                    <strong>
                      {Number(traffic.rate).toFixed(2)}
                    </strong>
                  </div>


                  <div className="traffic-metric">
                    <span>
                      Duration
                    </span>

                    <strong>
                      {Number(traffic.dur).toFixed(6)}
                    </strong>
                  </div>

                </div>


                <div className="dataset-source">

                  <div className="source-icon">
                    DB
                  </div>

                  <div>

                    <span>
                      DATASET CATEGORY
                    </span>

                    <strong>
                      {datasetInfo?.category || "Unknown"}
                    </strong>

                  </div>

                  <small>
                    Original UNSW-NB15 category
                  </small>

                </div>

              </div>


              {/* AI RESULT */}
              <div
                className={
                  "panel result-panel " +
                  (
                    result.prediction === "ATTACK"
                      ? "attack-panel"
                      : "normal-panel"
                  )
                }
              >

                <div className="panel-header">

                  <div>

                    <span className="section-kicker">
                      AI ANALYSIS
                    </span>

                    <h3>
                      Threat Detection Result
                    </h3>

                  </div>

                  <span className="analyzed-badge">
                    ANALYZED
                  </span>

                </div>


                <div className="result-main">

                  <div
                    className={
                      "result-icon " +
                      (
                        result.prediction === "ATTACK"
                          ? "attack-icon"
                          : "normal-icon"
                      )
                    }
                  >

                    {result.prediction === "ATTACK"
                      ? "!"
                      : "✓"}

                  </div>


                  <div className="result-text">

                    <span>
                      AI PREDICTION
                    </span>

                    <h2>
                      {result.prediction}
                    </h2>

                    <p>
                      {result.prediction === "ATTACK"
                        ? "Potential malicious traffic pattern detected."
                        : "Traffic appears normal based on learned model patterns."}
                    </p>

                  </div>

                </div>


                {/* CONFIDENCE */}
                <div className="confidence-section">

                  <div className="confidence-header">

                    <span>
                      MODEL CONFIDENCE
                    </span>

                    <strong>
                      {result.confidence}%
                    </strong>

                  </div>


                  <div className="confidence-track">

                    <div
                      className={
                        "confidence-fill " +
                        (
                          result.prediction === "ATTACK"
                            ? "attack-fill"
                            : "normal-fill"
                        )
                      }
                      style={{
                        width: `${result.confidence}%`,
                      }}
                    />

                  </div>

                </div>


                {/* RESULT MESSAGE */}
                <div
                  className={
                    "result-message " +
                    (
                      result.prediction === "ATTACK"
                        ? "attack-message"
                        : "normal-message"
                    )
                  }
                >

                  <span>
                    {result.prediction === "ATTACK"
                      ? "!"
                      : "✓"}
                  </span>

                  <div>

                    <strong>
                      {result.prediction === "ATTACK"
                        ? "Potential Threat Detected"
                        : "Traffic Appears Normal"}
                    </strong>

                    <p>
                      {result.prediction === "ATTACK"
                        ? "The model identified patterns associated with attack traffic."
                        : "No significant threat pattern was detected in the analyzed traffic."}
                    </p>

                  </div>

                </div>

              </div>

            </section>


            {/* DATASET CATEGORIES */}
            <section className="panel category-panel">

              <div className="panel-header">

                <div>

                  <span className="section-kicker">
                    DATASET ANALYSIS
                  </span>

                  <h3>
                    Analyzed Dataset Categories
                  </h3>

                </div>

                <span className="count-badge">
                  {categoryEntries.length} Categories
                </span>

              </div>


              <p className="panel-description">
                Original UNSW-NB15 categories of the traffic records
                analyzed during this session.
              </p>


              {categoryEntries.length === 0 ? (

                <div className="empty-category">
                  Analyze traffic to view dataset categories.
                </div>

              ) : (

                <div className="category-grid">

                  {categoryEntries.map(
                    ([category, count]) => {

                      const percentage = Math.round(
                        (count / history.length) * 100
                      );

                      return (

                        <div
                          className="category-item"
                          key={category}
                        >

                          <div className="category-top">

                            <div>

                              <strong>
                                {category}
                              </strong>

                              <span>
                                {count}{" "}
                                {count === 1
                                  ? "record"
                                  : "records"}
                              </span>

                            </div>

                            <strong>
                              {percentage}%
                            </strong>

                          </div>


                          <div className="category-bar">

                            <div
                              className="category-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

              )}

            </section>


            {/* MODEL PERFORMANCE */}
            <section className="panel performance-panel">

              <div className="panel-header">

                <div>

                  <span className="section-kicker">
                    MODEL EVALUATION
                  </span>

                  <h3>
                    Model Performance
                  </h3>

                </div>

                <span className="evaluation-badge">
                  OFFICIAL TEST SET
                </span>

              </div>


              <div className="performance-grid">

                <div className="performance-card main-performance">

                  <span>
                    TEST ACCURACY
                  </span>

                  <strong>
                    87.09%
                  </strong>

                  <div className="performance-track">

                    <div
                      className="performance-fill"
                      style={{
                        width: "87.09%",
                      }}
                    />

                  </div>

                  <small>
                    Overall classification accuracy
                  </small>

                </div>


                <div className="performance-card">

                  <span>
                    ATTACK RECALL
                  </span>

                  <strong>
                    98.45%
                  </strong>

                  <div className="performance-track">

                    <div
                      className="performance-fill"
                      style={{
                        width: "98.45%",
                      }}
                    />

                  </div>

                  <small>
                    Attacks correctly identified
                  </small>

                </div>


                <div className="performance-card">

                  <span>
                    NORMAL RECALL
                  </span>

                  <strong>
                    73.18%
                  </strong>

                  <div className="performance-track">

                    <div
                      className="performance-fill"
                      style={{
                        width: "73.18%",
                      }}
                    />

                  </div>

                  <small>
                    Normal traffic correctly identified
                  </small>

                </div>

              </div>


              <div className="model-meta-grid">

                <div>
                  <span>
                    MODEL
                  </span>

                  <strong>
                    Random Forest
                  </strong>
                </div>


                <div>
                  <span>
                    DATASET
                  </span>

                  <strong>
                    UNSW-NB15
                  </strong>
                </div>


                <div>
                  <span>
                    CLASSIFICATION
                  </span>

                  <strong>
                    Binary
                  </strong>
                </div>


                <div>
                  <span>
                    TEST RECORDS
                  </span>

                  <strong>
                    82,332
                  </strong>
                </div>

              </div>


              <div className="evaluation-note">

                <span>
                  i
                </span>

                <p>
                  These metrics were calculated using the official
                  UNSW-NB15 testing set. Individual traffic confidence
                  values are different from overall model accuracy.
                </p>

              </div>

            </section>


            {/* THREAT HISTORY */}
            <section className="panel history-panel">

              <div className="panel-header">

                <div>

                  <span className="section-kicker">
                    MONITORING LOG
                  </span>

                  <h3>
                    Threat History
                  </h3>

                </div>

                <span className="count-badge">
                  {history.length} Records
                </span>

              </div>


              {history.length === 0 ? (

                <div className="empty-history">

                  <div>
                    ◌
                  </div>

                  <strong>
                    No traffic analyzed yet
                  </strong>

                  <p>
                    Click "Analyze Traffic" to begin monitoring.
                  </p>

                </div>

              ) : (

                <div className="history-table-wrapper">

                  <table>

                    <thead>

                      <tr>
                        <th>TIME</th>
                        <th>PROTOCOL</th>
                        <th>STATUS</th>
                        <th>CATEGORY</th>
                        <th>CONFIDENCE</th>
                      </tr>

                    </thead>


                    <tbody>

                      {history.map(
                        (item, index) => (

                          <tr
                            key={`${item.time}-${index}`}
                          >

                            <td>
                              {item.time}
                            </td>

                            <td>
                              <span className="protocol-tag">
                                {item.protocol}
                              </span>
                            </td>

                            <td>

                              <span
                                className={
                                  "status-tag " +
                                  (
                                    item.status === "ATTACK"
                                      ? "status-attack"
                                      : "status-normal"
                                  )
                                }
                              >
                                {item.status}
                              </span>

                            </td>

                            <td>
                              {item.category}
                            </td>

                            <td>
                              {item.confidence}%
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>

        )}


        {/* FOOTER */}
        <footer>

          <span>
            AI Cyber Threat Detection
          </span>

          <span>
            UNSW-NB15 • Random Forest • Binary Classification
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;