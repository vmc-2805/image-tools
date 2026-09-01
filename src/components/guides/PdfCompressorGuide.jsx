import React from 'react';
import { FileStack, FileText, Minimize2, CheckCircle2, ArrowRight, ShieldCheck, Zap, Printer } from 'lucide-react';
import { TOOLS_CATALOG } from '../../toolsCatalog';

export default function PdfCompressorGuide({ setActiveTool }) {
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
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
        border: '1px solid rgba(59, 130, 246, 0.25)',
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
          background: 'rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          color: '#3b82f6',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '16px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          <FileStack size={16} />
          <span>In-Browser PDF & Compression Studio</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1.25, marginBottom: '14px', color: 'var(--text-primary)' }}>
          Image to PDF, PDF to JPG & Target KB Compressor
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.6, marginBottom: '24px' }}>
          Merge images into documents, render PDF pages to crisp JPGs, and compress files strictly under 20KB, 50KB, 100KB, 200KB or 500KB limits with 100% client-side privacy.
        </p>

        {/* Quick Launch Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={() => launchTool('image-to-pdf')} 
            className="btn btn-primary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileStack size={16} />
            <span>Image to PDF</span>
          </button>

          <button 
            type="button" 
            onClick={() => launchTool('pdf-to-jpg')} 
            className="btn btn-secondary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FileText size={16} />
            <span>PDF to JPG</span>
          </button>

          <button 
            type="button" 
            onClick={() => launchTool('reduce-kb')} 
            className="btn btn-secondary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Minimize2 size={16} />
            <span>Compress to Target KB</span>
          </button>

          <button 
            type="button" 
            onClick={() => launchTool('convert-dpi')} 
            className="btn btn-secondary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Printer size={16} />
            <span>Change DPI (300 DPI)</span>
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
        Complete PDF & Compression Workflow Tools
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {/* Card 1 */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <FileStack size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Merge Images to PDF</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Combine multiple JPG, PNG, and WEBP photos into a single PDF document with custom page orientation and margins.
            </p>
          </div>
          <button type="button" onClick={() => launchTool('image-to-pdf')} className="btn btn-secondary" style={{ width: '100%', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
            <span>Open Image to PDF</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>PDF to High-Res JPG</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Extract full PDF pages as standalone high-resolution JPG images or extract embedded photos directly.
            </p>
          </div>
          <button type="button" onClick={() => launchTool('pdf-to-jpg')} className="btn btn-secondary" style={{ width: '100%', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
            <span>Open PDF to JPG</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Minimize2 size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Exact KB Compressor</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Compress images directly to strict portal limits (20KB, 50KB, 100KB, 200KB) using binary search JPEG quantization.
            </p>
          </div>
          <button type="button" onClick={() => launchTool('reduce-kb')} className="btn btn-secondary" style={{ width: '100%', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
            <span>Open Compressor</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
