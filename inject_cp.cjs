const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'image-splitter-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'color-picker-engine' ? (
        // COLOR PICKER CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Find Color Code From Image | HEX & RGB</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Welcome to Pi7 Image Tool - Your Reliable Solution for Extract HEX & RGB Color Codes!</p>
          </div>
          
          <input type="file" ref={cpInputRef} onChange={handleCpFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div className="cp-workspace">
             {/* Left Column */}
             <div className="cp-image-col">
                <div className="cp-image-header">
                   Click On Image To Pick Color
                </div>
                <div className="cp-image-container" 
                     onMouseMove={handleCpMouseMove} 
                     onMouseLeave={handleCpMouseLeave}
                     onClick={handleCpClick}>
                   {cpImage ? (
                      <>
                         <img src={cpImage} ref={cpImgRef} alt="Upload" crossOrigin="anonymous" />
                         {cpIsHovering && (
                            <div className="cp-loupe" style={{
                               left: \`\${cpHoverPos.x}%\`,
                               top: \`\${cpHoverPos.y}%\`,
                               backgroundColor: \`rgb(\${cpHoverColor[0]}, \${cpHoverColor[1]}, \${cpHoverColor[2]})\`
                            }}>
                               <div className="cp-loupe-dot"></div>
                            </div>
                         )}
                      </>
                   ) : (
                      <div className="cp-upload-placeholder" onClick={() => cpInputRef.current.click()}>
                         <Upload size={32} style={{ marginBottom: '16px', color: '#9ca3af' }} />
                         <p>Click here to upload an image</p>
                      </div>
                   )}
                </div>
             </div>
             
             {/* Right Column */}
             <div className="cp-panel-col">
                <div className="cp-panel-card">
                   <div className="cp-panel-header">Color Palette</div>
                   <div className="cp-palette-grid">
                      {cpPalette.map((color, i) => (
                         <div 
                            key={i} 
                            className="cp-palette-swatch" 
                            style={{ backgroundColor: \`rgb(\${color[0]}, \${color[1]}, \${color[2]})\` }}
                            onClick={() => { setCpSelectedColor(color); setCpHoverColor(color); }}
                         ></div>
                      ))}
                      {/* Fill empty spots if needed to look like a grid */}
                      {Array.from({ length: Math.max(0, 15 - cpPalette.length) }).map((_, i) => (
                         <div key={\`empty-\${i}\`} className="cp-palette-swatch empty"></div>
                      ))}
                   </div>
                   
                   <div className="cp-download-wrap">
                      <button className="cp-btn-outline" onClick={downloadCpPalette} disabled={cpPalette.length === 0}>
                         Download Palette
                      </button>
                   </div>
                   
                   <div className="cp-current-color-box">
                      <div className="cp-color-preview" style={{ backgroundColor: \`rgb(\${cpSelectedColor[0]}, \${cpSelectedColor[1]}, \${cpSelectedColor[2]})\` }}></div>
                      <div className="cp-color-info">
                         <div className="cp-color-row">
                            <span className="cp-color-label">HEX:</span>
                            <span className="cp-color-value">{rgbToHex(cpSelectedColor[0], cpSelectedColor[1], cpSelectedColor[2])}</span>
                            <Copy size={14} className="cp-copy-icon" onClick={() => {
                               navigator.clipboard.writeText(rgbToHex(cpSelectedColor[0], cpSelectedColor[1], cpSelectedColor[2]));
                               showToast('Copied HEX code!');
                            }} />
                         </div>
                         <div className="cp-color-row">
                            <span className="cp-color-label">RGB:</span>
                            <span className="cp-color-value">rgba({cpSelectedColor[0]},{cpSelectedColor[1]},{cpSelectedColor[2]})</span>
                            <Copy size={14} className="cp-copy-icon" onClick={() => {
                               navigator.clipboard.writeText(\`rgba(\${cpSelectedColor[0]},\${cpSelectedColor[1]},\${cpSelectedColor[2]})\`);
                               showToast('Copied RGB code!');
                            }} />
                         </div>
                         <button className="cp-add-palette-btn" onClick={() => {
                            if (!cpPalette.some(c => c[0]===cpSelectedColor[0] && c[1]===cpSelectedColor[1] && c[2]===cpSelectedColor[2])) {
                               setCpPalette(prev => [...prev, cpSelectedColor]);
                            }
                         }}>
                            + Add Color To Palette
                         </button>
                      </div>
                   </div>
                   
                   <div className="cp-upload-wrap">
                      <button className="cp-btn-upload" onClick={() => cpInputRef.current.click()}>
                         <Upload size={16} /> Upload New Image
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Color Picker UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
