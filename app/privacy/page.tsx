'use client'
import React from "react";
import { Shield, Eye, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div
      style={{
        backgroundColor: "#0f172a", // Sötét háttér (Dark Mode)
        color: "#cbd5e1", // Világosszürke szöveg
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
            <ArrowLeft size={16} /> Back to Hex Land Grab
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
        <p style={{ color: "#64748b", marginBottom: "40px" }}>Effective Date: February 16, 2026</p>

        {/* SUMMARY BOX */}
        <div
          style={{
            marginBottom: "40px",
            padding: "24px",
            border: "1px solid #3b82f6", // Kék keret
            backgroundColor: "rgba(59, 130, 246, 0.1)", // Kék áttetsző háttér
            borderRadius: "16px",
          }}
        >
          <div style={{ color: "#60a5fa", fontWeight: 800, marginBottom: "10px", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Shield size={20} /> Summary
          </div>
          <p style={{ margin: 0, color: "#e2e8f0" }}>
            Hex Land Grab is committed to keeping your private data private. We only collect the absolute minimum data required to record your digital ownership (Hex Code + Nickname) and to process your payment via Gumroad. 
            <br/><br/>
            <strong>We do not sell your data.</strong> We do not track you across the web.
          </p>
        </div>

        {/* CONTENT SECTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>1. Information We Collect</h2>
            <p>We collect two types of data to provide our service:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
              <li><strong>Public Data (The Ledger):</strong> When you purchase a color, your chosen <em>Nickname</em> and the <em>Hex Color Code</em> are stored in our database and displayed publicly on the website. This is the core function of the service.</li>
              <li><strong>Private Data (Payment):</strong> We use <strong>Gumroad</strong> as our payment processor. Gumroad collects your email address and payment details. <strong>We do not store your credit card information.</strong> We only receive your email address to send you a receipt.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>2. How We Use Your Data</h2>
            <p>We use the data strictly for the following purposes:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
              <li>To record and verify your ownership of a specific Hex Color.</li>
              <li>To display your ownership on the global &quot;Hex Land Grab&quot; public ledger.</li>
              <li>To prevent fraud (e.g. preventing the same color from being bought twice).</li>
              <li>To send you transactional emails (receipts) via Gumroad.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>3. Third-Party Services (Trusted Partners)</h2>
            <p>We rely on trusted third-party infrastructure to operate. By using our service, you acknowledge that your data flows through:</p>
            <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                <strong style={{ color: '#fff' }}>Gumroad:</strong> Handles all payments and emailing. Please review <a href="https://gumroad.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>Gumroad&apos;s Privacy Policy</a>.
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                <strong style={{ color: '#fff' }}>Supabase:</strong> Our secure database provider where the ownership records are stored.
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                <strong style={{ color: '#fff' }}>Vercel:</strong> Our hosting provider, which may collect anonymous technical logs (IP addresses) for security and performance monitoring.
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>4. Public Visibility (The Ledger)</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
              <Eye size={24} color="#fbbf24" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#fbbf24' }}>Important Note:</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  The &quot;Hex Land Grab&quot; project is a public registry. The <strong>Nickname</strong> you provide at checkout will be publicly visible to anyone visiting the site. Do not use your real name or sensitive personal information if you wish to remain anonymous.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>5. Data Retention & Deletion</h2>
            <p>
              We retain the public record of ownership indefinitely as part of the service (&quot;Forever Ownership&quot;). 
              However, if you wish to have your data removed, you may contact us. 
              <strong>Please note:</strong> Deleting your data will result in the forfeiture of your Hex Color claim, as the record effectively ceases to exist.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>6. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact the site operator via the Gumroad contact form or at the email address provided on your receipt.
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
