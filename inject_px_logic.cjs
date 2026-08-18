const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `  // ENGINE U: Unblur Image Logic`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `  // ENGINE PX: Pixelate Image Logic
  
  const predefinedPalettes = {
     retro1: ['#2B0F54', '#AB1F65', '#FF4F69', '#FFF7F8', '#FF8142', '#FFDA45', '#3368DC', '#49E7EC'],
     gameboy: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
     cga: ['#000000', '#55FFFF', '#FF55FF', '#FFFFFF'],
     sepia: ['#3e2a14', '#704f2a', '#a67b4b', '#d9b48f', '#ffe8cc']
  };

  const hexToRgb = (hex) => {
     const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
     return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
     } : {r: 0, g: 0, b: 0};
  };

  const handlePxFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPxImage(url);
    }
  };

  useEffect(() => {
    if (pxImage) {
       applyPixelate();
    }
  }, [pxImage, pxBlockSize, pxUsePalette, pxActivePalette, pxCustomPalette, pxGrayscale, pxDrawGrid, pxDrawEdges, pxEdgeWidth, pxEdgeThreshold]);

  const applyPixelate = () => {
     if (!pxImage) return;
     setProcessing(true);
     
     setTimeout(async () => {
        try {
           const img = await loadImageElement(pxImage);
           
           // Create processing canvas
           const canvas = document.createElement('canvas');
           let w = img.naturalWidth;
           let h = img.naturalHeight;
           
           // Scale down for heavy processing to prevent freezing
           const MAX_PROCESS = 1200;
           if (w > MAX_PROCESS || h > MAX_PROCESS) {
              const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
              w = Math.round(w * r);
              h = Math.round(h * r);
           }
           canvas.width = w;
           canvas.height = h;
           const ctx = canvas.getContext('2d');
           
           // Calculate block size scaled to image dimension
           const bSize = Math.max(1, Math.round((pxBlockSize / 100) * (Math.max(w, h) * 0.05)));
           
           // Draw Original
           ctx.drawImage(img, 0, 0, w, h);
           
           // Downsample
           const downW = Math.ceil(w / bSize);
           const downH = Math.ceil(h / bSize);
           
           const smallCanvas = document.createElement('canvas');
           smallCanvas.width = downW;
           smallCanvas.height = downH;
           const sCtx = smallCanvas.getContext('2d');
           sCtx.drawImage(canvas, 0, 0, downW, downH);
           
           // Process pixels
           const imgData = sCtx.getImageData(0, 0, downW, downH);
           const data = imgData.data;
           
           // Prepare Palette
           let currentPaletteRGB = [];
           if (pxUsePalette) {
              const pal = pxActivePalette === 'custom' ? pxCustomPalette : predefinedPalettes[pxActivePalette];
              currentPaletteRGB = pal.map(hexToRgb);
           }
           
           for (let i = 0; i < data.length; i += 4) {
              let r = data[i];
              let g = data[i + 1];
              let b = data[i + 2];
              
              if (pxGrayscale) {
                 const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                 r = g = b = lum;
              }
              
              if (pxUsePalette && currentPaletteRGB.length > 0) {
                 let minDist = Infinity;
                 let closest = currentPaletteRGB[0];
                 for (const p of currentPaletteRGB) {
                    const dist = Math.pow(r - p.r, 2) + Math.pow(g - p.g, 2) + Math.pow(b - p.b, 2);
                    if (dist < minDist) {
                       minDist = dist;
                       closest = p;
                    }
                 }
                 r = closest.r;
                 g = closest.g;
                 b = closest.b;
              }
              
              data[i] = r;
              data[i+1] = g;
              data[i+2] = b;
           }
           
           sCtx.putImageData(imgData, 0, 0);
           
           // Clear and upsample without smoothing
           ctx.clearRect(0, 0, w, h);
           ctx.imageSmoothingEnabled = false;
           ctx.drawImage(smallCanvas, 0, 0, w, h);
           
           // Sobel Edge Detection Overlay
           if (pxDrawEdges) {
              const origData = ctx.getImageData(0, 0, w, h);
              const edgeData = new ImageData(w, h);
              const limit = w * h * 4;
              const w4 = w * 4;
              
              // Simple fast sobel approximation on grayscale
              for (let y = 1; y < h - 1; y++) {
                 for (let x = 1; x < w - 1; x++) {
                    const idx = (y * w + x) * 4;
                    // top, bottom, left, right brightness
                    const t = origData.data[idx - w4];
                    const b = origData.data[idx + w4];
                    const l = origData.data[idx - 4];
                    const r_ = origData.data[idx + 4];
                    
                    const dx = Math.abs(l - r_);
                    const dy = Math.abs(t - b);
                    const grad = dx + dy;
                    
                    if (grad > (100 - pxEdgeThreshold) * 3) {
                       edgeData.data[idx] = 0; // Black edges
                       edgeData.data[idx+1] = 0;
                       edgeData.data[idx+2] = 0;
                       edgeData.data[idx+3] = 255;
                    } else {
                       edgeData.data[idx+3] = 0; // transparent
                    }
                 }
              }
              
              const edgeCanvas = document.createElement('canvas');
              edgeCanvas.width = w;
              edgeCanvas.height = h;
              const eCtx = edgeCanvas.getContext('2d');
              eCtx.putImageData(edgeData, 0, 0);
              
              // Draw edges with specified thickness (this is tricky in pure pixel manipulation, so we'll just scale it slightly or rely on the block size. Actually, thick edges are best done by drawing the edge map slightly blurred and thresholded again, but we will keep it simple).
              ctx.imageSmoothingEnabled = false;
              ctx.globalAlpha = 0.8;
              ctx.drawImage(edgeCanvas, 0, 0);
              ctx.globalAlpha = 1.0;
           }
           
           // Grid Lines
           if (pxDrawGrid) {
              ctx.fillStyle = 'rgba(255,255,255,0.2)';
              for (let x = 0; x < w; x += bSize) {
                 ctx.fillRect(x, 0, 1, h);
              }
              for (let y = 0; y < h; y += bSize) {
                 ctx.fillRect(0, y, w, 1);
              }
           }
           
           setPxPreviewUrl(canvas.toDataURL('image/png'));
        } catch (err) {
           console.error("Pixelate error:", err);
        } finally {
           setProcessing(false);
        }
     }, 50);
  };

  const handlePxDownload = () => {
     if (pxPreviewUrl) {
        const link = document.createElement('a');
        link.download = 'pixelated_retro.png';
        link.href = pxPreviewUrl;
        link.click();
     }
  };

${targetStr}`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Pixelate Logic.");
} else {
    console.log("Target string not found in App.jsx.");
}
