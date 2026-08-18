const fs = require('fs');

const css = `
/* IMAGE SPLITTER STYLES */
.is-workspace {
  max-width: 450px;
  margin: 0 auto;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.is-header {
  background-color: #e5e7eb;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  color: #4b5563;
  border-bottom: 1px solid #d1d5db;
}

.is-controls {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 16px;
  background-color: #ffffff;
}

.is-control-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.is-label {
  font-size: 14px;
  color: #374151;
}

.is-spinner {
  display: flex;
  border: 1px solid #9ca3af;
  border-radius: 4px;
  overflow: hidden;
}

.is-spinner button {
  background-color: #9ca3af;
  color: white;
  border: none;
  width: 32px;
  height: 28px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.is-spinner button:hover {
  background-color: #6b7280;
}

.is-spinner input {
  width: 40px;
  text-align: center;
  border: none;
  border-left: 1px solid #9ca3af;
  border-right: 1px solid #9ca3af;
  font-size: 14px;
  outline: none;
}

.is-checkbox-container {
  text-align: center;
  padding-bottom: 16px;
  font-size: 14px;
  color: #4b5563;
}

.is-checkbox-container label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.is-preview-container {
  background-color: #9ca3af;
  background-image: linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
                    linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
                    linear-gradient(-45deg, transparent 75%, #cbd5e1 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.is-image-wrapper {
  position: relative;
  max-width: 100%;
  max-height: 450px;
  display: flex;
}

.is-image-wrapper img {
  max-width: 100%;
  max-height: 450px;
  display: block;
  object-fit: contain;
}

.is-image-wrapper img.is-img-ratio {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.is-grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  pointer-events: none;
}

.is-grid-cell {
  border: 1px dashed #3b82f6;
  position: relative;
}

/* To avoid double borders visually, we only render top and left dashed borders on cells */
.is-grid-cell {
  border-top: 1px dashed #3b82f6;
  border-left: 1px dashed #3b82f6;
  border-right: none;
  border-bottom: none;
}
/* But the very right/bottom edges need borders to close the grid */
.is-grid-overlay {
  border-right: 1px dashed #3b82f6;
  border-bottom: 1px dashed #3b82f6;
}

.is-footer-note {
  text-align: center;
  font-size: 13px;
  color: #3b82f6;
  padding: 12px;
  background-color: #ffffff;
}

.is-actions {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.is-btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #9ca3af;
  border-radius: 4px;
  background-color: #ffffff;
  color: #4b5563;
  font-size: 14px;
  cursor: pointer;
}

.is-btn-outline:hover {
  background-color: #f3f4f6;
}

.is-btn-primary {
  padding: 8px 32px;
  background-color: #5c6ac4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.is-btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Image Splitter styles to index.css');
