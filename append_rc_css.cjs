const fs = require('fs');

const css = `
/* ROUND CORNERS STYLES */
.rc-workspace-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

@media (min-width: 768px) {
  .rc-workspace-grid {
    grid-template-columns: 1fr 320px;
  }
}

.rc-preview-pane {
  padding: 24px;
  border-right: 1px solid #e5e7eb;
}

.rc-controls-pane {
  padding: 24px;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Round Corners styles to index.css');
