import React from 'react';

export default function TermsOfService() {
  return (
    <>
      <p style={{ marginBottom: '20px', fontSize: '16px', lineHeight: '1.7', color: 'var(--text-primary)' }}>
        Welcome to AeroTools. By accessing our static portal and utilizing our client-side utilities, you agree to comply with the legal parameters outlined below. 
      </p>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        1. License & Usage Permissions
      </h3>
      <p style={{ marginBottom: '12px' }}>
        We grant you a free, perpetual, non-exclusive license to use the AeroTools portal for any legal purpose. This includes:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '16px', listStyleType: 'circle' }}>
        <li style={{ marginBottom: '8px' }}><strong>Commercial Workloads:</strong> Designing materials, preparing corporate PDFs, resizing client forms, and signing contracts for business operations.</li>
        <li style={{ marginBottom: '8px' }}><strong>Enterprise Deployments:</strong> Recommending these local tools to employee workstations to keep internal data secure.</li>
        <li style={{ marginBottom: '8px' }}><strong>Educational Settings:</strong> Classroom exercises, research document resizing, and student portal submissions.</li>
      </ul>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        2. Client-Side Compute Boundaries
      </h3>
      <p style={{ marginBottom: '16px' }}>
        AeroTools performs tasks using your local device resources (RAM, CPU cycles, and GPU calculations). 
        Consequently, performance outputs (processing speed, memory capacities, and conversion limits) are subject to your browser specifications and hardware boundaries.
      </p>
      <p style={{ marginBottom: '16px' }}>
        For example, loading extremely large PDF streams (e.g. 500+ pages) or 100MB+ images might occasionally trigger browser tab crash limits if your workstation lacks sufficient free system RAM. 
        We are not responsible for browser failures or data loss due to local system memory allocation limits.
      </p>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        3. Fair-Use & Automation
      </h3>
      <p style={{ marginBottom: '16px' }}>
        Since our tools run client-side, we do not monitor or rate-limit API calls on our hosting nodes. 
        However, scraping or hot-linking our static scripts to load on third-party platforms without attribution is prohibited. 
        All static bundles must be requested from our official hosting endpoints or built from authorized sources.
      </p>

      <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '28px 0 14px', color: 'var(--text-primary)' }}>
        4. Disclaimer of Warranties & Limitation of Liability
      </h3>
      <p style={{ marginBottom: '16px', fontStyle: 'italic' }}>
        AeroTools is provided "as is" and "as available," without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
      </p>
      <p style={{ marginBottom: '16px' }}>
        In no event shall AeroTools, its developers, or its static hosting providers be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, loss of data, loss of business profits, or system crashes) arising in any way out of the use of this software, even if advised of the possibility of such damage.
      </p>
    </>
  );
}
