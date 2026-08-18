const fs = require('fs');

const css = `
/* FREEHAND CROP STYLES */
.fc-workspace {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.fc-header {
  background: #eef2ff;
  color: #4b5563;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
}

.fc-canvas-container {
  height: 400px;
  background: white;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
}

.fc-transform-layer {
  position: relative;
  transform-origin: center center;
  /* width and height are naturally determined by the image */
}

.fc-base-img {
  max-width: 350px;
  max-height: 350px;
  display: block;
  user-select: none;
}

.fc-svg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Let clicks pass through to img */
}

.fc-controls {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.fc-btn-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.fc-btn {
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  color: #1f2937;
  cursor: pointer;
}

.fc-btn:hover {
  background: #e5e7eb;
}

.fc-btn-primary {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.fc-btn-primary:hover {
  background: #4338ca;
}

.fc-btn-outline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: white;
  border: 1px solid #4f46e5;
  color: #4f46e5;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.fc-hint {
  text-align: center;
  color: #4f46e5;
  font-size: 12px;
  margin-top: 12px;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended freehand crop styles to index.css');
