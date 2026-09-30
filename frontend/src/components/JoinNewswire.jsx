import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

export default function JoinNewswire({ onBack }) {
  const [formData, setFormData] = useState({
    full_name: "", email: "", position: "", preferred_desk: "", 
    pitch: "", portfolio_url: "", resume_data: "", samples_data: ""
  });
  const [status, setStatus] = useState(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/positions/`)
      .then(res => res.json())
      .then(data => setPositions(data.positions || []))
      .catch(console.error);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE_URL}/volunteer/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        console.error("Backend Error:", data);
        setStatus(data.error || "Failed to submit. Check backend console.");
      }
    } catch (err) {
      console.error("Network Error:", err);
      setStatus("Network connection failed.");
    }
  };

  const inputStyle = {
    width: "100%", padding: "16px", backgroundColor: "var(--hf-section-bg)",
    border: "1px solid var(--hf-border-light)", color: "var(--hf-text)", outline: "none",
    boxSizing: "border-box", fontFamily: "Arial, sans-serif", fontSize: "14px",
    transition: "border-color 0.2s, background-color 0.3s, color 0.3s"
  };
  
  const labelStyle = {
    display: "block", color: "var(--hf-accent-dark)", fontSize: "10px",
    fontWeight: "bold", letterSpacing: "1.5px", marginBottom: "8px", textTransform: "uppercase",
    transition: "color 0.3s"
  };

  if (status === "success") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--hf-bg)", padding: "80px 20px", textAlign: "center", transition: "background-color 0.3s" }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 42px)", color: "var(--hf-text)", transition: "color 0.3s" }}>Application Received</h1>
        <p style={{ color: "var(--hf-text-muted)", fontSize: "18px", marginTop: "20px", transition: "color 0.3s" }}>Thank you for applying. The editorial team will review your submission.</p>
        <button onClick={onBack} style={{ marginTop: "40px", padding: "12px 24px", backgroundColor: "var(--hf-btn-bg)", color: "var(--hf-btn-text)", border: "none", fontWeight: "bold", cursor: "pointer", letterSpacing: "1px", transition: "background-color 0.3s, color 0.3s" }}>RETURN TO DESK</button>
      </div>
    );
  }

  return (
    <div className="join-page-wrapper">
      <style>{`
        /* Dynamic Theme Variables */
        :root {
          --hf-bg: #F3EEE3;
          --hf-card-bg: #FFFFFF;
          --hf-section-bg: #EBE4D5;
          --hf-text: #161412;
          --hf-text-muted: #5E574C;
          --hf-border: #161412;
          --hf-border-light: #D9CBA0;
          --hf-accent: #C9A227;
          --hf-accent-dark: #8F7118;
          --hf-btn-bg: #161412;
          --hf-btn-text: #F3EEE3;
          --hf-btn-hover: #8F7118;
          --hf-btn-disabled-bg: #EBE4D5;
          --hf-btn-disabled-text: #A39E93;
          --hf-red: #d32f2f;
        }
        
        .dark-mode {
          --hf-bg: #161412;
          --hf-card-bg: #1e1b18;
          --hf-section-bg: #1e1b18;
          --hf-text: #F3EEE3;
          --hf-text-muted: #A39E93;
          --hf-border: #5E574C;
          --hf-border-light: #332F2C;
          --hf-accent: #C9A227;
          --hf-accent-dark: #C9A227;
          --hf-btn-bg: #F3EEE3;
          --hf-btn-text: #161412;
          --hf-btn-hover: #C9A227;
          --hf-btn-disabled-bg: #332F2C;
          --hf-btn-disabled-text: #5E574C;
        }

        .join-page-wrapper {
          min-height: 100vh;
          background-color: var(--hf-bg);
          padding: 40px 20px 80px 20px;
          transition: background-color 0.3s;
        }
        
        .join-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .join-header-row {
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .join-hero-title {
          font-family: Georgia, serif;
          font-size: 56px;
          color: var(--hf-text);
          margin: 0 0 20px 0;
          letter-spacing: -1px;
          font-weight: bold;
          line-height: 1.1;
          transition: color 0.3s;
        }

        .join-hero-desc {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 22px;
          color: var(--hf-text-muted);
          line-height: 1.5;
          margin-bottom: 40px;
          transition: color 0.3s;
        }

        .join-body-text {
          font-size: 15px;
          color: var(--hf-text);
          line-height: 1.8;
          margin-bottom: 50px;
          transition: color 0.3s;
        }

        .join-section-title {
          font-family: Georgia, serif;
          font-size: 26px;
          color: var(--hf-text);
          margin: 0 0 25px 0;
          font-weight: bold;
          transition: color 0.3s;
        }

        .join-position-card {
          border: 1px solid var(--hf-border-light);
          padding: 25px;
          background-color: transparent;
          transition: border-color 0.3s;
        }

        .join-position-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 15px;
        }

        .join-form-container {
          background-color: var(--hf-card-bg);
          padding: 50px;
          border: 1px solid var(--hf-border-light);
          transition: background-color 0.3s, border-color 0.3s;
        }

        .join-submit-btn {
          margin-top: 10px;
          padding: 16px 24px;
          background-color: var(--hf-btn-bg);
          color: var(--hf-btn-text);
          border: none;
          font-weight: bold;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          align-self: flex-start;
          transition: background-color 0.2s, color 0.2s;
        }

        .join-submit-btn:hover:not(:disabled) {
          background-color: var(--hf-btn-hover);
        }

        .join-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background-color: var(--hf-btn-disabled-bg);
          color: var(--hf-btn-disabled-text);
        }

        .file-input {
          color: var(--hf-text);
          font-size: 13px;
          padding: 10px 0;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .join-page-wrapper {
            padding: 20px 15px 60px 15px;
          }
          .join-hero-title {
            font-size: 38px;
          }
          .join-hero-desc {
            font-size: 18px;
            margin-bottom: 30px;
          }
          .join-body-text {
            font-size: 14px;
            margin-bottom: 40px;
          }
          .join-position-card {
            padding: 20px;
          }
          .join-form-container {
            padding: 25px 20px;
          }
          .join-submit-btn {
            align-self: stretch;
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="join-container">
        
        <div className="join-header-row">
          <div style={{ fontSize: "10px", fontWeight: "bold", color: "var(--hf-accent-dark)", letterSpacing: "2px", textTransform: "uppercase", transition: "color 0.3s" }}>
            CAREERS <span style={{ color: "var(--hf-border-light)", margin: "0 6px" }}>·</span> VOLUNTEER / INTERNSHIP
          </div>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--hf-text)", fontWeight: "bold", fontSize: "12px", letterSpacing: "1px", padding: 0, transition: "color 0.3s" }}>
            ✕ CLOSE
          </button>
        </div>

        <h1 className="join-hero-title">
          Join the Cancerbriefs Newswire
        </h1>
        
        <p className="join-hero-desc">
          Work alongside the AI clinical reporting team. Build a research portfolio. Learn how a working medical newsroom actually files. Help train the next generation of clinical intelligence tools.
        </p>

        <div className="join-body-text">
          <p style={{ marginBottom: "20px" }}>
            Cancerbriefs publishes daily across specialized oncology desks. The staff are AI clinical researchers with advanced retrieval tools; their work is rigorous but the bylines are synthetic. We are opening seats for real-human medical and research contributors who file alongside the staff — with their own bylines, their own faces on the oncology board wall, and their own professional profile pages.
          </p>
          <p style={{ margin: 0 }}>
            These are <strong>volunteer / internship positions</strong>. Unpaid. The compensation is academic and portfolio exposure, a public byline, and direct experience in how an AI-augmented oncology newsroom operates day-to-day. Highly valuable for medical students, oncology researchers, recent healthcare graduates, and science writers. Hours are flexible.
          </p>
        </div>

        {/* Open Positions */}
        <h2 className="join-section-title">
          Open positions
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "60px" }}>
          {positions.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "var(--hf-text-muted)", margin: 0, transition: "color 0.3s" }}>No positions are currently open.</p>
          ) : positions.map((pos) => (
            <div key={pos.id} className="join-position-card">
              <div className="join-position-header">
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", margin: 0, color: "var(--hf-text)", fontWeight: "bold", lineHeight: "1.3", transition: "color 0.3s" }}>
                  {pos.title}
                </h3>
                <span style={{ backgroundColor: "var(--hf-section-bg)", color: "var(--hf-text-muted)", padding: "4px 8px", fontSize: "9px", fontWeight: "bold", letterSpacing: "1px", whiteSpace: "nowrap", textTransform: "uppercase", transition: "background-color 0.3s, color 0.3s" }}>
                  {pos.seats} {pos.seats === 1 ? "SEAT" : "SEATS"}
                </span>
              </div>
              <p style={{ margin: 0, color: "var(--hf-text-muted)", fontSize: "14px", lineHeight: "1.6", transition: "color 0.3s" }}>{pos.description}</p>
            </div>
          ))}
        </div>

        {/* The Application Form */}
        <div className="join-form-container">
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: "var(--hf-text)", margin: "0 0 15px 0", transition: "color 0.3s" }}>Apply</h2>
          <p style={{ color: "var(--hf-text-muted)", fontSize: "13px", marginBottom: "40px", borderBottom: "1px solid var(--hf-border-light)", paddingBottom: "25px", lineHeight: "1.5", marginTop: 0, transition: "color 0.3s, border-color 0.3s" }}>
            Submit your name, email, the position you're applying for, a short pitch, and your resume or clinical writing samples. We review every application closely.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            
            <div>
              <label style={labelStyle}>FULL NAME</label>
              <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--hf-border)"} onBlur={(e) => e.target.style.borderColor = "var(--hf-border-light)"} />
            </div>

            <div>
              <label style={labelStyle}>EMAIL</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--hf-border)"} onBlur={(e) => e.target.style.borderColor = "var(--hf-border-light)"} />
            </div>

            <div>
              <label style={labelStyle}>POSITION</label>
              <select required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} style={{ ...inputStyle, cursor: "pointer", WebkitAppearance: "none", appearance: "none" }} onFocus={(e) => e.target.style.borderColor = "var(--hf-border)"} onBlur={(e) => e.target.style.borderColor = "var(--hf-border-light)"}>
                <option value="" disabled style={{ color: "var(--hf-text-muted)" }}>Select a position</option>
                {positions.map(pos => (
                  <option key={pos.id} value={pos.title}>{pos.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>PREFERRED DESK (OPTIONAL)</label>
              <select value={formData.preferred_desk} onChange={e => setFormData({...formData, preferred_desk: e.target.value})} style={{ ...inputStyle, cursor: "pointer", WebkitAppearance: "none", appearance: "none" }} onFocus={(e) => e.target.style.borderColor = "var(--hf-border)"} onBlur={(e) => e.target.style.borderColor = "var(--hf-border-light)"}>
                <option value="No preference">No preference</option>
                <option value="Cancer Research">Cancer Research</option>
                <option value="Clinical Trials">Clinical Trials</option>
                <option value="Oncology Care">Oncology Care</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>PITCH / WHY THIS ROLE</label>
              <textarea required rows="5" placeholder="What kind of clinical research or writing do you want to file? Any specific oncology subspecialties or study angles? Why this seat?" value={formData.pitch} onChange={e => setFormData({...formData, pitch: e.target.value})} style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }} onFocus={(e) => e.target.style.borderColor = "var(--hf-border)"} onBlur={(e) => e.target.style.borderColor = "var(--hf-border-light)"} />
              <div style={{ color: "var(--hf-text-muted)", fontSize: "11px", fontStyle: "italic", marginTop: "8px", transition: "color 0.3s" }}>Plain text. Up to 2000 characters.</div>
            </div>

            <div>
              <label style={labelStyle}>PORTFOLIO / SAMPLES URL (OPTIONAL)</label>
              <input type="url" placeholder="https://your-site.com or LinkedIn" value={formData.portfolio_url} onChange={e => setFormData({...formData, portfolio_url: e.target.value})} style={inputStyle} onFocus={(e) => e.target.style.borderColor = "var(--hf-border)"} onBlur={(e) => e.target.style.borderColor = "var(--hf-border-light)"} />
              <div style={{ color: "var(--hf-text-muted)", fontSize: "11px", fontStyle: "italic", marginTop: "8px", transition: "color 0.3s" }}>If you have published research or articles, link them here.</div>
            </div>

            <div>
              <label style={labelStyle}>RESUME / CV (PDF OR DOCX)</label>
              <input type="file" onChange={e => handleFile(e, "resume_data")} className="file-input" />
            </div>

            <div>
              <label style={labelStyle}>WRITING OR RESEARCH SAMPLES (PDF, DOCX, OR ZIP - OPTIONAL)</label>
              <input type="file" onChange={e => handleFile(e, "samples_data")} className="file-input" />
              <div style={{ color: "var(--hf-text-muted)", fontSize: "11px", fontStyle: "italic", marginTop: "8px", transition: "color 0.3s" }}>Attach sample clinical notes, summaries, or research papers if applicable.</div>
            </div>

            <button type="submit" disabled={status === "loading"} className="join-submit-btn">
              {status === "loading" ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
            </button>
            
            {status !== null && status !== "loading" && status !== "success" && (
              <div style={{ color: "var(--hf-red)", fontSize: "14px", marginTop: "15px", fontWeight: "bold", padding: "10px", border: "1px solid var(--hf-red)", backgroundColor: "var(--hf-section-bg)" }}>
                Error: {status}
              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  );
}