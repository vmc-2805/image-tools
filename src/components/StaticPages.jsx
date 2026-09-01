import React from 'react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import AiEnhancementGuide from './guides/AiEnhancementGuide';
import PassportPhotoGuide from './guides/PassportPhotoGuide';
import PdfCompressorGuide from './guides/PdfCompressorGuide';

export default function StaticPages({ activeTool, setActiveTool }) {
  if (!activeTool || activeTool.engine !== 'page') return null;

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto 60px', padding: '0 20px', fontFamily: 'var(--sans-font)', textAlign: 'left', flex: 1 }}>
      {/* Do not repeat h1 if custom guide component renders its own hero */}
      {!['ai-enhancement-guide', 'passport-photo-guide', 'pdf-compressor-guide'].includes(activeTool.id) && (
        <h1 style={{ fontFamily: 'var(--display-font)', fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>
          {activeTool.name}
        </h1>
      )}

      <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
        {activeTool.id === 'privacy-policy' && <PrivacyPolicy />}
        {activeTool.id === 'terms-of-service' && <TermsOfService />}
        {activeTool.id === 'ai-enhancement-guide' && <AiEnhancementGuide setActiveTool={setActiveTool} />}
        {activeTool.id === 'passport-photo-guide' && <PassportPhotoGuide setActiveTool={setActiveTool} />}
        {activeTool.id === 'pdf-compressor-guide' && <PdfCompressorGuide setActiveTool={setActiveTool} />}
      </div>
    </div>
  );
}
