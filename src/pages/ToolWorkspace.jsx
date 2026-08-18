import React, { useState, useEffect, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import { PDFDocument } from 'pdf-lib';
import { 
  Search, 
  ArrowLeft, 
  Upload, 
  Download, 
  Trash, 
  Palette, 
  RotateCw, 
  Image, 
  FileText, 
  Sliders, 
  Type, 
  Check, 
  Settings,
  Crop,
  Layers,
  Sparkles,
  Maximize2,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Droplet,
  Contrast
} from 'lucide-react';

// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Tools database definition based on screenshot categories
const TOOLS_CATALOG = [
  // 1. Most Used Tools
  { id: 'passport-maker', name: 'Passport Photo Maker', desc: 'Create standard passport photos with custom bg', category: 'Most Used Tools', engine: 'resizer', params: { width: 3.5, height: 4.5, unit: 'cm', dpi: 300, fitMode: 'cover', bgColor: '#ffffff', enableCrop: true } },
  { id: 'reduce-kb', name: 'Reduce Image Size in KB', desc: 'Compress image to target KB limit', category: 'Most Used Tools', engine: 'compressor', params: { targetKB: 50 } },
  { id: 'resize-pixel', name: 'Resize Image Pixel', desc: 'Resize image dimensions by width/height pixels', category: 'Most Used Tools', engine: 'resizer', params: { width: 1200, height: 800, unit: 'px', dpi: 72 } },
  { id: 'gen-sig', name: 'Generate Signature', desc: 'Draw a customized digital signature', category: 'Most Used Tools', engine: 'sig', params: {} },
  { id: 'increase-kb', name: 'Increase Image Size in KB', desc: 'Increase file size by padding metadata or low compression', category: 'Most Used Tools', engine: 'compressor', params: { targetKB: 500, mode: 'increase' } },
  { id: 'ai-enhancer', name: 'AI Photo Enhancer', desc: 'Auto adjust contrast, saturation and sharpness', category: 'Most Used Tools', engine: 'effects', params: { effectType: 'enhance' } },
  { id: 'resize-sig', name: 'Resize Signature', desc: 'Resize signature to custom standard dimensions', category: 'Most Used Tools', engine: 'resizer', params: { width: 5.0, height: 2.0, unit: 'cm', dpi: 300 } },
  
  // 2. Basic Editing
  { id: 'blur-bg', name: 'Blur Background', desc: 'Apply blur filter on the background area', category: 'Basic Editing', engine: 'effects', params: { effectType: 'blur-bg' } },
  { id: 'rotate-img', name: 'Rotate Image', desc: 'Rotate image by 90, 180 or 270 degrees', category: 'Basic Editing', engine: 'effects', params: { effectType: 'rotate', rotation: 90 } },
  { id: 'flip-img', name: 'Flip Image', desc: 'Flip image vertically or horizontally', category: 'Basic Editing', engine: 'effects', params: { effectType: 'flip', direction: 'horizontal' } },
  { id: 'watermark', name: 'Watermark Images', desc: 'Add text overlay on image', category: 'Basic Editing', engine: 'effects', params: { effectType: 'watermark', text: 'CONFIDENTIAL' } },
  { id: 'round-corners', name: 'Round Corners', desc: 'Apply rounded border corners to your image', category: 'Basic Editing', engine: 'effects', params: { effectType: 'round-corners', radius: 40 } },
  { id: 'img-colorpicker', name: 'Image Color Picker', desc: 'Pick any color code from your image', category: 'Basic Editing', engine: 'effects', params: { effectType: 'colorpicker' } },
  
  // 3. Blur, Pixelate and Special Effects
  { id: 'blur-image', name: 'Blur Image', desc: 'Blur the entire image content', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'blur', intensity: 10 } },
  { id: 'pixelate-image', name: 'Pixelate Image', desc: 'Turn photo into a retro pixelated style', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'pixelate', size: 15 } },
  { id: 'grayscale', name: 'Grayscale Image', desc: 'Convert image to grayscale mode', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'grayscale' } },
  { id: 'black-white', name: 'Black & White', desc: 'Convert image to binary high-threshold black & white', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'blackwhite', threshold: 128 } },
  { id: 'deep-fry', name: 'Deep Fry Photo', desc: 'Over-saturate and maximize contrast', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'deepfry' } },
  { id: 'add-text', name: 'Add Text to Image', desc: 'Overlay custom styled text onto image', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'add-text', text: 'Type Here', color: '#ff0000', size: 36 } },
  { id: 'add-border', name: 'Add Border to Image', desc: 'Draw a white or colored border frame', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'border', borderSize: 15, borderColor: '#ffffff' } },
  
  // 4. DPI & Quality
  { id: 'convert-dpi', name: 'Convert DPI (200, 300, 600)', desc: 'Change the metadata resolution DPI of image', category: 'DPI & Quality', engine: 'resizer', params: { width: 100, height: 100, unit: 'percent', dpi: 300 } },
  
  // 5. Passport & ID Photo Sizes
  { id: 'red-bg-passport', name: 'Red Background Passport', desc: 'Fit photo to passport size with red background', category: 'Passport & ID Photo Sizes', engine: 'resizer', params: { width: 3.5, height: 4.5, unit: 'cm', dpi: 300, fitMode: 'cover', bgColor: '#ff0000' } },
  { id: 'white-bg-passport', name: 'White Background Passport', desc: 'Fit photo to passport size with white background', category: 'Passport & ID Photo Sizes', engine: 'resizer', params: { width: 3.5, height: 4.5, unit: 'cm', dpi: 300, fitMode: 'cover', bgColor: '#ffffff' } },
  { id: 'ssc-resize', name: 'SSC Photo Resize', desc: 'Resize image to SSC online form size (3.5x4.5cm)', category: 'Passport & ID Photo Sizes', engine: 'resizer', params: { width: 3.5, height: 4.5, unit: 'cm', dpi: 300 } },
  { id: 'pancard-resize', name: 'PAN Card Photo Resize', desc: 'Resize photo to PAN Card guidelines (2.5x3.5cm)', category: 'Passport & ID Photo Sizes', engine: 'resizer', params: { width: 2.5, height: 3.5, unit: 'cm', dpi: 300 } },
  
  // 6. Social Media
  { id: 'whatsapp-dp', name: 'WhatsApp DP Size', desc: 'Resize photo to square WhatsApp DP size (500x500 px)', category: 'Resize For Social Media', engine: 'resizer', params: { width: 500, height: 500, unit: 'px', dpi: 72, fitMode: 'contain' } },
  
  // 7. Format Conversions
  { id: 'image-to-jpg', name: 'Image to JPG', desc: 'Convert image format to JPEG', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'png-to-jpeg', name: 'PNG to JPEG', desc: 'Convert PNG images to JPEG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'jpeg-to-png', name: 'JPEG to PNG', desc: 'Convert JPG images to PNG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'png' } },
  { id: 'webp-to-jpg', name: 'WEBP to JPG', desc: 'Convert WEBP images to JPEG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'favicon-gen', name: 'Favicon Generator', desc: 'Generate standard multi-size PNG/ICO favicon', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'ico' } },
  
  // 8. Image to PDF
  { id: 'image-to-pdf', name: 'Image to PDF', desc: 'Convert image files into a single PDF document', category: 'Image to PDF', engine: 'converter', params: { targetFormat: 'pdf' } },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Render PDF page streams into JPG image downloads', category: 'Image to PDF', engine: 'converter', params: { targetFormat: 'pdf-to-jpg' } },
  
  // 9. Exact Target Sizes (Compression)
  { id: 'comp-5kb', name: 'Compress to 5KB', desc: 'Compress image under 5KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 5 } },
  { id: 'comp-10kb', name: 'Compress to 10KB', desc: 'Compress image under 10KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 10 } },
  { id: 'comp-20kb', name: 'Compress to 20KB', desc: 'Compress image under 20KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 20 } },
  { id: 'comp-50kb', name: 'Compress to 50KB', desc: 'Compress image under 50KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 50 } },
  { id: 'comp-100kb', name: 'Compress to 100KB', desc: 'Compress image under 100KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 100 } },
  { id: 'comp-200kb', name: 'Compress to 200KB', desc: 'Compress image under 200KB limit', category: 'Exact Target Sizes', engine: 'compressor', params: { targetKB: 200 } }
];

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeTool, setActiveTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  // File management
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalMeta, setOriginalMeta] = useState(null);
  
  // UI processing states
  const [processing, setProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');
  const [toast, setToast] = useState(null);

  // Engine A: Resizer States
  const [resizeWidth, setResizeWidth] = useState(100);
  const [resizeHeight, setResizeHeight] = useState(100);
  const [resizeUnit, setResizeUnit] = useState('px');
  const [resizeDpi, setResizeDpi] = useState(300);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [fitMode, setFitMode] = useState('cover'); // cover (fill & crop) | contain (fit inside) | stretch
  const [resizerBgColor, setResizerBgColor] = useState('#ffffff');
  const [bgRemovedUrl, setBgRemovedUrl] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropBrightness, setCropBrightness] = useState(100);
  const [cropContrast, setCropContrast] = useState(100);
  const [cropSaturation, setCropSaturation] = useState(100);
  const [activeToolbarTab, setActiveToolbarTab] = useState(null);
  const [passportPreset, setPassportPreset] = useState('3.5x4.5cm');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [enableManualCrop, setEnableManualCrop] = useState(false);
  const imgRef = useRef(null);

  const onImageLoad = (e) => {
    if (enableManualCrop) {
      const { width, height } = e.currentTarget;
      let aspect = undefined;
      if (resizeWidth && resizeHeight) {
         aspect = resizeWidth / resizeHeight;
      }
      
      const initialCrop = centerCrop(
        makeAspectCrop({
          unit: '%',
          width: 90,
        }, aspect || 1, width, height),
        width, height
      );
      setCrop(initialCrop);
    }
  };
  
  // Engine B: Compressor States
  const [compressTargetKB, setCompressTargetKB] = useState(50);
  const [compressMode, setCompressMode] = useState('reduce'); // reduce | increase
  
  // Engine C: Signature Draw States
  const [penColor, setPenColor] = useState('#000000');
  const [penThickness, setPenThickness] = useState(3);
  const [sigBackground, setSigBackground] = useState('transparent');
  const sigCanvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  
  // Engine E: Filters / Effects States
  const [effectType, setEffectType] = useState('enhance');
  const [effectRotation, setEffectRotation] = useState(90);
  const [effectFlipDirection, setEffectFlipDirection] = useState('horizontal');
  const [effectWatermarkText, setEffectWatermarkText] = useState('CONFIDENTIAL');
  const [effectRoundRadius, setEffectRoundRadius] = useState(30);
  const [effectBlurIntensity, setEffectBlurIntensity] = useState(8);
  const [effectPixelSize, setEffectPixelSize] = useState(10);
  const [effectBwThreshold, setEffectBwThreshold] = useState(128);
  const [effectBorderWidth, setEffectBorderWidth] = useState(10);
  const [effectBorderColor, setEffectBorderColor] = useState('#ffffff');
  const [pickedColor, setPickedColor] = useState(null);

  const fileInputRef = useRef(null);
  
  // Auto-hide toast notifications
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Preset loading when tool changes
  useEffect(() => {
    if (!activeTool) return;
    
    // Reset file selection
    setSelectedFile(null);
    setPreviewUrl('');
    setOriginalMeta(null);
    setPickedColor(null);
    
    const params = activeTool.params || {};
    
    if (activeTool.engine === 'resizer') {
      setResizeWidth(params.width || 500);
      setResizeHeight(params.height || 500);
      setResizeUnit(params.unit || 'px');
      setResizeDpi(params.dpi || 300);
      setMaintainAspect(params.maintainAspectRatio !== false);
      setFitMode(params.fitMode || 'cover');
      setResizerBgColor(params.bgColor || '#ffffff');
      setEnableManualCrop(params.enableCrop || false);
      setCrop(undefined);
      setCompletedCrop(null);
    }
    
    if (activeTool.engine === 'compressor') {
      setCompressTargetKB(params.targetKB || 50);
      setCompressMode(params.mode || 'reduce');
    }
    
    if (activeTool.engine === 'effects') {
      setEffectType(params.effectType || 'enhance');
      if (params.effectType === 'rotate') setEffectRotation(params.rotation || 90);
      if (params.effectType === 'flip') setEffectFlipDirection(params.direction || 'horizontal');
      if (params.effectType === 'watermark') setEffectWatermarkText(params.text || 'CONFIDENTIAL');
      if (params.effectType === 'round-corners') setEffectRoundRadius(params.radius || 30);
      if (params.effectType === 'blur') setEffectBlurIntensity(params.intensity || 8);
      if (params.effectType === 'pixelate') setEffectPixelSize(params.size || 10);
      if (params.effectType === 'blackwhite') setEffectBwThreshold(params.threshold || 128);
      if (params.effectType === 'border') {
        setEffectBorderWidth(params.borderSize || 10);
        setEffectBorderColor(params.borderColor || '#ffffff');
      }
    }
  }, [activeTool]);

  // Load uploaded image metadata
  const handleFileLoad = (file) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setBgRemovedUrl(null);
    setCropZoom(1);
    setCropBrightness(100);
    setCropContrast(100);
    setCropSaturation(100);
    setActiveToolbarTab(null);
    setPassportPreset('3.5x4.5cm');

    if (file.type.startsWith('image/')) {
      const img = new window.Image();
      img.onload = () => {
        setOriginalMeta({
          width: img.width,
          height: img.height,
          sizeKB: Math.round(file.size / 1024),
          mimeType: file.type
        });
      };
      img.src = url;
    } else if (file.type === 'application/pdf') {
      setOriginalMeta({
        sizeKB: Math.round(file.size / 1024),
        mimeType: file.type
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileLoad(file);
  };

  const handlePresetSelect = (presetId) => {
    setPassportPreset(presetId);
    if (presetId === '3.5x4.5cm') {
      setResizeUnit('cm');
      setResizeWidth(3.5);
      setResizeHeight(4.5);
    } else if (presetId === '2x2inch') {
      setResizeUnit('inch');
      setResizeWidth(2);
      setResizeHeight(2);
    } else if (presetId === '5x7cm') {
      setResizeUnit('cm');
      setResizeWidth(5);
      setResizeHeight(7);
    }
  };

  const handleBgColorClick = async (c) => {
    setResizerBgColor(c);
    
    if (bgRemovedUrl || activeTool.engine !== 'resizer') return;

    setProcessing(true);
    setProcessingText('Applying background color...');
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(selectedFile);
      const newUrl = URL.createObjectURL(blob);
      setBgRemovedUrl(newUrl);
      setPreviewUrl(newUrl);
    } catch (e) {
      console.error(e);
      showToast('Could not process background.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Helper to load HTML Image object from URL
  const loadImageElement = (url) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  // 1. ENGINE A: Resizer Implementation
  const runResizer = async () => {
    if (!previewUrl || !originalMeta) return;
    setProcessing(true);
    setProcessingText('Resizing your image...');
    
    try {
      const img = await loadImageElement(previewUrl);
      
      // Calculate output size in pixels
      let pxWidth = resizeWidth;
      let pxHeight = resizeHeight;
      
      if (resizeUnit === 'cm') {
        pxWidth = Math.round((resizeWidth / 2.54) * resizeDpi);
        pxHeight = Math.round((resizeHeight / 2.54) * resizeDpi);
      } else if (resizeUnit === 'mm') {
        pxWidth = Math.round((resizeWidth / 25.4) * resizeDpi);
        pxHeight = Math.round((resizeHeight / 25.4) * resizeDpi);
      } else if (resizeUnit === 'inch') {
        pxWidth = Math.round(resizeWidth * resizeDpi);
        pxHeight = Math.round(resizeHeight * resizeDpi);
      } else if (resizeUnit === 'percent') {
        pxWidth = Math.round(img.width * (resizeWidth / 100));
        pxHeight = Math.round(img.height * (resizeHeight / 100));
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = pxWidth;
      canvas.height = pxHeight;
      const ctx = canvas.getContext('2d');
      
      // Fill background color
      if (resizerBgColor !== 'transparent') {
        ctx.fillStyle = resizerBgColor;
        ctx.fillRect(0, 0, pxWidth, pxHeight);
      }
      
      let sourceImg = img;
      if (enableManualCrop && completedCrop && completedCrop.width && completedCrop.height) {
        const scaleX = img.width / imgRef.current.width;
        const scaleY = img.height / imgRef.current.height;
        
        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropW = completedCrop.width * scaleX;
        const cropH = completedCrop.height * scaleY;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = cropW;
        tempCanvas.height = cropH;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.filter = `brightness(${cropBrightness}%) contrast(${cropContrast}%) saturate(${cropSaturation}%)`;
        tempCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        sourceImg = tempCanvas;
      }
      
      if (fitMode === 'contain') {
        // Draw image keeping ratio fit inside box
        const scale = Math.min(pxWidth / sourceImg.width, pxHeight / sourceImg.height);
        const w = sourceImg.width * scale;
        const h = sourceImg.height * scale;
        const x = (pxWidth - w) / 2;
        const y = (pxHeight - h) / 2;
        ctx.drawImage(sourceImg, x, y, w, h);
      } else if (fitMode === 'cover') {
        // Draw image cropping center to fill box
        const scale = Math.max(pxWidth / sourceImg.width, pxHeight / sourceImg.height);
        const w = sourceImg.width * scale;
        const h = sourceImg.height * scale;
        const x = (pxWidth - w) / 2;
        const y = (pxHeight - h) / 2;
        ctx.drawImage(sourceImg, x, y, w, h);
      } else {
        // Stretch
        ctx.drawImage(sourceImg, 0, 0, pxWidth, pxHeight);
      }
      
      const outputFormat = resizerBgColor === 'transparent' ? 'image/png' : 'image/jpeg';
      const ext = resizerBgColor === 'transparent' ? 'png' : 'jpg';
      const resizedUrl = canvas.toDataURL(outputFormat, 0.95);
      downloadDataUrl(resizedUrl, `resized_${selectedFile.name.split('.')[0]}.${ext}`);
      showToast('Image resized & downloaded successfully!');
    } catch (e) {
      console.error(e);
      showToast('Error resizing image.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // Helper to trigger browser file download
  const downloadDataUrl = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. ENGINE B: Compressor Implementation
  const runCompressor = async () => {
    if (!previewUrl || !originalMeta) return;
    setProcessing(true);
    setProcessingText('Compressing to exact target size...');
    
    try {
      const img = await loadImageElement(previewUrl);
      const canvas = document.createElement('canvas');
      
      // Start with original dimensions or scale down slightly for very low target KBs
      let scale = 1.0;
      if (compressTargetKB < 15 && originalMeta.sizeKB > 1000) {
        scale = 0.5; // Scale down dimensions to fit extreme low file sizes
      } else if (compressTargetKB < 50 && originalMeta.sizeKB > 3000) {
        scale = 0.7;
      }
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Binary search algorithm to find the quality matching the target KB
      let minQ = 0.01;
      let maxQ = 0.99;
      let quality = 0.8;
      let bestBlob = null;
      let bestSizeDiff = Infinity;
      
      const getBlob = (q) => {
        return new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', q);
        });
      };
      
      // Run binary search loop
      for (let i = 0; i < 7; i++) {
        const blob = await getBlob(quality);
        const sizeKB = blob.size / 1024;
        const diff = sizeKB - compressTargetKB;
        
        if (Math.abs(diff) < Math.abs(bestSizeDiff)) {
          bestSizeDiff = diff;
          bestBlob = blob;
        }
        
        if (sizeKB > compressTargetKB) {
          // File is too large, reduce quality range
          maxQ = quality;
          quality = (minQ + quality) / 2;
        } else {
          // File is small enough, try to increase quality closer to threshold
          minQ = quality;
          quality = (maxQ + quality) / 2;
        }
      }
      
      if (bestBlob) {
        const url = URL.createObjectURL(bestBlob);
        downloadDataUrl(url, `compressed_${compressTargetKB}kb_${selectedFile.name}`);
        URL.revokeObjectURL(url);
        showToast(`Compressed image to ${Math.round(bestBlob.size / 1024)} KB.`);
      } else {
        showToast('Failed to meet compression target.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Error compressing image.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // 3. ENGINE C: Signature Canvas Implementation
  const startDrawing = (e) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    isDrawingRef.current = true;
    
    // Support touch and mouse coordinates
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penThickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSigCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    
    // To support transparent bg or colored background
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const oCtx = outputCanvas.getContext('2d');
    
    if (sigBackground !== 'transparent') {
      oCtx.fillStyle = sigBackground;
      oCtx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    oCtx.drawImage(canvas, 0, 0);
    const dataUrl = outputCanvas.toDataURL('image/png');
    downloadDataUrl(dataUrl, 'signature.png');
    showToast('Signature exported!');
  };

  // 4. ENGINE D: Format Converter
  const runConverter = async () => {
    if (!selectedFile) return;
    const targetFormat = activeTool.params.targetFormat;
    
    setProcessing(true);
    setProcessingText('Converting format...');
    
    try {
      if (targetFormat === 'pdf') {
        // Convert Image to PDF
        const fileBytes = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.create();
        
        let pdfImg;
        if (selectedFile.type === 'image/png') {
          pdfImg = await pdfDoc.embedPng(fileBytes);
        } else {
          pdfImg = await pdfDoc.embedJpg(fileBytes);
        }
        
        const page = pdfDoc.addPage([pdfImg.width, pdfImg.height]);
        page.drawImage(pdfImg, {
          x: 0,
          y: 0,
          width: pdfImg.width,
          height: pdfImg.height
        });
        
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        downloadDataUrl(url, `${selectedFile.name.split('.')[0]}.pdf`);
        URL.revokeObjectURL(url);
        showToast('Image converted to PDF successfully.');
      } else if (targetFormat === 'pdf-to-jpg') {
        // Convert PDF pages to JPG image files
        const fileBytes = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: fileBytes }).promise;
        const pageCount = pdf.numPages;
        
        showToast(`Converting ${pageCount} PDF pages to JPG...`);
        
        for (let i = 1; i <= pageCount; i++) {
          setProcessingText(`Rendering page ${i} of ${pageCount}...`);
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 }); // high resolution
          
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d');
          
          await page.render({ canvasContext: ctx, viewport }).promise;
          
          const imgUrl = canvas.toDataURL('image/jpeg', 0.95);
          downloadDataUrl(imgUrl, `page_${i}_${selectedFile.name.split('.')[0]}.jpg`);
        }
        showToast('PDF pages converted to images!');
      } else {
        // Image to Image Format Conversions
        const img = await loadImageElement(previewUrl);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        let mimeType = 'image/jpeg';
        let ext = 'jpg';
        if (targetFormat === 'png') {
          mimeType = 'image/png';
          ext = 'png';
        } else if (targetFormat === 'ico') {
          mimeType = 'image/png'; // modern favicons are standard PNG
          ext = 'ico';
        }
        
        const dataUrl = canvas.toDataURL(mimeType, 0.9);
        downloadDataUrl(dataUrl, `${selectedFile.name.split('.')[0]}.${ext}`);
        showToast(`Converted file to ${targetFormat.toUpperCase()}!`);
      }
    } catch (e) {
      console.error(e);
      showToast('Error converting file format.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // 5. ENGINE E: Image Filters & Effects
  const handleColorPick = (e) => {
    if (effectType !== 'colorpicker' || !previewUrl) return;
    const canvas = document.createElement('canvas');
    const img = e.currentTarget;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const rect = img.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * img.naturalWidth;
    const clickY = ((e.clientY - rect.top) / rect.height) * img.naturalHeight;
    
    const pixel = ctx.getImageData(Math.round(clickX), Math.round(clickY), 1, 1).data;
    const hex = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
    setPickedColor(hex);
  };

  const runEffects = async () => {
    if (!previewUrl || !originalMeta) return;
    setProcessing(true);
    setProcessingText('Applying filters & effects...');
    
    try {
      const img = await loadImageElement(previewUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Determine output sizes (changes for rotate operations)
      if (effectType === 'rotate') {
        if (effectRotation === 90 || effectRotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      
      // 1. ROTATE
      if (effectType === 'rotate') {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((effectRotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } 
      // 2. FLIP
      else if (effectType === 'flip') {
        if (effectFlipDirection === 'horizontal') {
          ctx.scale(-1, 1);
          ctx.drawImage(img, -canvas.width, 0);
        } else {
          ctx.scale(1, -1);
          ctx.drawImage(img, 0, -canvas.height);
        }
      } 
      // 3. CORE FILTER PROCESSORS (Grayscale, Pixelate, Black/White, deepfry)
      else {
        // Draw image first
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        if (effectType === 'grayscale') {
          for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] + data[i+1] + data[i+2]) / 3;
            data[i] = gray;
            data[i+1] = gray;
            data[i+2] = gray;
          }
          ctx.putImageData(imgData, 0, 0);
        } 
        else if (effectType === 'blackwhite') {
          for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] + data[i+1] + data[i+2]) / 3;
            const binary = gray >= effectBwThreshold ? 255 : 0;
            data[i] = binary;
            data[i+1] = binary;
            data[i+2] = binary;
          }
          ctx.putImageData(imgData, 0, 0);
        } 
        else if (effectType === 'deepfry') {
          for (let i = 0; i < data.length; i += 4) {
            // High contrast & saturation
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 2.5 + 128));     // R
            data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 2.5 + 128)); // G
            data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.5 + 128)); // B
          }
          ctx.putImageData(imgData, 0, 0);
        } 
        else if (effectType === 'pixelate') {
          // Pixelation trick: draw small on temporary canvas and stretch back
          const tempCanvas = document.createElement('canvas');
          const percent = Math.max(0.01, 1 / effectPixelSize);
          tempCanvas.width = canvas.width * percent;
          tempCanvas.height = canvas.height * percent;
          const tempCtx = tempCanvas.getContext('2d');
          
          tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
        } 
        else if (effectType === 'blur') {
          // Canvas CSS blur filter
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.filter = `blur(${effectBlurIntensity}px)`;
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none'; // reset
        } 
        else if (effectType === 'blur-bg') {
          // Mock background blur by blurring outer region
          ctx.filter = `blur(10px)`;
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
          // Draw unblurred center oval
          ctx.save();
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.35, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, 0, 0);
          ctx.restore();
        }
        else if (effectType === 'enhance') {
          // AI Enhancer parameters: slight contrast increase, brightness bump
          for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.15 + 128 + 5)); // contrast + brightness
            data[i+1] = Math.min(255, Math.max(0, (data[i+1] - 128) * 1.15 + 128 + 5));
            data[i+2] = Math.min(255, Math.max(0, (data[i+2] - 128) * 1.15 + 128));
          }
          ctx.putImageData(imgData, 0, 0);
        }
        else if (effectType === 'round-corners') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(effectRoundRadius, 0);
          ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, effectRoundRadius);
          ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, effectRoundRadius);
          ctx.arcTo(0, canvas.height, 0, 0, effectRoundRadius);
          ctx.arcTo(0, 0, canvas.width, 0, effectRoundRadius);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0);
          ctx.restore();
        }
        else if (effectType === 'watermark') {
          // Text watermark overlay
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.font = 'bold 36px Outfit, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(effectWatermarkText, canvas.width - 20, canvas.height - 20);
        }
        else if (effectType === 'border') {
          // Add white or colored borders
          ctx.lineWidth = effectBorderWidth * 2;
          ctx.strokeStyle = effectBorderColor;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }
        else if (effectType === 'add-text') {
          // Add custom text
          ctx.fillStyle = effectBorderColor; // Use border color swatch for text color
          ctx.font = `bold ${effectPixelSize * 3}px var(--sans-font)`; // reuse pixelSize slider for text size
          ctx.textAlign = 'center';
          ctx.fillText(effectWatermarkText, canvas.width / 2, canvas.height / 2);
        }
      }
      
      const exported = canvas.toDataURL('image/jpeg', 0.95);
      downloadDataUrl(exported, `edited_${effectType}_${selectedFile.name}`);
      showToast('Filters applied & image downloaded!');
    } catch (e) {
      console.error(e);
      showToast('Error applying image effects.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // 6. Portal Filters (Dashboard Search)
  const filteredTools = TOOLS_CATALOG.filter(tool => {
    const q = searchQuery.toLowerCase();
    return tool.name.toLowerCase().includes(q) || 
           tool.desc.toLowerCase().includes(q) || 
           tool.category.toLowerCase().includes(q);
  });

  // Group filtered tools by category
  const categoriesMap = filteredTools.reduce((acc, tool) => {
    acc[tool.category] = acc[tool.category] || [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  return (
    <div className="portal-container">
      {/* 1. Header Navbar */}
      <header className="navbar">
        <div className="logo-section" onClick={() => setActiveTool(null)} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <Sparkles size={20} />
          </div>
          <span className="logo-text">AeroTools</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title="Toggle theme"
            style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {activeTool && (
            <div className="btn btn-secondary" onClick={() => setActiveTool(null)}>
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </div>
          )}
        </div>
      </header>
      
      {!activeTool ? (
        // 2. DASHBOARD VIEW
        <>
          <div className="dashboard-header">
            <h1 className="dashboard-title">Free Image & PDF Utilities Portal</h1>
            <p className="dashboard-subtitle">
              Quick, beautiful, and secure toolkits running 100% locally in your browser. 
              Your files never upload to any server.
            </p>
            
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search over 80+ tools (e.g. passport, compress, converter)..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <main className="dashboard-content">
            {Object.keys(categoriesMap).map((catName) => (
              <div key={catName} className="category-section">
                <h2 className="category-title">{catName}</h2>
                <div className="tools-grid">
                  {categoriesMap[catName].map((tool) => (
                    <div 
                      key={tool.id} 
                      className="tool-card"
                      onClick={() => setActiveTool(tool)}
                    >
                      <div className="tool-icon-wrapper">
                        {tool.engine === 'resizer' ? <Crop size={18} /> :
                         tool.engine === 'compressor' ? <Maximize2 size={18} /> :
                         tool.engine === 'sig' ? <Palette size={18} /> :
                         tool.engine === 'converter' ? <FileText size={18} /> :
                         <Sliders size={18} />}
                      </div>
                      <h3 className="tool-card-title">{tool.name}</h3>
                      <p className="tool-card-desc">{tool.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(categoriesMap).length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No tools match your search query. Try another keyword!
              </div>
            )}
          </main>
        </>
      ) : (
        // 3. TOOL WORKSPACE VIEWS
        <div className="workspace-container">
          <div className="back-link" onClick={() => setActiveTool(null)}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </div>
          
          <div className="workspace-title-bar">
            <h1 className="workspace-title">{activeTool.name}</h1>
            <p className="workspace-desc">{activeTool.desc}</p>
          </div>
          
          <div className="workspace-grid">
            {/* Input Options Column */}
            <div className="control-panel">
              <span className="panel-section-title">Upload File</span>
              
              {activeTool.engine !== 'sig' && (
                <>
                  {!selectedFile ? (
                    <div 
                      className="dropzone"
                      onClick={() => fileInputRef.current.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files[0]) handleFileLoad(e.dataTransfer.files[0]);
                      }}
                    >
                      <Upload className="dropzone-icon" size={32} />
                      <div className="form-label">Drop file here or click to browse</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Supports JPG, PNG, WEBP, PDF (max 20MB)
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <FileText size={18} className="text-secondary" />
                        <span className="file-name" style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedFile.name}</span>
                      </div>
                      <button className="btn-icon" style={{ background: 'transparent', color: 'var(--danger)', border: 'none', cursor: 'pointer' }} onClick={() => { setSelectedFile(null); setPreviewUrl(''); setOriginalMeta(null); }}>
                        <Trash size={16} />
                      </button>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept={activeTool.params.targetFormat === 'pdf-to-jpg' ? '.pdf' : 'image/*,.pdf'}
                    style={{ display: 'none' }}
                  />
                </>
              )}
              
              {/* Render dynamic settings depending on Engine */}
              {activeTool.engine === 'resizer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span className="panel-section-title">
                    {activeTool.id === 'passport-maker' ? 'Select Passport Photo Size' : 'Resize Settings'}
                  </span>

                  {activeTool.id === 'passport-maker' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500' }}>Default DPI:</span>
                      <input 
                        type="number" 
                        value={resizeDpi}
                        onChange={(e) => setResizeDpi(parseInt(e.target.value) || 300)}
                        className="number-input"
                        style={{ width: '80px', padding: '4px' }}
                      />
                    </div>
                  )}

                  {activeTool.id === 'passport-maker' && (
                    <div className="preset-grid">
                      <div className={`preset-card ${passportPreset === '3.5x4.5cm' ? 'active' : ''}`} onClick={() => handlePresetSelect('3.5x4.5cm')}>
                        {passportPreset === '3.5x4.5cm' && <div className="preset-card-badge"><Check size={10} /> Selected</div>}
                        <div className="preset-card-title">3.5 CM x 4.5 CM</div>
                        <div className="preset-card-title" style={{ color: 'var(--text-secondary)' }}>35 MM x 45 MM</div>
                        <div className="preset-card-subtitle">India, Australia, Europe, UK, Pakistan</div>
                      </div>

                      <div className={`preset-card ${passportPreset === '2x2inch' ? 'active' : ''}`} onClick={() => handlePresetSelect('2x2inch')}>
                        {passportPreset === '2x2inch' && <div className="preset-card-badge"><Check size={10} /> Selected</div>}
                        <div className="preset-card-title">2 Inch X 2 Inch</div>
                        <div className="preset-card-title" style={{ color: 'var(--text-secondary)' }}>51 MM x 51 MM</div>
                        <div className="preset-card-subtitle">USA, Philippines</div>
                      </div>

                      <div className={`preset-card ${passportPreset === '5x7cm' ? 'active' : ''}`} onClick={() => handlePresetSelect('5x7cm')}>
                        {passportPreset === '5x7cm' && <div className="preset-card-badge"><Check size={10} /> Selected</div>}
                        <div className="preset-card-title">50 MM X 70 MM</div>
                        <div className="preset-card-title" style={{ color: 'var(--text-secondary)' }}>5 CM x 7 CM</div>
                        <div className="preset-card-subtitle">Canada</div>
                      </div>

                      <div className={`preset-card ${passportPreset === 'custom' ? 'active' : ''}`} onClick={() => handlePresetSelect('custom')} style={{ padding: '8px' }}>
                        {passportPreset === 'custom' && <div className="preset-card-badge" style={{ zIndex: 10 }}><Check size={10} /> Selected</div>}
                        
                        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                          <label><input type="radio" name="custom_unit" checked={resizeUnit === 'cm'} onChange={() => { handlePresetSelect('custom'); setResizeUnit('cm'); }} /> CM</label>
                          <label><input type="radio" name="custom_unit" checked={resizeUnit === 'mm'} onChange={() => { handlePresetSelect('custom'); setResizeUnit('mm'); }} /> MM</label>
                          <label><input type="radio" name="custom_unit" checked={resizeUnit === 'inch'} onChange={() => { handlePresetSelect('custom'); setResizeUnit('inch'); }} /> Inch</label>
                          <label><input type="radio" name="custom_unit" checked={resizeUnit === 'px'} onChange={() => { handlePresetSelect('custom'); setResizeUnit('px'); }} /> PX</label>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input type="number" value={resizeWidth} onChange={(e) => { handlePresetSelect('custom'); setResizeWidth(parseFloat(e.target.value) || 0); }} className="number-input" style={{ width: '40px', padding: '2px 4px', fontSize: '11px', textAlign: 'center' }} />
                          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>X</span>
                          <input type="number" value={resizeHeight} onChange={(e) => { handlePresetSelect('custom'); setResizeHeight(parseFloat(e.target.value) || 0); }} className="number-input" style={{ width: '40px', padding: '2px 4px', fontSize: '11px', textAlign: 'center' }} />
                        </div>
                        
                        <div className="preset-card-subtitle" style={{ fontWeight: '700' }}>Custom</div>
                      </div>
                    </div>
                  )}

                  {activeTool.id !== 'passport-maker' && (
                    <>
                      <div className="form-input-row">
                        <div className="form-input-col">
                          <label className="form-label">Width</label>
                          <input 
                            type="number" 
                            value={resizeWidth} 
                            onChange={(e) => setResizeWidth(parseFloat(e.target.value) || 0)}
                            className="number-input"
                          />
                        </div>
                        <div className="form-input-col">
                          <label className="form-label">Height</label>
                          <input 
                            type="number" 
                            value={resizeHeight} 
                            onChange={(e) => setResizeHeight(parseFloat(e.target.value) || 0)}
                            className="number-input"
                          />
                        </div>
                      </div>
                      
                      <div className="form-input-row">
                        <div className="form-input-col">
                          <label className="form-label">Unit</label>
                          <select 
                            value={resizeUnit} 
                            onChange={(e) => setResizeUnit(e.target.value)}
                            className="select-input"
                          >
                            <option value="px">Pixels (px)</option>
                            <option value="cm">Centimeters (cm)</option>
                            <option value="mm">Millimeters (mm)</option>
                            <option value="inch">Inches (in)</option>
                            <option value="percent">Percentage (%)</option>
                          </select>
                        </div>
                        <div className="form-input-col">
                          <label className="form-label">Resolution (DPI)</label>
                          <select 
                            value={resizeDpi} 
                            onChange={(e) => setResizeDpi(parseInt(e.target.value))}
                            className="select-input"
                          >
                            <option value={72}>72 DPI (Web)</option>
                            <option value={150}>150 DPI (Standard)</option>
                            <option value={300}>300 DPI (High/Print)</option>
                            <option value={600}>600 DPI (Ultra)</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="form-input-row">
                    {activeTool.id !== 'passport-maker' && (
                      <div className="form-input-col">
                        <label className="form-label">Fit Mode</label>
                        <select 
                          value={fitMode} 
                          onChange={(e) => setFitMode(e.target.value)}
                          className="select-input"
                        >
                          <option value="cover">Fill & Crop (Center)</option>
                          <option value="contain">Fit Inside (Keep Ratio)</option>
                          <option value="stretch">Stretch to Fit</option>
                        </select>
                      </div>
                    )}
                    <div className="form-input-col">
                      <label className="form-label">Background Fill</label>
                      <div className="color-picker-row" style={{ marginTop: '6px' }}>
                        {['transparent', '#ffffff', '#000000', '#ff0000', '#0000ff', '#3b82f6'].map(c => (
                          <div 
                            key={c}
                            className={`color-picker-dot ${resizerBgColor === c ? 'active' : ''}`}
                            style={{ 
                              backgroundColor: c === 'transparent' ? '#fff' : c, 
                              border: (c === '#ffffff' || c === 'transparent') ? '1px solid #ccc' : 'none',
                              backgroundImage: c === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                              backgroundPosition: c === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'none',
                              backgroundSize: c === 'transparent' ? '8px 8px' : 'auto'
                            }}
                            onClick={() => handleBgColorClick(c)}
                            title={c === 'transparent' ? 'Transparent (PNG)' : c}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary" onClick={runResizer} disabled={!selectedFile}>
                    <Download size={16} />
                    <span>Resize & Save</span>
                  </button>
                </div>
              )}
              
              {activeTool.engine === 'compressor' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span className="panel-section-title">Compression Parameters</span>
                  
                  <div className="form-group">
                    <label className="form-label">Target File Size (KB)</label>
                    <input 
                      type="number" 
                      value={compressTargetKB} 
                      onChange={(e) => setCompressTargetKB(parseInt(e.target.value) || 10)}
                      className="number-input"
                      min={5}
                      max={2000}
                    />
                  </div>
                  
                  <button className="btn btn-primary" onClick={runCompressor} disabled={!selectedFile}>
                    <Download size={16} />
                    <span>Compress & Download</span>
                  </button>
                </div>
              )}
              
              {activeTool.engine === 'sig' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span className="panel-section-title">Signature Settings</span>
                  
                  <div className="form-group">
                    <label className="form-label">Pen Color</label>
                    <div className="color-picker-row">
                      {['#000000', '#0000ff', '#ff0000', '#009900'].map(c => (
                        <div 
                          key={c}
                          className={`color-picker-dot ${penColor === c ? 'active' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setPenColor(c)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="slider-group">
                    <div className="slider-label-row">
                      <span>Pen Thickness</span>
                      <span className="slider-value">{penThickness}px</span>
                    </div>
                    <input 
                      type="range" 
                      min={1} 
                      max={12} 
                      value={penThickness} 
                      onChange={(e) => setPenThickness(parseInt(e.target.value))}
                      className="range-slider"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Background</label>
                    <select 
                      value={sigBackground} 
                      onChange={(e) => setSigBackground(e.target.value)}
                      className="select-input"
                    >
                      <option value="transparent">Transparent (PNG)</option>
                      <option value="#ffffff">White Background</option>
                      <option value="#fffbeb">Cream / Yellow Background</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={clearSigCanvas} style={{ flex: 1 }}>
                      Clear Board
                    </button>
                    <button className="btn btn-primary" onClick={downloadSignature} style={{ flex: 1 }}>
                      Save Signature
                    </button>
                  </div>
                </div>
              )}
              
              {activeTool.engine === 'converter' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span className="panel-section-title">Conversion Action</span>
                  
                  <div className="form-group">
                    <label className="form-label">Target Format</label>
                    <div style={{ textTransform: 'uppercase', fontSize: '15px', fontWeight: '700', color: 'var(--primary)' }}>
                      {activeTool.params.targetFormat.replace('-', ' ')}
                    </div>
                  </div>
                  
                  <button className="btn btn-primary" onClick={runConverter} disabled={!selectedFile}>
                    <Check size={16} />
                    <span>Convert & Download</span>
                  </button>
                </div>
              )}
              
              {activeTool.engine === 'effects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <span className="panel-section-title">Filter Configurations</span>
                  
                  {effectType === 'rotate' && (
                    <div className="form-group">
                      <label className="form-label">Rotate Degrees</label>
                      <select 
                        value={effectRotation} 
                        onChange={(e) => setEffectRotation(parseInt(e.target.value))}
                        className="select-input"
                      >
                        <option value={90}>90° Right</option>
                        <option value={180}>180° Rotate</option>
                        <option value={270}>90° Left</option>
                      </select>
                    </div>
                  )}
                  
                  {effectType === 'flip' && (
                    <div className="form-group">
                      <label className="form-label">Flip Direction</label>
                      <select 
                        value={effectFlipDirection} 
                        onChange={(e) => setEffectFlipDirection(e.target.value)}
                        className="select-input"
                      >
                        <option value="horizontal">Horizontal (Mirror)</option>
                        <option value="vertical">Vertical</option>
                      </select>
                    </div>
                  )}
                  
                  {(effectType === 'watermark' || effectType === 'add-text') && (
                    <div className="form-group">
                      <label className="form-label">Text String</label>
                      <input 
                        type="text" 
                        value={effectWatermarkText} 
                        onChange={(e) => setEffectWatermarkText(e.target.value)}
                        className="text-input"
                      />
                    </div>
                  )}
                  
                  {effectType === 'round-corners' && (
                    <div className="slider-group">
                      <div className="slider-label-row">
                        <span>Round Radius</span>
                        <span className="slider-value">{effectRoundRadius}px</span>
                      </div>
                      <input 
                        type="range" 
                        min={5} 
                        max={150} 
                        value={effectRoundRadius} 
                        onChange={(e) => setEffectRoundRadius(parseInt(e.target.value))}
                        className="range-slider"
                      />
                    </div>
                  )}
                  
                  {effectType === 'blur' && (
                    <div className="slider-group">
                      <div className="slider-label-row">
                        <span>Blur Intensity</span>
                        <span className="slider-value">{effectBlurIntensity}px</span>
                      </div>
                      <input 
                        type="range" 
                        min={1} 
                        max={40} 
                        value={effectBlurIntensity} 
                        onChange={(e) => setEffectBlurIntensity(parseInt(e.target.value))}
                        className="range-slider"
                      />
                    </div>
                  )}
                  
                  {effectType === 'blackwhite' && (
                    <div className="slider-group">
                      <div className="slider-label-row">
                        <span>Binary Threshold</span>
                        <span className="slider-value">{effectBwThreshold}</span>
                      </div>
                      <input 
                        type="range" 
                        min={10} 
                        max={240} 
                        value={effectBwThreshold} 
                        onChange={(e) => setEffectBwThreshold(parseInt(e.target.value))}
                        className="range-slider"
                      />
                    </div>
                  )}
                  
                  {(effectType === 'pixelate' || effectType === 'add-text') && (
                    <div className="slider-group">
                      <div className="slider-label-row">
                        <span>{effectType === 'add-text' ? 'Font Size' : 'Pixel Size'}</span>
                        <span className="slider-value">{effectPixelSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min={4} 
                        max={80} 
                        value={effectPixelSize} 
                        onChange={(e) => setEffectPixelSize(parseInt(e.target.value))}
                        className="range-slider"
                      />
                    </div>
                  )}
                  
                  {(effectType === 'border' || effectType === 'add-text') && (
                    <>
                      <div className="slider-group">
                        <div className="slider-label-row">
                          <span>Border Frame Width</span>
                          <span className="slider-value">{effectBorderWidth}px</span>
                        </div>
                        <input 
                          type="range" 
                          min={2} 
                          max={50} 
                          value={effectBorderWidth} 
                          onChange={(e) => setEffectBorderWidth(parseInt(e.target.value))}
                          className="range-slider"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Color Swatch</label>
                        <div className="color-picker-row">
                          {['#ffffff', '#000000', '#ff0000', '#0000ff', '#ffff00'].map(c => (
                            <div 
                              key={c}
                              className={`color-picker-dot ${effectBorderColor === c ? 'active' : ''}`}
                              style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #ccc' : 'none' }}
                              onClick={() => setEffectBorderColor(c)}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {effectType === 'colorpicker' && pickedColor && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Selected Color:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: pickedColor, border: '1px solid rgba(255,255,255,0.2)' }} />
                        <span style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 'bold' }}>{pickedColor}</span>
                      </div>
                    </div>
                  )}
                  
                  {effectType === 'colorpicker' ? (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      Tip: Click anywhere on the preview image inside the right panel to pick its exact hexadecimal color code!
                    </div>
                  ) : (
                    <button className="btn btn-primary" onClick={runEffects} disabled={!selectedFile}>
                      <Sliders size={16} />
                      <span>Apply & Download</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Output Preview Column */}
            <div className="preview-panel">
              <span className="panel-section-title">Workspace Preview</span>
              
              {activeTool.engine === 'sig' ? (
                <canvas 
                  ref={sigCanvasRef}
                  width={500}
                  height={250}
                  className="sig-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              ) : (
                <>
                  {previewUrl ? (
                    <>
                      <div className="image-preview-container">
                        {selectedFile.type === 'application/pdf' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <FileText size={48} className="text-secondary" />
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>PDF Document Loaded</span>
                          </div>
                        ) : (
                          activeTool.engine === 'resizer' && enableManualCrop ? (
                            <ReactCrop
                              crop={crop}
                              onChange={(_, percentCrop) => setCrop(percentCrop)}
                              onComplete={(c) => setCompletedCrop(c)}
                              style={{ transform: `scale(${cropZoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-in-out' }}
                            >
                              <img 
                                ref={imgRef}
                                src={previewUrl} 
                                alt="Crop preview" 
                                className="preview-image" 
                                onLoad={onImageLoad}
                                style={{ 
                                  backgroundColor: resizerBgColor !== 'transparent' ? resizerBgColor : 'transparent',
                                  filter: `brightness(${cropBrightness}%) contrast(${cropContrast}%) saturate(${cropSaturation}%)`
                                }}
                              />
                            </ReactCrop>
                          ) : (
                            <img 
                              src={previewUrl} 
                              alt="Workspace preview" 
                              className="preview-image" 
                              onClick={handleColorPick}
                              style={{ 
                                cursor: effectType === 'colorpicker' ? 'crosshair' : 'default',
                                backgroundColor: activeTool.engine === 'resizer' && resizerBgColor !== 'transparent' ? resizerBgColor : 'transparent'
                              }}
                            />
                          )
                        )}
                      </div>
                      {activeTool.engine === 'resizer' && enableManualCrop && selectedFile.type !== 'application/pdf' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div className="crop-toolbar">
                            <button className="crop-toolbar-btn" onClick={() => setCropZoom(Math.min(3, cropZoom + 0.2))} title="Zoom In">
                              <ZoomIn size={16} />
                            </button>
                            <button className="crop-toolbar-btn" onClick={() => setCropZoom(Math.max(0.5, cropZoom - 0.2))} title="Zoom Out">
                              <ZoomOut size={16} />
                            </button>
                            <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 4px' }} />
                            <button className={`crop-toolbar-btn ${activeToolbarTab === 'brightness' ? 'active' : ''}`} onClick={() => setActiveToolbarTab(activeToolbarTab === 'brightness' ? null : 'brightness')} title="Brightness">
                              <Sun size={16} />
                            </button>
                            <button className={`crop-toolbar-btn ${activeToolbarTab === 'saturation' ? 'active' : ''}`} onClick={() => setActiveToolbarTab(activeToolbarTab === 'saturation' ? null : 'saturation')} title="Saturation">
                              <Droplet size={16} />
                            </button>
                            <button className={`crop-toolbar-btn ${activeToolbarTab === 'contrast' ? 'active' : ''}`} onClick={() => setActiveToolbarTab(activeToolbarTab === 'contrast' ? null : 'contrast')} title="Contrast">
                              <Contrast size={16} />
                            </button>
                          </div>
                          
                          {activeToolbarTab && (
                            <div className="crop-slider-popup" style={{ width: '240px' }}>
                              <div className="slider-header">
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {activeToolbarTab === 'brightness' && <><Sun size={12} /> Brightness</>}
                                  {activeToolbarTab === 'saturation' && <><Droplet size={12} /> Saturation</>}
                                  {activeToolbarTab === 'contrast' && <><Contrast size={12} /> Contrast</>}
                                </span>
                                <span>{activeToolbarTab === 'brightness' ? cropBrightness : activeToolbarTab === 'saturation' ? cropSaturation : cropContrast}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="200" 
                                value={activeToolbarTab === 'brightness' ? cropBrightness : activeToolbarTab === 'saturation' ? cropSaturation : cropContrast} 
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (activeToolbarTab === 'brightness') setCropBrightness(val);
                                  if (activeToolbarTab === 'saturation') setCropSaturation(val);
                                  if (activeToolbarTab === 'contrast') setCropContrast(val);
                                }}
                                className="range-input"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', border: '1px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)', gap: '8px' }}>
                      <Image size={32} />
                      <span style={{ fontSize: '13px' }}>Upload a file to see preview</span>
                    </div>
                  )}
                  
                  {originalMeta && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 0 0' }}>
                      <div className="preview-meta-row">
                        <span>Original Resolution:</span>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {originalMeta.width ? `${originalMeta.width} x ${originalMeta.height} px` : 'PDF Document'}
                        </span>
                      </div>
                      <div className="preview-meta-row">
                        <span>File Size:</span>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{originalMeta.sizeKB} KB</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 4. Loader Overlay Screen */}
      {processing && (
        <div className="loading-overlay">
          <div className="spinner" />
          <span className="loading-text">{processingText}</span>
        </div>
      )}
      
      {/* 5. Toast Notifications */}
      {toast && (
        <div className="toast-msg">
          <Check size={16} style={{ color: 'var(--success)' }} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
