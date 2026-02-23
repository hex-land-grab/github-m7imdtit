'use client'
import React from "react";
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        color: "#cbd5e1",
        minHeight: "100vh",
        padding: "40px 20px 80px 20px",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        lineHeight: "1.8",
        fontSize: "16px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Vissza gomb */}
        <div style={{ marginBottom: "40px" }}>
          <a href="/" style={{ 
            display: "inline-flex", alignItems: "center", gap: "8px",
            color: "#94a3b8", textDecoration: "none", fontWeight: "600",
            padding: "8px 16px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <ArrowLeft size={16} /> Back to Own a Color
          </a>
        </div>

        <h1
          style={{
            color: "#fff",
            fontSize: "2.5rem",
            fontWeight: "900",
            marginBottom: "10px",
            borderBottom: "1px solid #334155",
            paddingBottom: "20px",
          }}
        >
          PRIVACY POLICY
        </h1>
        <p style={{ color: "#64748b", marginBottom: "40px" }}>Effective Date: February 23, 2026</p>

        {/* SUMMARY BOX */}
        <div
          style={{
            marginBottom: "40px",
            padding: "24px",
            border: "1px solid #3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)", 
            borderRadius: "16px",
          }}
        >
          <div style={{ color: "#60a5fa", fontWeight: 800, marginBottom: "10px", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck size={20} /> Summary
          </div>
          <p style={{ margin: 0, color: "#e2e8f0" }}>
            <strong>Own a Color</strong> is committed to keeping your private data private. We only collect the absolute minimum data required to record your digital ownership and process your payment via Gumroad. We do not sell your data, and we do not track you across the web.
          </p>
        </div>

        {/* CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>1. Information We Collect</h2>
            <p>We collect two types of data to provide our service:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
              <li><strong>Public Data (The Ledger):</strong> When you purchase a color, your chosen <em>Nickname</em> and the <em>Hex Color Code</em> are stored in our database and displayed publicly on the website.</li>
              <li><strong>Private Data (Payment):</strong> We use <strong>Gumroad</strong> as our payment processor. Gumroad collects your email address and payment details. <strong>We do not store your credit card information.</strong></li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>2. How We Use Your Data</h2>
            <p>We use the data strictly for the following purposes:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
              <li>To record and verify your ownership of a specific Hex Color.</li>
              <li>To display your ownership on the global <strong>Own a Color</strong> public ledger.</li>
              <li>To prevent fraud (e.g., preventing the same color from being bought twice).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>3. Public Visibility & Anonymity</h2>
            <div style={{ borderLeft: "4px solid #eab308", paddingLeft: "16px", color: "#cbd5e1" }}>
              <p><strong>Public Registry Notice:</strong> 'Own a Color' is a public database. By purchasing, you understand that the 'Nickname' and 'City' fields you provide during checkout will be displayed publicly on the internet alongside your claimed hex code.</p>
              <p style={{ marginTop: "10px" }}><strong>Data Minimization & Anonymity:</strong> We do not process or store credit card data; all payments are handled securely via Gumroad. If you prefer not to share personal data, we strongly encourage you to use an alias ('Anonymous') and leave the city field blank at checkout.</p>
            </div>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>4. Contact Us</h2>
            <p>
              We do not maintain a direct customer service inbox on this website; all transaction and payment data is managed exclusively through the Gumroad checkout process. If you have billing inquiries or need transaction support, please contact Gumroad directly or use the tools provided in your email receipt.
            </p>
          </section>

        </div>

        <div style={{ marginTop: '60px', borderTop: '1px solid #334155', paddingTop: '30px', textAlign: 'center' }}>
          <a href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
            Return to Home Page
          </a>
        </div>

      </div>
    </div>
  );
}
