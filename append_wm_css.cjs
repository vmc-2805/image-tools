const fs = require('fs');

const css = `
/* WATERMARK TOOL STYLES */
.wm-workspace {
  display: flex;
  gap: 32px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.wm-preview-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.wm-sidebar {
  width: 320px;
  background: #f3f4f6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.wm-preview-container {
  position: relative;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: inline-block;
  margin: 0 auto;
  overflow: hidden; /* Needed for grid effect */
}

.wm-base-img {
  max-width: 100%;
  max-height: 60vh;
  display: block;
}

.wm-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  cursor: grab;
  user-select: none;
}

.wm-overlay:active {
  cursor: grabbing;
}

.wm-overlay.active {
  outline: 1px dashed #f59e0b;
}

.wm-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #f59e0b;
  background: transparent;
}

.wm-handle-tl { top: -5px; left: -5px; cursor: nwse-resize; }
.wm-handle-tr { top: -5px; right: -5px; cursor: nesw-resize; }
.wm-handle-bl { bottom: -5px; left: -5px; cursor: nesw-resize; }
.wm-handle-br { bottom: -5px; right: -5px; cursor: nwse-resize; }
.wm-handle-rotate { top: -20px; left: calc(50% - 5px); cursor: ew-resize; border-radius: 50%; background: #f59e0b; }

.wm-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
}

.wm-tab {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: none;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.wm-tab.active {
  background: white;
  color: #1f2937;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.wm-tab-close {
  padding: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wm-tab-content {
  padding: 24px;
  flex: 1;
}

.wm-logo-thumb {
  width: 80px;
  height: 60px;
  background: #c7d2fe;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
}

.wm-logo-thumb.active {
  border-color: #6366f1;
}

.wm-logo-thumb img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
}

.wm-logo-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.wm-logo-add {
  width: 80px;
  height: 60px;
  background: white;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.wm-control-group {
  margin-bottom: 20px;
}

.wm-control-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #4b5563;
}

.wm-control-group input[type="range"] {
  width: 100%;
}

.wm-text-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
}

.wm-text-item.active {
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.wm-color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wm-color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid rgba(0,0,0,0.1);
}

.wm-color-swatch.transparent {
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%);
  background-size: 10px 10px;
  background-position: 0 0, 5px 0, 5px -5px, 0px 5px;
}

.wm-color-picker-btn {
  width: 24px; 
  height: 24px; 
  padding: 0; 
  border: none; 
  cursor: pointer;
  background: transparent;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended watermark styles to index.css');
