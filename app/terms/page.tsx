'use client'
import React from "react";
import { ArrowLeft, Scale, AlertTriangle, FileText } from 'lucide-react';

export default function TermsPage() {
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
          TERMS & CONDITIONS
        </h1>
        <p style={{ color: "#64748b", marginBottom: "40px" }}>Last updated: February 16, 2026</p>

        {/* SUMMARY BOX */}
        <div
          style={{
            marginBottom: "40px",
            padding: "24px",
            border: "1px solid #eab308", // Sárga keret
            backgroundColor: "rgba(234, 179, 8, 0.1)", // Sárga áttetsző háttér
            borderRadius: "16px",
          }}
        >
          <div style={{ color: "#facc15", fontWeight: 800, marginBottom: "10px", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <AlertTriangle size={20} /> Important Summary
          </div>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#e2e8f0" }}>
            <li><strong>NO REFUNDS:</strong> All digital sales are final.</li>
            <li><strong>NOT AN NFT:</strong> This is a private database record, not a blockchain token.</li>
            <li><strong>NO IP RIGHTS:</strong> You do not legally own the color in the real world.</li>
          </ul>
        </div>

        {/* CONTENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>1. Overview</h2>
            <p>
              <strong>Own a Color</strong> (“we”, “us”, “our”) provides an entertainment and status-based digital collectible experience that lets users “claim” a hex color code for a one-time fee. A claim is recorded in our private database (Supabase) and displayed on the <strong>Own a Color</strong> website. Payments are processed by Gumroad, acting as the merchant of record.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>2. What You Are Buying</h2>
            <p>When you purchase a claim, you receive:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
              <li>A digital record on the <strong>Own a Color</strong> platform indicating that your account/nickname is associated with a specific hex color code.</li>
              <li>The ability for that record to be displayed as “claimed” on this website.</li>
            </ul>
            <p style={{ marginTop: '10px' }}><strong>You do NOT receive:</strong> Any legal ownership, intellectual property rights, trademark rights, or exclusive rights to use a color in the real world or on other platforms.</p>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>3. No Refund Policy</h2>
            <p>
              All purchases are final. Because the product is a digital good/instant-access service (a database record and status display), we do not offer refunds, returns, or exchanges, except where required by applicable law.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>4. Platform Operation</h2>
            <p>
              We strive to keep the site available indefinitely ("Forever Ownership"), but we do not guarantee 100% uptime. The service relies on third-party providers (Vercel, Supabase). We are not liable for temporary outages or data loss caused by these providers.
            </p>
          </section>

          <section>
            <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px" }}>5. Contact</h2>
            <p>
              For support questions related to payment, please contact Gumroad. For platform questions, contact the site operator via the email address provided on your purchase receipt.
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
