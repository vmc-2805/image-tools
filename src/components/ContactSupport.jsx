import React from 'react';

export default function ContactSupport() {
  return (
    <>
      <p style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-primary)' }}>
        Need assistance or have feedback regarding AeroTools? Since we do not run user databases, our support channels operate via email and localized interactive forms.
      </p>

      <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>Pre-Support Checklist</h3>
      <p style={{ marginBottom: '12px' }}>Before reaching out, check if these steps resolve your processing issue:</p>
      <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'decimal' }}>
          <li style={{ marginBottom: '6px' }}><strong>Verify File Format:</strong> Make sure the loaded asset matches the target input profile (e.g. check image headers and file extensions).</li>
          <li style={{ marginBottom: '6px' }}><strong>Clear Browser Memory:</strong> If processing large PDFs, refresh the tab or clear temporary browser cache to release canvas memory handles.</li>
          <li style={{ marginBottom: '0px' }}><strong>Check Extension Conflicts:</strong> Ad-blockers or local privacy extensions might occasionally restrict WebAssembly script files. Try running in incognito mode.</li>
        </ul>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>Support Channel</h3>
      <p>
        You can also contact our dev team directly at: <strong style={{ color: 'var(--text-primary)' }}>support@aerotools.online</strong>. We try to respond to inquiries within 48 business hours.
      </p>
    </>
  );
}
