const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStart = `           // Sobel Edge Detection Overlay`;
const targetEnd = `           // Grid Lines`;

if (content.includes(targetStart) && content.includes(targetEnd)) {
    const parts = content.split(targetStart);
    const endParts = parts[1].split(targetEnd);
    
    // We replace the edge detection logic to run on the smallCanvas (downsampled) instead of the upscaled blocky canvas.
    // Running it on the blocky canvas causes every block boundary to be detected as an edge.
    
    const newEdgeLogic = `           // Sobel Edge Detection Overlay
           if (pxDrawEdges) {
              // Run edge detection on the SMALL (downsampled) canvas, so edges align with pixel blocks!
              const sOrigData = sCtx.getImageData(0, 0, downW, downH);
              const edgeData = new ImageData(downW, downH);
              const w4 = downW * 4;
              
              // Edge Threshold from UI (0-100). Higher slider = higher threshold (fewer edges).
              // We map 0-100 to a gradient threshold limit.
              const thresholdLimit = (100 - pxEdgeThreshold) * 4; 
              
              for (let y = 1; y < downH - 1; y++) {
                 for (let x = 1; x < downW - 1; x++) {
                    const idx = (y * downW + x) * 4;
                    
                    // Simple cross gradient (luminance approx using just Red channel for speed, since we already color mapped)
                    const t = sOrigData.data[idx - w4];
                    const b = sOrigData.data[idx + w4];
                    const l = sOrigData.data[idx - 4];
                    const r_ = sOrigData.data[idx + 4];
                    
                    const dx = Math.abs(l - r_);
                    const dy = Math.abs(t - b);
                    const grad = dx + dy;
                    
                    if (grad > thresholdLimit) {
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
              edgeCanvas.width = downW;
              edgeCanvas.height = downH;
              const eCtx = edgeCanvas.getContext('2d');
              eCtx.putImageData(edgeData, 0, 0);
              
              // Now draw the blocky edges onto the main canvas!
              ctx.imageSmoothingEnabled = false;
              ctx.globalAlpha = 0.85;
              
              // We simulate line width by drawing the edge map slightly offset multiple times (or just scaling it).
              // Since the user wants blocky retro edges, a thicker line just means drawing it multiple times offset by 1 block.
              const maxOffset = Math.floor(pxEdgeWidth / 2);
              
              if (maxOffset > 0) {
                 for(let oy = -maxOffset; oy <= maxOffset; oy++) {
                    for(let ox = -maxOffset; ox <= maxOffset; ox++) {
                       // We don't want a solid square of thickness, just a cross or circle, but for retro, square is fine.
                       if(Math.abs(ox) + Math.abs(oy) <= maxOffset) {
                          ctx.drawImage(edgeCanvas, 0, 0, downW, downH, ox * bSize, oy * bSize, w, h);
                       }
                    }
                 }
              } else {
                 ctx.drawImage(edgeCanvas, 0, 0, downW, downH, 0, 0, w, h);
              }
              ctx.globalAlpha = 1.0;
           }
           
`;

    fs.writeFileSync('src/App.jsx', parts[0] + newEdgeLogic + targetEnd + endParts[1]);
    console.log("Successfully fixed Pixelate Edge Logic.");
} else {
    console.log("Target strings not found in App.jsx.");
}
