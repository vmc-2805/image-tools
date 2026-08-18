const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `      ) : activeTool.engine === 'merge-photo-sig-engine' ? (`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `      ) : activeTool.engine === 'join-images-engine' ? (
        // JOIN IMAGES CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Join Images Online: Free & Easy Photo Merger</h1>
          </div>
          
          <input type="file" ref={jiFileInputRef} onChange={handleJiFileChange} accept="image/*" multiple style={{ display: 'none' }} />
          
          <div className="ji-upload-container">
             <div className="ji-images-grid">
                {jiFiles.map((fileObj) => (
                   <div key={fileObj.id} className="ji-image-card">
                      <div className="ji-image-wrapper">
                         <img src={fileObj.url} alt={fileObj.name} />
                         <button className="ji-crop-btn" onClick={() => showToast('Crop feature coming soon', 'info')}>
                            <Crop size={14} style={{ marginRight: '4px' }} /> Crop
                         </button>
                         <button className="ji-remove-btn" onClick={() => removeJiFile(fileObj.id)}>
                            <X size={16} />
                         </button>
                      </div>
                      <div className="ji-filename" title={fileObj.name}>
                         {fileObj.name.length > 25 ? fileObj.name.substring(0, 22) + '...' : fileObj.name}
                      </div>
                   </div>
                ))}
             </div>
             
             <button className="ji-add-more-btn" onClick={() => jiFileInputRef.current.click()}>
                <div style={{ fontSize: '24px', fontWeight: '300', marginBottom: '4px' }}>+</div>
                ADD MORE
             </button>
          </div>
          
          <div className="ji-controls-container">
             <div className="ji-control-row">
                <span className="ji-control-label">Direction:</span>
                <label className="ji-radio-label">
                   <input 
                      type="radio" 
                      name="jiDirection" 
                      checked={jiDirection === 'horizontal'} 
                      onChange={() => setJiDirection('horizontal')} 
                   /> 
                   <span style={{ marginLeft: '4px' }}>↔ Horizontal</span>
                </label>
                <label className="ji-radio-label">
                   <input 
                      type="radio" 
                      name="jiDirection" 
                      checked={jiDirection === 'vertical'} 
                      onChange={() => setJiDirection('vertical')} 
                   /> 
                   <span style={{ marginLeft: '4px' }}>↕ Vertical</span>
                </label>
             </div>
             
             <div className="ji-control-row">
                <span className="ji-control-label">Arrange :</span>
                <label className="ji-radio-label">
                   <input 
                      type="radio" 
                      name="jiArrange" 
                      checked={jiArrange === 'proper'} 
                      onChange={() => setJiArrange('proper')} 
                   /> 
                   <span style={{ marginLeft: '4px' }}>Proper Align</span>
                </label>
                <label className="ji-radio-label">
                   <input 
                      type="radio" 
                      name="jiArrange" 
                      checked={jiArrange === 'free'} 
                      onChange={() => setJiArrange('free')} 
                   /> 
                   <span style={{ marginLeft: '4px' }}>Free Style</span>
                </label>
             </div>
             
             <div className="ji-border-controls">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                   Add Border To Images 
                   <input 
                      type="checkbox" 
                      checked={jiBorder} 
                      onChange={(e) => setJiBorder(e.target.checked)} 
                   />
                </label>
                
                {jiBorder && (
                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>Color:</span>
                         <div style={{ position: 'relative', width: '24px', height: '24px', borderRadius: '50%', border: '1px solid #d1d5db', overflow: 'hidden' }}>
                            <input 
                               type="color" 
                               value={jiBorderColor} 
                               onChange={(e) => setJiBorderColor(e.target.value)}
                               style={{ position: 'absolute', top: '-10px', left: '-10px', width: '44px', height: '44px', cursor: 'pointer' }}
                            />
                         </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>Size:</span>
                         <input 
                            type="number" 
                            value={jiBorderSize} 
                            onChange={(e) => setJiBorderSize(parseInt(e.target.value) || 0)}
                            style={{ width: '50px', padding: '2px 4px', border: '1px solid #d1d5db', borderRadius: '2px' }}
                         />
                      </div>
                   </div>
                )}
             </div>
             
             <button className="ji-join-btn" onClick={runJoinImagesDownload} disabled={processing}>
                {processing ? 'Processing...' : 'Join Images'}
             </button>
          </div>
        </div>
${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Join Images UI.");
} else {
    console.log("Target string not found in App.jsx.");
}
