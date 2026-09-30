import React from "react";

export default function CookieSettings({ onBack }) {
  return (
    <div className="cookie-page-wrapper">
      <style>{`
        /* Dynamic Theme Variables */
        :root {
          --hf-bg: #F3EEE3;
          --hf-card-bg: #FFFFFF;
          --hf-text: #161412;
          --hf-text-muted: #5E574C;
          --hf-border: #161412;
          --hf-border-light: #D8D1C4;
          --hf-accent: #C9A227;
        }
        
        .dark-mode {
          --hf-bg: #161412;
          --hf-card-bg: #1e1b18;
          --hf-text: #F3EEE3;
          --hf-text-muted: #A39E93;
          --hf-border: #5E574C;
          --hf-border-light: #332F2C;
          --hf-accent: #C9A227;
        }

        .cookie-page-wrapper {
          background-color: var(--hf-bg);
          min-height: 100vh;
          padding: 50px 20px;
          color: var(--hf-text);
          font-family: Arial, sans-serif;
          transition: background-color 0.3s, color 0.3s;
        }

        .cookie-container {
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          background-color: var(--hf-card-bg);
          border: 2px solid var(--hf-border);
          padding: 60px 70px;
          box-shadow: 10px 10px 0px var(--hf-border);
          box-sizing: border-box;
          transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
        }

        .cookie-title {
          font-family: Georgia, serif;
          font-size: 42px;
          line-height: 1.15;
          margin-bottom: 10px;
          border-bottom: 2px solid var(--hf-accent);
          padding-bottom: 18px;
          color: var(--hf-text);
          transition: color 0.3s, border-color 0.3s;
        }

        .cookie-date {
          color: var(--hf-text-muted);
          font-size: 14px;
          margin-bottom: 40px;
          transition: color 0.3s;
        }

        .cookie-heading {
          font-family: Georgia, serif;
          font-size: 22px;
          line-height: 1.3;
          margin-top: 38px;
          margin-bottom: 15px;
          color: var(--hf-text);
          transition: color 0.3s;
        }

        .cookie-paragraph {
          line-height: 1.8;
          margin-bottom: 20px;
          color: var(--hf-text);
          font-size: 15px;
          transition: color 0.3s;
        }

        .cookie-list {
          line-height: 1.9;
          color: var(--hf-text);
          margin-bottom: 25px;
          padding-left: 25px;
          transition: color 0.3s;
        }

        .cookie-footer {
          margin-top: 50px;
          padding-top: 25px;
          border-top: 1px solid var(--hf-border-light);
          color: var(--hf-text-muted);
          font-size: 13px;
          line-height: 1.7;
          transition: border-color 0.3s, color 0.3s;
        }

        @media (max-width: 768px) {
          .cookie-container {
            padding: 40px 25px;
            box-shadow: 6px 6px 0px var(--hf-border);
          }
          .cookie-title {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="cookie-container">
        
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--hf-text)", fontWeight: "bold", fontSize: "12px", letterSpacing: "1px", padding: 0, marginBottom: "30px", transition: "color 0.3s" }}>
            ← BACK
          </button>
        )}

        <h1 className="cookie-title">
          Cookie Settings
        </h1>

        <p className="cookie-date">
          Last updated: September 22, 2026
        </p>

        <p className="cookie-paragraph">
          Cancerbriefs uses limited browser storage to provide essential website functionality, maintain secure administrative sessions, and remember certain interface settings.
        </p>

        <p className="cookie-paragraph">
          Cancerbriefs does not currently use third-party advertising cookies, cross-site advertising trackers, or third-party analytics cookies.
        </p>

        <h3 className="cookie-heading">1. Cookies and Browser Storage</h3>
        <p className="cookie-paragraph">
          Cookies are small files that websites may store on your device. Cancerbriefs may also use local storage and session storage, which provide similar functionality within your browser.
        </p>

        <h3 className="cookie-heading">2. Technologies We Use</h3>
        <p className="cookie-paragraph">
          Cancerbriefs currently uses essential browser storage for:
        </p>
        <ul className="cookie-list">
          <li>Maintaining authenticated administrative sessions</li>
          <li>Remembering the signed-in user and current page</li>
          <li>Remembering the selected administrative view</li>
        </ul>
        <p className="cookie-paragraph">
          Authentication information is stored only as needed to provide and protect restricted website functionality.
        </p>

        <h3 className="cookie-heading">3. Essential Storage</h3>
        <p className="cookie-paragraph">
          Essential storage supports login, authentication, navigation, security, and administrative functionality. Disabling or clearing this storage may sign you out or prevent restricted features from working correctly.
        </p>
        <p className="cookie-paragraph">
          Cancerbriefs does not use this storage to create advertising profiles or track your activity across unrelated websites.
        </p>

        <h3 className="cookie-heading">4. RSS Feeds and AI Processing</h3>
        <p className="cookie-paragraph">
          Cancerbriefs collects news from RSS and publisher-provided feeds. Automated systems and artificial intelligence may organize, categorize, and summarize that content.
        </p>
        <p className="cookie-paragraph">
          RSS collection and AI processing occur through Cancerbriefs' backend systems. These processes do not require cookies or browser storage on your device.
        </p>

        <h3 className="cookie-heading">5. Analytics and Advertising</h3>
        <p className="cookie-paragraph">
          Cancerbriefs does not currently use third-party analytics or advertising cookies.
        </p>
        <p className="cookie-paragraph">
          If analytics, advertising, or other optional tracking technologies are introduced, this page will be updated. Where required by law, users will be given an appropriate consent choice before non-essential technologies are activated.
        </p>

        <h3 className="cookie-heading">6. External Websites</h3>
        <p className="cookie-paragraph">
          Cancerbriefs links to original news publishers and other external websites. When you open an external link, that website may use its own cookies or tracking technologies.
        </p>
        <p className="cookie-paragraph">
          Cancerbriefs does not control the cookie practices of external websites. Please review their privacy and cookie policies for more information.
        </p>

        <h3 className="cookie-heading">7. Managing Browser Storage</h3>
        <p className="cookie-paragraph">
          You can view, delete, or restrict cookies and browser storage through your browser's privacy or site-data settings.
        </p>
        <p className="cookie-paragraph">
          Clearing Cancerbriefs' site data may sign you out and reset saved navigation or interface settings.
        </p>

        <h3 className="cookie-heading">8. Changes to These Settings</h3>
        <p className="cookie-paragraph">
          Cancerbriefs may update this page if its use of cookies, browser storage, analytics, or other technologies changes. The date at the top will show when the page was most recently revised.
        </p>

        <h3 className="cookie-heading">9. Related Policies</h3>
        <p className="cookie-paragraph">
          This Cookie Settings page should be read together with the Cancerbriefs Privacy Policy and Terms of Use.
        </p>

        <h3 className="cookie-heading">10. Contact Us</h3>
        <p className="cookie-paragraph">
          If you have questions about cookies, browser storage, or Cancerbriefs' privacy practices, please contact us using the contact information available on the Cancerbriefs website.
        </p>

        <div className="cookie-footer">
          <strong>Cancerbriefs</strong>
          <br />
          News discovery powered by RSS feeds and AI-assisted content processing.
        </div>
      </div>
    </div>
  );
}