import React from 'react';

export default function AboutUs() {
  return (
    <>
      <p style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-primary)' }}>
        AeroTools is an offline-ready, 100% client-side document and image processing ecosystem. 
        Designed with strict compliance and privacy as our operational baseline, our application enables businesses, developers, 
        and daily users to modify, compress, and convert sensitive files without transiting them through remote servers.
      </p>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        Our Technology Stack
      </h3>
      <p style={{ marginBottom: '16px' }}>
        AeroTools combines modern web browsers' native capacities with compiled binary sandboxes. By moving the workload from cloud nodes to your device, we deliver instant processing speeds and eliminate data leak risks:
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', margin: '24px 0' }}>
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px', fontSize: '15px' }}>
            WebAssembly Compilation
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Our complex conversion and extraction modules (e.g. parsing heavy PDF streams) are pre-compiled into binary execution standards to run at native speeds directly in the browser's JavaScript sandbox.
          </p>
        </div>
        
        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px', fontSize: '15px' }}>
            Local Canvas & GPU Acceleration
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Image operations like pixel-art filters, resizing, threshold controls, and custom watermark blends are rendered using HTML5 Canvas contexts directly accelerated by your computer's local graphics card.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <h4 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '10px', fontSize: '15px' }}>
            HTML5 File Handles
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Uploaded files are read strictly as local binary objects using the HTML5 File API. No server gets a handle of the files; the browser releases memory as soon as the active tab is closed.
          </p>
        </div>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        Architectural Comparison
      </h3>
      <p style={{ marginBottom: '16px' }}>
        Understanding where your data lives is critical to compliance. Below is a comparative table of standard server-side document portals versus the AeroTools client-side model:
      </p>

      <div style={{ overflowX: 'auto', marginBottom: '28px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Feature</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Traditional Server Portals</th>
              <th style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>AeroTools Portal</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>File Destination</td>
              <td style={{ padding: '12px 16px' }}>Uploaded to Cloud Server Nodes</td>
              <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>Remains in Browser Memory (RAM)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Data Exposure</td>
              <td style={{ padding: '12px 16px' }}>Transit over Network, Disk Storage, Backups</td>
              <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>Zero Network Exposure (Strictly Sandbox)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Offline Usage</td>
              <td style={{ padding: '12px 16px' }}>Unavailable Offline</td>
              <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>Fully Functional Offline</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Processing Speed</td>
              <td style={{ padding: '12px 16px' }}>Network Dependent (Upload/Download delays)</td>
              <td style={{ padding: '12px 16px' }}>Instant GPU/CPU Processing (No Latency)</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 16px', fontWeight: '600', color: 'var(--text-primary)' }}>Compliance Ready</td>
              <td style={{ padding: '12px 16px' }}>Requires strict DPA, GDPR audits</td>
              <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: '600' }}>Compliant out-of-the-box (GDPR, HIPAA, SOC2)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        Our Philosophy
      </h3>
      <p style={{ marginBottom: '16px' }}>
        We believe that utility tools should not serve as data-harvesting traps. Large file conversion portals generate revenue by indexing file content, compiling metadata databases, and selling access to marketing brokers. 
      </p>
      <p style={{ marginBottom: '16px' }}>
        AeroTools runs on a decentralized model. The application assets are served via a static CDN, and once downloaded, all compute logic executes inside the sandbox boundary of your local browser tab. You do not need to register an account, pay subscription fees, or configure firewall exceptions to process documents safely.
      </p>
    </>
  );
}
