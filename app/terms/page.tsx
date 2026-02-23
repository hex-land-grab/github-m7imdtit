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
            <li><strong style={{ color: '#fff' }}>NO REFUNDS:</strong> All digital sales are final.</li>
            <li><strong style={{ color: '#fff' }}>NOT AN NFT:</strong> This is a private database record, not a blockchain token.</li>
            <li><strong style={{ color: '#fff' }}>NO IP RIGHTS:</strong> You do not legally own the color in the real world.</li>
          </ul>
        </div>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>1. Overview</h2>
        <p>Own a Color ("we", "us", "our") provides an entertainment and status-based digital collectible experience that lets users "claim" a hex color code for a one-time fee. A claim is recorded in our private database and displayed on the Own a Color website. Payments are processed by Gumroad, acting as the merchant of record.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>2. What You Are Buying</h2>
        <p>When you purchase a claim, you receive a digital record indicating your account/nickname is associated with a specific hex code, and the ability for that record to be displayed publicly on this website.</p>
        <p><strong style={{ color: '#fff' }}>You do NOT receive:</strong> Any legal ownership, intellectual property rights, trademark rights, or exclusive rights to use a color in the real world or on other platforms.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>3. No Refund Policy & EU/UK Waiver</h2>
        <p>All purchases are final. Because the product is a digital good and instant-access service, we do not offer refunds, returns, or exchanges.</p>
        <p style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginTop: '10px' }}>
          <strong style={{ color: '#fff' }}>EU/UK Consumers (Digital Performance Waiver):</strong> By claiming a color and completing the purchase, you explicitly request immediate performance of this digital service and acknowledge that you lose your right of withdrawal (14-day refund right) once the digital entry is created.
        </p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>4. Platform Operation</h2>
        <p>We strive to keep the site available indefinitely (for the lifetime of the service), but we do not guarantee 100% uptime. The service relies on third-party providers. We are not liable for temporary outages or data loss caused by these providers.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>5. Contact</h2>
        <p>For support questions related to payment, please contact Gumroad. For platform questions, contact the site operator via the email address provided on your purchase receipt.</p>
      </div>
    </div>
  );
}
