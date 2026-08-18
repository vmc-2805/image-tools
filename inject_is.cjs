const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'join-images-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'image-splitter-engine' ? (
        // IMAGE SPLITTER CUSTOM UI
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Image Splitter - Split Photo into 3, 4, 9 Parts</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Free browser tool. Split your image into equal parts for Instagram, carousels, and poster slicing.</p>
          </div>
          
          <input type="file" ref={isInputRef} onChange={handleIsFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div className="is-workspace">
             <div className="is-header">
                {isRows}x{isCols} Grid Is Used For Instagram
             </div>
             
             <div className="is-controls">
                <div className="is-control-group">
                   <span className="is-label">Rows</span>
                   <div className="is-spinner">
                      <button onClick={() => setIsRows(r => Math.max(1, r - 1))}>−</button>
                      <input type="number" value={isRows} readOnly />
                      <button onClick={() => setIsRows(r => r + 1)}>+</button>
                   </div>
                </div>
                
                <div className="is-control-group">
                   <span className="is-label">Columns</span>
                   <div className="is-spinner">
                      <button onClick={() => setIsCols(c => Math.max(1, c - 1))}>−</button>
                      <input type="number" value={isCols} readOnly />
                      <button onClick={() => setIsCols(c => c + 1)}>+</button>
                   </div>
                </div>
             </div>
             
             <div className="is-checkbox-container">
                <label>
                   <input type="checkbox" checked={isMaintainRatio} onChange={(e) => setIsMaintainRatio(e.target.checked)} />
                   Maintain Aspect Ratio
                </label>
             </div>
             
             <div className="is-preview-container">
                {isImage ? (
                   <div className="is-image-wrapper">
                      <img src={isImage} alt="Split Preview" className={isMaintainRatio ? 'is-img-ratio' : ''} style={isMaintainRatio ? { aspectRatio: \`\${isCols} / \${isRows}\` } : {}} />
                      <div className="is-grid-overlay" style={{ gridTemplateRows: \`repeat(\${isRows}, 1fr)\`, gridTemplateColumns: \`repeat(\${isCols}, 1fr)\` }}>
                         {Array.from({ length: isRows * isCols }).map((_, i) => (
                            <div key={i} className="is-grid-cell"></div>
                         ))}
                      </div>
                   </div>
                ) : (
                   <div style={{ padding: '60px', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      Upload an image to see the grid preview
                   </div>
                )}
             </div>
             
             <div className="is-footer-note">
                Scroll Mouse Wheel To Zoom
             </div>
             
             <div className="is-actions">
                <button className="is-btn-outline" onClick={() => isInputRef.current.click()}>
                   <Upload size={16} /> Upload New Image
                </button>
                <button className="is-btn-primary" onClick={runImageSplitterDownload} disabled={processing || !isImage}>
                   Split
                </button>
             </div>
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Image Splitter UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
