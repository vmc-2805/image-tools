const fs = require('fs');

const css = `
/* ASPECT RATIO STYLES */
.ar-workspace-grid {
  display: grid;
  grid-template-columns: 1fr;
  background: white;
  border: 1px solid #e5e7eb;
}

@media (min-width: 768px) {
  .ar-workspace-grid {
    grid-template-columns: 1fr 320px;
  }
}

.ar-preview-pane {
  padding: 24px;
  border-right: 1px solid #e5e7eb;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ar-controls-pane {
  padding: 24px;
}

.ar-control-title {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 1px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.ar-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  color: #374151;
}

.ar-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.ar-toggle-btn {
  width: 100%;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.ar-control-desc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 8px;
}

.ar-format-btn {
  flex: 1;
  padding: 6px;
  background-color: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
}

.ar-format-btn.active {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #111827;
}

.ar-download-btn {
  width: 100%;
  padding: 12px;
  background-color: #4f46e5;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.ar-link-btn {
  background: none;
  border: none;
  color: #4b5563;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}
.ar-link-btn:hover {
  text-decoration: underline;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Aspect Ratio styles to index.css');
