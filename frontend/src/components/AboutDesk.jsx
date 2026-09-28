import React from "react";

export default function AboutDesk({ onBack }) {
  return (
    <main className="page">
      <section className="page-header">
        <div>
          <div className="kicker">BEHIND THE SCENES</div>
          <h1 style={{ fontFamily: "Georgia, serif", color: "#161412" }}>About Cancerbriefs</h1>
          <p>Your daily desk for clinical oncology and cancer research updates.</p>
        </div>

        <button className="refresh" onClick={onBack}>
          ← BACK TO NEWS
        </button>
      </section>

      <section
        className="about-content"
        style={{
          maxWidth: "1100px",
          margin: "40px auto",
          padding: "0 30px",
          lineHeight: "1.8",
          color: "#161412",
          fontSize: "17px",
        }}
      >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
          Our Technology
        </h2>

        <ul
          style={{
            paddingLeft: "25px",
            marginTop: "15px",
            marginBottom: "25px",
          }}
        >
          <li style={{ marginBottom: "12px" }}>
            <strong>Backend:</strong> Django and Python support the APIs, data
            processing, and server-side workflows.
          </li>

          <li style={{ marginBottom: "12px" }}>
            <strong>Frontend:</strong> React and JavaScript provide the
            interactive clinical interface.
          </li>

          <li style={{ marginBottom: "12px" }}>
            <strong>AI processing:</strong> Local language models running through
            Ollama may support automated summarization and medical content processing.
          </li>

          <li style={{ marginBottom: "12px" }}>
            <strong>News sources:</strong> RSS and publisher-provided feeds
            supply headlines and study metadata.
          </li>

          <li style={{ marginBottom: "12px" }}>
            <strong>Content processing:</strong> Automated workflows organize
            incoming studies and prepare them for presentation.
          </li>

          <li style={{ marginBottom: "12px" }}>
            <strong>Text-to-speech:</strong> Native browser speech synthesis
            allows users to listen to available summaries and briefings.
          </li>
        </ul>

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <h2
          style={{
            marginTop: "40px",
            marginBottom: "15px",
            fontFamily: "Georgia, serif",
          }}
        >
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

        <div
          style={{
            marginTop: "50px",
            paddingTop: "25px",
            borderTop: "1px solid #D8D1C4",
            color: "#5E574C",
            fontSize: "14px",
            lineHeight: "1.7",
          }}
        >
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