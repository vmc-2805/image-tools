const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'flip-img' ? (`;

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'watermark-engine' ? (
        // 4. WATERMARK CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <h1 className="workspace-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Add Watermark to Image Online</h1>
          
          <div className="wm-workspace">
             <div className="wm-preview-area">
                {previewUrl ? (
                   <div className="wm-preview-container">
                     <img src={previewUrl} className="wm-base-img" alt="Base" />
                     {watermarks.map(wm => (
                        <div 
                           key={wm.id}
                           className={\`wm-overlay \${activeWatermarkId === wm.id ? 'active' : ''}\`}
                           style={{
                              transform: \`translate(calc(-50% + \${wm.x}px), calc(-50% + \${wm.y}px)) rotate(\${wm.rotation}deg) scale(\${wm.scale})\`,
                              opacity: wm.opacity,
                              ...(wm.gridEffect ? {
                                 width: '100%',
                                 height: '100%',
                                 backgroundImage: wm.type === 'image' ? \`url(\${wm.src})\` : 'none',
                                 backgroundRepeat: 'repeat'
                              } : {})
                           }}
                           onPointerDown={(e) => handleWmPointerDown(e, wm, 'move')}
                        >
                           {/* Render actual content based on type */}
                           {!wm.gridEffect && wm.type === 'image' && wm.src && (
                              <img src={wm.src} style={{ filter: \`brightness(\${wm.brightness}%)\`, display: 'block', maxWidth: '100%' }} draggable={false} alt="watermark" />
                           )}
                           {!wm.gridEffect && wm.type === 'text' && (
                              <div style={{ 
                                 fontFamily: wm.fontFamily, 
                                 fontSize: \`\${wm.fontSize}px\`, 
                                 color: wm.color, 
                                 backgroundColor: wm.bgColor,
                                 padding: '10px',
                                 whiteSpace: 'nowrap',
                                 WebkitTextStroke: \`\${wm.strokeWidth}px \${wm.strokeColor}\`,
                                 border: wm.borderStyle || 'none'
                              }}>
                                 {wm.text}
                              </div>
                           )}
                           
                           {activeWatermarkId === wm.id && (
                              <>
                                 <div className="wm-handle wm-handle-rotate" onPointerDown={(e) => handleWmPointerDown(e, wm, 'rotate')}></div>
                                 <div className="wm-handle wm-handle-tl" onPointerDown={(e) => handleWmPointerDown(e, wm, 'scale-tl')}></div>
                                 <div className="wm-handle wm-handle-tr" onPointerDown={(e) => handleWmPointerDown(e, wm, 'scale-tr')}></div>
                                 <div className="wm-handle wm-handle-bl" onPointerDown={(e) => handleWmPointerDown(e, wm, 'scale-bl')}></div>
                                 <div className="wm-handle wm-handle-br" onPointerDown={(e) => handleWmPointerDown(e, wm, 'scale-br')}></div>
                              </>
                           )}
                        </div>
                     ))}
                   </div>
                ) : (
                   <div 
                      className="dropzone"
                      onClick={() => fileInputRef.current.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files[0]) handleFileLoad(e.dataTransfer.files[0]);
                      }}
                      style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                   >
                     <Upload size={32} />
                     <p>Click to Upload Image</p>
                   </div>
                )}
                
                {previewUrl && (
                   <div style={{ textAlign: 'center', marginTop: '20px' }}>
                     <button className="btn btn-primary" onClick={runWatermarkDownload} disabled={processing}>
                       {processing ? 'Processing...' : 'Download'}
                     </button>
                     <p style={{ color: '#6366f1', fontSize: '14px', marginTop: '12px' }}>
                        ⓘ Rotate & Scale Watermark By Click On Square Dots
                     </p>
                   </div>
                )}
             </div>
             
             <div className="wm-sidebar">
                <div className="wm-tabs">
                   <button className={\`wm-tab \${wmActiveTab === 'image' ? 'active' : ''}\`} onClick={() => setWmActiveTab('image')}>
                      <Image size={16} /> Image
                   </button>
                   <button className={\`wm-tab \${wmActiveTab === 'text' ? 'active' : ''}\`} onClick={() => setWmActiveTab('text')}>
                      <Type size={16} /> Text
                   </button>
                   <button className="wm-tab-close" onClick={() => setActiveTool(null)}><X size={16} color="#ef4444" /></button>
                </div>
                
                <div className="wm-tab-content">
                   {wmActiveTab === 'image' ? (
                      <>
                         <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            {/* Selected Logos logic (simplified list of image watermarks) */}
                            {watermarks.filter(w => w.type === 'image').map(wm => (
                               <div key={wm.id} className={\`wm-logo-thumb \${activeWatermarkId === wm.id ? 'active' : ''}\`} onClick={() => setActiveWatermarkId(wm.id)}>
                                  <img src={wm.src} alt="logo" />
                                  <button className="wm-logo-remove" onClick={(e) => { e.stopPropagation(); removeWm(wm.id); }}><X size={12} /></button>
                               </div>
                            ))}
                            <div className="wm-logo-add" onClick={() => {
                               const input = document.createElement('input');
                               input.type = 'file';
                               input.accept = 'image/*';
                               input.onchange = (e) => { if(e.target.files[0]) handleWmAddImage(e.target.files[0]); };
                               input.click();
                            }}>
                               <Plus size={24} color="#9ca3af" />
                               <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Select Logo</span>
                            </div>
                         </div>
                         
                         {activeWatermarkId && watermarks.find(w => w.id === activeWatermarkId)?.type === 'image' && (
                            <>
                               <div className="wm-control-group">
                                  <label><span className="icon-opacity">⬛</span> Opacity</label>
                                  <input type="range" min="0" max="1" step="0.01" 
                                     value={watermarks.find(w => w.id === activeWatermarkId).opacity}
                                     onChange={(e) => updateActiveWm({ opacity: parseFloat(e.target.value) })}
                                  />
                               </div>
                               <div className="wm-control-group">
                                  <label><span className="icon-brightness">◐</span> Brightness</label>
                                  <input type="range" min="0" max="200" step="1" 
                                     value={watermarks.find(w => w.id === activeWatermarkId).brightness}
                                     onChange={(e) => updateActiveWm({ brightness: parseInt(e.target.value) })}
                                  />
                               </div>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', cursor: 'pointer', fontSize: '14px', color: '#4b5563' }}>
                                  <input type="checkbox" 
                                     checked={watermarks.find(w => w.id === activeWatermarkId).gridEffect}
                                     onChange={(e) => updateActiveWm({ gridEffect: e.target.checked })}
                                  /> Apply Grid Effect
                               </label>
                            </>
                         )}
                      </>
                   ) : (
                      <>
                         <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                            <input type="text" className="text-input" placeholder="Enter Text" value={wmTextInput} onChange={e => setWmTextInput(e.target.value)} style={{ flex: 1 }} />
                            <button className="btn btn-primary" onClick={handleWmAddText} style={{ background: '#0d9488', borderColor: '#0d9488' }}>Add</button>
                         </div>
                         
                         <div style={{ marginBottom: '16px' }}>
                            {watermarks.filter(w => w.type === 'text').map(wm => (
                               <div key={wm.id} className={\`wm-text-item \${activeWatermarkId === wm.id ? 'active' : ''}\`} onClick={() => setActiveWatermarkId(wm.id)}>
                                  <span>{wm.text}</span>
                                  <button onClick={(e) => { e.stopPropagation(); removeWm(wm.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={14} /></button>
                               </div>
                            ))}
                         </div>
                         
                         {activeWatermarkId && watermarks.find(w => w.id === activeWatermarkId)?.type === 'text' && (
                            <>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer', fontSize: '14px', color: '#4b5563' }}>
                                  <input type="checkbox" 
                                     checked={watermarks.find(w => w.id === activeWatermarkId).gridEffect}
                                     onChange={(e) => updateActiveWm({ gridEffect: e.target.checked })}
                                  /> Apply Grid Effect
                               </label>
                               
                               <select className="select-input" style={{ width: '100%', marginBottom: '16px' }} 
                                  value={watermarks.find(w => w.id === activeWatermarkId).fontFamily}
                                  onChange={e => updateActiveWm({ fontFamily: e.target.value })}
                               >
                                  <option value="Arial">Arial</option>
                                  <option value="Times New Roman">Times New Roman</option>
                                  <option value="Courier New">Courier New</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Verdana">Verdana</option>
                               </select>
                               
                               <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                  <div style={{ flex: 1 }}>
                                     <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Font Size</div>
                                     <div className="number-spinner">
                                        <button onClick={() => updateActiveWm({ fontSize: Math.max(10, watermarks.find(w => w.id === activeWatermarkId).fontSize - 2) })}>-</button>
                                        <input type="number" value={watermarks.find(w => w.id === activeWatermarkId).fontSize} onChange={e => updateActiveWm({ fontSize: parseInt(e.target.value) || 10 })} />
                                        <button onClick={() => updateActiveWm({ fontSize: watermarks.find(w => w.id === activeWatermarkId).fontSize + 2 })}>+</button>
                                     </div>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                     <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Opacity</div>
                                     <div className="number-spinner">
                                        <button onClick={() => updateActiveWm({ opacity: Math.max(0, watermarks.find(w => w.id === activeWatermarkId).opacity - 0.1) })}>-</button>
                                        <input type="number" step="0.1" value={watermarks.find(w => w.id === activeWatermarkId).opacity.toFixed(1)} onChange={e => updateActiveWm({ opacity: parseFloat(e.target.value) || 1 })} />
                                        <button onClick={() => updateActiveWm({ opacity: Math.min(1, watermarks.find(w => w.id === activeWatermarkId).opacity + 0.1) })}>+</button>
                                     </div>
                                  </div>
                               </div>
                               
                               <div style={{ marginBottom: '16px' }}>
                                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Font Color</div>
                                  <div className="wm-color-grid">
                                     {['#1e3a8a','#9333ea','#3b82f6','#4ade80','#fde047','#f87171'].map(c => (
                                        <div key={c} className="wm-color-swatch" style={{ background: c }} onClick={() => updateActiveWm({ color: c })} />
                                     ))}
                                     <input type="color" className="wm-color-picker-btn" value={watermarks.find(w => w.id === activeWatermarkId).color} onChange={e => updateActiveWm({ color: e.target.value })} />
                                  </div>
                               </div>
                               
                               <div style={{ marginBottom: '16px' }}>
                                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Background Color</div>
                                  <div className="wm-color-grid">
                                     <div className="wm-color-swatch transparent" onClick={() => updateActiveWm({ bgColor: 'transparent' })} title="Transparent" />
                                     {['#14532d','#b91c1c','#c2410c','#a16207','#93c5fd','#475569'].map(c => (
                                        <div key={c} className="wm-color-swatch" style={{ background: c }} onClick={() => updateActiveWm({ bgColor: c })} />
                                     ))}
                                     <input type="color" className="wm-color-picker-btn" value={watermarks.find(w => w.id === activeWatermarkId).bgColor !== 'transparent' ? watermarks.find(w => w.id === activeWatermarkId).bgColor : '#ffffff'} onChange={e => updateActiveWm({ bgColor: e.target.value })} />
                                  </div>
                               </div>
                               
                               <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                  <div style={{ flex: 1 }}>
                                     <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Text Stroke</div>
                                     <div className="number-spinner">
                                        <button onClick={() => updateActiveWm({ strokeWidth: Math.max(0, watermarks.find(w => w.id === activeWatermarkId).strokeWidth - 1) })}>-</button>
                                        <input type="number" value={watermarks.find(w => w.id === activeWatermarkId).strokeWidth} onChange={e => updateActiveWm({ strokeWidth: parseInt(e.target.value) || 0 })} />
                                        <button onClick={() => updateActiveWm({ strokeWidth: watermarks.find(w => w.id === activeWatermarkId).strokeWidth + 1 })}>+</button>
                                     </div>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                     <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Stroke Color</div>
                                     <input type="color" value={watermarks.find(w => w.id === activeWatermarkId).strokeColor} onChange={e => updateActiveWm({ strokeColor: e.target.value })} style={{ width: '100%', height: '36px', padding: '4px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                                  </div>
                               </div>
                               
                            </>
                         )}
                      </>
                   )}
                </div>
             </div>
          </div>
          
          <div className="add-more-container" style={{ marginTop: '20px' }}>
            <span style={{ cursor: 'pointer', color: '#4f46e5' }} onClick={() => fileInputRef.current.click()}>+ Add More Images</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected watermark UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
