const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'deep-fryer-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'unblur-engine' ? (
        // UNBLUR CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Unblur Image Online Free</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Pi7 Image Tool - Turn Blurry Photos Into Clear Memories.</p>
          </div>
          
          <input type="file" ref={ubInputRef} onChange={handleUbFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
             {/* Left Column - Preview */}
             <div style={{ flex: '1', backgroundColor: '#ffffff', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                {ubOriginalImage ? (
                   <img 
                      src={ubShowOriginal ? ubOriginalImage : (ubEnhancedImage || ubOriginalImage)} 
                      alt="Unblur Preview" 
                      style={{ maxWidth: '100%', maxHeight: '500px', display: 'block' }} 
                   />
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <Upload size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                      <p>Preview will appear here</p>
                   </div>
                )}
             </div>
             
             {/* Right Column - Actions */}
             <div style={{ width: '320px', backgroundColor: '#f3f4f6', padding: '24px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '15px', color: '#4b5563', marginBottom: '16px' }}>
                   {ubEnhancedImage ? 'Image Restored' : 'Upload Image'}
                </div>
                
                <button 
                   onClick={() => ubInputRef.current.click()} 
                   style={{ width: '100%', backgroundColor: '#ffffff', color: '#5c6ac4', border: '1px solid #5c6ac4', padding: '10px', borderRadius: '2px', fontSize: '14px', cursor: 'pointer', marginBottom: '16px' }}
                >
                   + New Image
                </button>
                
                <button 
                   onClick={handleUbDownload} 
                   disabled={!ubEnhancedImage} 
                   style={{ width: '100%', backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '2px', fontSize: '14px', cursor: ubEnhancedImage ? 'pointer' : 'not-allowed', opacity: ubEnhancedImage ? 1 : 0.5, marginBottom: '24px' }}
                >
                   Download Image <span style={{ fontSize: '11px', fontWeight: 'normal' }}>(Watch Ad)</span>
                </button>
                
                {ubEnhancedImage && (
                   <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280', cursor: 'pointer' }}>
                      <input type="checkbox" checked={ubShowOriginal} onChange={(e) => setUbShowOriginal(e.target.checked)} />
                      Preview Orignal Image
                   </label>
                )}
                
                <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
                   <button 
                      onClick={handleUbReset}
                      style={{ background: 'none', border: 'none', color: '#ef4444', textDecoration: 'underline', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                   >
                      Delete Image From Server <span style={{ textDecoration: 'none', border: '1px solid #ef4444', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>i</span>
                   </button>
                </div>
             </div>
          </div>
          
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
             Blurry photo? Don't worry - Pi7 Image Tool has your back. With our AI-powered unblur image tool, you can bring back sharpness and detail in just seconds. No complex steps, no software downloads - simply upload your image, and our system will automatically remove blur and enhance resolution with precision.
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Unblur Image UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
