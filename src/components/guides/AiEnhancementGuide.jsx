import React from 'react';
import { Sparkles, Wand2, Eraser, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { TOOLS_CATALOG } from '../../toolsCatalog';

export default function AiEnhancementGuide({ setActiveTool }) {
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
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
        border: '1px solid rgba(168, 85, 247, 0.25)',
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
          background: 'rgba(168, 85, 247, 0.2)',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          color: '#a855f7',
          fontSize: '13px',
          fontWeight: '700',
          marginBottom: '16px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          <Sparkles size={16} />
          <span>In-Browser AI Enhancement Suite</span>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: 1.25, marginBottom: '14px', color: 'var(--text-primary)' }}>
          AI Photo Enhancer, Blemish Remover & Face Retouching
        </h1>

        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '680px', lineHeight: 1.6, marginBottom: '24px' }}>
          Discover how Imgediit uses client-side machine learning and unsharp mask algorithms to turn low-res, blurry photos into crisp HD memories without uploading files to remote servers.
        </p>

        {/* Quick Launch Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={() => launchTool('ai-enhancer')} 
            className="btn btn-primary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} />
            <span>AI Photo Enhancer</span>
          </button>

          <button 
            type="button" 
            onClick={() => launchTool('remove-blemishes')} 
            className="btn btn-secondary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Eraser size={16} />
            <span>Remove Blemishes</span>
          </button>

          <button 
            type="button" 
            onClick={() => launchTool('ai-retouch')} 
            className="btn btn-secondary"
            style={{ padding: '12px 22px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Wand2 size={16} />
            <span>AI Portrait Retouch</span>
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-primary)' }}>
        Explore AI Tools in this Suite
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {/* Card 1 */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>AI Photo Enhancer</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Restores blurred details, increases image micro-contrast, and sharpens edges in photos with smart detail synthesis.
            </p>
          </div>
          <button type="button" onClick={() => launchTool('ai-enhancer')} className="btn btn-secondary" style={{ width: '100%', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
            <span>Launch Enhancer</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Eraser size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Blemish Remover</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Interactive spot-eraser brush that blends acne, blemishes, and skin spots with surrounding skin texture naturally.
            </p>
          </div>
          <button type="button" onClick={() => launchTool('remove-blemishes')} className="btn btn-secondary" style={{ width: '100%', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
            <span>Launch Blemish Tool</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Wand2 size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>AI Face Retouch</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Smoothens skin tones, brightens portraits, and removes harsh facial shadows with one click.
            </p>
          </div>
          <button type="button" onClick={() => launchTool('ai-retouch')} className="btn btn-secondary" style={{ width: '100%', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
            <span>Launch Retouch Tool</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Guide Content & Benefits */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '28px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
          Why Choose In-Browser AI Enhancement?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>100% Private & Secure</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Your private family photos, selfies, and portraits never leave your computer or phone.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Zap size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>Zero Server Wait Times</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                No queueing, no file size upload bottlenecks, and instant live canvas preview.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>High-Resolution Export</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Download processed full-quality JPG and PNG files without watermarks or hidden costs.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>Batch & Unlimited Usage</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Enhance and retouch as many images as you need without signup, subscription, or limits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
