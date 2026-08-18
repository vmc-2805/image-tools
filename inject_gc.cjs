const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      {/* 4. Loader Overlay Screen */}`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `
      {/* GLOBAL CROP MODAL */}
      {gcModalOpen && gcImageSrc && (
        <div style={{
           position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
           backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, 
           display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
           <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', width: '90%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                 <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Crop Image</h2>
                 <button onClick={() => setGcModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              
              <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', padding: '16px' }}>
                 <ReactCrop 
                    crop={gcCropState} 
                    onChange={(_, percentCrop) => setGcCropState(percentCrop)}
                 >
                    <img src={gcImageSrc} style={{ maxHeight: '60vh', display: 'block' }} alt="Crop preview" />
                 </ReactCrop>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
                 <button 
                    onClick={() => setGcModalOpen(false)}
                    style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
                 >
                    Cancel
                 </button>
                 <button 
                    onClick={applyGlobalCrop}
                    disabled={gcLoading || !gcCropState || gcCropState.width === 0}
                    style={{ padding: '8px 16px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                 >
                    {gcLoading ? 'Cropping...' : 'Apply Crop'}
                 </button>
              </div>
           </div>
        </div>
      )}
      
      {/* 4. Loader Overlay Screen */}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Global Crop UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
