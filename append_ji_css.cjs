const fs = require('fs');

const css = `
/* JOIN IMAGES STYLES */
.ji-upload-container {
  border: 2px dashed #93add1;
  border-radius: 4px;
  padding: 16px;
  background-color: #ffffff;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.ji-images-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-bottom: 16px;
}

.ji-image-card {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ji-image-wrapper {
  width: 100%;
  height: 150px;
  border: 1px solid #3b769f;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  overflow: hidden;
}

.ji-image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.ji-crop-btn {
  position: absolute;
  top: 4px;
  left: 4px;
  background-color: #3b769f;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 11px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ji-remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: transparent;
  color: #111827;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ji-filename {
  font-size: 12px;
  color: #4b5563;
  margin-top: 8px;
  text-align: center;
}

.ji-add-more-btn {
  width: 100%;
  background-color: #eef2ff;
  border: none;
  padding: 16px;
  color: #a5b4fc;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
}
.ji-add-more-btn:hover {
  background-color: #e0e7ff;
}

.ji-controls-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
}

.ji-control-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.ji-control-label {
  font-size: 14px;
  color: #374151;
  min-width: 80px;
  text-align: right;
}

.ji-radio-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #111827;
  cursor: pointer;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.ji-border-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: #4b5563;
}

.ji-join-btn {
  background-color: #4354a5;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Join Images styles to index.css');
