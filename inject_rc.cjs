const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'circle-crop' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'round-corners-engine' ? (
        // ROUND CORNERS CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Round Corners on Image - Free Online Tool, No Upload</h1>
            <p style={{ color: '#6b7280' }}>Drop a photo. Drag the radius. Live preview. Save as PNG or JPG, transparent or solid background.</p>
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
             <div className="rc-workspace-grid">
                <div className="rc-preview-pane">
                   <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>Live Preview</h3>
                   <div style={{ 
                      width: '100%', 
                      height: '400px', 
                      backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3hF8RSMvGgwFgzG0kQEGAwMjw4GheXAwMA4aDAUDgzG0EQIAwQQC4Z1qWlUAAAAASUVORK5CYII=")',
                      backgroundRepeat: 'repeat',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: rcBackground === 'transparent' ? 'transparent' : (rcBackground === 'white' ? '#fff' : (rcBackground === 'black' ? '#000' : rcCustomColor))
                   }}>
                      <img 
                         src={previewUrl}
                         style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            display: 'block',
                            borderRadius: rcPerCorner 
                               ? \`\${rcCorners.tl}px \${rcCorners.tr}px \${rcCorners.br}px \${rcCorners.bl}px\` 
                               : \`\${rcRadius}px\`,
                            objectFit: 'contain'
                         }}
                         alt="Rounded Preview"
                      />
                   </div>
                </div>
                
                <div className="rc-controls-pane">
                   <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>Radius</h3>
                   
                   {!rcPerCorner && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                         <input 
                            type="range" 
                            min="0" 
                            max={rcMaxRadius} 
                            value={rcRadius} 
                            onChange={(e) => handleRcGlobalChange(parseInt(e.target.value, 10))}
                            style={{ flex: 1, accentColor: '#3b82f6' }}
                         />
                         <span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '14px', width: '48px' }}>{rcRadius} px</span>
                      </div>
                   )}
                   
                   {!rcPerCorner && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                         {['Sharp', '8 px', '16 px', '24 px', '32 px', '64 px', 'Circle'].map(preset => (
                            <button 
                               key={preset}
                               onClick={() => handleRcPreset(preset)}
                               style={{
                                  padding: '6px 12px',
                                  backgroundColor: 'white',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '16px',
                                  fontSize: '13px',
                                  color: '#374151',
                                  cursor: 'pointer'
                               }}
                            >
                               {preset}
                            </button>
                         ))}
                      </div>
                   )}
                   
                   <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4b5563', cursor: 'pointer', marginBottom: '24px' }}>
                      <input 
                         type="checkbox" 
                         checked={rcPerCorner} 
                         onChange={(e) => setRcPerCorner(e.target.checked)}
                      />
                      Per-corner control
                   </label>
                   
                   {rcPerCorner && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                         <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Top-left</label>
                            <input type="number" value={rcCorners.tl} onChange={(e) => setRcCorners({...rcCorners, tl: parseInt(e.target.value, 10) || 0})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                         </div>
                         <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Top-right</label>
                            <input type="number" value={rcCorners.tr} onChange={(e) => setRcCorners({...rcCorners, tr: parseInt(e.target.value, 10) || 0})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                         </div>
                         <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Bottom-left</label>
                            <input type="number" value={rcCorners.bl} onChange={(e) => setRcCorners({...rcCorners, bl: parseInt(e.target.value, 10) || 0})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                         </div>
                         <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Bottom-right</label>
                            <input type="number" value={rcCorners.br} onChange={(e) => setRcCorners({...rcCorners, br: parseInt(e.target.value, 10) || 0})} style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                         </div>
                      </div>
                   )}
                   
                   <div style={{ borderTop: '1px solid #e5e7eb', margin: '24px 0' }}></div>
                   
                   <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b5563', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>Background</h3>
                   <div style={{ marginBottom: '24px' }}>
                      <select 
                         value={rcBackground} 
                         onChange={(e) => setRcBackground(e.target.value)}
                         style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', backgroundColor: 'white' }}
                      >
                         <option value="transparent">Transparent (saves as PNG)</option>
                         <option value="white">White (saves as JPG)</option>
                         <option value="black">Black (saves as JPG)</option>
                         <option value="custom">Custom colour (saves as JPG)</option>
                      </select>
                      
                      {rcBackground === 'custom' && (
                         <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input 
                               type="color" 
                               value={rcCustomColor} 
                               onChange={(e) => setRcCustomColor(e.target.value)} 
                               style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#4b5563' }}>{rcCustomColor}</span>
                         </div>
                      )}
                   </div>
                   
                   <button 
                      onClick={runRoundCornersDownload} 
                      disabled={processing}
                      style={{ 
                         width: '100%', 
                         padding: '12px', 
                         backgroundColor: '#4f46e5', 
                         color: 'white', 
                         fontWeight: 'bold', 
                         borderRadius: '6px', 
                         border: 'none', 
                         cursor: 'pointer',
                         marginBottom: '16px'
                      }}
                   >
                      {processing ? 'Processing...' : 'Download rounded image'}
                   </button>
                   
                   <div style={{ textAlign: 'center' }}>
                      <button 
                         onClick={() => {
                            setPreviewUrl(null);
                            setSelectedFile(null);
                         }}
                         style={{
                            background: 'none',
                            border: 'none',
                            color: '#4f46e5',
                            fontWeight: '600',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '14px'
                         }}
                      >
                         Round a different image
                      </button>
                   </div>
                </div>
             </div>
          )}
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Round Corners UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
