const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'unblur-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'add-border-engine' ? (
        // ADD BORDER CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Add Border To Photo - Free Online Image Border Generator</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Welcome to Pi7 Image Tool - Your photo. Your frame. Zero fuss.</p>
          </div>
          
          <input type="file" ref={abInputRef} onChange={handleAbFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             {/* Left Column - Preview Area */}
             <div className="ab-grid-bg" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px' }}>
                <button 
                   onClick={() => abInputRef.current.click()}
                   style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: '#f3f4f6', color: '#4f5b93', border: '1px solid #d1d5db', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                >
                   <Upload size={14} /> CHANGE IMAGE
                </button>
                
                {abPreviewUrl ? (
                   <>
                      <img 
                         src={abPreviewUrl} 
                         alt="Bordered Preview" 
                         style={{ maxWidth: '100%', maxHeight: 'calc(100% - 40px)', display: 'block', objectFit: 'contain', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }} 
                      />
                      <div style={{ marginTop: '16px', backgroundColor: '#4b5563', color: '#ffffff', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}>
                         {abImageDimensions.w} x {abImageDimensions.h} px
                      </div>
                   </>
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <Upload size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                      <p>Upload an image to start adding borders</p>
                   </div>
                )}
             </div>
             
             {/* Right Column - Sidebar Panel */}
             <div style={{ width: '360px', backgroundColor: '#f9fafb', borderLeft: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* PRESETS */}
                   <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f5b93', letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase' }}>Presets</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                         {['CLASSIC', 'GOLDEN', 'DOUBLE', 'VINTAGE', 'POLAROID', 'WHITE', 'FILM', 'MINIMAL', 'BOLD'].map(preset => (
                            <button 
                               key={preset}
                               onClick={() => setAbActivePreset(preset)}
                               className={abActivePreset === preset ? "ab-grid-btn active" : "ab-grid-btn"}
                            >
                               <div className={\`ab-icon-preview ab-\${preset.toLowerCase()}\`}></div>
                               <span style={{ fontSize: '10px', fontWeight: 'bold', marginTop: '6px' }}>{preset}</span>
                            </button>
                         ))}
                      </div>
                   </div>
                   
                   <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0 -24px 24px -24px' }}></div>
                   
                   {/* ASPECT RATIO */}
                   <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f5b93', letterSpacing: '0.1em', marginBottom: '12px', textTransform: 'uppercase' }}>Aspect Ratio</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                         {[
                            { id: 'Original', icon: '■', label: '' },
                            { id: '1:1', icon: '□', label: 'INSTAGRAM' },
                            { id: '4:5', icon: '◫', label: 'PORTRAIT' },
                            { id: '16:9', icon: '▭', label: 'WIDESCREEN' },
                            { id: '9:16', icon: '▯', label: 'STORY' },
                            { id: '4:3', icon: '▤', label: 'CLASSIC' },
                            { id: '3:2', icon: '▧', label: 'DSLR' },
                            { id: '2:3', icon: '▥', label: 'PRINT' }
                         ].map(ar => (
                            <button 
                               key={ar.id}
                               onClick={() => setAbAspectRatio(ar.id)}
                               className={abAspectRatio === ar.id ? "ab-grid-btn active" : "ab-grid-btn"}
                               style={{ padding: '8px 4px' }}
                            >
                               <span style={{ fontSize: '14px', marginBottom: '4px' }}>{ar.icon}</span>
                               <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{ar.id}</span>
                               {ar.label && <span style={{ fontSize: '8px', color: '#6b7280', marginTop: '2px' }}>{ar.label}</span>}
                            </button>
                         ))}
                      </div>
                   </div>
                   
                   <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0 -24px 24px -24px' }}></div>
                   
                   {/* BORDER SETTINGS */}
                   <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f5b93', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>Border</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>WIDTH</span>
                         <span style={{ fontSize: '12px', color: '#4f5b93', fontWeight: 'bold' }}>{abBorderWidth}px</span>
                      </div>
                      <input 
                         type="range" 
                         min="0" max="100" 
                         value={abBorderWidth} 
                         onChange={(e) => setAbBorderWidth(Number(e.target.value))} 
                         className="ab-slider"
                         style={{ width: '100%', marginBottom: '24px' }} 
                      />
                      
                      <div style={{ marginBottom: '8px' }}>
                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>STYLE</span>
                      </div>
                      <select 
                         value={abBorderStyle} 
                         onChange={(e) => setAbBorderStyle(e.target.value)}
                         style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#ffffff', fontSize: '13px' }}
                      >
                         <option value="Solid">Solid</option>
                         <option value="Dashed">Dashed</option>
                         <option value="Dotted">Dotted</option>
                      </select>
                   </div>
                   
                   <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0 -24px 24px -24px' }}></div>
                   
                   {/* EXPORT OPTIONS */}
                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                      {['PNG', 'JPEG', 'WEBP'].map(fmt => (
                         <button 
                            key={fmt}
                            onClick={() => setAbExportFormat(fmt)}
                            className={abExportFormat === fmt ? "ab-format-btn active" : "ab-format-btn"}
                         >
                            {fmt}
                         </button>
                      ))}
                   </div>
                   
                   <button 
                      onClick={handleAbDownload} 
                      disabled={!abPreviewUrl}
                      style={{ width: '100%', backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: abPreviewUrl ? 'pointer' : 'not-allowed', opacity: abPreviewUrl ? 1 : 0.5 }}
                   >
                      ↓ DOWNLOAD IMAGE
                   </button>
                   
                </div>
             </div>
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Add Border UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
