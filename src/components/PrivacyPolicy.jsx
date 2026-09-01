import React from 'react';

export default function PrivacyPolicy() {
  return (
    <>
      <p style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-primary)' }}>
        Imgediit is designed around a fundamental security principle: <strong>what never leaves your device can never be leaked.</strong> 
        Because our suite of document and image utilities executes 100% locally inside your web browser sandbox, we have zero visibility into your files.
      </p>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        Data Mapping and Local Isolation
      </h3>
      <p style={{ marginBottom: '16px' }}>
        The table below provides a detailed inventory of asset handling, showing the complete isolation between the user's workstation and our static delivery servers:
      </p>

      <div style={{ overflowX: 'auto', marginBottom: '28px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Asset type</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Processing Location</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Storage Duration</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Network Transit</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Images (PNG, JPG, WebP)</td>
              <td style={{ padding: '12px 16px' }}>Local Web Canvas / GPU Buffer</td>
              <td style={{ padding: '12px 16px' }}>Temporary RAM (Released on tab close)</td>
              <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>None (0 Bytes Transferred)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>PDF Documents</td>
              <td style={{ padding: '12px 16px' }}>Local WebAssembly (PDF-Lib runtime)</td>
              <td style={{ padding: '12px 16px' }}>Temporary RAM (Released on tab close)</td>
              <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>None (0 Bytes Transferred)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Signatures & Drawings</td>
              <td style={{ padding: '12px 16px' }}>HTML5 Canvas Vector buffers</td>
              <td style={{ padding: '12px 16px' }}>Transient memory only</td>
              <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>None (0 Bytes Transferred)</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>User Preferences (Theme)</td>
              <td style={{ padding: '12px 16px' }}>Browser LocalStorage</td>
              <td style={{ padding: '12px 16px' }}>Persistent on device until cleared</td>
              <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>None (Local client state)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        Compliance Auditing (GDPR, HIPAA, and SOC 2 Readiness)
      </h3>
      <p style={{ marginBottom: '16px' }}>
        For corporate clients, data privacy regulations place heavy compliance burdens when third-party servers process PII (Personally Identifiable Information). Imgediit simplifies this framework completely:
      </p>
      
      <ul style={{ paddingLeft: '20px', marginBottom: '24px', listStyleType: 'disc' }}>
        <li style={{ marginBottom: '12px' }}>
          <strong>GDPR Compliant by Architecture:</strong> Because no file transit takes place, Imgediit is not a "Data Processor" or "Data Controller" under the General Data Protection Regulation. There are no sub-processors to audit, and no risk of cross-border data leakage.
        </li>
        <li style={{ marginBottom: '12px' }}>
          <strong>HIPAA Medical Record Isolation:</strong> Healthcare companies can compress medical document scans, crop ID photos, and merge PDFs without signing a Business Associate Agreement (BAA) because patient files never enter a external network.
        </li>
        <li style={{ marginBottom: '12px' }}>
          <strong>Zero Server Retention logs:</strong> We do not log filenames, image contents, or document text. The static hosting provider only logs standard server assets request telemetry (like IP addresses requesting javascript source bundles) for CDN operations.
        </li>
      </ul>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        Security Sandbox Boundaries
      </h3>
      <p style={{ marginBottom: '16px' }}>
        Imgediit executes scripts inside your browser's default sandbox structure. This prevents scripts from accessing your machine's system files or network assets without explicit user drag-and-drop triggers. You can physically disconnect your internet connection (offline mode) and continue to crop, compress, scale, or sign files, which verifies that the logic stays on your device.
      </p>
    </>
  );
}
