import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0a1e",
        color: "#fff",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px" }}>
        {/* Header */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            Repurposer<span style={{ color: "#7c3aed" }}>.ai</span>
          </span>
        </Link>

        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 48 }}>
          Last updated: March 2026
        </p>

        {[
          {
            title: "1. Information We Collect",
            content:
              "We collect information you provide directly: name, email address, and payment information (processed by Stripe — we never store card details). We also collect content you submit for repurposing and usage data to improve our Service.",
          },
          {
            title: "2. How We Use Your Information",
            content:
              "We use your information to provide and improve the Service, process payments, send transactional emails (job completion, receipts), and communicate important updates. We do not sell your personal data to third parties.",
          },
          {
            title: "3. Data Storage",
            content:
              "Your data is stored securely using Supabase (PostgreSQL). Content you submit is processed to generate outputs and may be retained to improve our AI models. You can request deletion of your data at any time.",
          },
          {
            title: "4. Third-Party Services",
            content:
              "We use the following third-party services: Stripe (payment processing), Supabase (database), Groq (AI generation), Firecrawl (URL scraping), and Resend (email delivery). Each has their own privacy policy.",
          },
          {
            title: "5. Cookies",
            content:
              "We use minimal cookies and localStorage for authentication tokens and user preferences. We do not use tracking cookies or advertising cookies.",
          },
          {
            title: "6. Your Rights",
            content:
              "You have the right to access, correct, or delete your personal data. You can request a copy of your data or ask us to delete your account by contacting support@userepurposer.com. We will respond within 30 days.",
          },
          {
            title: "7. Data Security",
            content:
              "We implement industry-standard security measures including HTTPS encryption, secure authentication, and regular security reviews. However, no system is 100% secure and we cannot guarantee absolute security.",
          },
          {
            title: "8. Children's Privacy",
            content:
              "Our Service is not directed to children under 18. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us.",
          },
          {
            title: "9. Changes to This Policy",
            content:
              "We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on our website. Continued use of the Service constitutes acceptance.",
          },
          {
            title: "10. Contact Us",
            content:
              "For privacy-related questions or requests, contact us at support@userepurposer.com. We take your privacy seriously and will respond promptly.",
          },
        ].map((section) => (
          <div
            key={section.title}
            style={{
              marginBottom: 36,
              paddingBottom: 36,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#06b6d4",
                marginBottom: 12,
              }}
            >
              {section.title}
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {section.content}
            </p>
          </div>
        ))}

        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: 24,
          }}
        >
          <Link
            to="/terms"
            style={{ color: "#7c3aed", textDecoration: "none", fontSize: 14 }}
          >
            Terms of Service
          </Link>
          <Link
            to="/login"
            style={{
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
