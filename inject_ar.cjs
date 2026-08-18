const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'round-corners-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'aspect-ratio-engine' ? (
        // ASPECT RATIO CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Change Aspect Ratio of Image - Free Online Tool</h1>
            <p style={{ color: '#6b7280' }}>Pick a preset. Drag to crop. Download. Instagram, TikTok, YouTube ratios in one click.</p>
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
             <div className="ar-workspace-grid">
                <div className="ar-preview-pane">
                   <div style={{ 
                      width: '100%', 
                      height: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                   }}>
                      {arMode === 'pad' ? (
                         <div style={{ 
                            aspectRatio: arPreset === 'custom' ? \`\${arCustomW}/\${arCustomH}\` : arPreset.match(/\\((.*?)\\)/)?.[1]?.replace(':', '/') || arPreset.replace(':', '/'),
                            maxHeight: '100%',
                            maxWidth: '100%',
                            backgroundImage: arBackground === 'transparent' ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3hF8RSMvGgwFgzG0kQEGAwMjw4GheXAwMA4aDAUDgzG0EQIAwQQC4Z1qWlUAAAAASUVORK5CYII=")' : 'none',
                            backgroundRepeat: 'repeat',
                            backgroundColor: arBackground === 'transparent' ? 'transparent' : (arBackground === 'white' ? '#fff' : (arBackground === 'black' ? '#000' : arCustomBgColor)),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                         }}>
                            <img src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Padded Preview" />
                         </div>
                      ) : (
                         <ReactCrop 
                            crop={crop} 
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            aspect={getArParsedRatio()}
                         >
                            <img src={previewUrl} style={{ maxHeight: '400px', display: 'block' }} alt="Crop preview" />
                         </ReactCrop>
                      )}
                      
                      <div style={{ marginTop: '16px', color: '#6b7280', fontSize: '13px' }}>
                         Output: {getArTargetDimensions().width} x {getArTargetDimensions().height} px | Ratio: {arPreset === 'custom' ? \`\${arCustomW}:\${arCustomH}\` : arPreset}
                      </div>
                   </div>
                </div>
                
                <div className="ar-controls-pane">
                   <h3 className="ar-control-title">ASPECT RATIO</h3>
                   <select 
                      value={arPreset} 
                      onChange={(e) => setArPreset(e.target.value)}
                      className="ar-select"
                   >
                      <optgroup label="Social Media">
                         <option value="Instagram Post (1:1)">Instagram Post (1:1)</option>
                         <option value="Instagram Portrait (4:5)">Instagram Portrait (4:5)</option>
                         <option value="Instagram Story/Reel (9:16)">Instagram Story/Reel (9:16)</option>
                         <option value="TikTok (9:16)">TikTok (9:16)</option>
                         <option value="YouTube Thumbnail (16:9)">YouTube Thumbnail (16:9)</option>
                         <option value="YouTube Shorts (9:16)">YouTube Shorts (9:16)</option>
                         <option value="Twitter/X Post (16:9)">Twitter/X Post (16:9)</option>
                         <option value="LinkedIn Post (191:100)">LinkedIn Post (191:100)</option>
                         <option value="Pinterest Pin (2:3)">Pinterest Pin (2:3)</option>
                         <option value="Facebook Post (191:100)">Facebook Post (191:100)</option>
                         <option value="WhatsApp Status (9:16)">WhatsApp Status (9:16)</option>
                      </optgroup>
                      <optgroup label="Photo / Print">
                         <option value="Square 1:1 (1:1)">Square 1:1 (1:1)</option>
                         <option value="Portrait 4:5 (4:5)">Portrait 4:5 (4:5)</option>
                         <option value="Photo 3:2 (3:2)">Photo 3:2 (3:2)</option>
                         <option value="Photo 4:3 (4:3)">Photo 4:3 (4:3)</option>
                         <option value="Widescreen 16:9 (16:9)">Widescreen 16:9 (16:9)</option>
                         <option value="Ultrawide 21:9 (21:9)">Ultrawide 21:9 (21:9)</option>
                      </optgroup>
                      <option value="custom">Custom W:H...</option>
                   </select>
                   
                   {arPreset === 'custom' && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                         <input type="number" value={arCustomW} onChange={(e) => setArCustomW(parseInt(e.target.value) || 1)} className="ar-input" placeholder="W" />
                         <span style={{ alignSelf: 'center' }}>:</span>
                         <input type="number" value={arCustomH} onChange={(e) => setArCustomH(parseInt(e.target.value) || 1)} className="ar-input" placeholder="H" />
                      </div>
                   )}
                   
                   <h3 className="ar-control-title" style={{ marginTop: '24px' }}>CROP</h3>
                   <button 
                      className="ar-toggle-btn"
                      onClick={() => setArMode(arMode === 'pad' ? 'crop' : 'pad')}
                   >
                      {arMode === 'pad' ? 'Adjust crop' : 'Fit with padding'}
                   </button>
                   <p className="ar-control-desc">
                      {arMode === 'pad' ? 'Full image with background padding' : 'Crop to fill aspect ratio completely'}
                   </p>
                   
                   {arMode === 'pad' && (
                      <>
                         <h3 className="ar-control-title" style={{ marginTop: '24px' }}>BACKGROUND</h3>
                         <select 
                            value={arBackground} 
                            onChange={(e) => setArBackground(e.target.value)}
                            className="ar-select"
                         >
                            <option value="transparent">Transparent</option>
                            <option value="white">White</option>
                            <option value="black">Black</option>
                            <option value="custom">Custom colour</option>
                         </select>
                         
                         {arBackground === 'custom' && (
                            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                               <input 
                                  type="color" 
                                  value={arCustomBgColor} 
                                  onChange={(e) => setArCustomBgColor(e.target.value)} 
                                  style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                               />
                               <span style={{ fontSize: '14px', color: '#4b5563' }}>{arCustomBgColor}</span>
                            </div>
                         )}
                      </>
                   )}
                   
                   <h3 className="ar-control-title" style={{ marginTop: '24px' }}>FORMAT</h3>
                   <div style={{ display: 'flex', gap: '8px' }}>
                      {['JPG', 'PNG', 'WEBP'].map(fmt => (
                         <button 
                            key={fmt}
                            onClick={() => setArFormat(fmt)}
                            className={\`ar-format-btn \${arFormat === fmt ? 'active' : ''}\`}
                         >
                            {fmt}
                         </button>
                      ))}
                   </div>
                   
                   <h3 className="ar-control-title" style={{ marginTop: '24px' }}>ACTIONS</h3>
                   <button 
                      onClick={runAspectRatioDownload} 
                      disabled={processing}
                      className="ar-download-btn"
                   >
                      {processing ? 'Processing...' : 'Download'}
                   </button>
                   
                   <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <button 
                         onClick={() => {
                            setPreviewUrl(null);
                            setSelectedFile(null);
                         }}
                         className="ar-link-btn"
                      >
                         Upload New Image
                      </button>
                   </div>
                </div>
             </div>
          )}
          
          <div style={{ marginTop: '48px', color: '#4b5563', lineHeight: 1.6, textAlign: 'left', maxWidth: '800px', margin: '48px auto 0' }}>
             <p>Pi7 Change Aspect Ratio tool turns your image into any shape in one click. Pick a preset for Instagram, TikTok, YouTube, or 14 other platforms. Or type your own W:H. See the whole image with padding by default. Or drag to crop to just the part you want. Download as JPG, PNG, or WebP. Everything runs in your browser. No signup. No upload. No watermark.</p>
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Aspect Ratio UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
