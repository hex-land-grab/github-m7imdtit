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
            Own a Color is committed to keeping your private data private. We only collect the absolute minimum data required to record your digital ownership. We do not sell your data, and we do not track you across the web.
          </p>
        </div>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>1. Data Controller & Processing (GDPR)</h2>
        <p><strong style={{ color: '#fff' }}>Identity:</strong> The data controller is the "Own a Color" Project. Payment processing is independently controlled by Gumroad, Inc.</p>
        <p><strong style={{ color: '#fff' }}>International Transfers:</strong> Our database and hosting services (Supabase, Vercel) operate globally. By using the service, you consent to the processing of your public display data on global servers.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>2. Information We Collect</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}><strong style={{ color: '#fff' }}>Public Data (The Ledger):</strong> When you purchase a color, your chosen <i>Nickname</i>, <i>City</i> (optional), and the <i>Hex Code</i> are stored in our database and displayed publicly.</li>
          <li><strong style={{ color: '#fff' }}>Private Data (Payment):</strong> We use Gumroad as our payment processor. <strong>We do not store or process your credit card information.</strong></li>
        </ul>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>3. Data Retention & Your Rights</h2>
        <p><strong style={{ color: '#fff' }}>Retention Period:</strong> Public ledger data is stored indefinitely (for the lifetime of the platform) to maintain the historical integrity of the registry.</p>
        <p><strong style={{ color: '#fff' }}>Your Rights:</strong> You have the right to request access, correction, or deletion of your public display data (e.g., changing your nickname to "Anonymous"). Since we do not maintain a direct customer email database, please initiate these requests by replying to your Gumroad purchase receipt.</p>

        <h2 style={{ color: '#fff', marginTop: '30px', marginBottom: '15px' }}>4. Public Visibility & Anonymity</h2>
        <p>By purchasing, you understand that the 'Nickname' and 'City' fields you provide during checkout will be displayed publicly on the internet. If you prefer not to share personal data, we strongly encourage you to use an alias and leave the city field blank.</p>
      </div>
    </div>
  );
}
