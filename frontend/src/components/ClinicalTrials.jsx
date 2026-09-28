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
          "https://clinicaltrials.gov/api/v2/studies?query.cond=cancer&pageSize=10"
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setTrials(data.studies || []);
      } catch (err) {
        setError(err.message || "Failed to fetch clinical trials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, []);

  return (
    <section style={{ padding: "60px 20px", backgroundColor: "#F3EEE3", minHeight: "80vh", borderTop: "1px solid #C9C1B0" }}>
      <div style={{ maxWidth: "1450px", margin: "0 auto" }}>
        
        {/* Updated Header - Single Line */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "15px", marginBottom: "40px", borderBottom: "1px solid #C9C1B0", paddingBottom: "15px" }}>
          <span style={{ color: "#C9A227", fontSize: "14px", fontWeight: "bold", letterSpacing: "2px", textTransform: "uppercase" }}>
            Live Data Feed
          </span>
          <h2 style={{ fontFamily: "Georgia, serif", color: "#161412", margin: 0, fontSize: "36px", fontWeight: "bold" }}>
            Active Oncology Clinical Trials
          </h2>
        </div>

        {/* State Handling */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#5E574C", fontWeight: "bold", fontSize: "16px" }}>
            <span style={{ display: "inline-block", animation: "pulse 1.5s infinite" }}>Loading clinical trial data...</span>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#ffebee", border: "1px solid #ffcdd2", borderRadius: "4px", color: "#D32F2F", fontWeight: "bold" }}>
            {error}
          </div>
        ) : trials.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#5E574C", fontStyle: "italic" }}>
            No clinical trials found for this condition.
          </div>
        ) : (
          /* Grid Layout */
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
            gap: "25px" 
          }}>
            {trials.map((study) => {
              // Safely extract data from the nested v2 API structure
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
              
              // Truncate summary for display
              const truncatedSummary = summary.length > 150 ? summary.substring(0, 150) + "..." : summary;

              return (
                <div 
                  key={nctId} 
                  style={{ 
                    backgroundColor: "#FFFFFF", 
                    border: "2px solid #161412", 
                    borderRadius: "4px", 
                    padding: "25px", 
                    display: "flex", 
                    flexDirection: "column",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                    cursor: "default"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
                    e.currentTarget.style.borderColor = "#C9A227";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
                    e.currentTarget.style.borderColor = "#161412";
                  }}
                >
                  {/* Status & ID Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                    <span style={{ 
                      backgroundColor: status.toLowerCase().includes("recruiting") ? "#EBE4D5" : "#F3EEE3", 
                      color: status.toLowerCase().includes("recruiting") ? "#8F7118" : "#5E574C", 
                      padding: "4px 10px", 
                      borderRadius: "2px", 
                      fontSize: "11px", 
                      fontWeight: "bold", 
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      border: `1px solid ${status.toLowerCase().includes("recruiting") ? "#C9A227" : "#C9C1B0"}`
                    }}>
                      {status}
                    </span>
                    <span style={{ color: "#161412", fontSize: "12px", fontWeight: "bold", fontFamily: "monospace", backgroundColor: "#F3EEE3", padding: "4px 8px", borderRadius: "2px" }}>
                      {nctId}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: "#161412", margin: "0 0 12px 0", lineHeight: "1.3" }}>
                    {title}
                  </h3>

                  {/* Lead Sponsor */}
                  <div style={{ fontSize: "12px", color: "#161412", fontWeight: "bold", marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Lead Sponsor: <span style={{ color: "#5E574C", fontWeight: "normal" }}>{sponsorName}</span>
                  </div>

                  {/* Conditions Tag */}
                  <div style={{ fontSize: "12px", color: "#C9A227", fontWeight: "bold", marginBottom: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Target: <span style={{ color: "#5E574C", fontWeight: "normal" }}>{conditions}</span>
                  </div>

                  {/* Summary */}
                  <p style={{ fontSize: "14px", color: "#5E574C", lineHeight: "1.6", margin: "0 0 20px 0", flex: 1 }}>
                    {truncatedSummary}
                  </p>

                  {/* Action Link */}
                  <div style={{ borderTop: "1px solid #C9C1B0", paddingTop: "15px", marginTop: "auto", textAlign: "right" }}>
                    <a 
                      href={`https://clinicaltrials.gov/study/${nctId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: "#161412", 
                        textDecoration: "none", 
                        fontSize: "12px", 
                        fontWeight: "bold", 
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "8px 16px",
                        border: "1px solid #161412",
                        transition: "background-color 0.2s, color 0.2s"
                      }}
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
        
        /* Mobile adjustment for header */
        @media (max-width: 768px) {
          .clinical-trials-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 5px !important;
          }
        }
      `}</style>
    </section>
  );
}