import React, { useState, useEffect, Suspense } from 'react';
import { 
  Search, 
  Layers, 
  Maximize2, 
  Sun, 
  Moon, 
  ChevronDown, 
  ArrowLeft, 
  Crop, 
  FileText, 
  Sliders, 
  Palette 
} from 'lucide-react';
import { getSeoData, updateMetaTags } from './seoData';
import { TOOLS_CATALOG } from './toolsCatalog';
import Header from './components/Header';
import Footer from './components/Footer';
import StaticPages from './components/StaticPages';

const ToolWorkspace = React.lazy(() => import('./components/ToolWorkspace'));

const FAQS = [
  { q: "Is AeroTools safe and private?", a: "Yes, 100%. AeroTools processes all files locally inside your browser using JavaScript, WebAssembly, and WebGPU. Your images, PDFs, and data never leave your device or upload to any servers." },
  { q: "How is AeroTools so fast?", a: "Traditional tools require uploading files to a server, waiting for processing, and downloading them back. AeroTools runs entirely in your local browser, eliminating network transfer latency completely." },
  { q: "Does AeroTools work offline?", a: "Yes! Once loaded, most tools (resizers, compressors, signature maker) do not require an active internet connection to process files." },
  { q: "What is client-side processing?", a: "It means the processing power of your own computer/phone is used to run the algorithms. This guarantees absolute data privacy and works instantly." }
];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeTool, setActiveTool] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync theme to document element and body classes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme === 'light' ? 'light-theme' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setIsToolkitOpen(false);
  }, [activeTool]);

  // Sync browser URL and handle browser back/forward buttons (routing)
  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split('/').filter(Boolean);
      const toolId = segments.length > 0 ? segments[segments.length - 1] : null;
      if (toolId) {
        const tool = TOOLS_CATALOG.find(t => t.id === toolId);
        if (tool) {
          setActiveTool(tool);
          return;
        }
        
        // Match static informational pages
        const staticPages = ['about-us', 'privacy-policy', 'terms-of-service', 'contact-support'];
        if (staticPages.includes(toolId)) {
          setActiveTool({
            id: toolId,
            name: toolId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            engine: 'page',
            category: 'Information'
          });
          return;
        }
      }
      setActiveTool(null);
    };

    window.addEventListener('popstate', handlePopState);
    
    const handleDocumentClick = () => {
      setIsToolkitOpen(false);
    };
    document.addEventListener('click', handleDocumentClick);

    // Parse current URL path on initial load
    handlePopState();

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  // Update history path when activeTool changes
  useEffect(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const currentPathId = segments.length > 0 ? segments[segments.length - 1] : null;
    
    if (activeTool) {
      if (currentPathId !== activeTool.id) {
        window.history.pushState(null, '', `/${activeTool.id}`);
      }
    } else {
      if (currentPathId !== null) {
        window.history.pushState(null, '', '/');
      }
    }
    
    // Reset scroll position to top of page on route/tool change
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTool]);

  // Dynamic SEO meta tags and JSON-LD update
  useEffect(() => {
    const seo = getSeoData(activeTool);
    updateMetaTags(seo);
  }, [activeTool]);

  // Filter tools based on search query
  const filteredTools = TOOLS_CATALOG.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered tools by category
  const categoriesMap = filteredTools.reduce((acc, tool) => {
    acc[tool.category] = acc[tool.category] || [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  return (
    <div className="portal-container">
      {/* 1. Header Navbar */}
      <Header 
        activeTool={activeTool} 
        setActiveTool={setActiveTool} 
        theme={theme} 
        setTheme={setTheme} 
        isToolkitOpen={isToolkitOpen} 
        setIsToolkitOpen={setIsToolkitOpen} 
      />

      {activeTool && (
        <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
          <span className="seo-breadcrumb-item" onClick={() => setActiveTool(null)}>
            Home
          </span>
          <span className="seo-breadcrumb-separator">&gt;</span>
          <span className="seo-breadcrumb-item" onClick={() => {
            const categorySlug = `category-${activeTool.category.replace(/[^a-zA-Z0-9]/g, '-')}`;
            setActiveTool(null);
            setTimeout(() => {
              const el = document.getElementById(categorySlug);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>
            {activeTool.category}
          </span>
          <span className="seo-breadcrumb-separator">&gt;</span>
          <span className="seo-breadcrumb-item active">
            {activeTool.name}
          </span>
        </nav>
      )}
      
      {!activeTool ? (
        // 2. DASHBOARD VIEW
        <>
          <div className="dashboard-header">
            <h1 className="dashboard-title">AeroTools - In-Browser Document & Image Utilities</h1>
            <p className="dashboard-subtitle">
              A secure workspace running entirely in your local browser. All files are processed on your machine to guarantee complete data privacy and zero upload latency.
            </p>
            
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search over 80+ tools (e.g. passport, compress, converter)..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <main className="dashboard-content">
            {Object.keys(categoriesMap).map((catName) => (
              <div key={catName} id={`category-${catName.replace(/[^a-zA-Z0-9]/g, '-')}`} className="category-section">
                <h2 className="category-title">{catName}</h2>
                <div className="tools-grid">
                  {categoriesMap[catName].map((tool) => (
                    <div 
                      key={tool.id} 
                      className="tool-card"
                      onClick={() => setActiveTool(tool)}
                    >
                      <div className="tool-icon-wrapper">
                        {tool.engine === 'resizer' ? <Crop size={18} /> :
                         tool.engine === 'compressor' ? <Maximize2 size={18} /> :
                         tool.engine === 'sig' ? <Palette size={18} /> :
                         tool.engine === 'converter' ? <FileText size={18} /> :
                         <Sliders size={18} />}
                      </div>
                      <h3 className="tool-card-title">{tool.name}</h3>
                      <p className="tool-card-desc">{tool.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(categoriesMap).length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No tools match your search query. Try another keyword!
              </div>
            )}
          </main>

          {/* Why AeroTools? Benefits Section */}
          <section className="landing-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '64px' }}>
            <div className="section-head">
              <h2 className="section-title">Security & Operations Guarantee</h2>
              <p className="section-subtitle">Client-side utilities designed for data compliance and security.</p>
            </div>
            
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Layers size={24} />
                </div>
                <h3 className="benefit-title">Local Data Privacy</h3>
                <p className="benefit-desc">
                  Your files never leave your browser. Processing runs entirely client-side to ensure compliance with strict data protection guidelines.
                </p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Maximize2 size={24} />
                </div>
                <h3 className="benefit-title">Zero Network Latency</h3>
                <p className="benefit-desc">
                  Skip the file upload and download queues. Operations execute directly in memory on your device for instant results.
                </p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">
                  <Sun size={24} />
                </div>
                <h3 className="benefit-title">Offline Capability</h3>
                <p className="benefit-desc">
                  Run the utility suite offline. Once loaded in your browser session, tools work without requiring an active network connection.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="landing-section">
            <div className="section-head">
              <h2 className="section-title">Workflow Architecture</h2>
              <p className="section-subtitle">How files are processed locally on your workstation.</p>
            </div>
            
            <div className="timeline-container">
              <div className="timeline-step">
                <div className="timeline-number">1</div>
                <div className="timeline-content">
                  <h4 className="timeline-title">Select Toolkit</h4>
                  <p className="timeline-desc">Choose from over 50+ image, scaling, or document formatting tools via the dashboard or navigation menus.</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="timeline-number">2</div>
                <div className="timeline-content">
                  <h4 className="timeline-title">Load Files Locally</h4>
                  <p className="timeline-desc">Upload or drag documents. Files are buffered directly into your browser's local sandbox memory.</p>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="timeline-number">3</div>
                <div className="timeline-content">
                  <h4 className="timeline-title">Process & Save</h4>
                  <p className="timeline-desc">Configure settings, render adjustments, and export. Output files are saved directly to your local storage.</p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="landing-section" style={{ paddingBottom: '64px' }}>
            <div className="section-head">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Common questions regarding browser-local processing and compliance.</p>
            </div>
            
            <div className="faq-accordion">
              {FAQS.map((faq, index) => (
                <div key={index} className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}>
                    <span>{faq.q}</span>
                    <ChevronDown size={18} />
                  </button>
                  <div className="faq-answer" style={{ display: openFaqIndex === index ? 'block' : 'none' }}>
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>

      ) : activeTool.engine === 'page' ? (
        <StaticPages activeTool={activeTool} />
      ) : (
        <Suspense fallback={<div className="loading-overlay"><div className="spinner" /></div>}>
          <ToolWorkspace activeTool={activeTool} setActiveTool={setActiveTool} theme={theme} />
        </Suspense>
      )}
      
      {/* 3. Footer */}
      <Footer setActiveTool={setActiveTool} />
    </div>
  );
}
