const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStr = `  // ENGINE U: Unblur Image Logic`

if (content.includes(targetStr)) {
    const parts = content.split(targetStr);
    
    const injection = `  // ENGINE B: Add Border Logic
  const handleAbFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAbImage(url);
    }
  };

  useEffect(() => {
    if (abImage) {
       drawBorderCanvas();
    }
  }, [abImage, abActivePreset, abAspectRatio, abBorderWidth, abBorderStyle, abExportFormat]);

  const drawBorderCanvas = async () => {
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
            // Image is wider than target: crop horizontally
            cropW = img.naturalHeight * targetRatio;
            cropX = (img.naturalWidth - cropW) / 2;
         } else {
            // Image is taller than target: crop vertically
            cropH = img.naturalWidth / targetRatio;
            cropY = (img.naturalHeight - cropH) / 2;
         }
      }
      
      // Calculate responsive base size to ensure border width feels consistent
      const baseDim = Math.max(cropW, cropH);
      const bW = (abBorderWidth / 100) * (baseDim * 0.1); // Map 0-100 to 0-10% of image size
      
      // 2. Preset Calculations
      let finalW = cropW;
      let finalH = cropH;
      let imgDrawX = 0;
      let imgDrawY = 0;
      
      // Default padding
      let padTop = 0, padRight = 0, padBottom = 0, padLeft = 0;
      
      switch (abActivePreset) {
         case 'CLASSIC':
            padTop = padRight = padBottom = padLeft = bW * 1.5;
            break;
         case 'GOLDEN':
            padTop = padRight = padBottom = padLeft = bW;
            break;
         case 'DOUBLE':
            padTop = padRight = padBottom = padLeft = bW * 1.5;
            break;
         case 'VINTAGE':
            padTop = padRight = padBottom = padLeft = bW * 2;
            break;
         case 'POLAROID':
            padTop = padRight = padLeft = bW;
            padBottom = bW * 3.5; // Polaroid bottom
            break;
         case 'WHITE':
            padTop = padRight = padBottom = padLeft = bW;
            break;
         case 'FILM':
            padTop = padBottom = bW * 1.5;
            padLeft = padRight = 0;
            break;
         case 'MINIMAL':
            padTop = padRight = padBottom = padLeft = bW * 0.5;
            break;
         case 'BOLD':
            padTop = padRight = padBottom = padLeft = bW * 2.5;
            break;
      }
      
      finalW = cropW + padLeft + padRight;
      finalH = cropH + padTop + padBottom;
      imgDrawX = padLeft;
      imgDrawY = padTop;
      
      const canvas = document.createElement('canvas');
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext('2d');
      
      // Draw background based on preset
      ctx.fillStyle = '#ffffff'; // Default white
      
      switch (abActivePreset) {
         case 'CLASSIC':
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, finalW, finalH);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(bW * 0.2, bW * 0.2, finalW - (bW * 0.4), finalH - (bW * 0.4));
            break;
         case 'GOLDEN':
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(0, 0, finalW, finalH);
            break;
         case 'DOUBLE':
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, finalW, finalH);
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = bW * 0.2;
            ctx.strokeRect(bW*0.4, bW*0.4, finalW - (bW*0.8), finalH - (bW*0.8));
            break;
         case 'VINTAGE':
            ctx.fillStyle = '#f4ecd8';
            ctx.fillRect(0, 0, finalW, finalH);
            ctx.strokeStyle = '#8b7355';
            ctx.lineWidth = bW * 0.1;
            ctx.strokeRect(bW*0.3, bW*0.3, finalW - (bW*0.6), finalH - (bW*0.6));
            break;
         case 'POLAROID':
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, finalW, finalH);
            // Drop shadow effect logic usually done via CSS, but we can do a subtle border
            ctx.strokeStyle = '#e5e7eb';
            ctx.lineWidth = 2;
            ctx.strokeRect(1, 1, finalW-2, finalH-2);
            break;
         case 'WHITE':
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, finalW, finalH);
            break;
         case 'FILM':
            ctx.fillStyle = '#111111';
            ctx.fillRect(0, 0, finalW, finalH);
            // Draw film holes
            ctx.fillStyle = '#ffffff';
            const holeW = finalW * 0.05;
            const holeH = bW * 0.6;
            const holeSpacing = finalW * 0.1;
            for (let i = holeW; i < finalW - holeW; i += holeSpacing) {
               ctx.fillRect(i, bW * 0.45, holeW, holeH);
               ctx.fillRect(i, finalH - bW * 1.05, holeW, holeH);
            }
            break;
         case 'MINIMAL':
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(0, 0, finalW, finalH);
            ctx.strokeStyle = '#9ca3af';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, finalW, finalH);
            break;
         case 'BOLD':
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, finalW, finalH);
            break;
      }
      
      // Implement custom Border Style overlay if applicable (e.g. dashed)
      if (abBorderStyle !== 'Solid' && ['WHITE', 'GOLDEN', 'BOLD', 'MINIMAL'].includes(abActivePreset)) {
         ctx.strokeStyle = abActivePreset === 'WHITE' ? '#000' : '#fff';
         ctx.lineWidth = Math.max(2, bW * 0.1);
         if (abBorderStyle === 'Dashed') ctx.setLineDash([ctx.lineWidth * 3, ctx.lineWidth * 3]);
         if (abBorderStyle === 'Dotted') ctx.setLineDash([ctx.lineWidth, ctx.lineWidth * 2]);
         ctx.strokeRect(padLeft/2, padTop/2, finalW - padLeft, finalH - padTop);
         ctx.setLineDash([]); // reset
      }
      
      // Draw cropped image onto canvas
      ctx.drawImage(img, cropX, cropY, cropW, cropH, imgDrawX, imgDrawY, cropW, cropH);
      
      // Save to state
      let mime = 'image/jpeg';
      if (abExportFormat === 'PNG') mime = 'image/png';
      if (abExportFormat === 'WEBP') mime = 'image/webp';
      
      setAbPreviewUrl(canvas.toDataURL(mime, 0.95));
      setAbImageDimensions({ w: Math.round(finalW), h: Math.round(finalH) });
    } catch (err) {
       console.error("Add Border error", err);
    }
  };

  const handleAbDownload = () => {
     if (abPreviewUrl) {
        const link = document.createElement('a');
        link.download = \`bordered_image.\${abExportFormat.toLowerCase()}\`;
        link.href = abPreviewUrl;
        link.click();
     }
  };

  // ENGINE U: Unblur Image Logic`;

    fs.writeFileSync('src/App.jsx', parts[0] + injection + parts[1]);
    console.log("Successfully injected Add Border Logic.");
} else {
    console.log("Target string not found in App.jsx.");
}
