const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'freehand-crop' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'add-name-date' ? (
        // ADD NAME DATE CUSTOM UI
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Add Name & Date to Photos Online</h1>
            <p style={{ color: '#6b7280' }}>Welcome to Pi7 Image Tool - Your Go-To Solution to Add Name and Date on Photos!</p>
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
          ) : ndStep === 1 ? (
             <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-block', backgroundColor: '#e5e7eb', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                   <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)}>
                      <img src={previewUrl} style={{ maxHeight: '400px', display: 'block', maxWidth: '100%' }} alt="Crop preview" />
                   </ReactCrop>
                </div>
                <div>
                   <button className="primary-btn" onClick={handleNdCropNext} disabled={processing} style={{ backgroundColor: '#4f46e5' }}>
                      {processing ? 'Processing...' : 'Crop & Next'}
                   </button>
                </div>
             </div>
          ) : (
             <div className="nd-step2-grid">
                <div className="nd-preview-container">
                   <div className="nd-preview-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={ndCroppedImg} style={{ maxWidth: '100%', display: 'block', border: '1px solid #d1d5db' }} alt="Cropped" />
                      
                      {/* Live preview overlay for white box */}
                      <div style={{
                         position: ndAddWhiteSpace ? 'relative' : 'absolute',
                         bottom: 0,
                         left: 0,
                         width: '100%',
                         minHeight: '40px',
                         height: '15%',
                         backgroundColor: 'white',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         justifyContent: 'center',
                         boxSizing: 'border-box',
                         border: ndAddWhiteSpace ? '1px solid #d1d5db' : 'none',
                         borderTop: 'none',
                         padding: '4px'
                      }}>
                         {ndName && (
                            <div style={{ color: ndNameColor, fontWeight: 'bold', fontSize: \`\${ndNameSize}px\`, lineHeight: 1.2 }}>
                               {ndName}
                            </div>
                         )}
                         {ndDate && (
                            <div style={{ color: ndDateColor, fontWeight: 'bold', fontSize: \`\${ndDateSize}px\`, lineHeight: 1.2 }}>
                               {ndDate}
                            </div>
                         )}
                      </div>
                   </div>
                </div>
                
                <div className="nd-controls-container">
                   <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#4b5563' }}>Add Name & Date On Image</h3>
                   
                   <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: '#6b7280', fontSize: '14px', cursor: 'pointer' }}>
                      <input 
                         type="checkbox" 
                         checked={ndAddWhiteSpace}
                         onChange={(e) => setNdAddWhiteSpace(e.target.checked)}
                      />
                      Add Extra White Space On Bottom
                   </label>
                   
                   <div className="nd-input-group">
                      <fieldset style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '12px', margin: 0 }}>
                         <legend style={{ color: '#6b7280', fontSize: '14px', padding: '0 4px' }}>Name on Image</legend>
                         <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                               type="text" 
                               value={ndName} 
                               onChange={(e) => setNdName(e.target.value)}
                               style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                            <input 
                               type="number" 
                               value={ndNameSize}
                               onChange={(e) => setNdNameSize(e.target.value)}
                               style={{ width: '60px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                            <input 
                               type="color" 
                               value={ndNameColor}
                               onChange={(e) => setNdNameColor(e.target.value)}
                               style={{ width: '36px', height: '36px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '50%', overflow: 'hidden' }}
                            />
                         </div>
                      </fieldset>
                   </div>
                   
                   <div className="nd-input-group" style={{ marginTop: '16px' }}>
                      <fieldset style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '12px', margin: 0 }}>
                         <legend style={{ color: '#6b7280', fontSize: '14px', padding: '0 4px' }}>Date on Image</legend>
                         <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                               type="text" 
                               value={ndDate} 
                               onChange={(e) => setNdDate(e.target.value)}
                               style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                            <input 
                               type="number" 
                               value={ndDateSize}
                               onChange={(e) => setNdDateSize(e.target.value)}
                               style={{ width: '60px', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                            <input 
                               type="color" 
                               value={ndDateColor}
                               onChange={(e) => setNdDateColor(e.target.value)}
                               style={{ width: '36px', height: '36px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '50%', overflow: 'hidden' }}
                            />
                         </div>
                      </fieldset>
                   </div>
                   
                   <div style={{ marginTop: '24px' }}>
                      <button className="primary-btn" onClick={runNdDownload} disabled={processing} style={{ backgroundColor: '#4f46e5' }}>
                         {processing ? 'Processing...' : 'Save & Next'}
                      </button>
                   </div>
                </div>
             </div>
          )}
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Add Name Date UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
