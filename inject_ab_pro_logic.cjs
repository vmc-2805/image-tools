const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStart = `  const drawBorderCanvas = async () => {`;
const targetEnd = `  const handleAbDownload = () => {`;

if (content.includes(targetStart) && content.includes(targetEnd)) {
    const parts = content.split(targetStart);
    const endParts = parts[1].split(targetEnd);
    
    // We want to replace everything between targetStart and targetEnd
    
    const newDrawBorder = `  const drawBorderCanvas = async () => {
    if (!abImage) return;
    
    try {
      const img = await loadImageElement(abImage);
      let cropW = img.naturalWidth;
      let cropH = img.naturalHeight;
      let cropX = 0;
      let cropY = 0;
      
      // 1. Aspect Ratio Cropping
      if (abAspectRatio !== 'Original') {
         let targetRatio = 1;
         switch(abAspectRatio) {
            case '1:1': targetRatio = 1; break;
            case '4:5': targetRatio = 4/5; break;
            case '16:9': targetRatio = 16/9; break;
            case '9:16': targetRatio = 9/16; break;
            case '4:3': targetRatio = 4/3; break;
            case '3:2': targetRatio = 3/2; break;
            case '2:3': targetRatio = 2/3; break;
         }
         
         const imgRatio = img.naturalWidth / img.naturalHeight;
         if (imgRatio > targetRatio) {
            cropW = img.naturalHeight * targetRatio;
            cropX = (img.naturalWidth - cropW) / 2;
         } else {
            cropH = img.naturalWidth / targetRatio;
            cropY = (img.naturalHeight - cropH) / 2;
         }
      }
      
      const baseDim = Math.max(cropW, cropH);
      const bW = (abBorderWidth / 100) * (baseDim * 0.1); 
      
      // Calculate Mat Padding
      const mWidth = abEnableMat ? (abMatWidth / 100) * (baseDim * 0.05) : 0;
      
      // 2. Padding Calculations
      let padTop = 0, padRight = 0, padBottom = 0, padLeft = 0;
      
      switch (abActivePreset) {
         case 'CLASSIC': padTop = padRight = padBottom = padLeft = bW * 1.5; break;
         case 'GOLDEN': padTop = padRight = padBottom = padLeft = bW; break;
         case 'DOUBLE': padTop = padRight = padBottom = padLeft = bW * 1.5; break;
         case 'VINTAGE': padTop = padRight = padBottom = padLeft = bW * 2; break;
         case 'POLAROID': 
            padTop = padRight = padLeft = bW;
            padBottom = bW * 3.5; 
            break;
         case 'WHITE': padTop = padRight = padBottom = padLeft = bW; break;
         case 'FILM':
            padTop = padBottom = bW * 1.5;
            padLeft = padRight = 0;
            break;
         case 'MINIMAL': padTop = padRight = padBottom = padLeft = bW * 0.5; break;
         case 'BOLD': padTop = padRight = padBottom = padLeft = bW * 2.5; break;
      }
      
      // Caption height
      let captionPad = 0;
      if (abShowCaption) {
         captionPad = baseDim * 0.15; // 15% extra height at bottom for text
      }
      
      const totalW = cropW + (mWidth * 2) + padLeft + padRight;
      const totalH = cropH + (mWidth * 2) + padTop + padBottom + captionPad;
      const imgDrawX = padLeft + mWidth;
      const imgDrawY = padTop + mWidth;
      
      const canvas = document.createElement('canvas');
      canvas.width = totalW;
      canvas.height = totalH;
      const ctx = canvas.getContext('2d');
      
      // Helper function for rounded rectangles
      const roundRect = (ctx, x, y, width, height, radius) => {
         ctx.beginPath();
         ctx.moveTo(x + radius, y);
         ctx.lineTo(x + width - radius, y);
         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
         ctx.lineTo(x + width, y + height - radius);
         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
         ctx.lineTo(x + radius, y + height);
         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
         ctx.lineTo(x, y + radius);
         ctx.quadraticCurveTo(x, y, x + radius, y);
         ctx.closePath();
      };
      
      // Max radius is half the shortest dimension
      const maxRadius = Math.min(totalW, totalH) / 2;
      const cRadius = (abCornerRadius / 100) * maxRadius;
      
      // Create rounded clipping path for the entire canvas if corner radius > 0
      if (cRadius > 0) {
         roundRect(ctx, 0, 0, totalW, totalH, cRadius);
         ctx.clip();
      }
      
      // Draw outer background (Border Color)
      // Allow presets to determine default color, but override if standard
      let effectiveBgColor = abBorderColor;
      if (abActivePreset === 'GOLDEN') effectiveBgColor = '#d4af37';
      if (abActivePreset === 'VINTAGE') effectiveBgColor = '#f4ecd8';
      if (abActivePreset === 'WHITE' || abActivePreset === 'POLAROID') effectiveBgColor = '#ffffff';
      if (abActivePreset === 'FILM') effectiveBgColor = '#111111';
      if (abActivePreset === 'MINIMAL') effectiveBgColor = '#f3f4f6';
      
      // We will actually just use abBorderColor for everything to give user full control,
      // UNLESS they just clicked a preset. We'll handle preset color updates in a useEffect later.
      // For now, respect the user's custom color state.
      ctx.fillStyle = abBorderColor;
      ctx.fillRect(0, 0, totalW, totalH);
      
      // Preset specific drawings (Classic inner line, Film holes, etc.)
      if (abActivePreset === 'CLASSIC') {
         ctx.fillStyle = abMatColor; // use mat color for the inner classic band
         ctx.fillRect(bW * 0.2, bW * 0.2, totalW - (bW * 0.4), totalH - (bW * 0.4) - captionPad);
         ctx.fillStyle = abBorderColor; // switch back to black for innermost band
         ctx.fillRect(bW * 0.3, bW * 0.3, totalW - (bW * 0.6), totalH - (bW * 0.6) - captionPad);
      } else if (abActivePreset === 'DOUBLE') {
         ctx.strokeStyle = '#000000';
         ctx.lineWidth = bW * 0.2;
         ctx.strokeRect(bW*0.4, bW*0.4, totalW - (bW*0.8), totalH - (bW*0.8) - captionPad);
      } else if (abActivePreset === 'VINTAGE') {
         ctx.strokeStyle = '#8b7355';
         ctx.lineWidth = bW * 0.1;
         ctx.strokeRect(bW*0.3, bW*0.3, totalW - (bW*0.6), totalH - (bW*0.6) - captionPad);
      } else if (abActivePreset === 'POLAROID') {
         ctx.strokeStyle = '#e5e7eb';
         ctx.lineWidth = 2;
         ctx.strokeRect(1, 1, totalW-2, totalH-2);
      } else if (abActivePreset === 'FILM') {
         ctx.fillStyle = '#ffffff';
         const holeW = totalW * 0.05;
         const holeH = bW * 0.6;
         const holeSpacing = totalW * 0.1;
         for (let i = holeW; i < totalW - holeW; i += holeSpacing) {
            ctx.fillRect(i, bW * 0.45, holeW, holeH);
            ctx.fillRect(i, totalH - captionPad - bW * 1.05, holeW, holeH);
         }
      } else if (abActivePreset === 'MINIMAL') {
         ctx.strokeStyle = '#9ca3af';
         ctx.lineWidth = 1;
         ctx.strokeRect(0, 0, totalW, totalH);
      }
      
      // Implement custom Border Style overlay (Dashed/Dotted) inside the padding area
      if (abBorderStyle !== 'Solid') {
         ctx.strokeStyle = (abBorderColor === '#ffffff' || abBorderColor === '#FFFFFF') ? '#000000' : '#ffffff';
         ctx.lineWidth = Math.max(2, bW * 0.1);
         if (abBorderStyle === 'Dashed') ctx.setLineDash([ctx.lineWidth * 3, ctx.lineWidth * 3]);
         if (abBorderStyle === 'Dotted') ctx.setLineDash([ctx.lineWidth, ctx.lineWidth * 2]);
         ctx.strokeRect(padLeft/2, padTop/2, totalW - padLeft, totalH - padTop - captionPad);
         ctx.setLineDash([]); // reset
      }
      
      // Draw Inner Mat
      if (abEnableMat) {
         ctx.fillStyle = abMatColor;
         ctx.fillRect(padLeft, padTop, cropW + (mWidth * 2), cropH + (mWidth * 2));
      }
      
      // Draw Image with inner corner radius if needed
      if (cRadius > 0) {
         ctx.save();
         // inner radius shouldn't exceed image dimensions
         const innerRadius = Math.max(0, cRadius - Math.min(padLeft, padTop) - mWidth);
         roundRect(ctx, imgDrawX, imgDrawY, cropW, cropH, innerRadius);
         ctx.clip();
      }
      
      ctx.drawImage(img, cropX, cropY, cropW, cropH, imgDrawX, imgDrawY, cropW, cropH);
      
      if (cRadius > 0) {
         ctx.restore();
      }
      
      // Render Caption
      if (abShowCaption && abCaptionText) {
         ctx.fillStyle = abBorderColor === '#ffffff' ? '#000000' : '#ffffff';
         if (abActivePreset === 'POLAROID') ctx.fillStyle = '#000000'; // polaroid caption is usually black
         
         const fontSize = baseDim * 0.05;
         ctx.font = \`bold \${fontSize}px sans-serif\`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         const textY = totalH - (captionPad / 2);
         ctx.fillText(abCaptionText, totalW / 2, textY);
      }
      
      // Save to state
      let mime = 'image/jpeg';
      if (abExportFormat === 'PNG') mime = 'image/png';
      if (abExportFormat === 'WEBP') mime = 'image/webp';
      
      setAbPreviewUrl(canvas.toDataURL(mime, 0.95));
      setAbImageDimensions({ w: Math.round(totalW), h: Math.round(totalH) });
    } catch (err) {
       console.error("Add Border error", err);
    }
  };

`;

    fs.writeFileSync('src/App.jsx', parts[0] + newDrawBorder + targetEnd + endParts[1]);
    console.log("Successfully injected new drawBorderCanvas Logic.");
} else {
    console.log("Target strings not found in App.jsx.");
}
