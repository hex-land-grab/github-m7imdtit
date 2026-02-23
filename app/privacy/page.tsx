import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#e2e8f0', fontFamily: 'sans-serif', padding: '40px 20px', lineHeight: '1.6' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', textDecoration: 'none', marginBottom: '30px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Back to Registry
        </Link>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>PRIVACY POLICY</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '40px' }}>Effective Date: February 23, 2026</p>

        <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '24px', borderRadius: '16px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#3b82f6', fontWeight: 'bold' }}>
            <ShieldCheck size={20} /> Summary
          </div>
          <p style={{ margin: 0, color: '#cbd5e1' }}>
            Own a Color is a public digital registry. We collect the minimum data required to list your ownership. We do not use invasive third-party advertising trackers. Your payment data is handled entirely by Gumroad.
          </p>
        </div>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>1. Data Controller, Lawful Basis & Transfers</h2>
        <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
          <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Controller/Operator:</strong> The "Own a Color" Project. Payment processing is independently controlled by Gumroad, Inc.</li>
          <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Lawful Basis:</strong> We process data based on <i>contract performance</i> (to provide you the registry listing you purchased) and <i>legitimate interests</i> (security, fraud prevention, and platform stability).</li>
          <li><strong style={{ color: '#fff' }}>International Transfers:</strong> Our processors (Vercel, Supabase, Gumroad) process data globally, including in the US. Where required, international transfers rely on appropriate safeguards (e.g., Standard Contractual Clauses) provided by these enterprise processors.</li>
        </ul>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>2. Information We Collect & Analytics</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Public Ledger Data:</strong> Your chosen <i>Nickname</i>, <i>City</i> (optional), and the <i>Hex Code</i> are stored and displayed publicly.</li>
          <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Private Payment Data:</strong> Handled by Gumroad. <strong>We never see or store your credit card information.</strong></li>
          <li><strong style={{ color: '#fff' }}>Analytics & Logs:</strong> We do not use third-party ad-tracking cookies. We and our hosting providers may collect basic, anonymous server logs and analytics strictly for security and site performance monitoring.</li>
        </ul>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>3. Data Retention, Anonymization & Your Rights</h2>
        <p><strong style={{ color: '#fff' }}>Retention:</strong> Registry entries (the Hex Code ownership record itself) are retained for the lifetime of the platform to ensure historical integrity.</p>
        <p><strong style={{ color: '#fff' }}>Your Rights & Anonymization:</strong> You have the right to request access, correction, or deletion of your personal data. Upon request, we will anonymize your public display fields (Nickname/City) to "Anonymous", though the Hex registry entry will remain. EU users also have the right to lodge a complaint with their local data protection authority.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>4. Public Visibility Warning</h2>
        <p>The 'Nickname' and 'City' fields are displayed on the public internet. <strong style={{ color: '#fff' }}>City is optional and should not be a precise address;</strong> consider using only your country or region. If you prefer absolute privacy, use an alias.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>5. Contact & Support</h2>
        <p style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4ade80', marginTop: '10px' }}>
          To maintain security and verify your purchase status, <strong style={{ color: '#fff' }}>all privacy requests, modifications to your public display name, or general support inquiries must be made by directly replying to your official Gumroad purchase receipt email.</strong>
        </p>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '10px' }}>For billing disputes or payment processing issues, please contact Gumroad Support directly.</p>
      </div>
    </div>
  );
}
