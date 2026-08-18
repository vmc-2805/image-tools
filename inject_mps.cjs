const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'aspect-ratio-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'merge-photo-sig-engine' ? (
        // MERGE PHOTO & SIG CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Merge Photo and Signature</h1>
            <p style={{ color: '#6b7280' }}>Pi7 Image Tool - Create professional merged images for forms and documents instantly.</p>
          </div>
          
          <input type="file" ref={mpsPhotoInputRef} onChange={handleMpsPhotoChange} accept="image/*" style={{ display: 'none' }} />
          <input type="file" ref={mpsSigInputRef} onChange={handleMpsSigChange} accept="image/*" style={{ display: 'none' }} />
          
          {(!mpsPhoto || !mpsSig) ? (
             <div className="mps-initial-box">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px' }}>
                   <div style={{ width: '64px', height: '64px', backgroundColor: '#9ca3af', borderRadius: '50%', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '12px', left: '16px', width: '32px', height: '32px', backgroundColor: '#d1d5db', borderRadius: '50%' }}></div>
                      <div style={{ position: 'absolute', bottom: '0', left: '8px', width: '48px', height: '24px', backgroundColor: '#d1d5db', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}></div>
                   </div>
                   <button className="mps-btn-blue" onClick={() => mpsPhotoInputRef.current.click()}>Select Photo</button>
                </div>
                
                <div style={{ width: '80%', height: '1px', backgroundColor: '#d1d5db', margin: '0 auto' }}></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px' }}>
                   <div style={{ fontSize: '32px', color: '#9ca3af', fontFamily: 'cursive' }}>~</div>
                   <button className="mps-btn-blue" onClick={() => mpsSigInputRef.current.click()}>Select Signature</button>
                </div>
             </div>
          ) : (
             <div className="mps-workspace-grid">
                <div className="mps-preview-pane">
                   <div style={{ position: 'relative', marginBottom: '16px' }}>
                      <img src={mpsPhoto} style={{ width: '100%', display: 'block', border: '1px solid #e5e7eb' }} alt="Photo" />
                      <button className="mps-btn-blue mps-crop-overlay" onClick={() => showToast('Crop feature coming soon', 'info')}>
                         <Crop size={14} style={{ marginRight: '4px' }} /> Crop
                      </button>
                   </div>
                   
                   <div style={{ position: 'relative' }}>
                      <img src={mpsSig} style={{ width: '100%', display: 'block', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }} alt="Signature" />
                      <button className="mps-btn-blue mps-crop-overlay" onClick={() => showToast('Crop feature coming soon', 'info')}>
                         <Crop size={14} style={{ marginRight: '4px' }} /> Crop
                      </button>
                   </div>
                </div>
                
                <div className="mps-controls-pane">
                   <div style={{ marginBottom: '16px' }}>
                      <label className="mps-checkbox-label">
                         <input type="checkbox" checked={mpsOverlap} onChange={(e) => setMpsOverlap(e.target.checked)} />
                         Overlap signature on photo
                      </label>
                   </div>
                   
                   <div style={{ marginBottom: '24px' }}>
                      <label className="mps-checkbox-label">
                         <input type="checkbox" checked={mpsBorder} onChange={(e) => setMpsBorder(e.target.checked)} />
                         Add border on image
                      </label>
                   </div>
                   
                   <h3 style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>Set Width & Height</h3>
                   <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      {['CM', 'Inch', 'Pixel'].map(unit => (
                         <button 
                            key={unit}
                            onClick={() => setMpsUnit(unit.toLowerCase())}
                            className={\`mps-unit-btn \${mpsUnit === unit.toLowerCase() ? 'active' : ''}\`}
                         >
                            {unit}
                         </button>
                      ))}
                   </div>
                   
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                      <div>
                         <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>DPI</label>
                         <input type="number" value={mpsDpi} onChange={(e) => setMpsDpi(parseInt(e.target.value) || 200)} className="mps-input" style={{ width: '60px' }} />
                      </div>
                      <span style={{ color: '#6b7280', marginTop: '16px' }}>=</span>
                      <div>
                         <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Width ({mpsUnit})</label>
                         <input type="number" step="0.01" value={mpsWidth} onChange={(e) => setMpsWidth(parseFloat(e.target.value) || 0)} className="mps-input" style={{ width: '80px' }} />
                      </div>
                      <span style={{ color: '#6b7280', marginTop: '16px' }}>X</span>
                      <div>
                         <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Height ({mpsUnit})</label>
                         <input type="number" step="0.01" value={mpsHeight} onChange={(e) => setMpsHeight(parseFloat(e.target.value) || 0)} className="mps-input" style={{ width: '80px' }} />
                      </div>
                   </div>
                   
                   <div style={{ marginBottom: '24px' }}>
                      <label className="mps-checkbox-label">
                         <input type="checkbox" checked={mpsCompress} onChange={(e) => setMpsCompress(e.target.checked)} />
                         Compress image to specific size (ex. {mpsCompressSize}kb)
                      </label>
                   </div>
                   
                   <div style={{ borderTop: '1px solid #e5e7eb', margin: '24px -24px', padding: '24px 24px 0', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                      <button className="mps-btn-outline-red" onClick={clearMpsAll}>Clear All</button>
                      <button className="mps-btn-blue-solid" onClick={runMergeDownload} disabled={processing}>
                         {processing ? 'Processing...' : 'Download Image'}
                      </button>
                   </div>
                </div>
             </div>
          )}
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Merge Photo and Sig UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
