import React from 'react';
import { Camera, CheckCircle2, ArrowRight, ShieldCheck, FileCheck, Palette } from 'lucide-react';
import { TOOLS_CATALOG } from '../../toolsCatalog';

export default function PassportPhotoGuide({ setActiveTool }) {
  const launchTool = (toolId) => {
    const tool = TOOLS_CATALOG.find(t => t.id === toolId);
    if (tool && setActiveTool) {
      setActiveTool(tool);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', color: 'var(--text-primary)' }}>
      {/* Hero Visual Graphic */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '20px',
        padding: '36px 30px',
        marginBottom: '36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#10b981',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '16px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          <Camera size={16} />
          <span>Biometric Passport & ID Suite</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1.25, marginBottom: '14px', color: 'var(--text-primary)' }}>
          Official Passport, Visa & ID Photo Guidelines
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.6, marginBottom: '24px' }}>
          Create compliant passport and ID photos with standard dimensions (3.5x4.5cm, 2x2 inch, 35x45mm), custom background colors (white, blue, red), and exact government portal KB file limits.
        </p>

        {/* Quick Launch Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={() => launchTool('passport-maker')} 
            className="btn btn-primary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#10b981', borderColor: '#10b981' }}
          >
            <Camera size={16} />
            <span>Passport Photo Maker</span>
          </button>

          <button 
            type="button" 
            onClick={() => launchTool('ssc-resize')} 
            className="btn btn-secondary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileCheck size={16} />
            <span>SSC Photo & Signature</span>
          </button>

          <button 
            type="button" 
            onClick={() => launchTool('pancard-resize')} 
            className="btn btn-secondary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Palette size={16} />
            <span>PAN Card Resizer</span>
          </button>
        </div>
      </div>

      {/* Specifications Table */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
          Standard Passport Photo Specifications
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <th style={{ padding: '12px 14px' }}>Document / Country</th>
                <th style={{ padding: '12px 14px' }}>Dimensions</th>
                <th style={{ padding: '12px 14px' }}>Background Color</th>
                <th style={{ padding: '12px 14px' }}>DPI & File Limits</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>Indian Passport & Visa</td>
                <td style={{ padding: '12px 14px' }}>3.5 x 4.5 cm (35 x 45 mm)</td>
                <td style={{ padding: '12px 14px' }}>Plain White / Off-white</td>
                <td style={{ padding: '12px 14px' }}>300 DPI (20KB - 100KB)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>US Passport / DS-160 Visa</td>
                <td style={{ padding: '12px 14px' }}>2 x 2 inches (51 x 51 mm)</td>
                <td style={{ padding: '12px 14px' }}>Pure White</td>
                <td style={{ padding: '12px 14px' }}>300 DPI (Under 240KB)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>Schengen Visa (Europe)</td>
                <td style={{ padding: '12px 14px' }}>3.5 x 4.5 cm</td>
                <td style={{ padding: '12px 14px' }}>Light Grey or White</td>
                <td style={{ padding: '12px 14px' }}>300 DPI (300 x 385 px minimum)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>SSC Exam (Photo & Sig)</td>
                <td style={{ padding: '12px 14px' }}>3.5 x 4.5 cm (Photo), 4.0 x 2.0 cm (Sig)</td>
                <td style={{ padding: '12px 14px' }}>White / Light Background</td>
                <td style={{ padding: '12px 14px' }}>200 DPI (20KB - 50KB Photo, 10-20KB Sig)</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', fontWeight: '600' }}>PAN Card (NSDL/UTI)</td>
                <td style={{ padding: '12px 14px' }}>2.5 x 3.5 cm (213 x 213 px)</td>
                <td style={{ padding: '12px 14px' }}>White Background</td>
                <td style={{ padding: '12px 14px' }}>300 DPI (Under 50KB)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Step-by-Step Tutorial */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>
          How to Create a Compliant Passport Photo in 3 Steps
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>
              1
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Upload Your Front-Facing Portrait</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Take a straight-facing photo with good lighting and neutral expression. Drop it directly into the Passport Photo Maker.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>
              2
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Select Background Color & Align Biometric Crop</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Choose standard White, Blue, or Red background. Adjust the face guide circle so your eyes and chin are centered.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', flexShrink: 0 }}>
              3
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Download High-Res 300 DPI Photo</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Download the single photo or multi-photo print sheet ready for physical printing on standard 4x6 photo paper or online portal upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
