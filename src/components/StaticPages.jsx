import React from 'react';
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ContactSupport from './ContactSupport';

export default function StaticPages({ activeTool }) {
  if (!activeTool || activeTool.engine !== 'page') return null;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px', fontFamily: 'var(--sans-font)', textAlign: 'left', flex: 1 }}>
      <h1 style={{ fontFamily: 'var(--display-font)', fontSize: '32px', fontWeight: '800', marginBottom: '24px', color: 'var(--text-primary)' }}>
        {activeTool.name}
      </h1>
      <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
        {activeTool.id === 'about-us' && <AboutUs />}
        {activeTool.id === 'privacy-policy' && <PrivacyPolicy />}
        {activeTool.id === 'terms-of-service' && <TermsOfService />}
        {activeTool.id === 'contact-support' && <ContactSupport />}
      </div>
    </div>
  );
}
