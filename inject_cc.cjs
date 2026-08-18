const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'add-name-date' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'circle-crop' ? (
        // CIRCLE CROP CUSTOM UI
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Circle Crop Your Images Online</h1>
          </div>
          
          {!previewUrl ? (
             <div className="upload-box" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div 
                  className="dropzone"
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files[0]) handleFileLoad(e.dataTransfer.files[0]);
                  }}
                >
                  <Upload size={48} className="upload-icon" />
                  <h3>Click to upload an image</h3>
                  <p>Or drag and drop</p>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
             </div>
          ) : (
             <div style={{ textAlign: 'center' }}>
                <div 
                   ref={ccImgContainerRef}
                   onWheel={handleCcWheel}
                   style={{ 
                      display: 'inline-block', 
                      backgroundColor: '#e5e7eb', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      marginBottom: '16px',
                      overflow: 'hidden'
                   }}
                >
                   <ReactCrop 
                      crop={crop} 
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      circularCrop={true}
                      aspect={ccMaintainAspect ? 1 : undefined}
                   >
                      <img 
                         src={previewUrl} 
                         style={{ 
                            maxHeight: '400px', 
                            display: 'block', 
                            maxWidth: '100%',
                            transform: \`scale(\${ccZoom})\`,
                            transformOrigin: 'center center',
                            transition: 'transform 0.1s ease-out'
                         }} 
                         alt="Crop preview" 
                      />
                   </ReactCrop>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                   <label style={{ color: '#4f46e5', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Maintain Aspect Ratio 
                      <input 
                         type="checkbox" 
                         checked={ccMaintainAspect}
                         onChange={(e) => setCcMaintainAspect(e.target.checked)}
                      />
                   </label>
                   
                   <label style={{ color: '#4f46e5', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Image Border 
                      <input 
                         type="checkbox" 
                         checked={ccImageBorder}
                         onChange={(e) => setCcImageBorder(e.target.checked)}
                      />
                   </label>
                   
                   <p style={{ color: '#6b7280', fontSize: '13px', margin: '8px 0 0 0' }}>
                      Tip:- Scroll Mouse Wheel For Zoom In & Zoom Out
                   </p>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                   <button 
                      onClick={() => {
                         setPreviewUrl(null);
                         setSelectedFile(null);
                         setCrop(null);
                         setCcZoom(1);
                      }} 
                      style={{ 
                         padding: '10px 20px', 
                         backgroundColor: 'white', 
                         color: '#4f46e5', 
                         border: '2px solid #4f46e5', 
                         borderRadius: '6px', 
                         fontWeight: 'bold',
                         cursor: 'pointer'
                      }}
                   >
                      + Select Another Image
                   </button>
                   
                   <button 
                      className="primary-btn" 
                      onClick={runCircleCropDownload} 
                      disabled={processing} 
                      style={{ backgroundColor: '#4f46e5' }}
                   >
                      {processing ? 'Processing...' : 'Crop & Download'}
                   </button>
                </div>
                
                <div style={{ marginTop: '48px', color: '#4b5563', lineHeight: 1.6, textAlign: 'left', maxWidth: '800px', margin: '48px auto 0' }}>
                   <p>Welcome to Pi7 Image Tool - your go-to destination for effortless image editing! Are you ready to add a creative twist to your pictures? Our user-friendly online tool offers a unique feature: circle cropping. Easily transform your images into captivating circular frames with just a few clicks.</p>
                </div>
             </div>
          )}
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Circle Crop UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
