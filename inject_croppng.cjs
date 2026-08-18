const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'image-splitter-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'crop-png-engine' ? (
        // CROP PNG CUSTOM UI
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Crop PNG Online with Perfect Quality & Transparency</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Welcome to Pi7 Image Tool - Clean PNG cropping with original transparency intact.</p>
          </div>
          
          <input type="file" ref={pngCropInputRef} onChange={handleCropPngFileChange} accept="image/png, image/*" style={{ display: 'none' }} />
          
          <div className="crop-png-workspace">
             {pngCropImage ? (
                <div style={{ textAlign: 'center' }}>
                   <div style={{ display: 'inline-block', position: 'relative' }}>
                      <ReactCrop 
                         crop={pngCropState} 
                         onChange={(_, percentCrop) => setPngCropState(percentCrop)}
                         aspect={pngMaintainRatio ? 1 : undefined}
                      >
                         <img src={pngCropImage} alt="Crop preview" style={{ maxHeight: '500px', display: 'block', backgroundColor: 'transparent', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'20\\' height=\\'20\\'%3E%3Crect width=\\'10\\' height=\\'10\\' fill=\\'%23e5e5f7\\'%3E%3C/rect%3E%3Crect x=\\'10\\' width=\\'10\\' height=\\'10\\' fill=\\'%23ffffff\\'%3E%3C/rect%3E%3Crect y=\\'10\\' width=\\'10\\' height=\\'10\\' fill=\\'%23ffffff\\'%3E%3C/rect%3E%3Crect x=\\'10\\' y=\\'10\\' width=\\'10\\' height=\\'10\\' fill=\\'%23e5e5f7\\'%3E%3C/rect%3E%3C/svg%3E")' }} />
                      </ReactCrop>
                   </div>
                   
                   <div style={{ margin: '16px 0', fontSize: '14px', color: '#4b5563' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                         Maintain Aspect Ratio 
                         <input type="checkbox" checked={pngMaintainRatio} onChange={(e) => setPngMaintainRatio(e.target.checked)} />
                      </label>
                   </div>
                   
                   <div style={{ fontSize: '13px', color: '#5c6ac4', marginBottom: '24px' }}>
                      Tip:- Scroll Mouse Wheel For Zoom In & Zoom Out
                   </div>
                </div>
             ) : (
                <div className="cp-upload-placeholder" style={{ minHeight: '300px', backgroundColor: '#f9fafb', border: '2px dashed #d1d5db', borderRadius: '8px', marginBottom: '24px' }} onClick={() => pngCropInputRef.current.click()}>
                   <Upload size={48} style={{ marginBottom: '16px', color: '#9ca3af' }} />
                   <p style={{ fontSize: '18px', color: '#4b5563', margin: '0 0 8px 0' }}>Upload PNG Image</p>
                   <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Click to browse</p>
                </div>
             )}
             
             <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
                <button className="cp-btn-outline" style={{ padding: '10px 24px', fontSize: '15px', fontWeight: '500' }} onClick={() => pngCropInputRef.current.click()}>
                   + Select Another Image
                </button>
                <button className="is-btn-primary" style={{ padding: '10px 24px', fontSize: '15px' }} onClick={runCropPngDownload} disabled={processing || !pngCropImage}>
                   Crop & Download
                </button>
             </div>
             
             <div style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
                Use our easy online tool to <a href="#" style={{ color: '#5c6ac4', textDecoration: 'none' }}>crop PNG in circle</a> and create perfect round images in seconds.
             </div>
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Crop PNG UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
