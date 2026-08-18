const fs = require('fs');

const css = `
/* ADD NAME & DATE STYLES */
.nd-step2-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}

@media (min-width: 768px) {
  .nd-step2-grid {
    grid-template-columns: 350px 1fr;
  }
}

.nd-preview-container {
  padding: 24px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.nd-controls-container {
  padding: 24px;
  text-align: left;
}

.nd-input-group fieldset {
  background: white;
}

.nd-input-group input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
.nd-input-group input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Add Name & Date styles to index.css');
