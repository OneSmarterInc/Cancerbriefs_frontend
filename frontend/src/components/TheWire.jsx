import React, { useMemo } from "react";

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
const getProfName = (id) => PROF_NAMES[(id || 1) - 1] || PROF_NAMES[0];

export default function TheWire({ articles, selectedCategory = "All", onArticleClick }) {
  // Grab exactly 10 random, active stories filtered by category
  const wireArticles = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    
    // Only use active articles
    let activeArticles = articles.filter(a => a.is_active !== false);
    
    // Filter by the selected category from the Navbar
    if (selectedCategory !== "All") {
      activeArticles = activeArticles.filter(
        article => (article.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Shuffle the array randomly
    const shuffled = [...activeArticles].sort(() => 0.5 - Math.random());
    
    // Return exactly 10
    return shuffled.slice(0, 10);
  }, [articles, selectedCategory]);

  return (
    <aside className="wire-sidebar-container" style={{ padding: "30px 25px", fontFamily: "Arial, Helvetica, sans-serif", height: "100%", transition: "background 0.3s, color 0.3s" }}>
      
      {/* CSS for Dark Mode transitions and hover effects */}
      <style>{`
        .wire-sidebar-container {
          background-color: #1F3A2E; 
          color: #F3EEE3;
        }
        .wire-title {
          color: #F3EEE3;
        }
        .wire-meta, .wire-prof, .wire-source, .wire-empty {
          color: #C9C1B0;
        }
        .wire-border {
          border-bottom: 1px solid rgba(243, 238, 227, 0.2);
        }
        .wire-item-border {
          border-bottom: 1px solid rgba(243, 238, 227, 0.1);
        }

        /* Dark Mode Overrides */
        .dark-mode .wire-sidebar-container {
          background-color: #161412;
          color: #EBE4D5;
          border: 1px solid #332F2C;
          border-radius: 4px;
        }
        .dark-mode .wire-title {
          color: #EBE4D5;
        }
        .dark-mode .wire-meta, .dark-mode .wire-prof, .dark-mode .wire-source, .dark-mode .wire-empty {
          color: #A39E93;
        }
        .dark-mode .wire-border {
          border-bottom: 1px solid #332F2C;
        }
        .dark-mode .wire-item-border {
          border-bottom: 1px solid #332F2C;
        }

        .wire-clickable { 
          text-decoration: none; 
          color: inherit; 
          display: flex; 
          transition: opacity 0.2s, border-color 0.3s; 
          cursor: pointer; 
        }
        .wire-clickable:hover { 
          opacity: 0.75; 
        }
      `}</style>

      {/* Header section */}
      <div className="wire-border" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", marginBottom: "20px", transition: "border 0.3s" }}>
        <h2 className="wire-title" style={{ fontFamily: "Georgia, serif", fontSize: "36px", margin: 0, letterSpacing: "-0.5px", transition: "color 0.3s" }}>The wire</h2>
        <div className="wire-meta" style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.3s" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#C9A227", display: "inline-block" }}></span>
          Live · {selectedCategory}
        </div>
      </div>

      {/* List of articles */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {wireArticles.length > 0 ? (
          wireArticles.map((article, i) => (
            <div 
              onClick={() => {
                if (onArticleClick) {
                  onArticleClick(article);
                } else if (article.link) {
                  window.open(article.link, "_blank", "noopener,noreferrer");
                }
              }}
              key={article.id || i} 
              className="wire-clickable wire-item-border"
              style={{ gap: "15px", paddingBottom: "20px", marginBottom: "20px" }}
            >
              {/* Left Column: Professor Name (Normal size) */}
              <div className="wire-prof" style={{ fontSize: "13px", width: "85px", flexShrink: 0, marginTop: "2px", fontWeight: "bold", transition: "color 0.3s" }}>
                {getProfName(article.professor_id)}
              </div>
              
              {/* Right Column: Smaller Headline, Source Only */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "13.5px", lineHeight: "1.35", fontWeight: "bold" }}>
                  {article.ai_headline || article.title}
                </h4>
                <div className="wire-source" style={{ fontSize: "13px", transition: "color 0.3s" }}>
                  {article.source || "News Source"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="wire-empty" style={{ fontSize: "14px", fontStyle: "italic", transition: "color 0.3s" }}>
            No stories currently available for {selectedCategory}.
          </div>
        )}
      </div>
    </aside>
  );
}