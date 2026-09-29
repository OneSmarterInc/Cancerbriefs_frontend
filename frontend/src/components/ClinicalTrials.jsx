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
                    backgroundColor: "#FFFFFF", 
                    border: isRecruiting ? "2px solid #C9A227" : "2px solid #161412", 
                    borderRadius: "4px", 
                    padding: "25px", 
                    display: "flex", 
                    flexDirection: "column",
                    boxShadow: isRecruiting ? "0 10px 25px rgba(201,162,39,0.15)" : "0 8px 20px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    cursor: "default",
                    boxSizing: "border-box",
                    height: "100%"
                  }}
                  onMouseOver={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
                      e.currentTarget.style.borderColor = "#C9A227";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (window.innerWidth > 768) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isRecruiting ? "0 10px 25px rgba(201,162,39,0.15)" : "0 8px 20px rgba(0,0,0,0.05)";
                      e.currentTarget.style.borderColor = isRecruiting ? "#C9A227" : "#161412";
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
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#161412";
                        e.currentTarget.style.color = "#F3EEE3";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#161412";
                      }}
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

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .clinical-trials-section {
          padding: 60px 20px;
          background-color: #F3EEE3;
          min-height: 80vh;
          border-top: 1px solid #C9C1B0;
          box-sizing: border-box;
          width: 100%;
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
          border-bottom: 1px solid #C9C1B0;
          padding-bottom: 15px;
          flex-wrap: wrap;
        }

        .clinical-trials-kicker {
          color: #C9A227;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .clinical-trials-title {
          font-family: Georgia, serif;
          color: #161412;
          margin: 0;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: bold;
        }

        .clinical-trials-state {
          text-align: center;
          padding: 60px 20px;
          color: #5E574C;
          font-weight: bold;
          font-size: 16px;
        }

        .clinical-trials-error {
          text-align: center;
          padding: 40px;
          background-color: #ffebee;
          border: 1px solid #ffcdd2;
          border-radius: 4px;
          color: #D32F2F;
          font-weight: bold;
        }

        .clinical-trials-empty {
          text-align: center;
          padding: 40px;
          color: #5E574C;
          font-style: italic;
        }

        .clinical-trials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          width: 100%;
          box-sizing: border-box;
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
        }

        .trial-status-badge.recruiting {
          background-color: #EBE4D5;
          color: #8F7118;
          border: 1px solid #C9A227;
        }

        .trial-status-badge.other {
          background-color: #F3EEE3;
          color: #5E574C;
          border: 1px solid #C9C1B0;
        }

        .trial-nct-id {
          color: #161412;
          font-size: 12px;
          font-weight: bold;
          font-family: monospace;
          background-color: #F3EEE3;
          padding: 4px 8px;
          border-radius: 2px;
          white-space: nowrap;
        }

        .trial-title {
          font-family: Georgia, serif;
          font-size: 18px;
          color: #161412;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .trial-meta-row {
          font-size: 12px;
          color: #161412;
          font-weight: bold;
          margin-bottom: 6px;
          word-break: break-word;
        }

        .trial-meta-row.target-row {
          color: #C9A227;
          margin-bottom: 15px;
        }

        .trial-meta-val {
          color: #5E574C;
          font-weight: normal;
        }

        .trial-summary {
          font-size: 14px;
          color: #5E574C;
          line-height: 1.6;
          margin: 0 0 20px 0;
          flex: 1;
        }

        .trial-action-container {
          border-top: 1px solid #C9C1B0;
          padding-top: 15px;
          margin-top: auto;
          text-align: right;
        }

        .trial-action-btn {
          color: #161412;
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
          border: 1px solid #161412;
          transition: background-color 0.2s, color 0.2s;
          width: 100%;
          box-sizing: border-box;
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
    </section>
  );
}