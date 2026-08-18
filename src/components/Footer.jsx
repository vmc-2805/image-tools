import React from 'react';
import { Layers } from 'lucide-react';
import { TOOLS_CATALOG } from '../toolsCatalog';

export default function Footer({ setActiveTool }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col">
          <div className="logo-section" style={{ padding: 0 }}>
            <div className="logo-icon">
              <Layers size={20} />
            </div>
            <span className="logo-text">AeroTools</span>
          </div>
          <p className="footer-desc" style={{ marginTop: '8px' }}>
            Client-side document and image processing utilities. All operations execute locally in your browser to ensure data privacy and security.
          </p>
        </div>
        
        <div className="footer-col">
          <h4 className="footer-col-title">Popular Utilities</h4>
          <ul className="footer-links">
            <li><span className="footer-link" onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'reduce-kb'); if(t) setActiveTool(t); }}>Compress Image KB</span></li>
            <li><span className="footer-link" onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'passport-maker'); if(t) setActiveTool(t); }}>Passport Photo Maker</span></li>
            <li><span className="footer-link" onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'convert-dpi'); if(t) setActiveTool(t); }}>Change Image DPI</span></li>
            <li><span className="footer-link" onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'image-to-pdf'); if(t) setActiveTool(t); }}>Image to PDF Converter</span></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4 className="footer-col-title">Security & Privacy</h4>
          <p className="footer-desc">
            AeroTools uses cutting-edge in-browser technologies like WebAssembly and WebGPU. No uploads, no servers, and offline-ready.
          </p>
        </div>
        
        <div className="footer-col">
          <h4 className="footer-col-title">Company</h4>
          <ul className="footer-links">
            <li><span className="footer-link" onClick={() => setActiveTool({ id: 'about-us', name: 'About Us', engine: 'page', category: 'Information' })}>About Us</span></li>
            <li><span className="footer-link" onClick={() => setActiveTool({ id: 'privacy-policy', name: 'Privacy Policy', engine: 'page', category: 'Information' })}>Privacy Policy</span></li>
            <li><span className="footer-link" onClick={() => setActiveTool({ id: 'terms-of-service', name: 'Terms of Service', engine: 'page', category: 'Information' })}>Terms of Service</span></li>
            <li><span className="footer-link" onClick={() => setActiveTool({ id: 'contact-support', name: 'Contact Support', engine: 'page', category: 'Information' })}>Contact Support</span></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} AeroTools Portal. All rights reserved.</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span className="footer-link" style={{ fontSize: '12px' }} onClick={() => setActiveTool({ id: 'privacy-policy', name: 'Privacy Policy', engine: 'page', category: 'Information' })}>Privacy</span>
          <span className="footer-link" style={{ fontSize: '12px' }} onClick={() => setActiveTool({ id: 'terms-of-service', name: 'Terms of Service', engine: 'page', category: 'Information' })}>Terms</span>
          <span className="footer-link" style={{ fontSize: '12px' }} onClick={() => setActiveTool(null)}>Sitemap</span>
        </div>
      </div>
    </footer>
  );
}
