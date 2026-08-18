const fs = require('fs');

const css = `
/* DEEP FRYER CUSTOM SLIDER */
.df-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 4px;
  outline: none;
}

.df-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0f766e;
  border: 3px solid #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  cursor: pointer;
}

.df-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #0f766e;
  border: 3px solid #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  cursor: pointer;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Deep Fryer slider styles to index.css');
