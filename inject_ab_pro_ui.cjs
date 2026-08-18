const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStart = `                   {/* BORDER SETTINGS */}`;
const targetEnd = `                   {/* EXPORT OPTIONS */}`;

if (content.includes(targetStart) && content.includes(targetEnd)) {
    const parts = content.split(targetStart);
    const endParts = parts[1].split(targetEnd);
    
    // The palette colors shown in the screenshot
    // Black, White, Cream, Gold, Brown, Olive, Blue, Magenta
    // DarkNavy, Tan, Custom(+)
    
    const newUI = `                   {/* BORDER SETTINGS */}
                   <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f5b93', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>Border</div>
                      
                      {/* Width */}
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
                         style={{ width: '100%', marginBottom: '16px' }} 
                      />
                      
                      {/* Style */}
                      <div style={{ marginBottom: '8px' }}>
                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>STYLE</span>
                      </div>
                      <select 
                         value={abBorderStyle} 
                         onChange={(e) => setAbBorderStyle(e.target.value)}
                         style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#ffffff', fontSize: '13px', marginBottom: '16px' }}
                      >
                         <option value="Solid">Solid</option>
                         <option value="Dashed">Dashed</option>
                         <option value="Dotted">Dotted</option>
                      </select>
                      
                      {/* Corner Radius */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>CORNER RADIUS</span>
                         <span style={{ fontSize: '12px', color: '#4f5b93', fontWeight: 'bold' }}>{abCornerRadius}%</span>
                      </div>
                      <input 
                         type="range" 
                         min="0" max="100" 
                         value={abCornerRadius} 
                         onChange={(e) => setAbCornerRadius(Number(e.target.value))} 
                         className="ab-slider"
                         style={{ width: '100%', marginBottom: '16px' }} 
                      />
                      
                      {/* Color Palette */}
                      <div style={{ marginBottom: '8px' }}>
                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>COLOR</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                         {['#111111', '#ffffff', '#f4ecd8', '#d4af37', '#8b4513', '#556b2f', '#191970', '#8b008b', '#000033', '#d2b48c'].map(color => (
                            <div 
                               key={color}
                               onClick={() => setAbBorderColor(color)}
                               style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color, border: '1px solid #d1d5db', cursor: 'pointer', boxShadow: abBorderColor === color ? '0 0 0 2px white, 0 0 0 4px #4f5b93' : 'none' }}
                            />
                         ))}
                         <label style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px dashed #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4f5b93', fontSize: '14px' }}>
                            +
                            <input type="color" value={abBorderColor} onChange={(e) => setAbBorderColor(e.target.value)} style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }} />
                         </label>
                      </div>
                   </div>
                   
                   <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0 -24px 24px -24px' }}></div>
                   
                   {/* INNER MAT */}
                   <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f5b93', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>Inner Mat</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase' }}>Enable Mat</span>
                         <label className="ab-toggle">
                            <input type="checkbox" checked={abEnableMat} onChange={(e) => setAbEnableMat(e.target.checked)} />
                            <span className="ab-slider-round"></span>
                         </label>
                      </div>
                      
                      <div style={{ opacity: abEnableMat ? 1 : 0.5, pointerEvents: abEnableMat ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563' }}>MAT WIDTH</span>
                            <span style={{ fontSize: '12px', color: '#4f5b93', fontWeight: 'bold' }}>{abMatWidth}px</span>
                         </div>
                         <input 
                            type="range" 
                            min="0" max="100" 
                            value={abMatWidth} 
                            onChange={(e) => setAbMatWidth(Number(e.target.value))} 
                            className="ab-slider"
                            style={{ width: '100%', marginBottom: '16px' }} 
                         />
                         
                         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {['#ffffff', '#f3f4f6', '#f4ecd8', '#d4af37', '#111111', '#d1d5db', '#fbcfe8', '#e0e7ff'].map(color => (
                               <div 
                                  key={'mat'+color}
                                  onClick={() => setAbMatColor(color)}
                                  style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color, border: '1px solid #d1d5db', cursor: 'pointer', boxShadow: abMatColor === color ? '0 0 0 2px white, 0 0 0 4px #4f5b93' : 'none' }}
                               />
                            ))}
                            <label style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px dashed #9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4f5b93', fontSize: '14px' }}>
                               +
                               <input type="color" value={abMatColor} onChange={(e) => setAbMatColor(e.target.value)} style={{ opacity: 0, position: 'absolute', width: 0, height: 0 }} />
                            </label>
                         </div>
                      </div>
                   </div>
                   
                   <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0 -24px 24px -24px' }}></div>
                   
                   {/* CAPTION */}
                   <div style={{ marginBottom: '32px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#4f5b93', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>Caption</div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: abShowCaption ? '16px' : '0' }}>
                         <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', textTransform: 'uppercase' }}>Show Caption</span>
                         <label className="ab-toggle">
                            <input type="checkbox" checked={abShowCaption} onChange={(e) => setAbShowCaption(e.target.checked)} />
                            <span className="ab-slider-round"></span>
                         </label>
                      </div>
                      
                      {abShowCaption && (
                         <input 
                            type="text" 
                            value={abCaptionText}
                            onChange={(e) => setAbCaptionText(e.target.value)}
                            placeholder="Enter caption..."
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                         />
                      )}
                   </div>
                   
                   <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '0 -24px 24px -24px' }}></div>
                   
                   `;

    fs.writeFileSync('src/App.jsx', parts[0] + newUI + targetEnd + endParts[1]);
    console.log("Successfully injected Add Border Pro UI.");
} else {
    console.log("Target strings not found in App.jsx.");
}
