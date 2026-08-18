const fs = require('fs');

const css = `
/* DEEP FRYER STYLES */
.df-preset-btn {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.df-preset-btn:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.df-preset-btn.active {
  background-color: #0f766e;
  border-color: #0f766e;
  color: #ffffff;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Deep Fryer styles to index.css');
