import React from 'react';
import { Layers, ChevronDown, Moon, Sun, ArrowLeft } from 'lucide-react';
import { TOOLS_CATALOG } from '../toolsCatalog';

export default function Header({ 
  activeTool, 
  setActiveTool, 
  theme, 
  setTheme, 
  isToolkitOpen, 
  setIsToolkitOpen 
}) {
  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo-section" onClick={() => setActiveTool(null)} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Layers size={20} />
          </div>
          <span className="logo-text">AeroTools</span>
        </div>

        {/* Navigation Menus */}
        <nav className="nav-menu">
          <span className="nav-link" onClick={() => setActiveTool(null)}>
            Dashboard
          </span>
          
          {/* Categories Dropdown */}
          <div className={`nav-dropdown ${isToolkitOpen ? 'open' : ''}`} onClick={(e) => { e.stopPropagation(); setIsToolkitOpen(!isToolkitOpen); }}>
            <span className="nav-link">
              Toolkits <ChevronDown size={14} style={{ marginLeft: '4px' }} />
            </span>
            <div className="nav-dropdown-content">
              <div className="nav-dropdown-group-title">Image Utilities</div>
              {TOOLS_CATALOG.filter(t => t.category === "Most Used Tools" || t.category === "Basic Editing").map(t => (
                <div key={t.id} className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); setActiveTool(t); setIsToolkitOpen(false); }}>
                  {t.name}
                </div>
              ))}
              <div className="nav-dropdown-group-title">Sizes & Formats</div>
              {TOOLS_CATALOG.filter(t => t.category === "DPI & Quality" || t.category === "Passport & ID Photo Sizes" || t.category === "Format Conversions").map(t => (
                <div key={t.id} className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); setActiveTool(t); setIsToolkitOpen(false); }}>
                  {t.name}
                </div>
              ))}
              <div className="nav-dropdown-group-title">PDF & Compression</div>
              {TOOLS_CATALOG.filter(t => t.category === "Image to PDF" || t.category === "Exact Target Sizes").map(t => (
                <div key={t.id} className="nav-dropdown-item" onClick={(e) => { e.stopPropagation(); setActiveTool(t); setIsToolkitOpen(false); }}>
                  {t.name}
                </div>
              ))}
            </div>
          </div>

          {/* About Link */}
          <span className="nav-link" onClick={() => setActiveTool({ id: 'about-us', name: 'About Us', engine: 'page', category: 'Information' })}>
            About Us
          </span>

          {/* Contact Link */}
          <span className="nav-link" onClick={() => setActiveTool({ id: 'contact-support', name: 'Contact Support', engine: 'page', category: 'Information' })}>
            Contact
          </span>
        </nav>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          title="Toggle theme"
          style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {activeTool && (
          <div className="btn btn-secondary" onClick={() => setActiveTool(null)} style={{ cursor: 'pointer' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </div>
        )}
      </div>
    </header>
  );
}
