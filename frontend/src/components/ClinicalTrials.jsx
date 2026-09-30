import React, { useState, useEffect } from "react";

export default function ClinicalTrials() {
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrials = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://clinicaltrials.gov/api/v2/studies?query.cond=cancer&pageSize=20"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        const rawStudies = data.studies || [];

        // 1. Filter to keep ONLY Recruiting and Not Yet Recruiting trials
        const filteredStudies = rawStudies.filter((study) => {
          const protocol = study.protocolSection || {};
          const statusModule = protocol.statusModule || {};
          const status = (statusModule.overallStatus || "").trim().toUpperCase();
          
          return status === "RECRUITING" || status === "NOT_YET_RECRUITING";
        });

        // 2. Sort so that "RECRUITING" comes before "NOT_YET_RECRUITING"
        const sortedStudies = filteredStudies.sort((a, b) => {
          const getStatusText = (study) => {
            const protocol = study.protocolSection || {};
            const statusModule = protocol.statusModule || {};
            return (statusModule.overallStatus || "").trim().toUpperCase();
          };

          const statusA = getStatusText(a);
          const statusB = getStatusText(b);

          if (statusA === "RECRUITING" && statusB !== "RECRUITING") return -1;
          if (statusA !== "RECRUITING" && statusB === "RECRUITING") return 1;
          return 0;
        });

        setTrials(sortedStudies);
      } catch (err) {
        setError(err.message || "Failed to fetch clinical trials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, []);

  return (
    <section className="clinical-trials-section">
      <style>{`
        /* Dynamic Theme Variables */
        :root {
          --hf-bg: #F3EEE3;
          --hf-card-bg: #FFFFFF;
          --hf-section-bg: #EBE4D5;
          --hf-text: #161412;
          --hf-text-muted: #5E574C;
          --hf-border: #161412;
          --hf-border-light: #C9C1B0;
          --hf-accent: #C9A227;
          --hf-accent-dark: #8F7118;
          --hf-btn-bg: #161412;
          --hf-btn-text: #F3EEE3;
          --hf-error-bg: #ffebee;
          --hf-error-border: #ffcdd2;
          --hf-red: #d32f2f;
          --hf-shadow-light: rgba(0,0,0,0.05);
          --hf-shadow-heavy: rgba(0,0,0,0.1);
          --hf-shadow-accent: rgba(201,162,39,0.15);
        }
        
        .dark-mode {
          --hf-bg: #161412;
          --hf-card-bg: #1e1b18;
          --hf-section-bg: #332F2C;
          --hf-text: #F3EEE3;
          --hf-text-muted: #A39E93;
          --hf-border: #5E574C;
          --hf-border-light: #332F2C;
          --hf-accent: #C9A227;
          --hf-accent-dark: #C9A227;
          --hf-btn-bg: #F3EEE3;
          --hf-btn-text: #161412;
          --hf-error-bg: #2a1111;
          --hf-error-border: #5c2020;
          --hf-red: #ff6b6b;
          --hf-shadow-light: rgba(0,0,0,0.4);
          --hf-shadow-heavy: rgba(0,0,0,0.6);
          --hf-shadow-accent: rgba(201,162,39,0.25);
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .clinical-trials-section {
          padding: 60px 20px;
          background-color: var(--hf-bg);
          min-height: 80vh;
          border-top: 1px solid var(--hf-border-light);
          box-sizing: border-box;
          width: 100%;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .clinical-trials-container {
          max-width: 1450px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .clinical-trials-header {
          display: flex;
          align-items: baseline;
          gap: 15px;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--hf-border-light);
          padding-bottom: 15px;
          flex-wrap: wrap;
          transition: border-color 0.3s;
        }

        .clinical-trials-kicker {
          color: var(--hf-accent);
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: color 0.3s;
        }

        .clinical-trials-title {
          font-family: Georgia, serif;
          color: var(--hf-text);
          margin: 0;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: bold;
          transition: color 0.3s;
        }

        .clinical-trials-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--hf-text-muted);
          font-weight: bold;
          font-size: 16px;
          transition: color 0.3s;
        }

        .clinical-trials-error {
          text-align: center;
          padding: 40px;
          background-color: var(--hf-error-bg);
          border: 1px solid var(--hf-error-border);
          border-radius: 4px;
          color: var(--hf-red);
          font-weight: bold;
          transition: background-color 0.3s, border-color 0.3s, color 0.3s;
        }

        .clinical-trials-empty {
          text-align: center;
          padding: 40px;
          color: var(--hf-text-muted);
          font-style: italic;
          transition: color 0.3s;
        }

        .clinical-trials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .trial-card {
          background-color: var(--hf-card-bg);
          border-radius: 4px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.3s;
          cursor: default;
          box-sizing: border-box;
          height: 100%;
        }

        .trial-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          gap: 10px;
        }

        .trial-status-badge {
          padding: 4px 10px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        .trial-status-badge.recruiting {
          background-color: var(--hf-section-bg);
          color: var(--hf-accent-dark);
          border: 1px solid var(--hf-accent);
        }

        .trial-status-badge.other {
          background-color: var(--hf-bg);
          color: var(--hf-text-muted);
          border: 1px solid var(--hf-border-light);
        }

        .trial-nct-id {
          color: var(--hf-text);
          font-size: 12px;
          font-weight: bold;
          font-family: monospace;
          background-color: var(--hf-bg);
          padding: 4px 8px;
          border-radius: 2px;
          white-space: nowrap;
          transition: color 0.3s, background-color 0.3s;
        }

        .trial-title {
          font-family: Georgia, serif;
          font-size: 18px;
          color: var(--hf-text);
          margin: 0 0 12px 0;
          line-height: 1.3;
          transition: color 0.3s;
        }

        .trial-meta-row {
          font-size: 12px;
          color: var(--hf-text);
          font-weight: bold;
          margin-bottom: 6px;
          word-break: break-word;
          transition: color 0.3s;
        }

        .trial-meta-row.target-row {
          color: var(--hf-accent);
          margin-bottom: 15px;
        }

        .trial-meta-val {
          color: var(--hf-text-muted);
          font-weight: normal;
          transition: color 0.3s;
        }

        .trial-summary {
          font-size: 14px;
          color: var(--hf-text-muted);
          line-height: 1.6;
          margin: 0 0 20px 0;
          flex: 1;
          transition: color 0.3s;
        }

        .trial-action-container {
          border-top: 1px solid var(--hf-border-light);
          padding-top: 15px;
          margin-top: auto;
          text-align: right;
          transition: border-color 0.3s;
        }

        .trial-action-btn {
          color: var(--hf-text);
          text-decoration: none;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 8px 16px;
          border: 1px solid var(--hf-border);
          transition: background-color 0.2s, color 0.2s, border-color 0.3s;
          width: 100%;
          box-sizing: border-box;
        }
        
        .trial-action-btn:hover {
          background-color: var(--hf-text);
          color: var(--hf-bg);
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .clinical-trials-section {
            padding: 30px 15px;
          }
          .clinical-trials-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            margin-bottom: 25px;
          }
          .clinical-trials-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .trial-card {
            padding: 20px;
          }
          .trial-title {
            font-size: 17px;
          }
        }
      `}</style>
      
      <div className="clinical-trials-container">
        
        {/* Header */}
        <div className="clinical-trials-header">
          <span className="clinical-trials-kicker">
            Live Data Feed
          </span>
          <h2 className="clinical-trials-title">
            Active Oncology Clinical Trials
          </h2>
        </div>

        {/* State Handling */}
        {loading ? (
          <div className="clinical-trials-state">
            <span style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>Loading clinical trial data...</span>
          </div>
        ) : error ? (
          <div className="clinical-trials-error">
            {error}
          </div>
        ) : trials.length === 0 ? (
          <div className="clinical-trials-empty">
            No recruiting clinical trials found.
          </div>
        ) : (
          /* Grid Layout */
          <div className="clinical-trials-grid">
            {trials.map((study) => {
              const protocol = study.protocolSection || {};
              const idModule = protocol.identificationModule || {};
              const statusModule = protocol.statusModule || {};
              const conditionsModule = protocol.conditionsModule || {};
              const descriptionModule = protocol.descriptionModule || {};
              const sponsorModule = protocol.sponsorCollaboratorsModule || {};
              const leadSponsor = sponsorModule.leadSponsor || {};

              const nctId = idModule.nctId || "Unknown ID";
              const title = idModule.briefTitle || idModule.officialTitle || "Untitled Study";
              const status = statusModule.overallStatus || "UNKNOWN STATUS";
              const conditions = (conditionsModule.conditions || []).join(", ") || "Cancer";
              const summary = descriptionModule.briefSummary || "No summary available for this trial.";
              const sponsorName = leadSponsor.name || "Sponsor not specified";
              
              const isRecruiting = status.trim().toUpperCase() === "RECRUITING";
              const truncatedSummary = summary.length > 150 ? summary.substring(0, 150) + "..." : summary;

              return (
                <div 
                  key={nctId} 
                  className="trial-card"
                  style={{
                    border: isRecruiting ? "2px solid var(--hf-accent)" : "2px solid var(--hf-border)",
                    boxShadow: isRecruiting ? "0 10px 25px var(--hf-shadow-accent)" : "0 8px 20px var(--hf-shadow-light)"
                  }}
                  onMouseOver={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 30px var(--hf-shadow-heavy)";
                      e.currentTarget.style.borderColor = "var(--hf-accent)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isRecruiting ? "0 10px 25px var(--hf-shadow-accent)" : "0 8px 20px var(--hf-shadow-light)";
                      e.currentTarget.style.borderColor = isRecruiting ? "var(--hf-accent)" : "var(--hf-border)";
                    }
                  }}
                >
                  {/* Status & ID Row */}
                  <div className="trial-card-top">
                    <span className={`trial-status-badge ${isRecruiting ? "recruiting" : "other"}`}>
                      {status}
                    </span>
                    <span className="trial-nct-id">
                      {nctId}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="trial-title">
                    {title}
                  </h3>

                  {/* Lead Sponsor */}
                  <div className="trial-meta-row">
                    Lead Sponsor: <span className="trial-meta-val">{sponsorName}</span>
                  </div>

                  {/* Conditions Tag */}
                  <div className="trial-meta-row target-row">
                    Target: <span className="trial-meta-val">{conditions}</span>
                  </div>

                  {/* Summary */}
                  <p className="trial-summary">
                    {truncatedSummary}
                  </p>

                  {/* Action Link */}
                  <div className="trial-action-container">
                    <a 
                      href={`https://clinicaltrials.gov/study/${nctId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="trial-action-btn"
                    >
                      View on ClinicalTrials.gov <span>→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}