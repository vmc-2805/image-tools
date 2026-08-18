const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'crop-png-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'deep-fryer-engine' ? (
        // DEEP FRYER CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Deep Fryer Photo - Free Online Image Deep Fry Tool</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Pick an image. Hit a preset. Download your deep-fried meme. Runs in your browser.</p>
          </div>
          
          <input type="file" ref={dfInputRef} onChange={handleDfFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div className="df-workspace" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
             {/* Left Column */}
             <div className="df-image-col" style={{ flex: '1', minWidth: '300px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {dfCurrentImage ? (
                   <img src={dfCurrentImage} alt="Deep Fried Preview" style={{ maxWidth: '100%', maxHeight: '500px', display: 'block', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                ) : (
                   <div className="cp-upload-placeholder" style={{ minHeight: '300px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', cursor: 'pointer' }} onClick={() => dfInputRef.current.click()}>
                      <Upload size={48} style={{ marginBottom: '16px', color: '#9ca3af' }} />
                      <p style={{ fontSize: '18px', color: '#4b5563', margin: '0 0 8px 0' }}>Upload Image to Fry</p>
                   </div>
                )}
             </div>
             
             {/* Right Column */}
             <div className="df-panel-col" style={{ width: '350px', flexShrink: '0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Fry Level Card */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                   <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#6b7280', marginBottom: '12px', letterSpacing: '0.05em' }}>FRY LEVEL</div>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                      <button onClick={() => handleDfPreset('Mild', 25)} className={dfActivePreset === 'Mild' ? 'df-preset-btn active' : 'df-preset-btn'}>Mild</button>
                      <button onClick={() => handleDfPreset('Crispy', 50)} className={dfActivePreset === 'Crispy' ? 'df-preset-btn active' : 'df-preset-btn'}>Crispy</button>
                      <button onClick={() => handleDfPreset('Burnt', 75)} className={dfActivePreset === 'Burnt' ? 'df-preset-btn active' : 'df-preset-btn'}>Burnt</button>
                      <button onClick={() => handleDfPreset('Nuclear', 100)} className={dfActivePreset === 'Nuclear' ? 'df-preset-btn active' : 'df-preset-btn'}>Nuclear</button>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#4b5563' }}>
                      <span>Custom intensity</span>
                      <span style={{ fontWeight: 'bold', color: '#0f766e' }}>{dfIntensity}%</span>
                   </div>
                   <input type="range" min="0" max="100" value={dfIntensity} onChange={(e) => handleDfIntensityChange(Number(e.target.value))} style={{ width: '100%', accentColor: '#0f766e' }} />
                </div>
                
                {/* Actions Card */}
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                   <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#6b7280', marginBottom: '16px', letterSpacing: '0.05em' }}>ACTIONS</div>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <button onClick={downloadDfImage} disabled={!dfCurrentImage} style={{ backgroundColor: '#5c6ac4', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: dfCurrentImage ? 'pointer' : 'not-allowed', opacity: dfCurrentImage ? 1 : 0.5 }}>
                         Download
                      </button>
                      
                      <button onClick={handleDfFryAgain} disabled={!dfCurrentImage} style={{ backgroundColor: '#ffffff', color: '#5c6ac4', border: '1px solid #5c6ac4', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: dfCurrentImage ? 'pointer' : 'not-allowed', opacity: dfCurrentImage ? 1 : 0.5 }}>
                         Fry It Again
                      </button>
                   </div>
                   
                   <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                      <button onClick={handleDfReset} disabled={!dfOriginalImage} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: dfOriginalImage ? 'pointer' : 'not-allowed', fontSize: '14px', textDecoration: 'none' }}>
                         Reset to Original
                      </button>
                      
                      <button onClick={() => dfInputRef.current.click()} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', fontSize: '14px', textDecoration: 'none' }}>
                         Upload New Image
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Deep Fryer UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
