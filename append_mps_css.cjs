const fs = require('fs');

const css = `
/* MERGE PHOTO & SIG STYLES */
.mps-initial-box {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
}

.mps-workspace-grid {
  display: grid;
  grid-template-columns: 1fr;
  background: white;
  border: 1px solid #e5e7eb;
}

@media (min-width: 768px) {
  .mps-workspace-grid {
    grid-template-columns: 300px 1fr;
  }
}

.mps-preview-pane {
  padding: 24px;
  border-right: 1px solid #e5e7eb;
  background-color: #ffffff;
}

.mps-controls-pane {
  padding: 24px;
  background-color: #f9fafb;
}

.mps-btn-blue {
  padding: 8px 16px;
  background-color: #3b769f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.mps-crop-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.mps-checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
}

.mps-unit-btn {
  padding: 6px 16px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

.mps-unit-btn.active {
  border-color: #4f46e5;
  color: #4f46e5;
  background-color: #eef2ff;
}

.mps-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.mps-btn-outline-red {
  padding: 10px 24px;
  background-color: transparent;
  color: #e11d48;
  border: 1px solid #e11d48;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.mps-btn-blue-solid {
  padding: 10px 24px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Merge Photo & Sig styles to index.css');
