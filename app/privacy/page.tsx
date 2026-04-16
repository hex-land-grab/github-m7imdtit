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
            Own a Color is a public digital registry. We collect the absolute minimum data required to list your ownership. We do not use third-party advertising pixels for behavioral targeting at this time. Your payment data is handled securely and entirely by Gumroad.
          </p>
        </div>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>1. Data Controller, Lawful Basis & Transfers</h2>
        <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
          <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Operator:</strong> The "Own a Color" Project, operating from the European Union. Payment processing is independently controlled by Gumroad, Inc. (Merchant of Record).</li>
          <li style={{ marginBottom: '8px' }}><strong style={{ color: '#fff' }}>Lawful Basis:</strong> We process data based on <i>contract performance</i> (to provide the registry listing you purchased) and <i>legitimate interests</i> (security and fraud prevention).</li>
          <li><strong style={{ color: '#fff' }}>International Transfers:</strong> Our processors (Vercel, Supabase, Gumroad) may process data globally, including in the US. Where applicable, international transfers are handled under the safeguards offered by these processors (such as SCCs or equivalent mechanisms). Please see their respective privacy policies for details.</li>
        </ul>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>2. Information We Collect & Analytics</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Public Ledger Data:</strong> Your chosen <i>Nickname</i>, <i>City</i>, and the <i>Hex Code</i> are stored and displayed publicly. <strong style={{ color: '#fff' }}>City is strictly optional and not required at checkout.</strong></li>
          <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Private Payment Data:</strong> Payments are processed by Gumroad (Merchant of Record). We receive basic order metadata to fulfill your listing, but <strong>we never see, store, or process your credit card information.</strong></li>
          <li><strong style={{ color: '#fff' }}>Analytics & Logs:</strong> We do not use third-party advertising pixels for behavioral ad targeting at this time. We and our hosting providers collect basic server logs (which may include IP addresses and user agents) strictly for security and performance monitoring.</li>
        </ul>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>3. Data Retention, Anonymization & Your Rights</h2>
        <p><strong style={{ color: '#fff' }}>Retention:</strong> Registry entries are retained for the lifetime of the platform to ensure the historical integrity of the database.</p>
        <p><strong style={{ color: '#fff' }}>Your Rights & Anonymization:</strong> You have the right to request access, correction, or deletion of your personal display data. Upon request, we will remove or anonymize your public display fields (Nickname/City), though the underlying Hex claim record itself will remain for integrity. EU users may also lodge a complaint with their local data protection authority.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>4. Public Visibility Warning</h2>
        <p>The 'Nickname' and 'City' fields are displayed on the public internet. If used, consider providing only your country or region. If you prefer absolute privacy, use an alias or leave the optional fields blank.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>5. Contact & Privacy Requests</h2>
        <p style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #4ade80', marginTop: '10px', color: '#cbd5e1' }}>
          To maintain security and verify your identity, <strong style={{ color: '#fff' }}>all privacy requests (including display name anonymization) must be sent to our official support channel:</strong>
          <br /><br />
          <a href="mailto:contact.ownacolor@gmail.com" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
            ✉️ contact@yourdomain.com
          </a>
          <br /><br />
          <span style={{ fontSize: '14px', color: '#94a3b8' }}>Please ensure you email us from the address you used for your purchase, or attach your official Gumroad receipt to help us identify your Claim ID.</span>
        </p>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '10px' }}>For billing disputes or payment processing issues, please contact Gumroad Support directly.</p>
      </div>
    </div>
  );
}
