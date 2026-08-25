// Structured catalog data of all available PDF and image processing tools.
export const TOOLS_CATALOG = [
  // 1. Most Used Tools
  { id: 'passport-maker', name: 'Passport Photo Maker', desc: 'Create standard passport photos with custom bg', category: 'Most Used Tools', engine: 'resizer', params: { width: 3.5, height: 4.5, unit: 'cm', dpi: 300, fitMode: 'cover', bgColor: '#ffffff', enableCrop: true } },
  { id: 'reduce-kb', name: 'Reduce Image Size in KB', desc: 'Compress image to target KB limit', category: 'Most Used Tools', engine: 'compressor', params: { targetKB: 50 } },
  { id: 'resize-pixel', name: 'Resize Image Pixel Online', desc: 'Resize image dimensions by width/height pixels with target file size control', category: 'Most Used Tools', engine: 'resize-pixel-engine', params: {} },
  { id: 'gen-sig', name: 'Generate Signature', desc: 'Draw a customized digital signature', category: 'Most Used Tools', engine: 'sig', params: {} },
  { id: 'increase-kb', name: 'Increase Image Size in KB', desc: 'Increase file size by padding metadata or low compression', category: 'Most Used Tools', engine: 'compressor', params: { targetKB: 500, mode: 'increase' } },
  { id: 'ai-enhancer', name: 'AI Photo Enhancer - Increase Image Quality Online', desc: 'Turn blurry photos into crystal-clear memories', category: 'Most Used Tools', engine: 'increase-quality-engine', params: {} },
  { id: 'remove-blemishes', name: 'Remove Blemishes from Photos with AI', desc: 'Flawless skin in every photo - remove blemishes, pimples, and spots instantly with AI.', category: 'Most Used Tools', engine: 'blemish-remover-engine', params: {} },
  { id: 'ai-retouch', name: 'Retouch Photo Online with AI', desc: 'Smooth skin, clear tones, and HD results - Pi7 makes photo retouch effortless.', category: 'Most Used Tools', engine: 'ai-retouch-engine', params: {} },
  { id: 'resize-sig', name: 'Resize Signature', desc: 'Resize signature to custom standard dimensions', category: 'Most Used Tools', engine: 'resizer', params: { width: 5.0, height: 2.0, unit: 'cm', dpi: 300 } },
  
  // 2. Basic Editing
  { id: 'blur-bg', name: 'Blur Image Background Online', desc: 'Welcome to Pi7 Image Tool - Make your photos pop with background blur.', category: 'Basic Editing', engine: 'motion-blur-engine', params: { defaultType: 'gaussian', defaultBlurBg: true } },
  { id: 'rotate-img', name: 'Rotate Image', desc: 'Rotate image by 90, 180 or 270 degrees', category: 'Basic Editing', engine: 'effects', params: { effectType: 'rotate', rotation: 0 } },
  { id: 'flip-img', name: 'Flip Image', desc: 'Flip image vertically or horizontally', category: 'Basic Editing', engine: 'effects', params: { effectType: 'flip', direction: 'horizontal' } },
  { id: 'watermark', name: 'Add Watermark to Image Online', desc: 'Protect your images with custom text or logo watermarks', category: 'Basic Editing', engine: 'watermark-engine', params: { defaultTab: 'text' } },
  { id: 'round-corners', name: 'Round Corners', desc: 'Apply rounded border corners to your image', category: 'Basic Editing', engine: 'effects', params: { effectType: 'round-corners', radius: 40 } },
  { id: 'img-colorpicker', name: 'Image Color Picker', desc: 'Pick any color code from your image', category: 'Basic Editing', engine: 'effects', params: { effectType: 'colorpicker' } },
  
  // 3. Blur, Pixelate and Special Effects
  { id: 'blur-image', name: 'Blur Image', desc: 'Apply Gaussian blur or motion blur to your images', category: 'Blur, Pixelate and Special Effects', engine: 'motion-blur-engine', params: { defaultType: 'gaussian', defaultBlurBg: false } },
  { id: 'pixelate-image', name: 'Pixelate Image', desc: 'Advanced retro image processor & face pixelator', category: 'Blur, Pixelate and Special Effects', engine: 'pixelate-engine', params: {} },
  { id: 'grayscale', name: 'Convert Image to Grayscale', desc: 'Transform Colors, Embrace Elegance: Pi7 Image Tool for Effortless Grayscale Conversion', category: 'Blur, Pixelate and Special Effects', engine: 'grayscale-engine', params: {} },
  { id: 'black-white', name: 'Turn Color Image to Black and White', desc: 'Pi7 Image Tool: Transforming Color Picture to Classic Black & White.', category: 'Blur, Pixelate and Special Effects', engine: 'blackwhite-engine', params: {} },
  { id: 'deep-fry', name: 'Deep Fryer Photo - Free Online Image Deep Fry Tool', desc: 'Pick an image. Hit a preset. Download your deep-fried meme. Runs in your browser.', category: 'Blur, Pixelate and Special Effects', engine: 'deep-fry-engine', params: {} },
  { id: 'add-text', name: 'Add Text to Image Online', desc: 'Overlay custom styled text onto image', category: 'Blur, Pixelate and Special Effects', engine: 'watermark-engine', params: { defaultTab: 'text' } },
  { id: 'add-border', name: 'Add Border to Image', desc: 'Add classic borders, polaroid frames, and more', category: 'Blur, Pixelate and Special Effects', engine: 'add-border-engine', params: {} },
  { id: 'censor-photo', name: 'Censor Photo Online', desc: 'The Easiest Way to Censor Photos Online, Fast and Secure!', category: 'Blur, Pixelate and Special Effects', engine: 'censor-engine', params: {} },
  { id: 'motion-blur', name: 'Motion Blur Image Online', desc: 'Your Reliable Solution to Motion Blur Photos Instantly & Securely!', category: 'Blur, Pixelate and Special Effects', engine: 'motion-blur-engine', params: {} },
  { id: 'pixel-art', name: 'Convert Any Picture to Pixel Art', desc: 'Turn Pictures into Pixel Art - Instantly, Privately, and for Free.', category: 'Blur, Pixelate and Special Effects', engine: 'pixel-art-engine', params: {} },
  
  // 4. DPI & Quality
  { id: 'convert-dpi', name: 'DPI Converter - Change Image DPI To 200, 300, 600', desc: 'Change Image DPI To 200, 300, 600 - Instantly adjust print resolution and dimensions', category: 'DPI & Quality', engine: 'dpi-converter-engine', params: {} },
  { id: 'check-dpi', name: 'Check Image DPI Online | Pi7 DPI Checker', desc: 'Discover Your Image DPI in Seconds with Our Tool', category: 'DPI & Quality', engine: 'dpi-checker-engine', params: {} },
  { id: 'super-resolution', name: 'Super Resolution Images Online', desc: 'Upscale low-resolution photos into crisp, high-definition images online', category: 'DPI & Quality', engine: 'super-resolution-engine', params: {} },
  { id: 'ai-upscale', name: 'Upscale Image Online with AI', desc: 'Pi7 Image Tool - AI upscaler that revives every pixel', category: 'DPI & Quality', engine: 'ai-upscale-engine', params: {} },
  
  // 5. Passport & ID Photo Sizes
  { id: 'resize-a4', name: 'Resize Image To A4 Size', desc: 'Fit and resize images to standard A4 size (2480 x 3508 px at 300 DPI)', category: 'Passport & ID Photo Sizes', engine: 'resize-a4-engine', params: { width: 2480, height: 3508 } },
  { id: 'red-bg-passport', name: 'Red Background Passport', desc: 'Fit photo to passport size with red background', category: 'Passport & ID Photo Sizes', engine: 'resizer', params: { width: 3.5, height: 4.5, unit: 'cm', dpi: 300, fitMode: 'cover', bgColor: '#ff0000' } },
  { id: 'white-bg-passport', name: 'White Background Passport', desc: 'Fit photo to passport size with white background', category: 'Passport & ID Photo Sizes', engine: 'resizer', params: { width: 3.5, height: 4.5, unit: 'cm', dpi: 300, fitMode: 'cover', bgColor: '#ffffff' } },
  { id: 'ssc-resize', name: 'Resize Image For SSC (Signature & Photo)', desc: 'Resize photo and signature for SSC online application forms with exact DPI, CM, and KB limits', category: 'Passport & ID Photo Sizes', engine: 'ssc-resizer-engine', params: { dpi: 200, widthCM: 7, heightCM: 10, targetKB: 20 } },
  { id: 'pancard-resize', name: 'PAN Card Photo Resize', desc: 'Resize photo to PAN Card guidelines (2.5x3.5cm)', category: 'Passport & ID Photo Sizes', engine: 'resizer', params: { width: 2.5, height: 3.5, unit: 'cm', dpi: 300 } },
  
  // 6. Social Media
  { id: 'whatsapp-dp', name: 'Resize Image for WhatsApp DP - No Cropping', desc: 'Welcome to Pi7 Image Tool - Resize Your Photos Perfectly for WhatsApp DP without Cropping!', category: 'Resize For Social Media', engine: 'whatsapp-dp-engine', params: {} },
  
  // 7. Format Conversions
  { id: 'image-to-jpg', name: 'Image to JPG', desc: 'Convert image format to JPEG', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'png-to-jpeg', name: 'PNG to JPEG', desc: 'Convert PNG images to JPEG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'jpeg-to-png', name: 'JPEG to PNG', desc: 'Convert JPG images to PNG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'png' } },
  { id: 'webp-to-jpg', name: 'WEBP to JPG', desc: 'Convert WEBP images to JPEG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'favicon-gen', name: 'Favicon Generator - Free Multi-Size Pack', desc: 'Drop a logo. Get a multi-size favicon.ico, PNGs, manifest, and HTML snippet. No upload. No signup. No wait.', category: 'Format Conversions', engine: 'favicon-engine', params: {} },
  
  // 8. Image to PDF
  { id: 'image-to-pdf', name: 'Image to PDF', desc: 'Convert multiple images into a single PDF document', category: 'Image to PDF', engine: 'img2pdf-engine', params: {} },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Render entire PDF pages to JPG or extract embedded images', category: 'Image to PDF', engine: 'pdf2jpg-engine', params: {} },
  { id: 'jpg-to-pdf-50kb', name: 'JPG to PDF (Under 50KB)', desc: 'Convert JPG to PDF compressed under 50KB limit', category: 'Image to PDF', engine: 'img2pdf-engine', params: { compress: true, targetKB: 50 } },
  { id: 'jpg-to-pdf-100kb', name: 'JPG to PDF (Under 100KB)', desc: 'Convert JPG to PDF compressed under 100KB limit', category: 'Image to PDF', engine: 'img2pdf-engine', params: { compress: true, targetKB: 100 } },
  { id: 'jpeg-to-pdf-200kb', name: 'JPEG to PDF (Under 200KB)', desc: 'Convert JPEG to PDF compressed under 200KB limit', category: 'Image to PDF', engine: 'img2pdf-engine', params: { compress: true, targetKB: 200 } },
  { id: 'jpg-to-pdf-300kb', name: 'JPG to PDF (Under 300KB)', desc: 'Convert JPG to PDF compressed under 300KB limit', category: 'Image to PDF', engine: 'img2pdf-engine', params: { compress: true, targetKB: 300 } },
  { id: 'jpg-to-pdf-500kb', name: 'JPG to PDF (Under 500KB)', desc: 'Convert JPG to PDF compressed under 500KB limit', category: 'Image to PDF', engine: 'img2pdf-engine', params: { compress: true, targetKB: 500 } },
  
  // 9. Exact Target Sizes (Compression)
  { id: 'comp-5kb', name: 'Compress to 5KB', desc: 'Compress image under 5KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 5 } },
  { id: 'comp-10kb', name: 'Compress to 10KB', desc: 'Compress image under 10KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 10 } },
  { id: 'comp-20kb', name: 'Compress to 20KB', desc: 'Compress image under 20KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 20 } },
  { id: 'comp-50kb', name: 'Compress to 50KB', desc: 'Compress image under 50KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 50 } },
  { id: 'comp-100kb', name: 'Compress to 100KB', desc: 'Compress image under 100KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 100 } },
  { id: 'comp-200kb', name: 'Compress to 200KB', desc: 'Compress image under 200KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 200 } }
];
