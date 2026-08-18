import React from 'react';

export default function StaticPages({ activeTool }) {
  if (!activeTool || activeTool.engine !== 'page') return null;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px', fontFamily: 'var(--sans-font)', textAlign: 'left', flex: 1 }}>
      <h1 style={{ fontFamily: 'var(--display-font)', fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>{activeTool.name}</h1>
      <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
        {activeTool.id === 'about-us' && (
          <>
            <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-primary)' }}>
              AeroTools is an offline-first, client-side utility suite designed to offer secure document and image processing options. Our core mission is to provide high-performance format conversions and scaling tools without compromising user privacy.
            </p>
            
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>Our Core Values</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Security First</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>We build utilities that respect your data bounds. Files never transit to remote nodes, removing tracking and leakage concerns.</p>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Zero Friction</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No account setup, subscription fees, or caps. Open the page and begin processing immediately from any modern browser.</p>
              </div>
              <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>Offline Accessibility</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Our tools continue executing operations even when disconnected, ensuring reliability anywhere you travel.</p>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>Our Client-Side Architecture</h3>
            <p style={{ marginBottom: '16px' }}>
              Traditional online services require you to upload your files to external remote servers. This introduces network transfer delays and poses serious privacy hazards for confidential records. AeroTools eliminates these risks by using client-side JavaScript, WebAssembly compile targets, and local browser memory.
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '24px', listStyleType: 'disc' }}>
              <li style={{ marginBottom: '8px' }}><strong>WebAssembly Compilation:</strong> Heavy processing operations (like PDF conversions and structural edits) utilize compiled binary targets for native desktop speed in-browser.</li>
              <li style={{ marginBottom: '8px' }}><strong>HTML5 File Sandbox:</strong> File ingestion utilizes temporary browser blob handles. The original file metadata and pixel grids remain contained in client-side runtime sandboxes.</li>
              <li style={{ marginBottom: '8px' }}><strong>GPU-Accelerated Scaling:</strong> High-resolution scaling operations leverage web canvas handles and GPU processing units to avoid server overheads.</li>
            </ul>

            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>Open Source Tribute</h3>
            <p>
              AeroTools is built on the shoulders of giants. We utilize community-supported open libraries, including the PDF.js parser engine, PDF-Lib generators, and canvas scaling utilities, compiling them into a unified desktop interface for office productivity.
            </p>
          </>
        )}
        
        {activeTool.id === 'privacy-policy' && (
          <>
            <p style={{ marginBottom: '16px' }}>
              At AeroTools, data privacy is our structural baseline. Because our utilities operate 100% client-side inside your local browser sessions, we do not collect, store, or transmit any files or data that you process.
            </p>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>Information We Do Not Collect</h3>
            <p style={{ marginBottom: '16px' }}>
              When you upload a PDF or an image to reduce size, adjust DPI, or format dimensions, the processing code runs entirely on your local CPU/GPU. No files, metadata, or document data are sent to our servers.
            </p>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>Cookies & Analytics</h3>
            <p>
              We may use basic local storage options (like theme preferences) to improve user interactions. We do not use tracking cookies or sell your activity metrics to third-party services.
            </p>
          </>
        )}

        {activeTool.id === 'terms-of-service' && (
          <>
            <p style={{ marginBottom: '16px' }}>
              By using the AeroTools portal, you agree to the following local usage terms. This service is provided entirely free of charge for personal and commercial applications.
            </p>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>License & Local Use</h3>
            <p style={{ marginBottom: '16px' }}>
              You are permitted to run these utilities on any number of personal workstations. Since the processing runs in your browser, you are responsible for maintaining browser compatibility and verifying output metrics.
            </p>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '24px 0 12px', color: 'var(--text-primary)' }}>Disclaimer of Warranties</h3>
            <p style={{ marginBottom: '16px' }}>
              AeroTools is provided "as is" without warranty of any kind, express or implied. We do not guarantee that operations will be completely error-free or that specific target sizes can always be achieved under browser memory constraints.
            </p>
          </>
        )}

        {activeTool.id === 'contact-support' && (
          <>
            <p style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-primary)' }}>
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
        )}
      </div>
    </div>
  );
}
