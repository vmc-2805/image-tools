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
  Palette,
  Sparkles,
  Camera,
  FileStack,
  ArrowRight
} from 'lucide-react';
import { getSeoData, updateMetaTags, fetchAndApplySeo } from './seoData';
import { TOOLS_CATALOG } from './toolsCatalog';
import { getToolIcon } from './toolIcons';
import Header from './components/Header';
import Footer from './components/Footer';
import StaticPages from './components/StaticPages';

const ToolWorkspace = React.lazy(() => import('./components/ToolWorkspace'));

const FAQS = [
  { q: "Is Imgediit safe and private?", a: "Yes, 100%. Imgediit processes all files locally inside your browser using JavaScript, WebAssembly, and WebGPU. Your images, PDFs, and data never leave your device or upload to any servers." },
  { q: "How is Imgediit so fast?", a: "Traditional tools require uploading files to a server, waiting for processing, and downloading them back. Imgediit runs entirely in your local browser, eliminating network transfer latency completely." },
  { q: "Does Imgediit work offline?", a: "Yes! Once loaded, most tools (resizers, compressors, signature maker) do not require an active internet connection to process files." },
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
        
        // Match static informational and guide pages
        const staticPages = [
          'privacy-policy', 
          'terms-of-service', 
          'ai-enhancement-guide',
          'passport-photo-guide',
          'pdf-compressor-guide'
        ];
        if (staticPages.includes(toolId)) {
          const guideTitles = {
            'ai-enhancement-guide': 'AI Photo Enhancer & Retouching Studio',
            'passport-photo-guide': 'Passport & Visa Photo Maker Suite',
            'pdf-compressor-guide': 'Smart PDF & Image Compressor Studio'
          };
          setActiveTool({
            id: toolId,
            name: guideTitles[toolId] || toolId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
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
    fetchAndApplySeo(activeTool);
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
            <h1 className="dashboard-title">Imgediit - In-Browser Document & Image Utilities</h1>
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
                        {getToolIcon(tool, 18)}
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

          {/* Bottom Featured Studios & Workflows Section */}
          <section className="landing-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '64px', paddingBottom: '32px' }}>
            <div className="section-head" style={{ marginBottom: '36px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                <Sparkles size={14} />
                <span>Featured Studios & Guides</span>
              </div>
              <h2 className="section-title">Popular Workflows & Tutorials</h2>
              <p className="section-subtitle">
                Explore in-depth guides, official dimensions, and fast in-browser workflows.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
              
              {/* Card 1: AI Photo Enhancer & Skin Retouch */}
              <div 
                onClick={() => setActiveTool({ id: 'ai-enhancement-guide', name: 'AI Photo Enhancer & Retouching Studio', engine: 'page', category: 'Information' })}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(168, 85, 247, 0.18)'; e.currentTarget.style.borderColor = '#a855f7'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                {/* Visual Graphic Header */}
                <div style={{
                  height: '160px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px'
                }}>
                  <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', color: '#ffffff', padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={12} style={{ color: '#fef08a' }} />
                    <span>AI Studio</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#ffffff' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                      <Sparkles size={34} />
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em' }}>4K AI Upscale</div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>Blemish Eraser & Retouch</div>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      AI Photo Enhancer & Skin Retouch
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      Turn blurry photos into sharp 4K memories, remove blemishes, smooth skin tones, and upscale images directly in your browser.
                    </p>

                    {/* Features List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#a855f7', fontWeight: '700' }}>✓</span>
                        <span>4K AI Upscaling & Edge Sharpening</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#a855f7', fontWeight: '700' }}>✓</span>
                        <span>Instant Acne & Spot Blemish Eraser</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#a855f7', fontWeight: '700' }}>✓</span>
                        <span>One-Click Portrait Skin Tone Retouch</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)', color: '#a855f7', fontSize: '13px', fontWeight: '700' }}>
                    <span>Read Guide & Launch Tools</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>

              {/* Card 2: Passport & Visa Photo Maker */}
              <div 
                onClick={() => setActiveTool({ id: 'passport-photo-guide', name: 'Passport & Visa Photo Maker Suite', engine: 'page', category: 'Information' })}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(16, 185, 129, 0.18)'; e.currentTarget.style.borderColor = '#10b981'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                {/* Visual Graphic Header */}
                <div style={{
                  height: '160px',
                  background: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px'
                }}>
                  <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', color: '#ffffff', padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Camera size={12} style={{ color: '#6ee7b7' }} />
                    <span>Official ID Suite</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#ffffff' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                      <Camera size={34} />
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em' }}>Biometric ID Studio</div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>3.5x4.5cm • 2x2 in • SSC & PAN</div>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      Passport & Visa Photo Maker Suite
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      Create official passport photos with automatic face centering, white/blue/red background changer, and exact portal KB limits.
                    </p>

                    {/* Features List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                        <span>Indian, US, UK & Schengen Visa Sizes</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                        <span>White, Blue & Red Background Switcher</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                        <span>Auto Face Alignment & Biometric Guides</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)', color: '#10b981', fontSize: '13px', fontWeight: '700' }}>
                    <span>Read Guidelines & Launch Tools</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>

              {/* Card 3: Smart PDF Merge & Image Compressor */}
              <div 
                onClick={() => setActiveTool({ id: 'pdf-compressor-guide', name: 'Smart PDF & Image Compressor Studio', engine: 'page', category: 'Information' })}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(59, 130, 246, 0.18)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                {/* Visual Graphic Header */}
                <div style={{
                  height: '160px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #0284c7 50%, #0891b2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '20px'
                }}>
                  <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', color: '#ffffff', padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileStack size={12} style={{ color: '#93c5fd' }} />
                    <span>PDF & Compress</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#ffffff' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                      <FileStack size={34} />
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em' }}>PDF & KB Studio</div>
                      <div style={{ fontSize: '12px', opacity: 0.9 }}>Target 20KB • 50KB • 100KB • 300 DPI</div>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
                      Smart PDF Merge & KB Compressor
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                      Merge multiple photos into single PDF files, convert PDF pages to JPG, and compress files under strict target KB limits.
                    </p>

                    {/* Features List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#3b82f6', fontWeight: '700' }}>✓</span>
                        <span>Merge Multiple JPG / PNG into Single PDF</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#3b82f6', fontWeight: '700' }}>✓</span>
                        <span>Extract PDF Pages to High-Res JPG</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                        <span style={{ color: '#3b82f6', fontWeight: '700' }}>✓</span>
                        <span>Exact 20KB, 50KB, 100KB Target Compression</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)', color: '#3b82f6', fontSize: '13px', fontWeight: '700' }}>
                    <span>Read PDF Guide & Launch Tools</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Why Imgediit? Benefits Section */}
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
        <StaticPages activeTool={activeTool} setActiveTool={setActiveTool} />
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
