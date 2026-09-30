import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config";

const formatToEST = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const timeMatch = dateString.match(/\d{1,2}:\d{2}(:\d{2})?/);
      return timeMatch ? timeMatch[0] : "Latest"; 
    }

    return new Intl.DateTimeFormat("en-US", {
      timeZone: "EST", 
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  } catch (e) {
    return "Latest";
  }
};

const formatTimeSeconds = (secs) => {
  if (isNaN(secs) || secs === 0) return "0:00";
  const mins = Math.floor(secs / 60);
  const remainingSecs = Math.floor(secs % 60);
  return `${mins}:${remainingSecs < 10 ? "0" : ""}${remainingSecs}`;
};

export default function Navbar({ 
  selectedCategory, setSelectedCategory, user, onSignin, onLogout,
  onHome, onRss, onClinicalTrials, onAbout, onAdmin, onSubscribe, 
  latestHeadline, latestSummary, latestPublished, latestSource, latestCategory, latestId,
  totalStories = 0, totalSources = 0, onSearch 
}) {
  const [speaking, setSpeaking] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false); 
  const [progress, setProgress] = useState(0); 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(new Date());
  
  const [embedCopied, setEmbedCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --- THEME TOGGLE LOGIC ---
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("app_theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    if (theme === "dark") {
      document.body.style.backgroundColor = "#161412";
      document.body.style.color = "#FCFBF8";
      document.body.classList.add("dark-mode");
    } else {
      // Very subtle, comfortable warm off-white (less yellow than before, warmer than pure white)
      document.body.style.backgroundColor = "#FCFBF8";
      document.body.style.color = "#161412";
      document.body.classList.remove("dark-mode");
    }
  }, [theme]);

  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "#161412" : "#FCFBF8",
    text: isDark ? "#FCFBF8" : "#161412",
    bgAlt: isDark ? "#1e1b18" : "#F5F3EB", // Slightly darker warm tone for contrast sections
    textMuted: isDark ? "#A39E93" : "#5E574C",
    border: isDark ? "#5E574C" : "#161412",
    borderLight: isDark ? "#332F2C" : "#E2DAC6",
    accent: "#C9A227",
    btnBg: isDark ? "#FCFBF8" : "#161412",
    btnText: isDark ? "#161412" : "#FCFBF8",
  };
  // --------------------------

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // GLOBAL AUDIO CONFLICT FIX: Stop navbar audio if a news card starts speaking
  useEffect(() => {
    const handleGlobalStopAudio = () => {
      if (window.audioPlayer) {
        window.audioPlayer.pause();
      }
      setSpeaking(false);
      setIsBuffering(false);
      setProgress(0);
      setCurrentTime(0);
    };
    window.addEventListener("stop-other-audio", handleGlobalStopAudio);
    return () => window.removeEventListener("stop-other-audio", handleGlobalStopAudio);
  }, []);

  const navigate = (path) => {
    setDrawerOpen(false); 
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const goHome = () => {
    setDrawerOpen(false);
    if (onHome) onHome();
    if (setSelectedCategory) setSelectedCategory("All");
    navigate("/");
  };

  const handleNavClick = (e, path, callback) => {
    e.preventDefault();
    if (callback) callback();
    navigate(path);
  };

  // SMART SCROLL TO NEWSROOM FEATURE
  const scrollToNewsroom = (e) => {
    e.preventDefault();
    setDrawerOpen(false);
    
    const triggerScroll = () => {
      const headings = Array.from(document.querySelectorAll('h2'));
      const newsroomHeading = headings.find(h => h.textContent.includes('Meet the Oncology Board') || h.textContent.includes('Oncology Board') || h.textContent.includes('Meet the Newsroom'));
      
      if (newsroomHeading) {
        newsroomHeading.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    };

    if (window.location.pathname !== "/" && window.location.pathname !== "") {
      goHome();
      setTimeout(triggerScroll, 400); 
    } else {
      triggerScroll(); 
    }
  };

  const submitSearch = (event) => {
    event.preventDefault();
    if (!search.trim()) return;
    onSearch ? onSearch(search.trim()) : navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const readSummary = () => {
    if (speaking || isBuffering) {
      if (window.audioPlayer) window.audioPlayer.pause();
      setSpeaking(false);
      setIsBuffering(false);
      setProgress(0);
      setCurrentTime(0);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    window.dispatchEvent(new CustomEvent("stop-other-audio", { detail: "navbar-audio" }));

    const textToSpeak = latestSummary || latestHeadline || "Latest news is loading.";
    const audioUrl = `${API_BASE_URL}/audio/?text=${encodeURIComponent(textToSpeak)}`;
  
    setIsBuffering(true);
    window.audioPlayer = new Audio(audioUrl);
  
    window.audioPlayer.onplay = () => { 
      setIsBuffering(false); 
      setSpeaking(true); 
      setProgress(0); 
    };

    window.audioPlayer.onloadedmetadata = () => {
      if (window.audioPlayer.duration) {
        setDuration(window.audioPlayer.duration);
      }
    };
  
    window.audioPlayer.ontimeupdate = () => {
      if (window.audioPlayer.duration) {
        const dur = window.audioPlayer.duration;
        const cur = window.audioPlayer.currentTime;
        setCurrentTime(cur);
        setDuration(dur);
        setProgress((cur / dur) * 100);
      }
    };
  
    window.audioPlayer.onended = () => { 
      setSpeaking(false); 
      setProgress(100); 
      setCurrentTime(duration);
      setTimeout(() => { setProgress(0); setCurrentTime(0); }, 1000); 
    };

    window.audioPlayer.onerror = () => {
      setIsBuffering(false);
      setSpeaking(false);
    };
  
    window.audioPlayer.play().catch(e => {
      setIsBuffering(false);
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://cancerbriefs-frontend.vercel.app/");
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="https://cancerbriefs-frontend.vercel.app/" width="680" height="120" style="border:0;" loading="lazy" title="Cancerbriefs Newsletter"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  };

  const currentDate = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "EST",
      weekday: "long", 
      month: "long", 
      day: "numeric", 
      year: "numeric"
    }).format(now);
  }, [now]);

  const recordingTime = useMemo(() => {
    if (latestPublished) {
      return formatToEST(latestPublished);
    }
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "EST",
      hour: "numeric",
      minute: "2-digit"
    }).format(now);
  }, [latestPublished, now]);

  const displaySummary = useMemo(() => {
    if (!latestSummary) return "AI-powered clinical intelligence from your live RSS feeds. Each item links back to the reporting it was built from.";
    const words = latestSummary.split(" ");
    if (words.length > 28) {
      return words.slice(0, 28).join(" ") + "...";
    }
    return latestSummary;
  }, [latestSummary]);

  return (
    <header className="aggregate-clone">
      <style>{`
        .aggregate-clone { background: ${colors.bg}; color: ${colors.text}; width: 100%; font-family: Arial, Helvetica, sans-serif; transition: background 0.3s, color 0.3s; }
        .aggregate-clone * { box-sizing: border-box; }
        .aggregate-wrap { width: 100%; max-width: 1455px; margin: 0 auto; padding: 0 20px; }
 
        /* TOPBAR */
        .aggregate-topbar { min-height: 42px; border-top: 1px solid ${colors.border}; border-bottom: 1px solid ${colors.border}; display: flex; align-items: center; justify-content: space-between; padding: 0 22px; color: ${colors.textMuted}; font-size: 14px; width: 100%; flex-wrap: wrap; background: ${colors.bg}; position: relative; z-index: 50; transition: border 0.3s, background 0.3s, color 0.3s; }
        .aggregate-top-left { display: flex; align-items: center; gap: 12px; padding: 10px 0; flex: 1; }
        .aggregate-top-left-text { line-height: 1.4; }
        .aggregate-live-dot { width: 8px; height: 8px; border-radius: 50%; background: #1F3A2E; display: inline-block; flex: none; }
 
        .hamburger-icon { background: transparent; border: none; color: ${colors.text}; font-size: 24px; cursor: pointer; display: flex; align-items: center; padding: 0; transition: color 0.2s ease; }
        .hamburger-icon:hover { color: ${colors.accent}; }

        .aggregate-top-right { display: flex; align-items: stretch; height: 42px; gap: 6px; }
        .aggregate-top-link { position: relative; color: ${colors.textMuted}; text-decoration: none; display: flex; align-items: center; padding: 0 13px; font-size: 14px; cursor: pointer; transition: color .2s ease, background-color .2s ease; }
        .aggregate-top-link::after { content: ""; position: absolute; left: 13px; right: 13px; bottom: 6px; height: 2px; background: ${colors.accent}; transform: scaleX(0); transform-origin: center; transition: transform .2s ease; }
        .aggregate-top-link:focus-visible, .aggregate-top-link:hover { color: ${colors.text}; background: rgba(201,162,39,.08); outline: 0; }
        .aggregate-top-link:focus-visible::after, .aggregate-top-link:hover::after { transform: scaleX(1); }
 
        .aggregate-subscribe { border: 0; background: ${colors.accent}; color: #161412; font-weight: 700; padding: 0 16px; cursor: pointer; font-size: 14px; transition: background-color .2s ease, color .2s ease, transform .15s ease; display: inline-flex; align-items: center; justify-content: center; margin-right: 8px; }
        .aggregate-subscribe:focus-visible, .aggregate-subscribe:hover { background: #8F7118; color: #FCFBF8; outline: 0; }
        .aggregate-subscribe:active { transform: translateY(1px); }
 
        /* MASTHEAD */
        .aggregate-masthead { padding: 25px 20px; border-bottom: 1px solid ${colors.border}; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; transition: border 0.3s; }
        .aggregate-brand-container { border: 0; background: transparent; padding: 0; margin: 0; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 16px; transition: opacity .2s ease, transform .2s ease; }
        .aggregate-brand-container:hover { opacity: 0.9; }
        .aggregate-brand-container:active { transform: scale(.995); }
 
        .aggregate-brand { font-family: Georgia, "Times New Roman", serif; font-size: clamp(38px, 6vw, 78px); line-height: .83; font-weight: 900; letter-spacing: -2px; color: ${colors.text}; margin: 0; transition: color 0.3s; }
        
        /* Adjusted logo sizing for a cleaner, compact feel across all devices */
        .aggregate-logo-img { width: clamp(35px, 4vw, 55px); height: clamp(35px, 4vw, 55px); object-fit: contain; border-radius: 6px; }

        /* BRIEFING */
        .aggregate-briefing { padding: 14px 0; background: ${colors.bgAlt}; border-bottom: 1px solid ${colors.border}; transition: background 0.3s, border 0.3s; }
        .aggregate-briefing-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 35px; align-items: start; }
        .aggregate-briefing-label { color: ${colors.accent}; font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px; }
        .aggregate-briefing-meta { color: ${colors.textMuted}; font-weight: 400; transition: color 0.3s; }
        .aggregate-briefing-title { font-family: Georgia, "Times New Roman", serif; font-size: 23px; line-height: 1.2; font-weight: 700; margin: 5px 0; max-width: 760px; color: ${colors.text}; transition: color 0.3s; }
        .aggregate-briefing-summary { color: ${colors.textMuted}; font-size: 14px; line-height: 1.5; max-width: 760px; transition: color 0.3s; }
        
        .aggregate-briefing-link-wrapper { text-decoration: none; color: inherit; display: block; transition: opacity 0.2s; cursor: pointer; }
        .aggregate-briefing-link-wrapper:hover { opacity: 0.75; }
 
        .aggregate-player-container { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 530px; }
        
        .aggregate-player { border: 1px solid ${colors.border}; padding: 6px 12px; display: flex; align-items: center; gap: 11px; background: ${colors.bg}; min-height: 40px; width: 100%; transition: border 0.3s, background 0.3s; }
        .aggregate-play { width: 30px; height: 30px; border-radius: 50%; border: 0; background: ${colors.btnBg}; color: ${colors.btnText}; display: flex; align-items: center; justify-content: center; cursor: pointer; flex: none; font-size: 12px; transition: background 0.2s, color 0.2s; }
        .aggregate-play.active, .aggregate-play:hover { background: ${colors.accent}; color: #161412; }
 
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .buffering-icon { display: inline-block; animation: spin 2s linear infinite; font-size: 11px; }

        .aggregate-player-main { flex: 1; min-width: 0; display: flex; align-items: center; gap: 11px; }
        .aggregate-progress { flex: 1; height: 4px; background: ${colors.borderLight}; position: relative; border-radius: 2px; overflow: hidden; width: 100%; transition: background 0.3s; }
        .aggregate-progress-fill { height: 100%; background: ${colors.text}; transition: background 0.3s; }

        .action-buttons-row { display: flex; gap: 10px; margin-top: 4px; flex-wrap: wrap; }
        .action-btn { border: 1px solid ${colors.accent}; background: transparent; color: ${colors.textMuted}; padding: 7px 12px; font-size: 11px; font-weight: bold; letter-spacing: 0.8px; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; text-align: center; display: inline-flex; justify-content: center; align-items: center; flex: 1; min-width: 100px; }
        .action-btn:hover { background: ${colors.accent}; color: #161412; }

        .side-drawer-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 9998; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
        .side-drawer-overlay.open { opacity: 1; pointer-events: auto; }
 
        .side-drawer { 
          position: fixed; 
          top: 0; 
          left: -320px; 
          width: 290px; 
          height: 100vh; 
          height: 100dvh; 
          background: #161412; 
          color: #FCFBF8; 
          z-index: 9999; 
          transition: left 0.3s ease; 
          padding: 35px 25px 40px 25px; 
          box-shadow: 5px 0 15px rgba(0,0,0,0.5); 
          display: flex; 
          flex-direction: column; 
          overflow-y: auto; 
        }
        .side-drawer.open { left: 0; }
        .drawer-close { align-self: flex-end; background: transparent; border: none; color: #E5E5E5; font-size: 24px; cursor: pointer; padding: 0; margin-bottom: 30px; transition: color 0.2s; }
        .drawer-close:hover { color: #C9A227; }
 
        .drawer-link { display: block; color: #FCFBF8; text-decoration: none; font-size: 21px; font-family: Georgia, serif; padding: 14px 0; border-bottom: 1px solid #332F2C; cursor: pointer; transition: color 0.2s ease, padding-left 0.2s ease; }
        .drawer-link:hover { color: #C9A227; padding-left: 9px; }
 
        @media (max-width: 980px) {
          .aggregate-briefing-inner { grid-template-columns: 1fr; gap: 15px; }
          .aggregate-player-container { max-width: 100%; gap: 6px; }
        }
        
        @media (max-width: 760px) {
          .aggregate-topbar { padding: 8px 14px; min-height: 44px; flex-wrap: nowrap; }
          .aggregate-top-left { font-size: 13px; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; width: 100%; flex-wrap: nowrap; gap: 8px; padding: 0; }
          .aggregate-top-left-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .hamburger-icon { margin: 0; font-size: 24px; } 
          .aggregate-top-right { display: none; }
          
          .aggregate-masthead { padding: 16px 15px; }
          .aggregate-brand { font-size: clamp(32px, 9vw, 48px); letter-spacing: -1.5px; }
          .aggregate-logo-img { width: 35px; height: 35px; }
          
          .aggregate-briefing { padding: 12px 0; }
          .aggregate-briefing-inner { gap: 12px; }
          .aggregate-briefing-label { margin-bottom: 2px; font-size: 11px; }
          .aggregate-briefing-title { font-size: 19px; margin: 3px 0; line-height: 1.25; }
          .aggregate-briefing-summary { font-size: 13px; line-height: 1.4; margin-bottom: 6px; }
          
          .aggregate-player { min-height: 36px; padding: 6px 10px; }
          .aggregate-play { width: 28px; height: 28px; font-size: 11px; }
          
          form.search-form { height: 36px !important; margin-top: 4px; }
          form.search-form input[type="search"] { padding: 0 12px !important; font-size: 14px !important; }
          form.search-form button[type="submit"] { padding: 0 14px !important; font-size: 12px !important; }

          .action-buttons-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 0; }
          .action-btn { padding: 8px; font-size: 11px; width: 100%; min-width: 0; }
        }
      `}</style>

      {/* Slide-out Overlay */}
      <div 
        className={`side-drawer-overlay ${drawerOpen ? "open" : ""}`} 
        onClick={() => setDrawerOpen(false)}
      ></div>

      {/* Slide-out Menu Panel */}
      <div className={`side-drawer ${drawerOpen ? "open" : ""}`}>
        <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        <a className="drawer-link" onClick={goHome}>Home</a>
        <a className="drawer-link" onClick={scrollToNewsroom}>Oncology Board</a>
        <a className="drawer-link" onClick={(e) => handleNavClick(e, "/rss", onRss)}>RSS Feed</a>
        
        {/* Clinical Trials Link */}
        <a className="drawer-link" href="/clinicaltrials" onClick={(e) => handleNavClick(e, "/clinicaltrials", onClinicalTrials)}>Clinical Trials</a>
        
        <a className="drawer-link" onClick={(e) => handleNavClick(e, "/how", onAbout)}>About the Cancerbriefs</a>
        <a className="drawer-link" onClick={(e) => handleNavClick(e, "/join", null)}>Careers</a>
        
        {/* Render Sign Out & Username only if logged in - Sign In removed */}
        {user && (
          <>
            <div 
              className="drawer-link" 
              style={{ color: "#C9A227", marginTop: "15px", cursor: "default", display: "flex", alignItems: "center", gap: "8px" }}
              title="now you are capable to use our ai agent to help you"
            >
              {/* Professional User Silhouette Icon SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{user.username || user.email}</span>
            </div>
            <a className="drawer-link" style={{ color: "#D32F2F" }} onClick={(e) => { setDrawerOpen(false); if (onLogout) onLogout(); }}>
              Sign Out
            </a>
          </>
        )}

        <div style={{ marginTop: "auto", paddingTop: "30px", paddingBottom: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {/* MOBILE THEME SEGMENTED TOGGLE */}
          <div style={{ display: "flex", width: "100%", border: "1px solid #5E574C", borderRadius: "6px", overflow: "hidden" }}>
            <button 
              onClick={() => setTheme("dark")} 
              style={{ 
                flex: 1, padding: "12px", border: "none", 
                backgroundColor: isDark ? "#161412" : "transparent", 
                color: isDark ? "#C9A227" : "#A39E93", 
                fontWeight: "bold", cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Dark
            </button>
            <button 
              onClick={() => setTheme("light")} 
              style={{ 
                flex: 1, padding: "12px", border: "none", 
                backgroundColor: !isDark ? "#FCFBF8" : "transparent", 
                color: !isDark ? "#161412" : "#A39E93", 
                fontWeight: "bold", cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Light
            </button>
          </div>

          <button 
            className="aggregate-subscribe" 
            style={{ width: "100%", padding: "14px", fontSize: "16px", border: "none" }} 
            onClick={(e) => { e.preventDefault(); setDrawerOpen(false); if (onSubscribe) onSubscribe(); }}
          >
            Subscribe
          </button>
        </div>
      </div>
 
      <div className="aggregate-topbar">
        <div className="aggregate-top-left">
          <button className="hamburger-icon" style={{ paddingRight: "10px" }} onClick={() => setDrawerOpen(true)}>☰</button>
          
          <span className="aggregate-top-left-text">
            {currentDate} · {totalStories} stories compiled today from {totalSources} sources
          </span>
        </div>
 
        <div className="aggregate-top-right">
          
          {/* Clinical Trials Link */}
          <a className="aggregate-top-link" href="/clinicaltrials" onClick={(e) => handleNavClick(e, "/clinicaltrials", onClinicalTrials)}>Clinical Trials</a>
          
          <a className="aggregate-top-link" href="/how" onClick={(e) => handleNavClick(e, "/how", onAbout)}>About the Cancerbriefs</a>
          
          {/* Render Sign Out & Username only if logged in - Sign In removed */}
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "13px", paddingRight: "13px" }}>
              <span 
                style={{ fontSize: "13px", fontWeight: "bold", color: colors.text, display: "flex", alignItems: "center", gap: "6px", cursor: "help", transition: "color 0.3s" }}
                title="now you are capable to use our ai agent to help you"
              >
                {/* Professional User Silhouette Icon SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {user.username || user.email}
              </span>
              <button 
                onClick={onLogout} 
                style={{ background: "none", border: `1px solid ${colors.text}`, padding: "4px 8px", fontSize: "11px", fontWeight: "bold", cursor: "pointer", color: colors.text, transition: "color 0.3s, border 0.3s" }}
              >
                SIGN OUT
              </button>
            </div>
          )}

          <button className="aggregate-subscribe" type="button" onClick={(e) => { e.preventDefault(); if (onSubscribe) onSubscribe(); }}>Subscribe</button>
          
          {/* DESKTOP THEME SEGMENTED TOGGLE */}
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${colors.borderLight}`, borderRadius: "6px", overflow: "hidden", marginLeft: "8px", backgroundColor: colors.bgAlt }}>
            <button 
              onClick={() => setTheme("dark")}
              style={{
                padding: "6px 14px",
                border: "none",
                backgroundColor: isDark ? "#161412" : "transparent",
                color: isDark ? "#C9A227" : colors.textMuted,
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Dark
            </button>
            <button 
              onClick={() => setTheme("light")}
              style={{
                padding: "6px 14px",
                border: "none",
                backgroundColor: !isDark ? "#FCFBF8" : "transparent",
                color: !isDark ? "#161412" : colors.textMuted,
                fontWeight: "bold",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Light
            </button>
          </div>
        </div>
      </div>

      <div className="aggregate-masthead">
        <button className="aggregate-brand-container" type="button" onClick={goHome}>
          <img src="/images/logo.png" alt="Cancerbriefs Logo" className="aggregate-logo-img" />
          <h1 className="aggregate-brand">Cancerbriefs</h1>
        </button>
      </div>

      <section className="aggregate-briefing">
        <div className="aggregate-wrap aggregate-briefing-inner">
 
          <div>
            <a 
              href={latestId ? `/?article_id=${latestId}` : "#"} 
              className="aggregate-briefing-link-wrapper"
              title={latestId ? "Read full article" : ""}
            >
              <div className="aggregate-briefing-label">Latest news briefing <span className="aggregate-briefing-meta">· recorded {recordingTime}</span></div>
              <h2 className="aggregate-briefing-title">{latestHeadline || "Three stories that will shape your Thursday, read by the desk."}</h2>
              <div className="aggregate-briefing-summary">{displaySummary}</div>
            </a>
          </div>
 
          <div className="aggregate-player-container">
            <div className="aggregate-player">
              <button 
                type="button" 
                className={`aggregate-play ${speaking || isBuffering ? "active" : ""}`} 
                onClick={readSummary} 
                aria-label={speaking ? "Stop reading" : "Read briefing"}
              >
                {isBuffering ? <span className="buffering-icon">⏳</span> : speaking ? "■" : "▶"}
              </button>
              
              <div className="aggregate-player-main">
                <div className="aggregate-progress">
                  <div 
                    className="aggregate-progress-fill" 
                    style={{ 
                      width: `${progress}%`, 
                      transition: "width 0.1s linear, background 0.3s" 
                    }} 
                  />
                </div>
                <div style={{ fontSize: "12px", color: colors.textMuted, fontWeight: "bold", whiteSpace: "nowrap", fontFamily: "Arial, sans-serif", transition: "color 0.3s" }}>
                  {formatTimeSeconds(currentTime)} / {duration ? formatTimeSeconds(duration) : "0:00"}
                </div>
              </div>
            </div>

            <form className="search-form" onSubmit={submitSearch} style={{ display: "flex", height: "38px", width: "100%" }}>
              <input 
                type="search" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search stories..." 
                aria-label="Search stories"
                style={{ flex: 1, border: `1px solid ${colors.borderLight}`, borderRight: "none", background: colors.bg, color: colors.text, padding: "0 15px", fontSize: "14px", outline: "none", borderRadius: 0, transition: "background 0.3s, color 0.3s, border 0.3s" }}
              />
              <button 
                type="submit"
                style={{ backgroundColor: colors.btnBg, color: colors.btnText, border: "none", padding: "0 20px", fontWeight: "bold", cursor: "pointer", fontSize: "12px", transition: "background 0.2s, color 0.2s", borderRadius: 0 }}
                onMouseOver={(e) => e.target.style.backgroundColor = colors.accent}
                onMouseOut={(e) => e.target.style.backgroundColor = colors.btnBg}
              >
                SEARCH
              </button>
            </form>

            <div className="action-buttons-row">
              <button 
                type="button" 
                className="action-btn" 
                onClick={handleCopyLink}
              >
                {linkCopied ? "COPIED!" : "COPY LINK"}
              </button>
              <button 
                type="button" 
                className="action-btn" 
                onClick={handleCopyEmbed}
              >
                {embedCopied ? "COPIED!" : "COPY EMBED"}
              </button>
              <button 
                type="button" 
                className="action-btn" 
                onClick={() => window.open('https://x.com/', '_blank')}
              >
                TWEET
              </button>
              <button 
                type="button" 
                className="action-btn" 
                onClick={(e) => handleNavClick(e, "/rss", onRss)}
              >
                PODCAST RSS
              </button>
            </div>

          </div>
        </div>
      </section>
    </header>
  );
}