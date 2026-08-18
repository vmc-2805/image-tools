const fs = require('fs');

const css = `
/* ADD BORDER TOOL CSS */
.ab-grid-bg {
  background-image: 
    linear-gradient(to right, #f3f4f6 1px, transparent 1px),
    linear-gradient(to bottom, #f3f4f6 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #ffffff;
}

.ab-grid-btn {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.ab-grid-btn:hover {
  border-color: #9ca3af;
  background-color: #f9fafb;
}

.ab-grid-btn.active {
  border-color: #4f5b93;
  color: #4f5b93;
  background-color: #f0f2f9;
}

.ab-format-btn {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  color: #4f5b93;
  padding: 6px 0;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
}
.ab-format-btn.active {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #374151;
}

/* Preset Miniature Icons */
.ab-icon-preview {
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e5e7eb;
}
.ab-icon-preview.ab-classic { border: 4px solid black; outline: 2px solid white; outline-offset: -6px; }
.ab-icon-preview.ab-golden { border: 4px solid #d4af37; }
.ab-icon-preview.ab-double { border: 1px solid black; outline: 3px solid white; outline-offset: -4px; background: black; }
.ab-icon-preview.ab-vintage { border: 4px solid #f4ecd8; outline: 1px solid #8b7355; outline-offset: -4px; }
.ab-icon-preview.ab-polaroid { border: 4px solid white; border-bottom-width: 10px; box-shadow: 0 0 2px rgba(0,0,0,0.3); }
.ab-icon-preview.ab-white { border: 4px solid white; box-shadow: 0 0 2px rgba(0,0,0,0.1); }
.ab-icon-preview.ab-film { border: 4px solid #111; border-left: none; border-right: none; }
.ab-icon-preview.ab-minimal { border: 2px solid #9ca3af; }
.ab-icon-preview.ab-bold { border: 6px solid black; }

/* Custom Slider */
.ab-slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  outline: none;
}
.ab-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4f5b93;
  cursor: pointer;
}
`;

fs.appendFileSync('src/index.css', css);
console.log('Appended Add Border CSS to index.css');
