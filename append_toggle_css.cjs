const fs = require('fs');

const css = `
/* Toggle Switch */
.ab-toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
.ab-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}
.ab-slider-round {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: .2s;
  border-radius: 20px;
}
.ab-slider-round:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .2s;
  border-radius: 50%;
}
input:checked + .ab-slider-round {
  background-color: #4f5b93;
}
input:checked + .ab-slider-round:before {
  transform: translateX(16px);
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Toggle CSS to index.css');
