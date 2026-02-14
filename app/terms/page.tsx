import React from "react";

export default function TermsPage() {
  return (
  <div
      style={{
        backgroundColor: "#000",
        color: "#ccc",
        padding: "20px 20px 60px 20px", // Több hely alulra
        fontFamily: "sans-serif",
        lineHeight: "1.8", // Lazább sorköz, könnyebb olvasni
        fontSize: "16px",  // Nagyobb betűk (eddig alapméret volt)
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          color: "#fff",
          borderBottom: "1px solid #333",
          paddingBottom: "10px",
        }}
      >
        TERMS & CONDITIONS (EN) — Hex Land Grab
      </h1>
      <p>Last updated: 2026-02-14</p>

      {/* RED WARNING BOX */}
      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          border: "1px solid #ff4d4d",
          backgroundColor: "rgba(255, 77, 77, 0.08)",
          borderRadius: "10px",
        }}
      >
        <div style={{ color: "#ff4d4d", fontWeight: 700, marginBottom: "6px" }}>
          Important Notice
        </div>
        <ul style={{ margin: 0, paddingLeft: "18px", color: "#ffd1d1" }}>
          <li>
            “Claiming” a color creates only a platform-specific digital record in a private database (not on a blockchain)
            and does <b>not</b> grant real-world legal ownership of any color.
          </li>
          <li>
            <b>No refunds:</b> all digital sales are final, except where required by applicable law.
          </li>
          <li>
            The service is provided “as is” and “as available” with <b>no uptime guarantees</b>.
          </li>
        </ul>
      </div>

      <h2 style={{ color: "#fff", marginTop: "28px" }}>1) Overview</h2>
      <p>
        Hex Land Grab (“we”, “us”, “our”) provides an entertainment and status-based digital collectible experience that lets
        users “claim” a hex color code for a one-time fee. A claim is recorded in our private database (Supabase) and displayed
        on the Hex Land Grab website hosted on Vercel. Payments are processed by Gumroad, acting as the merchant of record.
      </p>

      <h2 style={{ color: "#fff" }}>2) Eligibility</h2>
      <p>
        You must be at least 18 years old (or the age of legal majority in your jurisdiction) to purchase a claim. By using
        the site or purchasing a claim, you represent that you meet this requirement.
      </p>

      <h2 style={{ color: "#ff4d4d" }}>3) What You Are Buying (Important)</h2>
      <p>When you purchase a claim, you receive:</p>
      <ul>
        <li>
          A digital record on the Hex Land Grab platform indicating that your account/email is associated with a specific hex
          color code; and
        </li>
        <li>The ability for that record to be displayed as “claimed” on this website.</li>
      </ul>
      <p>You do NOT receive:</p>
      <ul>
        <li>
          Any legal ownership, intellectual property rights, trademark rights, or exclusive rights to use a color in the real
          world or on other platforms;
        </li>
        <li>Any rights enforceable against third parties; or</li>
        <li>Any blockchain token, NFT, or on-chain ownership proof.</li>
      </ul>
      <p>Claims are platform-specific digital records for entertainment/status purposes only.</p>

      <h2 style={{ color: "#fff" }}>4) Claim Availability and Conflicts</h2>
      <p>
        Each hex code can be recorded as claimed only once in our database. Due to the nature of online systems, two users may
        attempt to claim the same code close in time. If a claim attempt conflicts with an existing record, the platform will
        treat the code as unavailable. We do not guarantee availability of any specific code at the time of purchase.
      </p>

      <h2 style={{ color: "#fff" }}>5) Pricing and Payment</h2>
      <p>
        The price of a claim is shown at checkout. Gumroad processes payments and may apply its own terms and policies. You are
        responsible for any charges related to your payment method, and any applicable taxes or fees.
      </p>

      <h2 style={{ color: "#ff4d4d" }}>6) No Refund Policy (Digital Goods)</h2>
      <p>
        All purchases are final. Because the product is a digital good/instant-access service (a database record and status
        display), we do not offer refunds, returns, or exchanges, except where required by applicable law. For unauthorized or
        fraudulent transactions, contact Gumroad and your payment provider immediately.
      </p>

      <h2 style={{ color: "#fff" }}>7) Platform Operation, Uptime, and Changes</h2>
      <p>
        We strive to keep the site available, but we do not guarantee uninterrupted service, 100% uptime, or error-free
        operation. The service may be temporarily unavailable due to maintenance, upgrades, provider outages
        (Vercel/Supabase/Gumroad), network issues, or other reasons. We may modify, suspend, or discontinue any part of the site
        at any time.
      </p>

      <h2 style={{ color: "#fff" }}>8) User Content and Display Name</h2>
      <p>
        You are responsible for the accuracy and appropriateness of any submitted information. We may remove or modify
        displayed names or records that contain offensive, unlawful, or misleading content, at our discretion.
      </p>

      <h2 style={{ color: "#fff" }}>9) Acceptable Use</h2>
      <p>
        You agree not to attempt to exploit or disrupt the website, submit false data, impersonate others, or use automated
        methods to overload the service.
      </p>

      <h2 style={{ color: "#fff" }}>10) Intellectual Property</h2>
      <p>
        The website, branding, and design are owned by us or licensed to us. Purchasing a claim does not grant you any
        ownership of our intellectual property.
      </p>

      <h2 style={{ color: "#fff" }}>11) Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we provide the service “as is” and “as available” without warranties of any
        kind. We are not liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability
        for any claim related to the service or your purchase will not exceed the amount you paid for the specific claim giving
        rise to the claim.
      </p>

      <h2 style={{ color: "#fff" }}>12) Indemnity</h2>
      <p>
        You agree to defend, indemnify, and hold us harmless from any claims arising from your misuse of the service or
        violation of these terms.
      </p>

      <h2 style={{ color: "#fff" }}>13) Governing Law</h2>
      <p>
        These terms are governed by the laws applicable to the operator’s place of establishment, without regard to
        conflict-of-law rules. If you are a consumer, mandatory consumer protections in your country may also apply.
      </p>

      <h2 style={{ color: "#fff" }}>14) Contact</h2>
      <p>
        For support questions related to payment or receipts, please contact Gumroad first. For platform questions, contact the
        site operator via the provided contact method.
      </p>

      <div style={{ marginTop: "40px", borderTop: "1px solid #333", paddingTop: "20px" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "underline" }}>
          ← Back to Home / Vissza a főoldalra
        </a>
      </div>
    </div>
  );
}
