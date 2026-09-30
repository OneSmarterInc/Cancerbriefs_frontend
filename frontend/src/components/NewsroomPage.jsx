import React, { useEffect, useState, useMemo } from "react";
import { API_BASE_URL } from "../config";
import { cleanSummary } from "../utils/summaryFilter";

const PROF_NAMES = [
  "Alexander Cole",
  "Marcus Reed",
  "Daniel Hayes",
  "Ethan Brooks",
  "Sophia Bennett",
  "Olivia Carter",
  "Amelia Parker",
  "Isabella Morgan"
];

// Updated to match the Oncology Board roles
const PROF_POSITIONS = [
  "Cancer Research & Oncology",
  "Cancer Types & Disease Specialties",
  "Cancer Diagnosis & Screening",
  "Cancer Treatment & Therapy",
  "Cancer Drugs & Clinical Trials",
  "Cancer Genetics & Precision Medicine",
  "Cancer Prevention & Survivorship",
  "Cancer Organizations, Statistics & Policy"
];

// Updated descriptions to match the clinical/oncology theme
const PROF_DESCRIPTIONS = [
  "A specialized look into fundamental cancer research, tumor biology, and broad oncology advancements.",
  "Deep dives into specific cancer pathologies, rare malignancies, and organ-site disease specialties.",
  "Tracking breakthroughs in early detection, biomarker screening, and advanced diagnostic imaging.",
  "Analyzing emerging therapeutic approaches, surgical oncology, radiation techniques, and comprehensive care.",
  "Investigating new pharmaceutical developments, immunotherapy drugs, and ongoing clinical trial results.",
  "Examining the role of genetic mutations, hereditary risks, and targeted precision medicine in oncology.",
  "Covering lifestyle factors, risk reduction strategies, and holistic survivorship care for cancer patients.",
  "Monitoring global cancer statistics, public health policies, and the impact of major cancer organizations."
];

const STAFF_VOICE_PROFILES = {
  1: { gender: "male", pitch: 0.85, rate: 0.95, voiceOffset: 0 },
  2: { gender: "male", pitch: 0.70, rate: 0.90, voiceOffset: 2 },
  3: { gender: "male", pitch: 0.95, rate: 1.00, voiceOffset: 4 },
  4: { gender: "male", pitch: 0.80, rate: 1.05, voiceOffset: 1 },
  5: { gender: "female", pitch: 1.20, rate: 0.90, voiceOffset: 0 },
  6: { gender: "female", pitch: 1.15, rate: 1.05, voiceOffset: 1 },
  7: { gender: "female", pitch: 1.25, rate: 1.00, voiceOffset: 3 },
  8: { gender: "female", pitch: 1.05, rate: 0.95, voiceOffset: 2 }
};

const getProfName = (id) => PROF_NAMES[(parseInt(id) || 1) - 1] || PROF_NAMES[0];
const getProfPosition = (id) => PROF_POSITIONS[(parseInt(id) || 1) - 1] || PROF_POSITIONS[0];
const getProfDescription = (id) => PROF_DESCRIPTIONS[(parseInt(id) || 1) - 1] || PROF_DESCRIPTIONS[0];

