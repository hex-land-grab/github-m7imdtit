import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#e2e8f0', fontFamily: 'sans-serif', padding: '40px 20px', lineHeight: '1.6' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', marginBottom: '30px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Back to Registry
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>TERMS & CONDITIONS</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '40px' }}>Last updated: February 23, 2026</p>

        <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid #eab308', padding: '24px', borderRadius: '16px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#eab308', fontWeight: 'bold' }}>
            <AlertTriangle size={20} /> Important Summary
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: '#cbd5e1' }}>
            <li><strong style={{ color: '#fff' }}>WHAT YOU GET:</strong> A public registry listing (for the lifetime of the service) + a timestamped Claim ID.</li>
            <li><strong style={{ color: '#fff' }}>NO REFUNDS:</strong> Digital sales are final (exceptions strictly limited to duplicate charges or verified failure to create the entry).</li>
            <li><strong style={{ color: '#fff' }}>NOT AN NFT:</strong> This is a centralized private database record, not a blockchain token.</li>
            <li><strong style={{ color: '#fff' }}>NO IP RIGHTS:</strong> You do not legally own the color in the real world.</li>
          </ul>
        </div>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>1. Overview & Eligibility</h2>
        <p>Own a Color ("we", "us", "our") provides an entertainment and status-based digital collectible experience that lets users "claim" a hex color code for a one-time fee. By using this service, you confirm you are at least 18 years old. Payments are processed by Gumroad, acting as the merchant of record.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>2. What You Are Buying</h2>
        <p>When you purchase a claim, you receive:</p>
        <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
          <li>A permanent public listing (for the lifetime of the service) associating your chosen nickname with a specific Hex Code.</li>
          <li>A unique, timestamped registry entry (Claim ID) that serves as proof of your listing.</li>
        </ul>
        <p><strong style={{ color: '#fff' }}>You do NOT receive:</strong> Any legal ownership, intellectual property rights, trademark rights, or exclusive rights to use a color in the real world or on other platforms.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>3. Content Guidelines & Moderation</h2>
        <p>When claiming a color, you may provide public display fields such as a "Nickname" and "City". We reserve the right, at our sole discretion, to modify, anonymize, or delete any input that contains hate speech, illegal content, impersonation, or promotional links, <strong>without notice and without issuing a refund.</strong> The underlying Hex Code registry entry will remain intact.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>4. No Refund Policy & EU/UK Waiver</h2>
        <p>Refunds are generally not provided. Exceptions are strictly limited to duplicate payment charges or a verified technical failure. <i>Verification means: the public registry fails to display your entry within 24 hours of payment confirmation.</i></p>
        <p style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginTop: '10px' }}>
          <strong style={{ color: '#fff' }}>EU/UK Consumers (Digital Performance Waiver):</strong> By claiming a color and completing the purchase, you explicitly request immediate performance of this digital service. You acknowledge that once the registry entry is created and displayed, the service is considered fully performed, and you lose your right of withdrawal (14-day refund right).
        </p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>5. Platform Continuity & Uptime</h2>
        <p>Your purchase grants a listing for the lifetime of the service. We do not guarantee 100% perpetual uptime as the service relies on third-party hosting providers.</p>
        <p><strong style={{ color: '#fff' }}>Continuity Commitment:</strong> Should the Own a Color project ever be permanently discontinued, we will use commercially reasonable efforts to publish a final, publicly accessible, timestamped archive (snapshot) of the entire registry (target: within 30 days of closure), ensuring your historical claim is preserved.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>6. Contact & Support</h2>
        <p style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4ade80', marginTop: '10px', color: '#cbd5e1' }}>
          To maintain security and verify your purchase status, <strong style={{ color: '#fff' }}>all support inquiries, including display name modifications or verified technical failure reports, must be sent to our official support channel:</strong>
          <br /><br />
          <a href="mailto:contact.ownacolor@gmail.com" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
            ✉️ contact.ownacolor@gmail.com
          </a>
          <br /><br />
          <span style={{ fontSize: '14px', color: '#94a3b8' }}>Please ensure you email us from the address you used for your purchase, or attach your official Gumroad receipt to help us identify your Claim ID.</span>
        </p>
      </div>
    </div>
  );
}
