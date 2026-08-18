const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'unblur-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'pixelate-engine' ? (
        // PIXELATE CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Pixelate Image Online</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Welcome to Pi7 Image Tool - The Most Advanced Way to Pixelate a Image Online.</p>
          </div>
          
          <input type="file" ref={pxInputRef} onChange={handlePxFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             {/* Left Column - Preview Area */}
             <div className="ab-grid-bg" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff' }}>
                {pxPreviewUrl ? (
                   <img 
                      src={pxPreviewUrl} 
                      alt="Pixelated Preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain', imageRendering: 'pixelated' }} 
                   />
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <p>Upload an image to start pixelating</p>
                   </div>
                )}
             </div>
             
             {/* Right Column - Sidebar Panel */}
             <div style={{ width: '400px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Block size */}
                   <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Block size</span>
                         <span style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #d1d5db', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fff' }}>{pxBlockSize}</span>
                      </div>
                      <input 
                         type="range" 
                         min="1" max="100" 
                         value={pxBlockSize} 
                         onChange={(e) => setPxBlockSize(Number(e.target.value))} 
                         style={{ width: '100%', accentColor: '#1d4ed8' }} 
                      />
                   </div>
                   
                   {/* Color Palette */}
                   <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
                         <input type="checkbox" checked={pxUsePalette} onChange={(e) => setPxUsePalette(e.target.checked)} style={{ accentColor: '#1d4ed8' }} />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Change Color Palette</span>
                      </label>
                      
                      <div style={{ paddingLeft: '24px', opacity: pxUsePalette ? 1 : 0.5, pointerEvents: pxUsePalette ? 'auto' : 'none' }}>
                         <select 
                            value={pxActivePalette} 
                            onChange={(e) => setPxActivePalette(e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#ffffff', fontSize: '13px', marginBottom: '12px' }}
                         >
                            <option value="retro1">Retro Pop (8 Colors)</option>
                            <option value="gameboy">GameBoy (4 Colors)</option>
                            <option value="cga">CGA Classic (4 Colors)</option>
                            <option value="sepia">Sepia Vintage (5 Colors)</option>
                            <option value="custom">Custom Palette...</option>
                         </select>
                         
                         <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Create Custom Palette</div>
                         <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                            {pxCustomPalette.map((color, idx) => (
                               <div key={idx} style={{ position: 'relative' }}>
                                  <input type="color" value={color} onChange={(e) => {
                                     const newPal = [...pxCustomPalette];
                                     newPal[idx] = e.target.value;
                                     setPxCustomPalette(newPal);
                                     setPxActivePalette('custom');
                                  }} style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer' }} />
                               </div>
                            ))}
                            <button onClick={() => {
                               if(pxCustomPalette.length < 16) {
                                  setPxCustomPalette([...pxCustomPalette, '#ffffff']);
                                  setPxActivePalette('custom');
                               }
                            }} style={{ width: '24px', height: '24px', border: '1px dashed #4f5b93', backgroundColor: 'transparent', color: '#4f5b93', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                         </div>
                         <button style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Save Palette</button>
                      </div>
                   </div>
                   
                   {/* Grayscale */}
                   <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <input type="checkbox" checked={pxGrayscale} onChange={(e) => setPxGrayscale(e.target.checked)} style={{ accentColor: '#1d4ed8' }} />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Apply Grayscale</span>
                      </label>
                   </div>
                   
                   {/* Draw Grid Lines */}
                   <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <input type="checkbox" checked={pxDrawGrid} onChange={(e) => setPxDrawGrid(e.target.checked)} style={{ accentColor: '#1d4ed8' }} />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Draw Grid Lines</span>
                      </label>
                   </div>
                   
                   {/* Draw Edges */}
                   <div style={{ marginBottom: '32px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
                         <input type="checkbox" checked={pxDrawEdges} onChange={(e) => setPxDrawEdges(e.target.checked)} style={{ accentColor: '#1d4ed8' }} />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Draw Edges</span>
                      </label>
                      
                      <div style={{ paddingLeft: '24px', opacity: pxDrawEdges ? 1 : 0.5, pointerEvents: pxDrawEdges ? 'auto' : 'none' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280', width: '60px' }}>Line Width</span>
                            <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                               <button onClick={() => setPxEdgeWidth(Math.max(1, pxEdgeWidth - 1))} style={{ padding: '4px 12px', border: 'none', backgroundColor: '#f9fafb', cursor: 'pointer' }}>-</button>
                               <input type="text" readOnly value={pxEdgeWidth} style={{ width: '40px', textAlign: 'center', border: 'none', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db' }} />
                               <button onClick={() => setPxEdgeWidth(Math.min(20, pxEdgeWidth + 1))} style={{ padding: '4px 12px', border: 'none', backgroundColor: '#f9fafb', cursor: 'pointer' }}>+</button>
                            </div>
                         </div>
                         
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#6b7280', width: '60px' }}>Threshold</span>
                            <input 
                               type="range" 
                               min="0" max="100" 
                               value={pxEdgeThreshold} 
                               onChange={(e) => setPxEdgeThreshold(Number(e.target.value))} 
                               style={{ flex: 1, accentColor: '#10b981' }} 
                            />
                            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{pxEdgeThreshold}</span>
                         </div>
                      </div>
                   </div>
                   
                </div>
                
                <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', gap: '8px', borderTop: '1px solid #e5e7eb' }}>
                   <button onClick={() => pxInputRef.current.click()} style={{ flex: 1, backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>New Image</button>
                   <button onClick={handlePxDownload} disabled={!pxPreviewUrl} style={{ flex: 1, backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: pxPreviewUrl ? 'pointer' : 'not-allowed', opacity: pxPreviewUrl ? 1 : 0.5 }}>Download Image</button>
                </div>
             </div>
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Pixelate Pro UI.");
} else {
    console.log("Target strings not found in App.jsx.");
}
