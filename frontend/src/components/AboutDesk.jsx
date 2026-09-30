import React from "react";

export default function AboutDesk({ onBack }) {
  return (
    <main className="page about-page-wrapper">
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
          --hf-accent-dark: #8F7118;
          --hf-btn-bg: transparent;
        }
        
        .dark-mode {
          --hf-bg: #161412;
          --hf-card-bg: #1e1b18;
          --hf-text: #F3EEE3;
          --hf-text-muted: #A39E93;
          --hf-border: #5E574C;
          --hf-border-light: #332F2C;
          --hf-accent: #C9A227;
          --hf-accent-dark: #C9A227;
          --hf-btn-bg: transparent;
        }

        .about-page-wrapper {
          background-color: var(--hf-bg);
          min-height: 100vh;
          transition: background-color 0.3s, color 0.3s;
        }

        .about-page-header {
          border-bottom: 1px solid var(--hf-border-light);
          margin-bottom: 15px;
          padding: 40px 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          transition: border-color 0.3s;
        }

        .about-kicker {
          font-family: Arial, sans-serif;
          font-size: 14px;
          font-weight: bold;
          color: var(--hf-accent-dark);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 5px;
          transition: color 0.3s;
        }

        .about-title {
          font-family: Georgia, serif;
          font-size: 36px;
          color: var(--hf-text);
          margin: 0 0 10px 0;
          transition: color 0.3s;
        }

        .about-subtitle {
          color: var(--hf-text-muted);
          font-size: 16px;
          margin: 0;
          transition: color 0.3s;
        }

        .about-back-btn {
          background: var(--hf-btn-bg);
          border: none;
          cursor: pointer;
          color: var(--hf-accent-dark);
          font-weight: bold;
          font-size: 13px;
          letter-spacing: 1px;
          transition: color 0.3s;
        }

        .about-content {
          max-width: 1100px;
          margin: 40px auto;
          padding: 0 30px 80px 30px;
          line-height: 1.8;
          color: var(--hf-text);
          font-size: 17px;
          transition: color 0.3s;
        }

        .about-content p {
          margin-bottom: 25px;
          color: var(--hf-text);
          transition: color 0.3s;
        }

        .about-heading {
          margin-top: 50px;
          margin-bottom: 20px;
          font-family: Georgia, serif;
          font-size: 28px;
          color: var(--hf-text);
          transition: color 0.3s;
        }

        .about-list {
          padding-left: 25px;
          margin-top: 15px;
          margin-bottom: 35px;
          color: var(--hf-text);
          transition: color 0.3s;
        }

        .about-list li {
          margin-bottom: 15px;
        }

        .about-footer {
          margin-top: 60px;
          padding-top: 25px;
          border-top: 1px solid var(--hf-border-light);
          color: var(--hf-text-muted);
          font-size: 14px;
          line-height: 1.7;
          transition: border-color 0.3s, color 0.3s;
        }

        @media (max-width: 768px) {
          .about-page-header {
            padding: 30px 20px;
          }
          .about-content {
            padding: 0 20px 60px 20px;
          }
          .about-title {
            font-size: 28px;
          }
        }
      `}</style>

      <section className="about-page-header">
        <div>
          <div className="about-kicker">BEHIND THE SCENES</div>
          <h1 className="about-title">About Cancerbriefs</h1>
          <p className="about-subtitle">Your daily desk for clinical oncology and cancer research updates.</p>
        </div>

        <button className="about-back-btn" onClick={onBack}>
          ← BACK TO NEWS
        </button>
      </section>

      <section className="about-content">
        <p>
          <strong>Cancerbriefs</strong> is a modern clinical news discovery platform
          designed to help medical professionals, researchers, and patients follow the rapidly changing worlds of
          oncology, cancer research, clinical trials, and precision medicine.
        </p>

        <p>
          The medical landscape moves quickly. New clinical trials are published,
          breakthrough therapies are announced, diagnostic technologies evolve,
          and researchers publish critical developments across many medical journals.
          Cancerbriefs brings relevant stories from trusted oncology and medical
          publishers into one focused clinical desk so readers can quickly understand
          what is happening and decide which studies deserve a deeper read.
        </p>

        <h2 className="about-heading">
          A Focused Clinical Desk
        </h2>

        <p>
          Cancerbriefs serves oncologists, clinical researchers, medical students,
          healthcare providers, patients, and anyone interested in the medical
          advancements shaping cancer care today.
        </p>

        <p>
          Coverage includes cancer pathologies, ongoing clinical trials,
          immunotherapy developments, surgical oncology techniques, radiation therapies,
          biomarker discoveries, global cancer statistics, and survivorship strategies.
        </p>

        <p>
          Cancerbriefs does not replace professional medical journalism or clinical advice.
          It acts as a discovery layer that helps readers find relevant peer-reviewed reporting
          and continue to the original publisher or journal.
        </p>

        <h2 className="about-heading">
          RSS-Powered Clinical Aggregation
        </h2>

        <p>
          Cancerbriefs uses RSS and publisher-provided feeds to collect
          available information from medical journals, research institutions, and oncology publications.
          Depending on the source, a feed may include a headline, publication date, abstract description,
          image, medical category, publisher name, and link to the original study.
        </p>

        <p>
          The system processes these feeds and organizes incoming research into
          a unified clinical stream. The original publisher remains the
          destination for the complete article, detailed methodology, clinical
          data, and full context.
        </p>

        <h2 className="about-heading">
          AI-Powered Study Summaries
        </h2>

        <p>
          Cancerbriefs may use artificial intelligence to process incoming
          studies and generate concise summaries. These summaries can identify
          the core findings, relevant patient demographics, tested therapies, and the
          broader clinical significance of a development.
        </p>

        <p>
          Summaries are intended to help readers decide which original studies
          to explore. AI-generated content may contain mistakes, omissions,
          outdated information, or incorrect medical interpretations. Readers should
          always verify critical clinical information through the original publisher or
          authoritative medical source.
        </p>

        <h2 className="about-heading">
          Understanding Why It Matters
        </h2>

        <p>
          Cancerbriefs aims to explain not only what was discovered but also why a
          clinical development may matter. For example, a new targeted therapy trial
          may be summarized in terms of the affected cancer type, potential survival impact,
          and relevance to current treatment standards.
        </p>

        <p>
          The same approach may be applied to early detection guidelines, surgical methodologies,
          preventative care, and other complex oncological developments.
        </p>

        <h2 className="about-heading">
          Accessibility First
        </h2>

        <p>
          Cancerbriefs includes browser-based text-to-speech functionality that
          allows users to listen to available summaries and briefings. Native
          browser speech synthesis converts displayed text into spoken audio
          on the user's device.
        </p>

        <p>
          Cancerbriefs continues to explore ways to improve usability across
          devices, screen sizes, and accessibility needs within the medical community.
        </p>

        <h2 className="about-heading">
          Built for Signal, Not Noise
        </h2>

        <p>
          Cancerbriefs is designed to reduce the time required to find
          meaningful oncology research. By combining multiple sources,
          organizing incoming headlines, and applying automated processing, it
          provides a cleaner starting point for daily clinical discovery.
        </p>

        <p>
          The goal is simple: help medical professionals and patients spend less time searching
          and more time understanding the breakthroughs that matter.
        </p>

        <h2 className="about-heading">
          Our Technology
        </h2>

        <ul className="about-list">
          <li>
            <strong>Backend:</strong> Django and Python support the APIs, data
            processing, and server-side workflows.
          </li>

          <li>
            <strong>Frontend:</strong> React and JavaScript provide the
            interactive clinical interface.
          </li>

          <li>
            <strong>AI processing:</strong> Local language models running through
            Ollama may support automated summarization and medical content processing.
          </li>

          <li>
            <strong>News sources:</strong> RSS and publisher-provided feeds
            supply headlines and study metadata.
          </li>

          <li>
            <strong>Content processing:</strong> Automated workflows organize
            incoming studies and prepare them for presentation.
          </li>

          <li>
            <strong>Text-to-speech:</strong> Native browser speech synthesis
            allows users to listen to available summaries and briefings.
          </li>
        </ul>

        <h2 className="about-heading">
          Independent Sources, One Unified Desk
        </h2>

        <p>
          Cancerbriefs brings information from multiple medical publishers together
          without presenting itself as the original publisher. Each journal has
          its own peer-review standards, reporting practices, and areas of
          clinical expertise.
        </p>

        <p>
          Readers are encouraged to visit the original publication for
          complete data, methodology, and additional clinical context.
        </p>

        <h2 className="about-heading">
          What Cancerbriefs Is Not
        </h2>

        <p>
          Cancerbriefs is not a replacement for professional medical advice, clinical guidelines,
          patient consultations, or authoritative healthcare sources.
        </p>

        <p>
          AI-generated summaries and automated classifications may contain
          medical inaccuracies. Important clinical, treatment, surgical, or health-related
          decisions should always be based on verified information from healthcare providers and appropriate authoritative sources.
        </p>

        <h2 className="about-heading">
          Our Vision
        </h2>

        <p>
          Our vision is to create a smarter and more accessible way to
          understand the rapidly advancing field of oncology.
        </p>

        <p>
          Cancerbriefs is built around a simple principle:
          <strong> discover quickly, understand clearly, and read from the
          clinical source.</strong>
        </p>

        <div className="about-footer">
          <strong>Cancerbriefs</strong>
          <br />
          Oncology, Research & Clinical Trial News
          <br />
          Clinical news discovery powered by RSS feeds and AI-assisted content processing.
        </div>
      </section>
    </main>
  );
}