const formatToEST = (dateString) => {
  if (!dateString) return "Recent";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "EST", month: "short", day: "numeric", year: "numeric"
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

export default function NewsroomPage({ articles, onBack, onArticleClick }) {
  const [profId, setProfId] = useState(1);
  const [speakingArticleId, setSpeakingArticleId] = useState(null);

  // States for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // States for Submit Query on the Newsroom Page
  const [queryArticle, setQueryArticle] = useState(null);
  const [queryText, setQueryText] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  // PRE-WARM VOICES BUG FIX
  useEffect(() => {
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      const loadVoices = () => window.speechSynthesis.getVoices();
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prof = parseInt(params.get("prof")) || 1;
    setProfId(prof);
    setCurrentPage(1); // Reset to page 1 when changing professors
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [window.location.search]); // Depend on search params

  const profArticles = useMemo(() => {
    return articles.filter(a => (a.professor_id || 1) === profId);
  }, [articles, profId]);

  // Pagination Logic
  const totalPages = Math.ceil(profArticles.length / ITEMS_PER_PAGE);
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return profArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [profArticles, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitQuery = async () => {
    if (!queryText.trim() || !queryArticle?.id) return;
    setSubmitStatus("loading");
    try {
      const res = await fetch(`${API_BASE_URL}/news/${queryArticle.id}/query/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query_text: queryText })
      });
      if (res.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          setQueryArticle(null);
          setSubmitStatus(null);
          setQueryText("");
        }, 1500);
      } else {
        setSubmitStatus(null);
        alert("Failed to send query to the specialist. Please try again.");
      }
    } catch {
      setSubmitStatus(null);
      alert("Network Error: Could not connect to the server.");
    }
  };

  const handleListen = (e, article) => {
    e.stopPropagation();

    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

    if (speakingArticleId === article.id) {
      window.speechSynthesis.cancel();
      setSpeakingArticleId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = `${article?.original_title || article?.title || ""}. ${cleanSummary(article?.summary)}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    const profile = STAFF_VOICE_PROFILES[profId] || STAFF_VOICE_PROFILES[1];
    utterance.pitch = profile.pitch;
    utterance.rate = profile.rate;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const englishVoices = voices.filter(v => v.lang.startsWith("en"));
      
      let genderFilteredVoices = englishVoices.filter(v => {
        const name = v.name.toLowerCase();
        if (profile.gender === "female") {
          return name.includes("female") || /zira|samantha|karen|victoria|moira|susan|hazel|amelia|olivia|tessa|ava|siri|melina|veena/i.test(name);
        } else {
          return name.includes("male") || /david|mark|george|daniel|oliver|james|ryan|arthur|alex|fred|bruce|albert|aaron|eddy|floyd|reed|rocko/i.test(name);
        }
      });

      // Mobile Fallback for Male Voices
      if (genderFilteredVoices.length === 0 && profile.gender === "male") {
        utterance.pitch = Math.max(0.1, profile.pitch - 0.4); 
      }

      let pool = genderFilteredVoices.length > 0 ? genderFilteredVoices : englishVoices;
      if (pool.length > 0) {
        const selectedIndex = profile.voiceOffset % pool.length;
        utterance.voice = pool[selectedIndex];
      }
    }

    utterance.onstart = () => setSpeakingArticleId(article.id);
    utterance.onend = () => setSpeakingArticleId(null);
    utterance.onerror = () => setSpeakingArticleId(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="newsroom-page-wrapper" style={{ minHeight: "100vh", backgroundColor: "var(--nr-bg)", position: "relative", transition: "background-color 0.3s" }}>
      
      <style>{`
        /* Dynamic Theme Variables */
        :root {
          --nr-bg: #F3EEE3;
          --nr-card-bg: #FFFFFF;
          --nr-text: #161412;
          --nr-text-muted: #5E574C;
          --nr-border: #161412;
          --nr-border-light: #EBE4D5;
          --nr-border-article: #EBE4D5;
          --nr-accent: #C9A227;
          --nr-accent-dark: #8F7118;
          --nr-btn-bg: #161412;
          --nr-btn-text: #F3EEE3;
          --nr-btn-alt-bg: #EBE4D5;
          --nr-btn-disabled-bg: #EBE4D5;
          --nr-btn-disabled-text: #A39E93;
          --nr-modal-overlay: rgba(22,20,18,0.9);
        }
        
        .dark-mode {
          --nr-bg: #161412;
          --nr-card-bg: #1e1b18;
          --nr-text: #F3EEE3;
          --nr-text-muted: #A39E93;
          --nr-border: #5E574C;
          --nr-border-light: #332F2C;
          --nr-border-article: #332F2C;
          --nr-accent: #C9A227;
          --nr-accent-dark: #C9A227;
          --nr-btn-bg: #F3EEE3;
          --nr-btn-text: #161412;
          --nr-btn-alt-bg: #332F2C;
          --nr-btn-disabled-bg: #332F2C;
          --nr-btn-disabled-text: #5E574C;
          --nr-modal-overlay: rgba(0,0,0,0.8);
        }

        .newsroom-page-wrapper {
          padding: 40px 20px;
        }
        
        .newsroom-main-card {
          max-width: 1000px;
          margin: 0 auto;
          background-color: var(--nr-card-bg);
          border: 1px solid var(--nr-border-light);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          padding: 60px;
          transition: background-color 0.3s, border-color 0.3s;
        }

        .newsroom-hero-img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          object-position: top;
          border-bottom: 4px solid var(--nr-border);
          transition: border-color 0.3s;
        }

        .newsroom-title {
          font-family: Georgia, serif;
          font-size: 48px;
          color: var(--nr-text);
          margin: 0 0 15px 0;
          line-height: 1.1;
          letter-spacing: -1px;
          transition: color 0.3s;
        }

        .newsroom-desc {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 22px;
          color: var(--nr-text-muted);
          margin: 0 0 25px 0;
          line-height: 1.5;
          transition: color 0.3s;
        }

        /* Article List Items */
        .article-row {
          display: flex;
          gap: 25px;
          padding-bottom: 35px;
          border-bottom: 1px solid var(--nr-border-article);
          cursor: pointer;
          flex-direction: row;
          transition: border-color 0.3s, opacity 0.2s;
        }
        
        .article-row:hover {
          opacity: 0.85;
        }

        .article-img {
          width: 220px;
          height: 150px;
          object-fit: cover;
          object-position: top;
          flex-shrink: 0;
          border: 1px solid var(--nr-border);
          transition: border-color 0.3s;
        }

        .article-content {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          flex: 1;
        }

        .article-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          flex-wrap: wrap;
          gap: 10px;
        }

        .article-btn-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .article-btn {
          padding: 6px 14px;
          font-weight: bold;
          cursor: pointer;
          border-radius: 3px;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .article-author-tag {
          font-size: 10px;
          color: var(--nr-accent-dark);
          font-weight: bold;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: color 0.3s;
        }

        /* Modals */
        .app-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--nr-modal-overlay);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          cursor: default;
          transition: background-color 0.3s;
        }

        .app-modal-content {
          background-color: var(--nr-bg);
          padding: 30px;
          width: 100%;
          max-width: 400px;
          border: 2px solid var(--nr-accent);
          border-radius: 4px;
          box-sizing: border-box;
          transition: background-color 0.3s;
        }

        /* Pagination */
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid var(--nr-border);
          flex-wrap: wrap;
          gap: 15px;
          transition: border-color 0.3s;
        }

        .page-btn {
          padding: 12px 24px;
          border: none;
          font-weight: bold;
          transition: all 0.2s;
        }

        .page-btn:not(:disabled) {
          background-color: var(--nr-btn-bg);
          color: var(--nr-btn-text);
          cursor: pointer;
        }

        .page-btn:disabled {
          background-color: var(--nr-btn-disabled-bg);
          color: var(--nr-btn-disabled-text);
          cursor: not-allowed;
        }

        .page-indicator {
          font-size: 14px;
          font-weight: bold;
          color: var(--nr-text-muted);
          letter-spacing: 1px;
          text-align: center;
          transition: color 0.3s;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .newsroom-hero-img { height: 400px; }
          .newsroom-title { font-size: 38px; }
          .newsroom-desc { font-size: 19px; }
        }

        @media (max-width: 768px) {
          .newsroom-page-wrapper { padding: 20px 10px; }
          .newsroom-main-card { padding: 25px; }
          .newsroom-hero-img { height: 280px; }
          .newsroom-title { font-size: 30px; }
          .newsroom-desc { font-size: 17px; }

          .article-row { flex-direction: column; gap: 15px; }
          .article-img { width: 100%; height: auto; aspect-ratio: 16/9; }
          
          .article-actions { flex-direction: column; align-items: stretch; gap: 15px; margin-top: 20px; }
          .article-btn-group { flex-direction: column; align-items: stretch; width: 100%; }
          .article-btn { width: 100%; justify-content: center; padding: 10px; }
          .article-author-tag { text-align: center; margin-top: 5px; }
          
          .app-modal-content { padding: 20px; }

          /* Responsive Pagination */
          .pagination-container { flex-direction: column; align-items: stretch; }
          .page-btn { width: 100%; }
          .page-indicator { margin: 10px 0; }
        }
      `}</style>

      {/* Submit Query Modal */}
      {queryArticle && (
        <div className="app-modal-overlay" onClick={(e) => { e.stopPropagation(); setQueryArticle(null); }}>
          <div className="app-modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 15px 0", fontFamily: "Georgia, serif", color: "var(--nr-text)", transition: "color 0.3s" }}>Submit Query to Specialist</h3>
            <p style={{ fontSize: "12px", color: "var(--nr-text-muted)", marginBottom: "15px", transition: "color 0.3s" }}>Ask a question or report an issue regarding this specific study.</p>
            
            <textarea 
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="What would you like to ask?"
              style={{ width: "100%", height: "100px", padding: "10px", border: "1px solid var(--nr-border)", backgroundColor: "var(--nr-card-bg)", outline: "none", resize: "none", marginBottom: "15px", fontFamily: "Arial", color: "var(--nr-text)", boxSizing: "border-box", transition: "background-color 0.3s, color 0.3s, border-color 0.3s" }}
            />
            
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button 
                onClick={() => setQueryArticle(null)} 
                style={{ padding: "8px 15px", border: "none", background: "transparent", cursor: "pointer", fontWeight: "bold", color: "var(--nr-text-muted)", transition: "color 0.3s" }}
              >
                CANCEL
              </button>
              <button 
                onClick={submitQuery} 
                disabled={submitStatus === "loading" || !queryText.trim()}
                style={{ padding: "8px 15px", border: "none", background: "var(--nr-btn-bg)", color: "var(--nr-btn-text)", cursor: "pointer", fontWeight: "bold", borderRadius: "3px", transition: "background-color 0.3s, color 0.3s" }}
              >
                {submitStatus === "loading" ? "SENDING..." : submitStatus === "success" ? "SENT!" : "SUBMIT"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="newsroom-main-card">
        
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--nr-accent-dark)", fontWeight: "bold", fontSize: "13px", marginBottom: "30px", display: "flex", alignItems: "center", gap: "5px", letterSpacing: "1px", transition: "color 0.3s" }}>
          ← BACK TO FEED
        </button>

        <div style={{ marginBottom: "60px" }}>
          <img 
            src={`/images/Proff_${profId}.png`} 
            alt={getProfName(profId)} 
            className="newsroom-hero-img"
          />
          
          <div style={{ marginTop: "35px" }}>
            <div style={{ display: "inline-block", border: "1px solid var(--nr-accent)", color: "var(--nr-accent)", padding: "4px 10px", fontSize: "12px", fontWeight: "bold", letterSpacing: "1.5px", marginBottom: "20px", textTransform: "uppercase", transition: "border-color 0.3s, color 0.3s" }}>
              {getProfPosition(profId)}
            </div>
            
            <h1 className="newsroom-title">
              Clinical Briefings by {getProfName(profId)}
            </h1>
            
            <p className="newsroom-desc">
              {getProfDescription(profId)}
            </p>
            
            <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--nr-accent-dark)", letterSpacing: "1px", textTransform: "uppercase", transition: "color 0.3s" }}>
              BY {getProfName(profId).toUpperCase()}, {getProfPosition(profId).toUpperCase()} LEAD
            </div>
          </div>
        </div>

        <div style={{ borderBottom: "3px solid var(--nr-border)", marginBottom: "40px", paddingBottom: "10px", transition: "border-color 0.3s" }}>
          <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--nr-text)", letterSpacing: "2px", textTransform: "uppercase", transition: "color 0.3s" }}>
            MORE FROM THE CLINICAL WIRE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
          {currentArticles.length > 0 ? (
            currentArticles.map(article => {
              const cleanedSummary = cleanSummary(article.summary);
              const summarySnippet = cleanedSummary.length > 180 ? cleanedSummary.substring(0, 180) + "..." : cleanedSummary;

              return (
                <div 
                  key={article.id} 
                  onClick={() => onArticleClick(article)}
                  className="article-row"
                >
                  <img 
                    src={`/images/Proff_${profId}.png`} 
                    alt={getProfName(profId)} 
                    className="article-img"
                  />
                  <div className="article-content">
                    <div style={{ fontSize: "11px", color: "var(--nr-accent-dark)", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px", transition: "color 0.3s" }}>
                      {article.source || "ONCOLOGY DESK"} &nbsp;•&nbsp; {formatToEST(article.published).toUpperCase()}
                    </div>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "24px", margin: "0 0 12px 0", color: "var(--nr-text)", lineHeight: "1.2", transition: "color 0.3s" }}>
                      {article.original_title || article.title}
                    </h3>
                    <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "16px", color: "var(--nr-text-muted)", margin: "0 0 15px 0", lineHeight: "1.5", transition: "color 0.3s" }}>
                      {summarySnippet}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="article-actions">
                      <div className="article-btn-group">
                        <button 
                          className="article-btn"
                          onClick={(e) => handleListen(e, article)}
                          style={{ 
                            backgroundColor: speakingArticleId === article.id ? "var(--nr-btn-bg)" : "transparent", 
                            color: speakingArticleId === article.id ? "var(--nr-btn-text)" : "var(--nr-text)", 
                            border: "1px solid var(--nr-border)"
                          }}
                        >
                          <span>{speakingArticleId === article.id ? "■" : "▶"}</span> 
                          {speakingArticleId === article.id ? "STOP READING" : `LISTEN`}
                        </button>

                        <button 
                          className="article-btn"
                          onClick={(e) => { e.stopPropagation(); setQueryArticle(article); }}
                          style={{ 
                            backgroundColor: "var(--nr-btn-alt-bg)", color: "var(--nr-text)", border: "none"
                          }}
                        >
                          SUBMIT QUERY <span style={{ fontSize: "13px", fontWeight: "900" }}>?</span>
                        </button>
                      </div>

                      <div className="article-author-tag">
                        BY {getProfName(profId).toUpperCase()}, SPECIALIST
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--nr-text-muted)", fontStyle: "italic", fontSize: "18px", transition: "color 0.3s" }}>
              No research updates are currently assigned to {getProfName(profId)}'s desk.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
              className="page-btn"
            >
              &larr; PREVIOUS
            </button>
            <span className="page-indicator">
              PAGE {currentPage} OF {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className="page-btn"
            >
              NEXT &rarr;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}