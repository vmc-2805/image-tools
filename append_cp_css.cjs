const fs = require('fs');

const css = `
/* COLOR PICKER STYLES */
.cp-workspace {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .cp-workspace {
    flex-direction: column;
  }
}

.cp-image-col {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.cp-image-header {
  background-color: #e5e7eb;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  color: #4b5563;
  border-bottom: 1px solid #d1d5db;
}

.cp-image-container {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  cursor: crosshair;
}

.cp-image-container img {
  max-width: 100%;
  max-height: 500px;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.cp-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
}

.cp-loupe {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ffffff;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  transform: translate(-50%, -50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cp-loupe-dot {
  width: 6px;
  height: 6px;
  background-color: red;
  border-radius: 50%;
}

.cp-panel-col {
  width: 380px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .cp-panel-col {
    width: 100%;
  }
}

.cp-panel-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.cp-panel-header {
  background-color: #e5e7eb;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  color: #4b5563;
  border-bottom: 1px solid #d1d5db;
}

.cp-palette-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 16px;
}

.cp-palette-swatch {
  aspect-ratio: 1;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.1s;
}

.cp-palette-swatch:hover {
  transform: scale(1.1);
}

.cp-palette-swatch.empty {
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
  cursor: default;
}
.cp-palette-swatch.empty:hover {
  transform: none;
}

.cp-download-wrap {
  text-align: center;
  padding-bottom: 16px;
}

.cp-btn-outline {
  background-color: #ffffff;
  color: #5c6ac4;
  border: 1px solid #5c6ac4;
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
}

.cp-btn-outline:hover:not(:disabled) {
  background-color: #f9fafb;
}

.cp-btn-outline:disabled {
  border-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.cp-current-color-box {
  margin: 0 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  overflow: hidden;
}

.cp-color-preview {
  width: 120px;
  flex-shrink: 0;
}

.cp-color-info {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.cp-color-row {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.cp-color-label {
  color: #6b7280;
  width: 35px;
}

.cp-color-value {
  color: #111827;
  font-weight: 600;
  margin-right: 8px;
}

.cp-copy-icon {
  color: #9ca3af;
  cursor: pointer;
}

.cp-copy-icon:hover {
  color: #4b5563;
}

.cp-add-palette-btn {
  background: none;
  border: none;
  color: #5c6ac4;
  font-size: 13px;
  text-align: left;
  padding: 0;
  margin-top: 4px;
  cursor: pointer;
}

.cp-add-palette-btn:hover {
  text-decoration: underline;
}

.cp-upload-wrap {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.cp-btn-upload {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

.cp-btn-upload:hover {
  background-color: #e5e7eb;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Color Picker styles to index.css');
