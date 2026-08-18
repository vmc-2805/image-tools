const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'watermark-engine' ? (`;

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'freehand-crop' ? (
        // FREEHAND CROP CUSTOM UI
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '20px', textAlign: 'center' }}>
          <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Freehand Crop Image Online</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>Welcome to Pi7 Image Tool - Your Reliable Solution for Freehand Image Cropping</p>
          
          <div className="fc-workspace">
             <div className="fc-header">Click On Image To Crop</div>
             
             <div className="fc-canvas-container" 
                  onWheel={handleFcWheel}
                  onPointerDown={handleFcPointerDown}
                  onPointerMove={handleFcPointerMove}
                  onPointerUp={handleFcPointerUp}
                  onPointerLeave={handleFcPointerUp}
             >
                {previewUrl ? (
                   <div className="fc-transform-layer" style={{ transform: \`translate(\${fcPan.x}px, \${fcPan.y}px) scale(\${fcZoom})\` }}>
                      <img src={previewUrl} className="fc-base-img" alt="Base" onClick={handleFcCanvasClick} draggable={false} />
                      <svg className="fc-svg-overlay" style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                         {fcPoints.length > 0 && (
                            <polygon 
                               points={fcPoints.map(p => \`\${p.x * 100}%,\${p.y * 100}%\`).join(' ')}
                               fill="rgba(59, 130, 246, 0.2)"
                               stroke="#3b82f6"
                               strokeWidth="2"
                               strokeDasharray="4"
                            />
                         )}
                         {fcPoints.map((p, i) => (
                            <circle key={i} cx={\`\${p.x * 100}%\`} cy={\`\${p.y * 100}%\`} r="4" fill="#ef4444" />
                         ))}
                      </svg>
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
                      style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                   >
                     <Upload size={32} />
                     <p>Click to Upload Image</p>
                   </div>
                )}
             </div>
             
             {previewUrl && (
                <div className="fc-controls">
                   <div className="fc-btn-group">
                      <button className="fc-btn" onClick={() => setFcPoints(fcPoints.slice(0, -1))}>Undo</button>
                      <button className="fc-btn" onClick={() => setFcZoom(z => Math.min(z + 0.2, 3))}>Zoom In</button>
                      <button className="fc-btn" onClick={() => setFcZoom(z => Math.max(z - 0.2, 0.5))}>Zoom Out</button>
                   </div>
                   
                   <div className="fc-btn-group" style={{ marginTop: '12px' }}>
                      <button className="fc-btn" onClick={() => { setFcZoom(1); setFcPan({x: 0, y: 0}); }}>Reset Zoom</button>
                      <button className="fc-btn fc-btn-primary" onClick={runFreehandCropDownload} disabled={processing}>
                         {processing ? '...' : 'Crop'}
                      </button>
                   </div>
                   
                   <div className="fc-hint">Scroll Mouse Wheel To Zoom</div>
                   
                   <button className="fc-btn fc-btn-outline" onClick={() => fileInputRef.current.click()} style={{ marginTop: '16px' }}>
                      <Upload size={16} /> Upload New Image
                   </button>
                </div>
             )}
          </div>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Freehand Crop UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
