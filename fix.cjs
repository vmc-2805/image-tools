const fs = require('fs');
const css = fs.readFileSync('src/index.css', 'utf8');
const lines = css.split('\n');
const cleanCss = lines.slice(0, 1659).join('\n');
fs.writeFileSync('src/index.css', cleanCss + `
/* FLIP IMAGE STYLES */
.flip-container {
  background: #e5e5e5;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.flip-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  border: 1px solid var(--danger);
  color: var(--danger);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.flip-close-btn:hover {
  background: var(--danger);
  color: white;
}

.flip-image-wrapper {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.flip-preview-img {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.flip-toolbar {
  background: white;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-top: 1px solid var(--border-color);
}

.flip-tool-btn {
  background: white;
  border: 1px solid #d1d5db;
  color: var(--text-primary);
  border-radius: 4px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.flip-tool-btn:hover {
  background: #f3f4f6;
}

.flip-tool-btn.active {
  background: #e0e7ff;
  border-color: var(--primary);
  color: var(--primary);
}

.flip-divider {
  width: 1px;
  height: 24px;
  background: #d1d5db;
  margin: 0 8px;
}

.add-more-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 40px;
  margin-bottom: 40px;
}

.add-more-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e0e7ff;
  color: var(--primary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.add-more-btn:hover {
  background: #c7d2fe;
  transform: scale(1.05);
}

.add-more-container span {
  color: var(--text-secondary);
  font-size: 14px;
}
`);
console.log("Truncated and fixed!");
