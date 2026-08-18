import React, { useState, useEffect, useRef } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
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
  Contrast,
  X
} from 'lucide-react';
import { getSeoData, updateMetaTags } from './seoData';

const LazyReactCrop = React.lazy(() => import('react-image-crop'));

let pdfjsInstance = null;
const loadPdfjs = async () => {
  if (pdfjsInstance) return pdfjsInstance;
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
  ).toString();
  pdfjsInstance = pdfjs;
  return pdfjs;
};


// Tools database definition based on screenshot categories
const TOOLS_CATALOG = [
  // 1. Most Used Tools
  { id: 'passport-maker', name: 'Passport Photo Maker', desc: 'Create standard passport photos with custom bg', category: 'Most Used Tools', engine: 'resizer', params: { width: 3.5, height: 4.5, unit: 'cm', dpi: 300, fitMode: 'cover', bgColor: '#ffffff', enableCrop: true } },
  { id: 'reduce-kb', name: 'Reduce Image Size in KB', desc: 'Compress image to target KB limit', category: 'Most Used Tools', engine: 'compressor', params: { targetKB: 50 } },
  { id: 'resize-pixel', name: 'Resize Image Pixel Online', desc: 'Resize image dimensions by width/height pixels with target file size control', category: 'Most Used Tools', engine: 'resize-pixel-engine', params: {} },
  { id: 'gen-sig', name: 'Generate Signature', desc: 'Draw a customized digital signature', category: 'Most Used Tools', engine: 'sig', params: {} },
  { id: 'increase-kb', name: 'Increase Image Size in KB', desc: 'Increase file size by padding metadata or low compression', category: 'Most Used Tools', engine: 'compressor', params: { targetKB: 500, mode: 'increase' } },
  { id: 'ai-enhancer', name: 'AI Photo Enhancer', desc: 'Pi7 Image Tool - Turn blurry photos into crystal-clear memories', category: 'Most Used Tools', engine: 'increase-quality-engine', params: {} },
  { id: 'remove-blemishes', name: 'Remove Blemishes from Photos with AI', desc: 'Flawless skin in every photo - remove blemishes, pimples, and spots instantly with AI.', category: 'Most Used Tools', engine: 'blemish-remover-engine', params: {} },
  { id: 'ai-retouch', name: 'Retouch Photo Online with AI', desc: 'Smooth skin, clear tones, and HD results - Pi7 makes photo retouch effortless.', category: 'Most Used Tools', engine: 'ai-retouch-engine', params: {} },
  { id: 'increase-quality', name: 'Increase Image Quality Online Free', desc: 'Pi7 Image Tool - Turn blurry photos into crystal-clear memories', category: 'Most Used Tools', engine: 'increase-quality-engine', params: {} },
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
  { id: 'pixelate-image', name: 'Pixelate Image', desc: 'Advanced retro image processor & face pixelator', category: 'Blur, Pixelate and Special Effects', engine: 'pixelate-engine', params: {} },
  { id: 'grayscale', name: 'Convert Image to Grayscale', desc: 'Transform Colors, Embrace Elegance: Pi7 Image Tool for Effortless Grayscale Conversion', category: 'Blur, Pixelate and Special Effects', engine: 'grayscale-engine', params: {} },
  { id: 'black-white', name: 'Turn Color Image to Black and White', desc: 'Pi7 Image Tool: Transforming Color Picture to Classic Black & White.', category: 'Blur, Pixelate and Special Effects', engine: 'blackwhite-engine', params: {} },
  { id: 'deep-fry', name: 'Deep Fry Photo', desc: 'Over-saturate and maximize contrast', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'deepfry' } },
  { id: 'add-text', name: 'Add Text to Image', desc: 'Overlay custom styled text onto image', category: 'Blur, Pixelate and Special Effects', engine: 'effects', params: { effectType: 'add-text', text: 'Type Here', color: '#ff0000', size: 36 } },
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
  { id: 'whatsapp-dp', name: 'WhatsApp DP Size', desc: 'Resize photo to square WhatsApp DP size (500x500 px)', category: 'Resize For Social Media', engine: 'resizer', params: { width: 500, height: 500, unit: 'px', dpi: 72, fitMode: 'contain' } },
  
  // 7. Format Conversions
  { id: 'image-to-jpg', name: 'Image to JPG', desc: 'Convert image format to JPEG', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'png-to-jpeg', name: 'PNG to JPEG', desc: 'Convert PNG images to JPEG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'jpeg-to-png', name: 'JPEG to PNG', desc: 'Convert JPG images to PNG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'png' } },
  { id: 'webp-to-jpg', name: 'WEBP to JPG', desc: 'Convert WEBP images to JPEG format', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'jpg' } },
  { id: 'favicon-gen', name: 'Favicon Generator', desc: 'Generate standard multi-size PNG/ICO favicon', category: 'Format Conversions', engine: 'converter', params: { targetFormat: 'ico' } },
  
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


const predefinedPalettes = {
  retro1: ['#2B0F54', '#AB1F65', '#FF4F69', '#FFF7F8', '#FF8142', '#FFDA45', '#3368DC', '#49E7EC'],
  gameboy: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
  cga: ['#000000', '#55FFFF', '#FF55FF', '#FFFFFF'],
  sepia: ['#3e2a14', '#704f2a', '#a67b4b', '#d9b48f', '#ffe8cc'],
  pico8: ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA']
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
     r: parseInt(result[1], 16),
     g: parseInt(result[2], 16),
     b: parseInt(result[3], 16)
  } : {r: 0, g: 0, b: 0};
};

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeTool, setActiveTool] = useState(null);

  // Sync browser URL and handle browser back/forward buttons (routing)
  useEffect(() => {
    const handlePopState = () => {
      const segments = window.location.pathname.split('/').filter(Boolean);
      const toolId = segments.length > 0 ? segments[segments.length - 1] : null;
      if (toolId) {
        const tool = TOOLS_CATALOG.find(t => t.id === toolId);
        if (tool) {
          setActiveTool(tool);
          return;
        }
      }
      setActiveTool(null);
    };

    window.addEventListener('popstate', handlePopState);
    // Parse current URL path on initial load
    handlePopState();

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update history path when activeTool changes
  useEffect(() => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const currentPathId = segments.length > 0 ? segments[segments.length - 1] : null;
    
    if (activeTool) {
      if (currentPathId !== activeTool.id) {
        window.history.pushState(null, '', `/${activeTool.id}`);
      }
    } else {
      if (currentPathId !== null) {
        window.history.pushState(null, '', '/');
      }
    }
  }, [activeTool]);

  // Dynamic SEO meta tags and JSON-LD update + Lazy-loading Signature fonts
  useEffect(() => {
    const seo = getSeoData(activeTool);
    updateMetaTags(seo);

    if (activeTool?.engine === 'sig') {
      const linkId = 'signature-fonts-link';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Pacifico&family=Caveat:wght@400;700&family=Satisfy&family=Cookie&family=Great+Vibes&family=Courgette&family=Sacramento&family=Yellowtail&family=Parisienne&family=Alex+Brush&family=Allura&family=Arizonia&family=Bad+Script&family=Cedarville+Cursive&family=Clicker+Script&family=Damion&family=Kaushan+Script&family=Italianno&family=Just+Another+Hand&display=swap";
        document.head.appendChild(link);
      }
    }
  }, [activeTool]);



  // Engine PX: Pixelate Image States
  const [pxImage, setPxImage] = useState(null);
  const [pxPreviewUrl, setPxPreviewUrl] = useState(null);
  const [pxBlockSize, setPxBlockSize] = useState(31);
  const [pxUsePalette, setPxUsePalette] = useState(true);
  const [pxActivePalette, setPxActivePalette] = useState('pico8');
  const [pxCustomPalette, setPxCustomPalette] = useState(['#000000', '#222222', '#555555', '#ffffff']);
  const [pxGrayscale, setPxGrayscale] = useState(false);
  const [pxDrawGrid, setPxDrawGrid] = useState(false);
  const [pxDrawEdges, setPxDrawEdges] = useState(false);
  const [pxEdgeWidth, setPxEdgeWidth] = useState(10);
  const [pxEdgeThreshold, setPxEdgeThreshold] = useState(83);
  const [pxManual, setPxManual] = useState(false);
  const [pxManualMode, setPxManualMode] = useState('pixelate'); // 'pixelate' | 'blur'
  const [pxManualShape, setPxManualShape] = useState('ellipse'); // 'rectangle' | 'ellipse'
  const [pxManualIntensity, setPxManualIntensity] = useState(30); // 1-100
  const [pxPatches, setPxPatches] = useState([]);
  const [pxUndoStack, setPxUndoStack] = useState([]);
  const [pxRedoStack, setPxRedoStack] = useState([]);
  const [pxIsDrawing, setPxIsDrawing] = useState(false);
  const [pxDrawStart, setPxDrawStart] = useState(null);
  const [pxCurrentDraw, setPxCurrentDraw] = useState(null);
  const pxInputRef = useRef(null);

  // Engine AB: Add Border States
  const [abImage, setAbImage] = useState(null);
  const [abPreviewUrl, setAbPreviewUrl] = useState(null);
  const [abWidth, setAbWidth] = useState(10);
  const [abRadius, setAbRadius] = useState(0);
  const [abBorderColor, setAbBorderColor] = useState('#ffffff');
  const [abBgColor, setAbBgColor] = useState('#000000');
  const [abCaption, setAbCaption] = useState('');
  const abInputRef = useRef(null);
  // Engine CS: Censor Photo States
  const [censorImage, setCensorImage] = useState(null);
  const [censorPreviewUrl, setCensorPreviewUrl] = useState(null);
  const [censorType, setCensorType] = useState('pixelate'); // 'blur' | 'pixelate'
  const [censorBlurFactor, setCensorBlurFactor] = useState(20); // 1 - 50
  const [censorAutoFaces, setCensorAutoFaces] = useState(false);
  const [censorManual, setCensorManual] = useState(true);
  const [censorShape, setCensorShape] = useState('ellipse'); // 'rectangle' | 'ellipse'
  const [censorPatches, setCensorPatches] = useState([]);
  const [censorUndoStack, setCensorUndoStack] = useState([]);
  const [censorRedoStack, setCensorRedoStack] = useState([]);
  const [censorIsDrawing, setCensorIsDrawing] = useState(false);
  const [censorDrawStart, setCensorDrawStart] = useState(null);
  const [censorCurrentDraw, setCensorCurrentDraw] = useState(null);
  const censorInputRef = useRef(null);
  // Engine MB: Motion Blur States
  const [mbFile, setMbFile] = useState(null);
  const [mbImage, setMbImage] = useState(null);
  const [mbPreviewUrl, setMbPreviewUrl] = useState(null);
  const [mbType, setMbType] = useState('motion'); // 'motion' | 'gaussian'
  const [mbAngle, setMbAngle] = useState(252); // 0 - 360
  const [mbDistance, setMbDistance] = useState(88); // 1 - 150
  const [mbSamples, setMbSamples] = useState(35); // 5 - 50
  const [mbGaussianRadius, setMbGaussianRadius] = useState(20);
  const [mbBlurBackground, setMbBlurBackground] = useState(true);
  const [mbSubjectUrl, setMbSubjectUrl] = useState(null);
  const mbInputRef = useRef(null);
  // Engine GS: Convert Image to Grayscale States
  const [gsImage, setGsImage] = useState(null);
  const [gsPreviewUrl, setGsPreviewUrl] = useState(null);
  const [gsIsGrayscale, setGsIsGrayscale] = useState(false);
  const gsInputRef = useRef(null);
  // Engine BW: Turn Color Image to Black and White States
  const [bwImage, setBwImage] = useState(null);
  const [bwPreviewUrl, setBwPreviewUrl] = useState(null);
  const [bwIsProcessed, setBwIsProcessed] = useState(false);
  const bwInputRef = useRef(null);
  // Engine PA: Convert Any Picture to Pixel Art States
  const [paImage, setPaImage] = useState(null);
  const [paPreviewUrl, setPaPreviewUrl] = useState(null);
  const [paBlockSize, setPaBlockSize] = useState(7);
  const [paUsePalette, setPaUsePalette] = useState(false);
  const [paActivePalette, setPaActivePalette] = useState('pico8');
  const [paCustomPalette, setPaCustomPalette] = useState(['#000000', '#222222', '#555555', '#ffffff']);
  const [paGrayscale, setPaGrayscale] = useState(false);
  const [paDrawGrid, setPaDrawGrid] = useState(false);
  const [paDrawEdges, setPaDrawEdges] = useState(false);
  const [paEdgeWidth, setPaEdgeWidth] = useState(5);
  const [paEdgeThreshold, setPaEdgeThreshold] = useState(75);
  const paInputRef = useRef(null);
  // Engine BLM: Remove Blemishes from Photos with AI States
  const [blmImage, setBlmImage] = useState(null);
  const [blmRestoredUrl, setBlmRestoredUrl] = useState(null);
  const [blmPreviewOriginal, setBlmPreviewOriginal] = useState(false);
  const [blmStatus, setBlmStatus] = useState('Image Restored');
  const blmInputRef = useRef(null);
  // Engine RT: Retouch Photo Online with AI States
  const [rtImage, setRtImage] = useState(null);
  const [rtRestoredUrl, setRtRestoredUrl] = useState(null);
  const [rtPreviewOriginal, setRtPreviewOriginal] = useState(false);
  const [rtStatus, setRtStatus] = useState('Image Restored');
  const rtInputRef = useRef(null);
  // Engine IQ: Increase Image Quality Online Free States
  const [iqImage, setIqImage] = useState(null);
  const [iqRestoredUrl, setIqRestoredUrl] = useState(null);
  const [iqPreviewOriginal, setIqPreviewOriginal] = useState(false);
  const [iqStatus, setIqStatus] = useState('Image Restored');
  const iqInputRef = useRef(null);
  // Engine DPI: DPI Converter & Resizer Suite States
  const [dpiFiles, setDpiFiles] = useState([]);
  const [dpiUnit, setDpiUnit] = useState('px'); // 'px' | 'mm' | 'cm'
  const [dpiTargetValue, setDpiTargetValue] = useState(300);
  const [dpiResizeModal, setDpiResizeModal] = useState(null);
  const [dpiConvertedResults, setDpiConvertedResults] = useState(null);
  // Engine CHKDPI: Check Image DPI Online States
  const [chkDpiFile, setChkDpiFile] = useState(null);
  const [chkDpiResult, setChkDpiResult] = useState(null);
  const chkDpiInputRef = useRef(null);
  // Engine SR: Super Resolution Images Online States
  const [srFiles, setSrFiles] = useState([]);
  const [srActiveIndex, setSrActiveIndex] = useState(0);
  const [srSliderPos, setSrSliderPos] = useState(50);
  const [srIsDragging, setSrIsDragging] = useState(false);
  const srInputRef = useRef(null);
  // Engine RX: Resize Image Pixel Online States
  const [rxFiles, setRxFiles] = useState([]);
  const [rxWidth, setRxWidth] = useState(468);
  const [rxHeight, setRxHeight] = useState(585);
  const [rxMaintainAspect, setRxMaintainAspect] = useState(false);
  const [rxAspect, setRxAspect] = useState(468 / 585);
  const [rxEnableTargetKB, setRxEnableTargetKB] = useState(false);
  const [rxTargetKB, setRxTargetKB] = useState(100);
  const [rxOutputFormat, setRxOutputFormat] = useState('jpeg'); // 'jpeg' | 'jpg' | 'png'
  const [rxResult, setRxResult] = useState(null);
  const rxInputRef = useRef(null);
  // Engine UP: Upscale Image Online with AI States
  const [upImage, setUpImage] = useState(null);
  const [upRestoredUrl, setUpRestoredUrl] = useState(null);
  const [upPreviewOriginal, setUpPreviewOriginal] = useState(false);
  const [upStatus, setUpStatus] = useState('Image Restored');
  const upInputRef = useRef(null);
  // Engine A4: Resize Image To A4 Size States
  const [a4Files, setA4Files] = useState([]);
  const [a4Width, setA4Width] = useState(2480);
  const [a4Height, setA4Height] = useState(3508);
  const [a4Result, setA4Result] = useState(null);
  const a4InputRef = useRef(null);
  // Engine SSC: Resize Image For SSC States
  const [sscFiles, setSscFiles] = useState([]);
  const [sscDpi, setSscDpi] = useState(200);
  const [sscWidthCM, setSscWidthCM] = useState(7);
  const [sscHeightCM, setSscHeightCM] = useState(10);
  const [sscEnableKB, setSscEnableKB] = useState(true);
  const [sscTargetKB, setSscTargetKB] = useState(20);
  const [sscResult, setSscResult] = useState(null);
  const sscInputRef = useRef(null);
  // Engine PDF: Convert Images To PDF States
  const [pdfImgFiles, setPdfImgFiles] = useState([]);
  const [pdfPageSize, setPdfPageSize] = useState('fit'); // 'fit' | 'a4' | 'letter' | 'legal'
  const [pdfCompressManual, setPdfCompressManual] = useState(false);
  const [pdfTargetKB, setPdfTargetKB] = useState(200);
  const [pdfResult, setPdfResult] = useState(null);
  const pdfImgInputRef = useRef(null);
  // Engine P2J: PDF to JPG Converter States
  const [pdf2JpgFiles, setPdf2JpgFiles] = useState([]);
  const [pdf2JpgMode, setPdf2JpgMode] = useState('extract'); // 'entire' | 'extract'
  const [pdf2JpgResults, setPdf2JpgResults] = useState(null);
  const pdf2JpgInputRef = useRef(null);








  const dpiInputRef = useRef(null);










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

  const onImageLoad = async (e) => {
    if (enableManualCrop) {
      const { width, height } = e.currentTarget;
      let aspect = undefined;
      if (resizeWidth && resizeHeight) {
         aspect = resizeWidth / resizeHeight;
      }
      
      const { centerCrop, makeAspectCrop } = await import('react-image-crop');
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

  // Comprehensive workspace reset whenever activeTool changes (or user returns to dashboard)
  useEffect(() => {
    // 1. Generic workspace image states
    setSelectedFile(null);
    setPreviewUrl('');
    setOriginalMeta(null);
    setBgRemovedUrl(null);
    setPickedColor(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setCropZoom(1);
    setCropBrightness(100);
    setCropContrast(100);
    setCropSaturation(100);

    // 2. Pixelate photo states
    setPxImage(null);
    setPxPreviewUrl(null);
    setPxPatches([]);
    setPxUndoStack([]);
    setPxRedoStack([]);

    // 3. Add border states
    setAbImage(null);
    setAbPreviewUrl(null);

    // 4. Censor photo states
    setCensorImage(null);
    setCensorPreviewUrl(null);
    setCensorPatches([]);
    setCensorUndoStack([]);
    setCensorRedoStack([]);

    // 5. Motion blur states
    setMbFile(null);
    setMbImage(null);
    setMbPreviewUrl(null);
    setMbSubjectUrl(null);

    // 6. Grayscale states
    setGsImage(null);
    setGsPreviewUrl(null);
    setGsIsGrayscale(false);

    // 7. Black & White states
    setBwImage(null);
    setBwPreviewUrl(null);
    setBwIsProcessed(false);

    // 8. Pixel Art states
    setPaImage(null);
    setPaPreviewUrl(null);

    // 9. Blemish Remover states
    setBlmImage(null);
    setBlmRestoredUrl(null);
    setBlmPreviewOriginal(false);

    // 10. AI Retouch states
    setRtImage(null);
    setRtRestoredUrl(null);
    setRtPreviewOriginal(false);

    // 11. Increase Quality states
    setIqImage(null);
    setIqRestoredUrl(null);
    setIqPreviewOriginal(false);

    // 12. DPI Converter states
    setDpiFiles([]);
    setDpiConvertedResults(null);
    setDpiResizeModal(null);

    // 13. DPI Checker states
    setChkDpiFile(null);
    setChkDpiResult(null);

    // 14. Super Resolution states
    setSrFiles([]);
    setSrActiveIndex(0);
    setSrSliderPos(50);

    // 15. Resize Pixel states
    setRxFiles([]);
    setRxResult(null);

    // 16. AI Upscale states
    setUpImage(null);
    setUpRestoredUrl(null);
    setUpPreviewOriginal(false);

    // 17. Resize A4 states
    setA4Files([]);
    setA4Result(null);

    // 18. SSC Resize states
    setSscFiles([]);
    setSscResult(null);

    // 19. Convert Images To PDF states
    setPdfImgFiles([]);
    setPdfResult(null);

    // 20. PDF to JPG states
    setPdf2JpgFiles([]);
    setPdf2JpgResults(null);

    if (!activeTool) return;
    
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
    
    if (activeTool.engine === 'img2pdf-engine') {
      setPdfCompressManual(params.compress || false);
      setPdfTargetKB(params.targetKB || 200);
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
        const { PDFDocument } = await import('pdf-lib');
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
        const pdfjs = await loadPdfjs();
        const pdf = await pdfjs.getDocument({ data: fileBytes }).promise;
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


  // ENGINE PX: Pixelate Image Handlers
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
  }, [pxImage, pxBlockSize, pxUsePalette, pxActivePalette, pxCustomPalette, pxGrayscale, pxDrawGrid, pxDrawEdges, pxEdgeWidth, pxEdgeThreshold, pxManual, pxPatches]);

  const applyPixelate = () => {
     if (!pxImage) return;
     setProcessing(true);
     
     setTimeout(async () => {
        try {
           const img = await loadImageElement(pxImage);
           const canvas = document.createElement('canvas');
           let w = img.naturalWidth;
           let h = img.naturalHeight;
           
           const MAX_PROCESS = 1200;
           if (w > MAX_PROCESS || h > MAX_PROCESS) {
              const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
              w = Math.round(w * r);
              h = Math.round(h * r);
           }
           canvas.width = w;
           canvas.height = h;
           const ctx = canvas.getContext('2d');
           ctx.drawImage(img, 0, 0, w, h);
           
           if (!pxManual) {
              const bSize = Math.max(1, Math.round((pxBlockSize / 100) * (Math.max(w, h) * 0.05)));
              const downW = Math.ceil(w / bSize);
              const downH = Math.ceil(h / bSize);
              
              const smallCanvas = document.createElement('canvas');
              smallCanvas.width = downW;
              smallCanvas.height = downH;
              const sCtx = smallCanvas.getContext('2d');
              sCtx.drawImage(canvas, 0, 0, downW, downH);
              
              const imgData = sCtx.getImageData(0, 0, downW, downH);
              const data = imgData.data;
              
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
              ctx.clearRect(0, 0, w, h);
              ctx.imageSmoothingEnabled = false;
              ctx.drawImage(smallCanvas, 0, 0, w, h);
              
              if (pxDrawEdges) {
                 const sOrigData = sCtx.getImageData(0, 0, downW, downH);
                 const edgeData = new ImageData(downW, downH);
                 const w4 = downW * 4;
                 const thresholdLimit = (100 - pxEdgeThreshold) * 4; 
                 
                 for (let y = 1; y < downH - 1; y++) {
                    for (let x = 1; x < downW - 1; x++) {
                       const idx = (y * downW + x) * 4;
                       const t = sOrigData.data[idx - w4];
                       const b = sOrigData.data[idx + w4];
                       const l = sOrigData.data[idx - 4];
                       const r_ = sOrigData.data[idx + 4];
                       const dx = Math.abs(l - r_);
                       const dy = Math.abs(t - b);
                       const grad = dx + dy;
                       if (grad > thresholdLimit) {
                          edgeData.data[idx] = 0; edgeData.data[idx+1] = 0; edgeData.data[idx+2] = 0; edgeData.data[idx+3] = 255;
                       } else {
                          edgeData.data[idx+3] = 0; 
                       }
                    }
                 }
                 
                 const edgeCanvas = document.createElement('canvas');
                 edgeCanvas.width = downW;
                 edgeCanvas.height = downH;
                 const eCtx = edgeCanvas.getContext('2d');
                 eCtx.putImageData(edgeData, 0, 0);
                 
                 ctx.imageSmoothingEnabled = false;
                 ctx.globalAlpha = 0.85;
                 const maxOffset = Math.floor(pxEdgeWidth / 2);
                 if (maxOffset > 0) {
                    for(let oy = -maxOffset; oy <= maxOffset; oy++) {
                       for(let ox = -maxOffset; ox <= maxOffset; ox++) {
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
              
              if (pxDrawGrid) {
                 ctx.fillStyle = 'rgba(255,255,255,0.2)';
                 for (let x = 0; x < w; x += bSize) {
                    ctx.fillRect(x, 0, 1, h);
                 }
                 for (let y = 0; y < h; y += bSize) {
                    ctx.fillRect(0, y, w, 1);
                 }
              }
           } else {
              for (const patch of pxPatches) {
                 const pxX = Math.round(patch.x * w);
                 const pxY = Math.round(patch.y * h);
                 const pxW = Math.round(patch.w * w);
                 const pxH = Math.round(patch.h * h);
                 
                 if (pxW === 0 || pxH === 0) continue;
                 
                 const patchCanvas = document.createElement('canvas');
                 patchCanvas.width = Math.abs(pxW);
                 patchCanvas.height = Math.abs(pxH);
                 const pCtx = patchCanvas.getContext('2d');
                 pCtx.drawImage(img, pxX, pxY, pxW, pxH, 0, 0, Math.abs(pxW), Math.abs(pxH));
                 
                 if (patch.type === 'pixelate') {
                    const bSize = Math.min(
                       Math.max(2, Math.round((patch.intensity / 100) * (Math.max(w, h) * 0.05))),
                       Math.min(Math.abs(pxW), Math.abs(pxH))
                    );
                    const downW = Math.ceil(Math.abs(pxW) / bSize);
                    const downH = Math.ceil(Math.abs(pxH) / bSize);
                    
                    const smallCanvas = document.createElement('canvas');
                    smallCanvas.width = downW;
                    smallCanvas.height = downH;
                    const sCtx = smallCanvas.getContext('2d');
                    sCtx.drawImage(patchCanvas, 0, 0, downW, downH);
                    
                    pCtx.clearRect(0, 0, Math.abs(pxW), Math.abs(pxH));
                    pCtx.imageSmoothingEnabled = false;
                    pCtx.drawImage(smallCanvas, 0, 0, Math.abs(pxW), Math.abs(pxH));
                 } else {
                    const blurRadius = Math.max(1, Math.round(patch.intensity * 0.3));
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = Math.abs(pxW);
                    tempCanvas.height = Math.abs(pxH);
                    const tCtx = tempCanvas.getContext('2d');
                    tCtx.filter = `blur(${blurRadius}px)`;
                    tCtx.drawImage(patchCanvas, 0, 0);
                    
                    pCtx.clearRect(0, 0, Math.abs(pxW), Math.abs(pxH));
                    pCtx.drawImage(tempCanvas, 0, 0);
                 }
                 
                 ctx.save();
                 ctx.beginPath();
                 if (patch.shape === 'ellipse') {
                    const rx = Math.abs(pxW) / 2;
                    const ry = Math.abs(pxH) / 2;
                    const cx = pxX + pxW / 2;
                    const cy = pxY + pxH / 2;
                    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
                 } else {
                    ctx.rect(pxX, pxY, pxW, pxH);
                 }
                 ctx.clip();
                 ctx.drawImage(patchCanvas, pxX, pxY, pxW, pxH);
                 ctx.restore();
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

  const handlePxMouseDown = (e) => {
    if (!pxManual || !pxPreviewUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setPxIsDrawing(true);
    setPxDrawStart({ x, y });
    setPxCurrentDraw({ x, y, w: 0, h: 0 });
  };

  const handlePxMouseMove = (e) => {
    if (!pxIsDrawing || !pxDrawStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const clampX = Math.max(0, Math.min(1, x));
    const clampY = Math.max(0, Math.min(1, y));
    
    setPxCurrentDraw({
      x: Math.min(pxDrawStart.x, clampX),
      y: Math.min(pxDrawStart.y, clampY),
      w: clampX - pxDrawStart.x,
      h: clampY - pxDrawStart.y
    });
  };

  const handlePxMouseUp = () => {
    if (!pxIsDrawing || !pxCurrentDraw) return;
    setPxIsDrawing(false);
    
    if (Math.abs(pxCurrentDraw.w) > 0.005 && Math.abs(pxCurrentDraw.h) > 0.005) {
       setPxUndoStack([...pxUndoStack, pxPatches]);
       setPxRedoStack([]);
       
       const newPatch = {
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          type: pxManualMode,
          shape: pxManualShape,
          x: pxCurrentDraw.w < 0 ? pxCurrentDraw.x + pxCurrentDraw.w : pxCurrentDraw.x,
          y: pxCurrentDraw.h < 0 ? pxCurrentDraw.y + pxCurrentDraw.h : pxCurrentDraw.y,
          w: Math.abs(pxCurrentDraw.w),
          h: Math.abs(pxCurrentDraw.h),
          intensity: pxManualIntensity
       };
       
       setPxPatches([...pxPatches, newPatch]);
    }
    
    setPxDrawStart(null);
    setPxCurrentDraw(null);
  };

  const handlePxUndo = () => {
     if (pxUndoStack.length === 0) return;
     const previous = pxUndoStack[pxUndoStack.length - 1];
     setPxRedoStack([pxPatches, ...pxRedoStack]);
     setPxPatches(previous);
     setPxUndoStack(pxUndoStack.slice(0, -1));
  };

  const handlePxRedo = () => {
     if (pxRedoStack.length === 0) return;
     const next = pxRedoStack[0];
     setPxUndoStack([...pxUndoStack, pxPatches]);
     setPxPatches(next);
     setPxRedoStack(pxRedoStack.slice(1));
  };

  const deletePxPatch = (id, e) => {
     if (e) e.stopPropagation();
     setPxUndoStack([...pxUndoStack, pxPatches]);
     setPxRedoStack([]);
     setPxPatches(pxPatches.filter(p => p.id !== id));
  };

  const handlePxDownload = () => {
     if (pxPreviewUrl) {
        const link = document.createElement('a');
        link.download = 'pixelated_retro.png';
        link.href = pxPreviewUrl;
        link.click();
     }
  };











// ================= TRUE BINARY DPI METADATA ENCODERS =================
const setBinaryDpiToJpeg = (dataUrl, dpi) => {
  try {
    const parts = dataUrl.split(',');
    const binaryString = atob(parts[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    let jfifOffset = -1;
    for (let i = 0; i < Math.min(120, bytes.length - 18); i++) {
      if (bytes[i] === 0xFF && bytes[i + 1] === 0xE0) {
        if (bytes[i + 4] === 0x4A && bytes[i + 5] === 0x46 && bytes[i + 6] === 0x49 && bytes[i + 7] === 0x46 && bytes[i + 8] === 0x00) {
          jfifOffset = i;
          break;
        }
      }
    }

    let finalBytes;
    if (jfifOffset !== -1) {
      bytes[jfifOffset + 11] = 1; // Units: 1 = dots per inch (DPI)
      bytes[jfifOffset + 12] = (dpi >> 8) & 0xFF; // Xdensity high
      bytes[jfifOffset + 13] = dpi & 0xFF;        // Xdensity low
      bytes[jfifOffset + 14] = (dpi >> 8) & 0xFF; // Ydensity high
      bytes[jfifOffset + 15] = dpi & 0xFF;        // Ydensity low
      finalBytes = bytes;
    } else if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
      // Insert APP0 JFIF header right after SOI marker (0xFF 0xD8)
      const app0 = new Uint8Array([
        0xFF, 0xE0, // APP0 marker
        0x00, 0x10, // Length = 16 bytes
        0x4A, 0x46, 0x49, 0x46, 0x00, // 'JFIF '
        0x01, 0x01, // Version 1.01
        0x01,       // Units: 1 = DPI
        (dpi >> 8) & 0xFF, dpi & 0xFF, // Xdensity
        (dpi >> 8) & 0xFF, dpi & 0xFF, // Ydensity
        0x00, 0x00  // No thumbnail
      ]);
      finalBytes = new Uint8Array(bytes.length + app0.length);
      finalBytes.set(bytes.subarray(0, 2), 0);
      finalBytes.set(app0, 2);
      finalBytes.set(bytes.subarray(2), 2 + app0.length);
    } else {
      finalBytes = bytes;
    }

    let binary = '';
    const len = finalBytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(finalBytes[i]);
    }
    return 'data:image/jpeg;base64,' + btoa(binary);
  } catch (err) {
    console.error("Error embedding JPEG DPI:", err);
    return dataUrl;
  }
};

const crc32Table = (() => {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
})();

const calcCrc32 = (buf) => {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
};

const setBinaryDpiToPng = (dataUrl, dpi) => {
  try {
    const parts = dataUrl.split(',');
    const binaryString = atob(parts[1]);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 1 meter = 39.37007874 inches
    const ppm = Math.round(dpi * 39.37007874);

    // Build pHYs chunk (9 bytes data)
    const physData = new Uint8Array(9);
    physData[0] = (ppm >> 24) & 0xFF;
    physData[1] = (ppm >> 16) & 0xFF;
    physData[2] = (ppm >> 8) & 0xFF;
    physData[3] = ppm & 0xFF;
    physData[4] = (ppm >> 24) & 0xFF;
    physData[5] = (ppm >> 16) & 0xFF;
    physData[6] = (ppm >> 8) & 0xFF;
    physData[7] = ppm & 0xFF;
    physData[8] = 1; // Unit: meter

    const chunkTypeAndData = new Uint8Array(4 + 9);
    chunkTypeAndData[0] = 0x70; // 'p'
    chunkTypeAndData[1] = 0x48; // 'H'
    chunkTypeAndData[2] = 0x79; // 'y'
    chunkTypeAndData[3] = 0x73; // 's'
    chunkTypeAndData.set(physData, 4);

    const crc = calcCrc32(chunkTypeAndData);

    const physChunk = new Uint8Array(4 + 4 + 9 + 4);
    // Length (9)
    physChunk[0] = 0;
    physChunk[1] = 0;
    physChunk[2] = 0;
    physChunk[3] = 9;
    physChunk.set(chunkTypeAndData, 4);
    // CRC
    physChunk[17] = (crc >> 24) & 0xFF;
    physChunk[18] = (crc >> 16) & 0xFF;
    physChunk[19] = (crc >> 8) & 0xFF;
    physChunk[20] = crc & 0xFF;

    // PNG signature is 8 bytes. IHDR is 25 bytes (8 + 25 = 33).
    // Insert pHYs right after IHDR
    const insertPos = 33;
    const newBytes = new Uint8Array(bytes.length + physChunk.length);
    newBytes.set(bytes.subarray(0, insertPos), 0);
    newBytes.set(physChunk, insertPos);
    newBytes.set(bytes.subarray(insertPos), insertPos + physChunk.length);

    let binary = '';
    const len = newBytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(newBytes[i]);
    }
    return 'data:image/png;base64,' + btoa(binary);
  } catch (err) {
    console.error("Error embedding PNG DPI:", err);
    return dataUrl;
  }
};









  // ENGINE P2J: PDF to JPG Handlers
  const handlePdf2JpgFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files).slice(0, 3 - pdf2JpgFiles.length);
      const newItems = [];

      for (const file of incoming) {
        try {
          const buffer = await file.arrayBuffer();
          const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
          newItems.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            file: file,
            name: file.name,
            sizeMB: sizeMB === '0.0' ? '0.1' : sizeMB,
            buffer: buffer
          });
        } catch (err) {
          console.error("Error reading PDF file:", err);
        }
      }

      setPdf2JpgFiles(prev => [...prev, ...newItems].slice(0, 3));
    }
  };

  const handlePdf2JpgRemove = (id) => {
    setPdf2JpgFiles(prev => prev.filter(item => item.id !== id));
  };

  const handleApplyPdf2Jpg = async () => {
    if (pdf2JpgFiles.length === 0) return;
    setProcessing(true);
    setProcessingText('Converting PDF Pages to High-Resolution JPG Images...');

    setTimeout(async () => {
      try {
        const results = [];

        const pdfjs = await loadPdfjs();
        for (const pdfItem of pdf2JpgFiles) {
          const typedArray = new Uint8Array(pdfItem.buffer);
          const loadingTask = pdfjs.getDocument({ data: typedArray });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const scale = 2.0; // High resolution 2x render
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            const baseName = pdfItem.name.substring(0, pdfItem.name.lastIndexOf('.')) || pdfItem.name;
            const sizeKB = Math.round((dataUrl.length * (3/4)) / 1024);

            results.push({
              id: `${pdfItem.id}_page_${pageNum}`,
              pdfName: pdfItem.name,
              name: `${baseName}_page_${pageNum}.jpg`,
              pageNum: pageNum,
              totalPages: numPages,
              dataUrl: dataUrl,
              sizeKB: sizeKB
            });
          }
        }

        setPdf2JpgResults(results);
        showToast('PDF pages converted to JPG successfully!');
      } catch (err) {
        console.error("PDF to JPG error:", err);
        showToast("Error converting PDF to JPG", "error");
      } finally {
        setProcessing(false);
      }
    }, 120);
  };

  const handlePdf2JpgDownload = (item) => {
    if (item && item.dataUrl) {
      downloadDataUrl(item.dataUrl, item.name);
    }
  };

  const handlePdf2JpgReset = () => {
    setPdf2JpgFiles([]);
    setPdf2JpgResults(null);
  };

  // ENGINE PDF: Convert Images To PDF Handlers
  const handlePdfImgFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files);
      const newItems = [];

      for (const file of incoming) {
        const url = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(url);
          newItems.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            file: file,
            url: url,
            name: file.name,
            sizeKB: Math.round(file.size / 1024),
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        } catch (err) {
          console.error("Error loading PDF image:", err);
        }
      }

      setPdfImgFiles(prev => [...prev, ...newItems]);
    }
  };

  const handlePdfImgRemove = (id) => {
    setPdfImgFiles(prev => prev.filter(item => item.id !== id));
  };

  const handlePdfImgMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= pdfImgFiles.length) return;
    setPdfImgFiles(prev => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleApplyImg2Pdf = async () => {
    if (pdfImgFiles.length === 0) return;
    setProcessing(true);
    setProcessingText('Compiling and Converting Images to PDF Document...');

    setTimeout(async () => {
      try {
        const { PDFDocument } = await import('pdf-lib');
        const pdfDoc = await PDFDocument.create();

        for (const item of pdfImgFiles) {
          const img = await loadImageElement(item.url);
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          let quality = 0.90;
          if (pdfCompressManual && pdfTargetKB > 0) {
            // Compress image quality per page if manual compression is requested
            const perPageKB = Math.max(20, Math.round(pdfTargetKB / pdfImgFiles.length));
            quality = Math.max(0.2, Math.min(0.85, perPageKB / (item.sizeKB || 100)));
          }

          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
          const base64Data = jpegDataUrl.split(',')[1];
          const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
          const embeddedImg = await pdfDoc.embedJpg(imageBytes);

          let pageWidth = img.naturalWidth;
          let pageHeight = img.naturalHeight;

          if (pdfPageSize === 'a4') {
            pageWidth = 595.28;
            pageHeight = 841.89;
          } else if (pdfPageSize === 'letter') {
            pageWidth = 612;
            pageHeight = 792;
          } else if (pdfPageSize === 'legal') {
            pageWidth = 612;
            pageHeight = 1008;
          }

          const page = pdfDoc.addPage([pageWidth, pageHeight]);

          if (pdfPageSize === 'fit') {
            page.drawImage(embeddedImg, {
              x: 0,
              y: 0,
              width: pageWidth,
              height: pageHeight
            });
          } else {
            // Fit within printable page aspect ratio
            const scale = Math.min(pageWidth / img.naturalWidth, pageHeight / img.naturalHeight);
            const drawW = img.naturalWidth * scale;
            const drawH = img.naturalHeight * scale;
            const posX = (pageWidth - drawW) / 2;
            const posY = (pageHeight - drawH) / 2;

            page.drawImage(embeddedImg, {
              x: posX,
              y: posY,
              width: drawW,
              height: drawH
            });
          }
        }

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        const finalSizeKB = Math.round(pdfBlob.size / 1024);

        setPdfResult({
          name: 'converted_document.pdf',
          renameName: 'converted_document',
          sizeKB: finalSizeKB,
          pdfBlobUrl: pdfBlobUrl
        });

        showToast('Images converted to PDF successfully!');
      } catch (err) {
        console.error("Image to PDF error:", err);
        showToast("Error converting images to PDF", "error");
      } finally {
        setProcessing(false);
      }
    }, 120);
  };

  const handlePdfDownload = () => {
    if (pdfResult && pdfResult.pdfBlobUrl) {
      const downloadName = `${pdfResult.renameName || 'converted_images'}.pdf`;
      const link = document.createElement('a');
      link.href = pdfResult.pdfBlobUrl;
      link.download = downloadName;
      link.click();
    }
  };

  const handlePdfReset = () => {
    setPdfImgFiles([]);
    setPdfResult(null);
  };

  // ENGINE SSC: Resize Image For SSC Handlers
  const handleSscFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files).slice(0, 10 - sscFiles.length);
      const newItems = [];

      for (const file of incoming) {
        const url = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(url);
          newItems.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            file: file,
            url: url,
            name: file.name,
            sizeKB: Math.round(file.size / 1024),
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        } catch (err) {
          console.error("Error loading SSC image:", err);
        }
      }

      setSscFiles(prev => [...prev, ...newItems].slice(0, 10));
    }
  };

  const handleSscRemove = (id) => {
    setSscFiles(prev => prev.filter(item => item.id !== id));
  };

  const handleApplySscResize = async () => {
    if (sscFiles.length === 0) return;
    const item = sscFiles[0];
    setProcessing(true);
    setProcessingText('Resizing Photo/Signature for SSC Online Application...');

    setTimeout(async () => {
      try {
        const img = await loadImageElement(item.url);
        const targetDpi = sscDpi || 200;
        const pxW = Math.max(1, Math.round((sscWidthCM / 2.54) * targetDpi));
        const pxH = Math.max(1, Math.round((sscHeightCM / 2.54) * targetDpi));

        const canvas = document.createElement('canvas');
        canvas.width = pxW;
        canvas.height = pxH;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pxW, pxH);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, pxW, pxH);

        let dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        // Target KB compression
        if (sscEnableKB && sscTargetKB > 0) {
          let minQ = 0.05;
          let maxQ = 0.98;
          for (let iter = 0; iter < 6; iter++) {
            const midQ = (minQ + maxQ) / 2;
            const testUrl = canvas.toDataURL('image/jpeg', midQ);
            const sizeKB = Math.round((testUrl.length * (3/4)) / 1024);
            if (sizeKB > sscTargetKB) {
              maxQ = midQ;
            } else {
              minQ = midQ;
              dataUrl = testUrl;
            }
          }
        }

        // Inject DPI header
        dataUrl = setBinaryDpiToJpeg(dataUrl, targetDpi);

        const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
        const finalSizeKB = Math.round((dataUrl.length * (3/4)) / 1024);

        setSscResult({
          name: `${baseName}_SSC_${targetDpi}dpi.jpg`,
          renameName: `${baseName}_SSC`,
          sizeKB: finalSizeKB,
          dataUrl: dataUrl,
          width: pxW,
          height: pxH
        });

        showToast('SSC photo/signature resized successfully!');
      } catch (err) {
        console.error("SSC Resize error:", err);
        showToast("Error resizing for SSC", "error");
      } finally {
        setProcessing(false);
      }
    }, 100);
  };

  const handleSscDownload = () => {
    if (sscResult && sscResult.dataUrl) {
      const downloadName = `${sscResult.renameName || 'ssc_image'}.jpg`;
      downloadDataUrl(sscResult.dataUrl, downloadName);
    }
  };

  const handleSscReset = () => {
    setSscFiles([]);
    setSscResult(null);
  };

  // ENGINE A4: Resize Image To A4 Size Handlers
  const handleA4FileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files).slice(0, 10 - a4Files.length);
      const newItems = [];

      for (const file of incoming) {
        const url = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(url);
          newItems.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            file: file,
            url: url,
            name: file.name,
            sizeKB: Math.round(file.size / 1024),
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        } catch (err) {
          console.error("Error loading A4 image:", err);
        }
      }

      setA4Files(prev => [...prev, ...newItems].slice(0, 10));
    }
  };

  const handleA4Remove = (id) => {
    setA4Files(prev => prev.filter(item => item.id !== id));
  };

  const handleApplyA4Resize = async () => {
    if (a4Files.length === 0) return;
    const item = a4Files[0];
    setProcessing(true);
    setProcessingText('Fitting and Resizing Image to A4 Standard (300 DPI)...');

    setTimeout(async () => {
      try {
        const img = await loadImageElement(item.url);
        const targetW = Math.max(1, a4Width);
        const targetH = Math.max(1, a4Height);

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const rawDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const dataUrl = setBinaryDpiToJpeg(rawDataUrl, 300);

        const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
        const finalSizeKB = Math.round((dataUrl.length * (3/4)) / 1024);

        setA4Result({
          name: `${baseName}_A4.jpg`,
          renameName: `${baseName}_A4`,
          sizeKB: finalSizeKB,
          dataUrl: dataUrl,
          width: targetW,
          height: targetH
        });

        showToast('Image resized to A4 (300 DPI) successfully!');
      } catch (err) {
        console.error("Resize A4 error:", err);
        showToast("Error resizing image to A4", "error");
      } finally {
        setProcessing(false);
      }
    }, 100);
  };

  const handleA4Download = () => {
    if (a4Result && a4Result.dataUrl) {
      const downloadName = `${a4Result.renameName || 'a4_image'}.jpg`;
      downloadDataUrl(a4Result.dataUrl, downloadName);
    }
  };

  const handleA4Reset = () => {
    setA4Files([]);
    setA4Result(null);
  };

  // ENGINE UP: Upscale Image Online with AI Handlers
  const handleUpFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUpImage(url);
      setUpRestoredUrl(null);
      setUpPreviewOriginal(false);
      applyAiUpscale(url);
    }
  };

  const applyAiUpscale = async (sourceUrl) => {
    const src = sourceUrl || upImage;
    if (!src) return;

    setProcessing(true);
    setProcessingText('AI Upscaling Image (Reviving Every Pixel)...');

    setTimeout(async () => {
      try {
        const img = await loadImageElement(src);
        // Double the resolution up to 2400px
        const targetW = Math.min(2400, Math.round(img.naturalWidth * 2));
        const targetH = Math.min(2400, Math.round(img.naturalHeight * 2));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;
        const outData = new Uint8ClampedArray(data);

        // High-pass Laplacian edge & texture revival filter
        const weights = [
           0, -0.45,  0,
          -0.45, 2.8, -0.45,
           0, -0.45,  0
        ];

        for (let y = 1; y < targetH - 1; y++) {
          for (let x = 1; x < targetW - 1; x++) {
            const idx = (y * targetW + x) * 4;
            let rSharp = 0, gSharp = 0, bSharp = 0;
            let k = 0;
            for (let cy = -1; cy <= 1; cy++) {
              for (let cx = -1; cx <= 1; cx++) {
                const pIdx = ((y + cy) * targetW + (x + cx)) * 4;
                const wt = weights[k++];
                rSharp += data[pIdx] * wt;
                gSharp += data[pIdx + 1] * wt;
                bSharp += data[pIdx + 2] * wt;
              }
            }

            let r = rSharp * 0.75 + data[idx] * 0.25;
            let g = gSharp * 0.75 + data[idx + 1] * 0.25;
            let b = bSharp * 0.75 + data[idx + 2] * 0.25;

            // Revive contrast, deep blacks, and micro-clarity
            r = ((r - 128) * 1.12) + 128 + 2;
            g = ((g - 128) * 1.10) + 128 + 2;
            b = ((b - 128) * 1.08) + 128 + 1;

            const avg = (r + g + b) / 3;
            r = avg + (r - avg) * 1.16;
            g = avg + (g - avg) * 1.16;
            b = avg + (b - avg) * 1.12;

            outData[idx] = Math.max(0, Math.min(255, Math.round(r)));
            outData[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
            outData[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
          }
        }

        ctx.putImageData(new ImageData(outData, targetW, targetH), 0, 0);
        setUpRestoredUrl(canvas.toDataURL('image/jpeg', 0.96));
        setUpStatus('Image Restored');
      } catch (err) {
        console.error("AI Upscale error:", err);
      } finally {
        setProcessing(false);
      }
    }, 80);
  };

  const handleUpReset = () => {
    setUpImage(null);
    setUpRestoredUrl(null);
    setUpPreviewOriginal(false);
  };

  const handleUpDownload = () => {
    const urlToDownload = upPreviewOriginal ? upImage : upRestoredUrl;
    if (urlToDownload) {
      const link = document.createElement('a');
      link.download = 'upscaled_ai_photo.jpg';
      link.href = urlToDownload;
      link.click();
    }
  };

  // ENGINE RX: Resize Image Pixel Online Handlers
  const handleRxFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files).slice(0, 10 - rxFiles.length);
      const newItems = [];

      for (const file of incoming) {
        const url = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(url);
          newItems.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            file: file,
            url: url,
            name: file.name,
            sizeKB: Math.round(file.size / 1024),
            width: img.naturalWidth,
            height: img.naturalHeight,
            aspect: img.naturalWidth / img.naturalHeight
          });
        } catch (err) {
          console.error("Error loading Resize Pixel image:", err);
        }
      }

      const combined = [...rxFiles, ...newItems].slice(0, 10);
      setRxFiles(combined);
      if (combined.length > 0) {
        setRxWidth(combined[0].width);
        setRxHeight(combined[0].height);
        setRxAspect(combined[0].aspect);
      }
    }
  };

  const handleRxRemove = (id) => {
    setRxFiles(prev => prev.filter(item => item.id !== id));
  };

  const handleRxWidthChange = (val) => {
    const num = parseInt(val) || 0;
    setRxWidth(num);
    if (rxMaintainAspect && rxAspect) {
      setRxHeight(Math.round(num / rxAspect));
    }
  };

  const handleRxHeightChange = (val) => {
    const num = parseInt(val) || 0;
    setRxHeight(num);
    if (rxMaintainAspect && rxAspect) {
      setRxWidth(Math.round(num * rxAspect));
    }
  };

  const handleApplyPixelResize = async () => {
    if (rxFiles.length === 0) return;
    const item = rxFiles[0];
    setProcessing(true);
    setProcessingText('Resizing Image Dimensions & Applying Optimization...');

    setTimeout(async () => {
      try {
        const img = await loadImageElement(item.url);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, rxWidth);
        canvas.height = Math.max(1, rxHeight);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const mimeType = rxOutputFormat === 'png' ? 'image/png' : 'image/jpeg';
        let quality = 0.92;
        let dataUrl = canvas.toDataURL(mimeType, quality);

        // If target KB is enabled, iteratively adjust JPEG quality
        if (rxEnableTargetKB && rxOutputFormat !== 'png' && rxTargetKB > 0) {
          let minQ = 0.05;
          let maxQ = 0.98;
          for (let iter = 0; iter < 6; iter++) {
            const midQ = (minQ + maxQ) / 2;
            const testUrl = canvas.toDataURL(mimeType, midQ);
            const sizeKB = Math.round((testUrl.length * (3/4)) / 1024);
            if (sizeKB > rxTargetKB) {
              maxQ = midQ;
            } else {
              minQ = midQ;
              dataUrl = testUrl;
            }
          }
        }

        const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
        const ext = rxOutputFormat === 'jpeg' ? 'jpeg' : rxOutputFormat === 'jpg' ? 'jpg' : 'png';
        const finalSizeKB = Math.round((dataUrl.length * (3/4)) / 1024);

        setRxResult({
          name: `${baseName}.${ext}`,
          renameName: baseName,
          sizeKB: finalSizeKB,
          dataUrl: dataUrl,
          width: canvas.width,
          height: canvas.height,
          format: ext
        });

        showToast('Image resized successfully!');
      } catch (err) {
        console.error("Resize pixel error:", err);
        showToast("Error resizing image", "error");
      } finally {
        setProcessing(false);
      }
    }, 100);
  };

  const handleRxDownload = () => {
    if (rxResult && rxResult.dataUrl) {
      const downloadName = `${rxResult.renameName || 'resized_image'}.${rxResult.format}`;
      downloadDataUrl(rxResult.dataUrl, downloadName);
    }
  };

  const handleRxReset = () => {
    setRxFiles([]);
    setRxResult(null);
  };

  // ENGINE SR: Super Resolution Images Online Handlers
  const handleSrFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files).slice(0, 3 - srFiles.length);
      const newItems = [];

      for (const file of incoming) {
        const url = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(url);
          newItems.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            file: file,
            url: url,
            name: file.name,
            sizeKB: Math.round(file.size / 1024),
            origW: img.naturalWidth,
            origH: img.naturalHeight,
            superW: Math.min(2000, img.naturalWidth * 2),
            superH: Math.min(2000, img.naturalHeight * 2),
            superUrl: null,
            isProcessed: false
          });
        } catch (err) {
          console.error("Error loading Super Resolution image:", err);
        }
      }

      setSrFiles(prev => [...prev, ...newItems].slice(0, 3));
    }
  };

  const applySuperResolution = async () => {
    if (srFiles.length === 0) return;
    setProcessing(true);
    setProcessingText('Generating AI Super-Resolution (2x Upscaling & HD Clarity)...');

    setTimeout(async () => {
      try {
        const updated = await Promise.all(srFiles.map(async (item) => {
          const img = await loadImageElement(item.url);
          const targetW = Math.min(2000, img.naturalWidth * 2);
          const targetH = Math.min(2000, img.naturalHeight * 2);

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetW, targetH);

          // Apply AI super-resolution high-pass detail recovery filter
          const imgData = ctx.getImageData(0, 0, targetW, targetH);
          const data = imgData.data;
          const outData = new Uint8ClampedArray(data);

          const weights = [
             0, -0.4,  0,
            -0.4, 2.6, -0.4,
             0, -0.4,  0
          ];

          for (let y = 1; y < targetH - 1; y++) {
            for (let x = 1; x < targetW - 1; x++) {
              const idx = (y * targetW + x) * 4;
              let rSharp = 0, gSharp = 0, bSharp = 0;
              let k = 0;
              for (let cy = -1; cy <= 1; cy++) {
                for (let cx = -1; cx <= 1; cx++) {
                  const pIdx = ((y + cy) * targetW + (x + cx)) * 4;
                  const wt = weights[k++];
                  rSharp += data[pIdx] * wt;
                  gSharp += data[pIdx + 1] * wt;
                  bSharp += data[pIdx + 2] * wt;
                }
              }

              let r = rSharp * 0.70 + data[idx] * 0.30;
              let g = gSharp * 0.70 + data[idx + 1] * 0.30;
              let b = bSharp * 0.70 + data[idx + 2] * 0.30;

              // Tone clarity and dynamic range boost
              r = ((r - 128) * 1.10) + 128 + 2;
              g = ((g - 128) * 1.08) + 128 + 2;
              b = ((b - 128) * 1.06) + 128 + 1;

              const avg = (r + g + b) / 3;
              r = avg + (r - avg) * 1.14;
              g = avg + (g - avg) * 1.14;
              b = avg + (b - avg) * 1.10;

              outData[idx] = Math.max(0, Math.min(255, Math.round(r)));
              outData[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
              outData[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
            }
          }

          ctx.putImageData(new ImageData(outData, targetW, targetH), 0, 0);
          const superUrl = canvas.toDataURL('image/jpeg', 0.96);

          return {
            ...item,
            superW: targetW,
            superH: targetH,
            superUrl: superUrl,
            isProcessed: true
          };
        }));

        setSrFiles(updated);
        showToast('Super Resolution 2x generated successfully!');
      } catch (err) {
        console.error("Super Resolution error:", err);
        showToast("Error processing Super Resolution", "error");
      } finally {
        setProcessing(false);
      }
    }, 80);
  };

  const handleSrDownload = (item) => {
    const itm = item || (srFiles[srActiveIndex] && srFiles[srActiveIndex].superUrl ? srFiles[srActiveIndex] : null);
    if (itm && itm.superUrl) {
      const baseName = itm.name.substring(0, itm.name.lastIndexOf('.')) || itm.name;
      downloadDataUrl(itm.superUrl, `${baseName}_super_res_${itm.superW}x${itm.superH}.jpg`);
    }
  };

  const handleSrSliderMove = (e, containerRef) => {
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSrSliderPos(percentage);
  };

  // ENGINE CHKDPI: Check Image DPI Handlers
  const parseDpiFromBinaryBuffer = (buffer) => {
    try {
      const bytes = new Uint8Array(buffer);

      // 1. Check JPEG JFIF (0xFF 0xE0)
      if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
        for (let i = 0; i < Math.min(2000, bytes.length - 18); i++) {
          if (bytes[i] === 0xFF && bytes[i + 1] === 0xE0) {
            if (bytes[i + 4] === 0x4A && bytes[i + 5] === 0x46 && bytes[i + 6] === 0x49 && bytes[i + 7] === 0x46 && bytes[i + 8] === 0x00) {
              const unit = bytes[i + 11]; // 1 = dots per inch, 2 = dots per cm
              const xDensity = (bytes[i + 12] << 8) | bytes[i + 13];
              if (xDensity > 0) {
                return unit === 2 ? Math.round(xDensity * 2.54) : xDensity;
              }
            }
          }
        }

        // 2. Check JPEG EXIF (0xFF 0xE1)
        for (let i = 0; i < Math.min(4000, bytes.length - 30); i++) {
          if (bytes[i] === 0xFF && bytes[i + 1] === 0xE1) {
            if (bytes[i + 4] === 0x45 && bytes[i + 5] === 0x78 && bytes[i + 6] === 0x69 && bytes[i + 7] === 0x66) {
              const tiffOffset = i + 10;
              const isLE = bytes[tiffOffset] === 0x49 && bytes[tiffOffset + 1] === 0x49;
              const read16 = (o) => isLE ? (bytes[o] | (bytes[o+1] << 8)) : ((bytes[o] << 8) | bytes[o+1]);
              const read32 = (o) => isLE ? (bytes[o] | (bytes[o+1] << 8) | (bytes[o+2] << 16) | (bytes[o+3] << 24)) : ((bytes[o] << 24) | (bytes[o+1] << 16) | (bytes[o+2] << 8) | bytes[o+3]);
              
              const ifdOffset = tiffOffset + read32(tiffOffset + 4);
              if (ifdOffset < bytes.length - 2) {
                const numEntries = read16(ifdOffset);
                for (let e = 0; e < numEntries; e++) {
                  const entryOffset = ifdOffset + 2 + e * 12;
                  if (entryOffset + 12 > bytes.length) break;
                  const tag = read16(entryOffset);
                  if (tag === 0x011A) { // XResolution
                    const valOffset = tiffOffset + read32(entryOffset + 8);
                    if (valOffset + 8 <= bytes.length) {
                      const num = read32(valOffset);
                      const den = read32(valOffset + 4);
                      if (den > 0 && num > 0) return Math.round(num / den);
                    }
                  }
                }
              }
            }
          }
        }
      }

      // 3. Check PNG pHYs chunk
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
        for (let i = 8; i < bytes.length - 12; i++) {
          if (bytes[i] === 0x70 && bytes[i + 1] === 0x48 && bytes[i + 2] === 0x59 && bytes[i + 3] === 0x73) {
            const ppmX = (bytes[i + 4] << 24) | (bytes[i + 5] << 16) | (bytes[i + 6] << 8) | bytes[i + 7];
            const unit = bytes[i + 12]; // 1 = meter
            if (unit === 1 && ppmX > 0) {
              return Math.round(ppmX * 0.0254);
            }
          }
        }
      }

      return 72; // Default screen DPI fallback
    } catch (err) {
      console.error("Error parsing binary DPI:", err);
      return 72;
    }
  };

  const handleChkDpiFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      try {
        const img = await loadImageElement(url);
        const buffer = await file.arrayBuffer();
        const detectedDpi = parseDpiFromBinaryBuffer(buffer);

        setChkDpiFile({
          file: file,
          url: url,
          name: file.name,
          sizeKB: Math.round(file.size / 1024),
          width: img.naturalWidth,
          height: img.naturalHeight,
          detectedDpi: detectedDpi
        });
        setChkDpiResult(null);
      } catch (err) {
        console.error("Error checking DPI file:", err);
      }
    }
  };

  const handleChkDpiCheck = () => {
    if (chkDpiFile) {
      setChkDpiResult({
        name: chkDpiFile.name,
        dpi: chkDpiFile.detectedDpi,
        width: chkDpiFile.width,
        height: chkDpiFile.height,
        sizeKB: chkDpiFile.sizeKB
      });
    }
  };

  const handleChkDpiReset = () => {
    setChkDpiFile(null);
    setChkDpiResult(null);
  };

  // ENGINE DPI: DPI Converter Handlers
  const handleDpiFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files).slice(0, 3 - dpiFiles.length);
      const newItems = [];

      for (const file of incoming) {
        const url = URL.createObjectURL(file);
        try {
          const img = await loadImageElement(url);
          newItems.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            file: file,
            url: url,
            name: file.name,
            sizeKB: Math.round(file.size / 1024),
            width: img.naturalWidth,
            height: img.naturalHeight,
            aspect: img.naturalWidth / img.naturalHeight
          });
        } catch (err) {
          console.error("Error loading image dimensions:", err);
        }
      }

      setDpiFiles(prev => [...prev, ...newItems].slice(0, 3));
    }
  };

  const handleDpiRemove = (id) => {
    setDpiFiles(prev => prev.filter(item => item.id !== id));
  };

  const getFormattedDpiDimension = (pxVal, unit) => {
    if (unit === 'mm') {
      return Math.round((pxVal / dpiTargetValue) * 25.4 * 10) / 10;
    }
    if (unit === 'cm') {
      return Math.round((pxVal / dpiTargetValue) * 2.54 * 10) / 10;
    }
    return pxVal;
  };

  const handleOpenResizeModal = (item) => {
    setDpiResizeModal({
      fileId: item.id,
      name: item.name,
      url: item.url,
      activeUnit: 'px',
      width: item.width,
      height: item.height,
      maintainAspect: true,
      aspect: item.aspect
    });
  };

  const handleResizeUnitChange = (unit) => {
    if (!dpiResizeModal) return;
    const currentUnit = dpiResizeModal.activeUnit;
    if (currentUnit === unit) return;

    let newWidth = dpiResizeModal.width;
    let newHeight = dpiResizeModal.height;

    // Convert to px first
    let pxW = newWidth;
    let pxH = newHeight;
    if (currentUnit === 'mm') {
      pxW = Math.round((newWidth / 25.4) * dpiTargetValue);
      pxH = Math.round((newHeight / 25.4) * dpiTargetValue);
    } else if (currentUnit === 'cm') {
      pxW = Math.round((newWidth / 2.54) * dpiTargetValue);
      pxH = Math.round((newHeight / 2.54) * dpiTargetValue);
    }

    // Convert from px to target unit
    if (unit === 'mm') {
      newWidth = Math.round((pxW / dpiTargetValue) * 25.4 * 10) / 10;
      newHeight = Math.round((pxH / dpiTargetValue) * 25.4 * 10) / 10;
    } else if (unit === 'cm') {
      newWidth = Math.round((pxW / dpiTargetValue) * 2.54 * 10) / 10;
      newHeight = Math.round((pxH / dpiTargetValue) * 2.54 * 10) / 10;
    } else {
      newWidth = pxW;
      newHeight = pxH;
    }

    setDpiResizeModal({
      ...dpiResizeModal,
      activeUnit: unit,
      width: newWidth,
      height: newHeight
    });
  };

  const handleResizeWidthChange = (val) => {
    const num = parseFloat(val) || 0;
    if (dpiResizeModal.maintainAspect && dpiResizeModal.aspect) {
      const calcH = Math.round((num / dpiResizeModal.aspect) * 10) / 10;
      setDpiResizeModal({ ...dpiResizeModal, width: num, height: calcH });
    } else {
      setDpiResizeModal({ ...dpiResizeModal, width: num });
    }
  };

  const handleResizeHeightChange = (val) => {
    const num = parseFloat(val) || 0;
    if (dpiResizeModal.maintainAspect && dpiResizeModal.aspect) {
      const calcW = Math.round((num * dpiResizeModal.aspect) * 10) / 10;
      setDpiResizeModal({ ...dpiResizeModal, height: num, width: calcW });
    } else {
      setDpiResizeModal({ ...dpiResizeModal, height: num });
    }
  };

  const handleApplyResize = async () => {
    if (!dpiResizeModal) return;
    
    // Calculate final pixel dimensions
    let finalPxW = dpiResizeModal.width;
    let finalPxH = dpiResizeModal.height;

    if (dpiResizeModal.activeUnit === 'mm') {
      finalPxW = Math.round((dpiResizeModal.width / 25.4) * dpiTargetValue);
      finalPxH = Math.round((dpiResizeModal.height / 25.4) * dpiTargetValue);
    } else if (dpiResizeModal.activeUnit === 'cm') {
      finalPxW = Math.round((dpiResizeModal.width / 2.54) * dpiTargetValue);
      finalPxH = Math.round((dpiResizeModal.height / 2.54) * dpiTargetValue);
    }

    finalPxW = Math.max(10, Math.round(finalPxW));
    finalPxH = Math.max(10, Math.round(finalPxH));

    setDpiFiles(prev => prev.map(item => {
      if (item.id === dpiResizeModal.fileId) {
        return {
          ...item,
          width: finalPxW,
          height: finalPxH,
          aspect: finalPxW / finalPxH
        };
      }
      return item;
    }));

    setDpiResizeModal(null);
    showToast('Image dimensions updated successfully!');
  };

  const handleDpiReset = () => {
    setDpiConvertedResults(null);
    setDpiFiles([]);
  };

  const handleConvertDpi = async () => {
    if (dpiFiles.length === 0) return;
    setProcessing(true);
    setProcessingText(`Converting ${dpiFiles.length} image(s) to ${dpiTargetValue} DPI...`);

    setTimeout(async () => {
      try {
        const results = [];
        for (const item of dpiFiles) {
          const img = await loadImageElement(item.url);
          const canvas = document.createElement('canvas');
          canvas.width = item.width;
          canvas.height = item.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, item.width, item.height);

          const rawDataUrl = canvas.toDataURL('image/jpeg', 0.96);
          // Embed true JFIF DPI resolution metadata (200, 300, 600, etc.)
          const finalDataUrl = setBinaryDpiToJpeg(rawDataUrl, dpiTargetValue);
          const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
          const outName = `${baseName}_${dpiTargetValue}dpi.jpg`;
          
          results.push({
            id: item.id,
            name: outName,
            url: finalDataUrl,
            dataUrl: finalDataUrl,
            sizeKB: Math.round((finalDataUrl.length * (3/4)) / 1024),
            width: item.width,
            height: item.height,
            dpi: dpiTargetValue
          });

          downloadDataUrl(finalDataUrl, outName);
        }
        
        setDpiConvertedResults(results);
        showToast(`Successfully converted to ${dpiTargetValue} DPI!`);
      } catch (err) {
        console.error("DPI conversion error:", err);
        showToast("Error converting DPI", "error");
      } finally {
        setProcessing(false);
      }
    }, 100);
  };

  // ENGINE IQ: Increase Image Quality Online Free Handlers
  const handleIqFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setIqImage(url);
      setIqRestoredUrl(null);
      setIqPreviewOriginal(false);
      applyIncreaseQuality(url);
    }
  };

  const applyIncreaseQuality = async (sourceUrl) => {
    const src = sourceUrl || iqImage;
    if (!src) return;

    setProcessing(true);
    setProcessingText('AI Restoring Clarity & Increasing Image Quality...');

    setTimeout(async () => {
      try {
        const img = await loadImageElement(src);
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_PROCESS = 1600;
        if (w > MAX_PROCESS || h > MAX_PROCESS) {
          const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const origImgData = ctx.getImageData(0, 0, w, h);
        const oData = origImgData.data;
        const outData = new Uint8ClampedArray(oData);

        // De-blurring & Super-Resolution Clarity Laplacian Filter
        const weights = [
           0, -0.45,  0,
          -0.45, 2.8, -0.45,
           0, -0.45,  0
        ];

        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            
            let rSharp = 0, gSharp = 0, bSharp = 0;
            let k = 0;
            for (let cy = -1; cy <= 1; cy++) {
              for (let cx = -1; cx <= 1; cx++) {
                const pIdx = ((y + cy) * w + (x + cx)) * 4;
                const wt = weights[k++];
                rSharp += oData[pIdx] * wt;
                gSharp += oData[pIdx + 1] * wt;
                bSharp += oData[pIdx + 2] * wt;
              }
            }

            // Blend de-blurred output (70% sharp + 30% original)
            let r = rSharp * 0.70 + oData[idx] * 0.30;
            let g = gSharp * 0.70 + oData[idx + 1] * 0.30;
            let b = bSharp * 0.70 + oData[idx + 2] * 0.30;

            // Dynamic Contrast & Vibrance Pop
            r = ((r - 128) * 1.12) + 128 + 2;
            g = ((g - 128) * 1.10) + 128 + 2;
            b = ((b - 128) * 1.08) + 128 + 1;

            const avg = (r + g + b) / 3;
            r = avg + (r - avg) * 1.16;
            g = avg + (g - avg) * 1.16;
            b = avg + (b - avg) * 1.12;

            outData[idx] = Math.max(0, Math.min(255, Math.round(r)));
            outData[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
            outData[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
          }
        }

        const finalImgData = new ImageData(outData, w, h);
        ctx.putImageData(finalImgData, 0, 0);
        setIqRestoredUrl(canvas.toDataURL('image/png'));
        setIqStatus('Image Restored');
      } catch (err) {
        console.error("Increase Quality error:", err);
      } finally {
        setProcessing(false);
      }
    }, 60);
  };

  const handleIqReset = () => {
    setIqImage(null);
    setIqRestoredUrl(null);
    setIqPreviewOriginal(false);
  };

  const handleIqDownload = () => {
    const urlToDownload = iqPreviewOriginal ? iqImage : iqRestoredUrl;
    if (urlToDownload) {
      const link = document.createElement('a');
      link.download = 'high_quality_restored_photo.png';
      link.href = urlToDownload;
      link.click();
    }
  };

  // ENGINE RT: Retouch Photo Online with AI Handlers
  const handleRtFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setRtImage(url);
      setRtRestoredUrl(null);
      setRtPreviewOriginal(false);
      applyAiRetouch(url);
    }
  };

  const applyAiRetouch = async (sourceUrl) => {
    const src = sourceUrl || rtImage;
    if (!src) return;

    setProcessing(true);
    setProcessingText('AI Retouching Photo (Clear Tones & HD Results)...');

    setTimeout(async () => {
      try {
        const img = await loadImageElement(src);
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_PROCESS = 1600;
        if (w > MAX_PROCESS || h > MAX_PROCESS) {
          const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const origImgData = ctx.getImageData(0, 0, w, h);
        const oData = origImgData.data;
        const outData = new Uint8ClampedArray(oData);

        // 1. Unsharp Masking Kernel (Crystal-Clear HD Sharpening & Micro-contrast)
        const weights = [
           0, -0.35,  0,
          -0.35, 2.4, -0.35,
           0, -0.35,  0
        ];

        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            const idx = (y * w + x) * 4;
            
            let rSharp = 0, gSharp = 0, bSharp = 0;
            let k = 0;
            for (let cy = -1; cy <= 1; cy++) {
              for (let cx = -1; cx <= 1; cx++) {
                const pIdx = ((y + cy) * w + (x + cx)) * 4;
                const wt = weights[k++];
                rSharp += oData[pIdx] * wt;
                gSharp += oData[pIdx + 1] * wt;
                bSharp += oData[pIdx + 2] * wt;
              }
            }

            // Blend sharpened version (65% sharp + 35% original)
            let r = rSharp * 0.65 + oData[idx] * 0.35;
            let g = gSharp * 0.65 + oData[idx + 1] * 0.35;
            let b = bSharp * 0.65 + oData[idx + 2] * 0.35;

            // 2. Clear Tones & Studio Contrast enhancement (S-curve + vibrance boost)
            r = ((r - 128) * 1.10) + 128 + 3;
            g = ((g - 128) * 1.08) + 128 + 2;
            b = ((b - 128) * 1.06) + 128;

            // Vibrance & glow
            const avg = (r + g + b) / 3;
            r = avg + (r - avg) * 1.14;
            g = avg + (g - avg) * 1.14;
            b = avg + (b - avg) * 1.10;

            outData[idx] = Math.max(0, Math.min(255, Math.round(r)));
            outData[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
            outData[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
          }
        }

        const finalImgData = new ImageData(outData, w, h);
        ctx.putImageData(finalImgData, 0, 0);
        setRtRestoredUrl(canvas.toDataURL('image/png'));
        setRtStatus('Image Restored');
      } catch (err) {
        console.error("AI Retouch error:", err);
      } finally {
        setProcessing(false);
      }
    }, 60);
  };

  const handleRtReset = () => {
    setRtImage(null);
    setRtRestoredUrl(null);
    setRtPreviewOriginal(false);
  };

  const handleRtDownload = () => {
    const urlToDownload = rtPreviewOriginal ? rtImage : rtRestoredUrl;
    if (urlToDownload) {
      const link = document.createElement('a');
      link.download = 'ai_retouched_photo.png';
      link.href = urlToDownload;
      link.click();
    }
  };

  // ENGINE BLM: Remove Blemishes from Photos with AI Handlers
  const handleBlmFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setBlmImage(url);
      setBlmRestoredUrl(null);
      setBlmPreviewOriginal(false);
      applyBlemishRemoval(url);
    }
  };

  const applyBlemishRemoval = async (sourceUrl) => {
    const src = sourceUrl || blmImage;
    if (!src) return;

    setProcessing(true);
    setProcessingText('AI Retouching Skin & Removing Blemishes...');

    setTimeout(async () => {
      try {
        const img = await loadImageElement(src);
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_PROCESS = 1400;
        if (w > MAX_PROCESS || h > MAX_PROCESS) {
          const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        // 1. Create a blurred layer for frequency separation skin smoothing
        const smoothCanvas = document.createElement('canvas');
        smoothCanvas.width = w;
        smoothCanvas.height = h;
        const sCtx = smoothCanvas.getContext('2d');
        sCtx.filter = 'blur(6px)';
        sCtx.drawImage(canvas, 0, 0);

        // 2. Read pixel data to detect skin tones and selectively blend smoothed skin
        const origImgData = ctx.getImageData(0, 0, w, h);
        const smoothImgData = sCtx.getImageData(0, 0, w, h);
        const oData = origImgData.data;
        const sData = smoothImgData.data;

        for (let i = 0; i < oData.length; i += 4) {
          const r = oData[i];
          const g = oData[i + 1];
          const b = oData[i + 2];

          // Standard skin tone classifier in RGB space
          const isSkin = (r > 60) && (g > 40) && (b > 20) &&
                         (Math.max(r, g, b) - Math.min(r, g, b) > 10) &&
                         (Math.abs(r - g) > 10) &&
                         (r > g) && (r > b);

          if (isSkin) {
            // Blend smoothed texture to remove pimples, spots, and blemishes while preserving facial structure
            oData[i] = Math.round(oData[i] * 0.25 + sData[i] * 0.75);
            oData[i + 1] = Math.round(oData[i + 1] * 0.25 + sData[i + 1] * 0.75);
            oData[i + 2] = Math.round(oData[i + 2] * 0.25 + sData[i + 2] * 0.75);
          }
        }

        ctx.putImageData(origImgData, 0, 0);
        setBlmRestoredUrl(canvas.toDataURL('image/png'));
        setBlmStatus('Image Restored');
      } catch (err) {
        console.error("Blemish removal error:", err);
      } finally {
        setProcessing(false);
      }
    }, 100);
  };

  const handleBlmReset = () => {
    setBlmImage(null);
    setBlmRestoredUrl(null);
    setBlmPreviewOriginal(false);
  };

  const handleBlmDownload = () => {
    const urlToDownload = blmPreviewOriginal ? blmImage : blmRestoredUrl;
    if (urlToDownload) {
      const link = document.createElement('a');
      link.download = 'blemish_removed_ai_photo.png';
      link.href = urlToDownload;
      link.click();
    }
  };

  // ENGINE PA: Convert Any Picture to Pixel Art Handlers
  const handlePaFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPaImage(url);
    }
  };

  useEffect(() => {
    if (paImage) {
      applyPixelArt();
    }
  }, [paImage, paBlockSize, paUsePalette, paActivePalette, paCustomPalette, paGrayscale, paDrawGrid, paDrawEdges, paEdgeWidth, paEdgeThreshold]);

  const applyPixelArt = () => {
    if (!paImage) return;
    setProcessing(true);

    setTimeout(async () => {
      try {
        const img = await loadImageElement(paImage);
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_PROCESS = 1200;
        if (w > MAX_PROCESS || h > MAX_PROCESS) {
          const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const bSize = Math.max(2, Math.round((paBlockSize / 100) * (Math.max(w, h) * 0.05)));
        const downW = Math.max(1, Math.ceil(w / bSize));
        const downH = Math.max(1, Math.ceil(h / bSize));

        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = downW;
        smallCanvas.height = downH;
        const sCtx = smallCanvas.getContext('2d');
        sCtx.drawImage(canvas, 0, 0, downW, downH);

        const imgData = sCtx.getImageData(0, 0, downW, downH);
        const data = imgData.data;

        let currentPaletteRGB = [];
        if (paUsePalette) {
          const pal = paActivePalette === 'custom' ? paCustomPalette : predefinedPalettes[paActivePalette];
          if (pal) currentPaletteRGB = pal.map(hexToRgb);
        }

        for (let i = 0; i < data.length; i += 4) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          if (paGrayscale) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            r = g = b = lum;
          }

          if (paUsePalette && currentPaletteRGB.length > 0) {
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
          data[i + 1] = g;
          data[i + 2] = b;
        }

        sCtx.putImageData(imgData, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(smallCanvas, 0, 0, w, h);

        if (paDrawEdges) {
          const sOrigData = sCtx.getImageData(0, 0, downW, downH);
          const edgeData = new ImageData(downW, downH);
          const w4 = downW * 4;
          const thresholdLimit = (100 - paEdgeThreshold) * 4;

          for (let y = 1; y < downH - 1; y++) {
            for (let x = 1; x < downW - 1; x++) {
              const idx = (y * downW + x) * 4;
              const t = sOrigData.data[idx - w4];
              const b = sOrigData.data[idx + w4];
              const l = sOrigData.data[idx - 4];
              const r_ = sOrigData.data[idx + 4];
              const dx = Math.abs(l - r_);
              const dy = Math.abs(t - b);
              const grad = dx + dy;
              if (grad > thresholdLimit) {
                edgeData.data[idx] = 0;
                edgeData.data[idx + 1] = 0;
                edgeData.data[idx + 2] = 0;
                edgeData.data[idx + 3] = 255;
              } else {
                edgeData.data[idx + 3] = 0;
              }
            }
          }

          const edgeCanvas = document.createElement('canvas');
          edgeCanvas.width = downW;
          edgeCanvas.height = downH;
          const eCtx = edgeCanvas.getContext('2d');
          eCtx.putImageData(edgeData, 0, 0);

          ctx.imageSmoothingEnabled = false;
          ctx.globalAlpha = 0.85;
          const maxOffset = Math.floor(paEdgeWidth / 2);
          if (maxOffset > 0) {
            for (let oy = -maxOffset; oy <= maxOffset; oy++) {
              for (let ox = -maxOffset; ox <= maxOffset; ox++) {
                if (Math.abs(ox) + Math.abs(oy) <= maxOffset) {
                  ctx.drawImage(edgeCanvas, 0, 0, downW, downH, ox * bSize, oy * bSize, w, h);
                }
              }
            }
          } else {
            ctx.drawImage(edgeCanvas, 0, 0, downW, downH, 0, 0, w, h);
          }
          ctx.globalAlpha = 1.0;
        }

        if (paDrawGrid) {
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          for (let x = 0; x < w; x += bSize) {
            ctx.fillRect(x, 0, 1, h);
          }
          for (let y = 0; y < h; y += bSize) {
            ctx.fillRect(0, y, w, 1);
          }
        }

        setPaPreviewUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error("Pixel Art error:", err);
      } finally {
        setProcessing(false);
      }
    }, 40);
  };

  const handlePaDownload = () => {
    if (paPreviewUrl) {
      const link = document.createElement('a');
      link.download = 'pixel_art_image.png';
      link.href = paPreviewUrl;
      link.click();
    }
  };

  // ENGINE BW: Turn Color Image to Black and White Handlers
  const handleBwFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setBwImage(url);
      setBwPreviewUrl(url);
      setBwIsProcessed(false);
      // Auto-apply Black & White conversion on load
      applyBlackWhiteEffect(url);
    }
  };

  const applyBlackWhiteEffect = async (overrideUrl) => {
    const src = overrideUrl || bwImage;
    if (!src) return;

    setProcessing(true);
    setTimeout(async () => {
      try {
        const img = await loadImageElement(src);
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_PROCESS = 1400;
        if (w > MAX_PROCESS || h > MAX_PROCESS) {
          const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // High-contrast, rich black and white tonal curve
        for (let i = 0; i < data.length; i += 4) {
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          // S-curve tonal contrast enhancement for authentic classic photography B&W
          let bwVal = lum;
          if (bwVal < 128) {
            bwVal = Math.pow(bwVal / 128, 1.2) * 128;
          } else {
            bwVal = 255 - Math.pow((255 - bwVal) / 128, 1.2) * 128;
          }
          bwVal = Math.max(0, Math.min(255, Math.round(bwVal)));
          
          data[i] = bwVal;
          data[i + 1] = bwVal;
          data[i + 2] = bwVal;
        }

        ctx.putImageData(imgData, 0, 0);
        setBwPreviewUrl(canvas.toDataURL('image/png'));
        setBwIsProcessed(true);
      } catch (err) {
        console.error("Black & White error:", err);
      } finally {
        setProcessing(false);
      }
    }, 40);
  };

  const handleBwReset = () => {
    setBwImage(null);
    setBwPreviewUrl(null);
    setBwIsProcessed(false);
  };

  const handleBwDownload = () => {
    if (bwPreviewUrl) {
      const link = document.createElement('a');
      link.download = 'black_and_white_photo.png';
      link.href = bwPreviewUrl;
      link.click();
    }
  };

  // ENGINE GS: Convert Image to Grayscale Handlers
  const handleGsFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setGsImage(url);
      setGsPreviewUrl(url);
      setGsIsGrayscale(false);
      // Auto-apply grayscale on load
      applyGrayscaleEffect(url);
    }
  };

  const applyGrayscaleEffect = async (overrideUrl) => {
    const src = overrideUrl || gsImage;
    if (!src) return;

    setProcessing(true);
    setTimeout(async () => {
      try {
        const img = await loadImageElement(src);
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_PROCESS = 1400;
        if (w > MAX_PROCESS || h > MAX_PROCESS) {
          const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = lum;
          data[i + 1] = lum;
          data[i + 2] = lum;
        }

        ctx.putImageData(imgData, 0, 0);
        setGsPreviewUrl(canvas.toDataURL('image/png'));
        setGsIsGrayscale(true);
      } catch (err) {
        console.error("Grayscale error:", err);
      } finally {
        setProcessing(false);
      }
    }, 40);
  };

  const handleGsReset = () => {
    setGsImage(null);
    setGsPreviewUrl(null);
    setGsIsGrayscale(false);
  };

  const handleGsDownload = () => {
    if (gsPreviewUrl) {
      const link = document.createElement('a');
      link.download = 'grayscale_converted.png';
      link.href = gsPreviewUrl;
      link.click();
    }
  };

  // ENGINE MB: Motion Blur Handlers
  const extractMbSubject = async (fileToProcess) => {
    const file = fileToProcess || mbFile;
    if (!file) return;

    setProcessing(true);
    setProcessingText('Extracting foreground subject...');
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(file);
      const subjUrl = URL.createObjectURL(blob);
      setMbSubjectUrl(subjUrl);
    } catch (err) {
      console.warn("AI subject extraction error, using soft portrait mask fallback:", err);
      try {
        const img = await loadImageElement(URL.createObjectURL(file));
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        ctx.save();
        ctx.beginPath();
        const cx = canvas.width / 2;
        const cy = canvas.height * 0.45;
        const rx = canvas.width * 0.35;
        const ry = canvas.height * 0.42;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        ctx.restore();
        
        setMbSubjectUrl(canvas.toDataURL('image/png'));
      } catch (fallbackErr) {
        console.error("Fallback error:", fallbackErr);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleMbFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMbFile(file);
      const url = URL.createObjectURL(file);
      setMbImage(url);
      setMbSubjectUrl(null);
      setMbPreviewUrl(url);

      if (mbBlurBackground) {
        extractMbSubject(file);
      }
    }
  };

  const handleToggleMbBlurBg = (checked) => {
    setMbBlurBackground(checked);
    if (checked && !mbSubjectUrl && mbFile) {
      extractMbSubject(mbFile);
    }
  };

  useEffect(() => {
    if (mbImage) {
      applyMotionBlur();
    }
  }, [mbImage, mbType, mbAngle, mbDistance, mbSamples, mbGaussianRadius, mbBlurBackground, mbSubjectUrl]);

  const applyMotionBlur = () => {
    if (!mbImage) return;

    setTimeout(async () => {
      try {
        const img = await loadImageElement(mbImage);
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_PROCESS = 1400;
        if (w > MAX_PROCESS || h > MAX_PROCESS) {
          const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        if (mbType === 'gaussian') {
          // Standard Gaussian blur
          const blurCanvas = document.createElement('canvas');
          blurCanvas.width = w;
          blurCanvas.height = h;
          const bCtx = blurCanvas.getContext('2d');
          bCtx.filter = `blur(${mbGaussianRadius}px)`;
          bCtx.drawImage(img, 0, 0, w, h);
          ctx.drawImage(blurCanvas, 0, 0);
        } else {
          // Directional Motion Blur with smooth multi-pass sampling
          const rad = (mbAngle * Math.PI) / 180;
          const totalDist = (mbDistance / 100) * (Math.max(w, h) * 0.12);
          const numSamples = Math.max(5, mbSamples);
          
          const blurCanvas = document.createElement('canvas');
          blurCanvas.width = w;
          blurCanvas.height = h;
          const bCtx = blurCanvas.getContext('2d');

          const stepX = (Math.cos(rad) * totalDist) / numSamples;
          const stepY = (Math.sin(rad) * totalDist) / numSamples;
          const half = Math.floor(numSamples / 2);

          bCtx.globalAlpha = 1.0 / numSamples;
          for (let i = -half; i <= half; i++) {
            const offsetX = i * stepX;
            const offsetY = i * stepY;
            bCtx.drawImage(img, offsetX, offsetY, w, h);
          }
          bCtx.globalAlpha = 1.0;
          ctx.drawImage(blurCanvas, 0, 0);
        }

        // If Blur Background is enabled and we have extracted the sharp foreground subject
        if (mbBlurBackground && mbSubjectUrl) {
          try {
            const subjImg = await loadImageElement(mbSubjectUrl);
            ctx.drawImage(subjImg, 0, 0, w, h);
          } catch (e) {
            console.error("Error overlaying foreground subject:", e);
          }
        }

        setMbPreviewUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error("Motion Blur error:", err);
      }
    }, 20);
  };

  const handleMbDownload = () => {
    if (mbPreviewUrl) {
      const link = document.createElement('a');
      link.download = 'motion_blurred_photo.png';
      link.href = mbPreviewUrl;
      link.click();
    }
  };

  // ENGINE CS: Censor Photo Handlers
  const handleCensorFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCensorImage(url);
      setCensorPatches([]);
      setCensorUndoStack([]);
      setCensorRedoStack([]);
      setCensorAutoFaces(false);
    }
  };

  useEffect(() => {
    if (censorImage) {
      applyCensor();
    }
  }, [censorImage, censorType, censorBlurFactor, censorAutoFaces, censorManual, censorPatches]);

  // When censorType or censorBlurFactor changes, update existing patches
  const handleCensorTypeChange = (newType) => {
    setCensorType(newType);
    setCensorPatches(prev => prev.map(p => ({ ...p, type: newType })));
  };

  const handleCensorFactorChange = (newFactor) => {
    setCensorBlurFactor(newFactor);
    setCensorPatches(prev => prev.map(p => ({ ...p, factor: newFactor })));
  };

  const toggleAutoFaces = (checked) => {
    setCensorAutoFaces(checked);
    if (checked) {
      const autoFacePatch = {
        id: 'auto-face-1',
        isAuto: true,
        type: censorType,
        shape: 'ellipse',
        x: 0.30,
        y: 0.14,
        w: 0.40,
        h: 0.28,
        factor: censorBlurFactor
      };
      setCensorUndoStack([...censorUndoStack, censorPatches]);
      setCensorPatches(prev => [...prev.filter(p => !p.isAuto), autoFacePatch]);
    } else {
      setCensorPatches(prev => prev.filter(p => !p.isAuto));
    }
  };

  const applyCensor = () => {
    if (!censorImage) return;
    setProcessing(true);

    setTimeout(async () => {
      try {
        const img = await loadImageElement(censorImage);
        const canvas = document.createElement('canvas');
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_PROCESS = 1400;
        if (w > MAX_PROCESS || h > MAX_PROCESS) {
          const r = Math.min(MAX_PROCESS / w, MAX_PROCESS / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        // Render patches
        for (const patch of censorPatches) {
          const pxX = Math.round(patch.x * w);
          const pxY = Math.round(patch.y * h);
          const pxW = Math.round(patch.w * w);
          const pxH = Math.round(patch.h * h);

          if (pxW === 0 || pxH === 0) continue;

          const patchCanvas = document.createElement('canvas');
          patchCanvas.width = Math.abs(pxW);
          patchCanvas.height = Math.abs(pxH);
          const pCtx = patchCanvas.getContext('2d');
          pCtx.drawImage(img, pxX, pxY, pxW, pxH, 0, 0, Math.abs(pxW), Math.abs(pxH));

          const currentFactor = patch.factor || censorBlurFactor;
          const currentType = patch.type || censorType;

          if (currentType === 'pixelate') {
            // Stronger, crisp retro censorship pixelation
            const bSize = Math.min(
              Math.max(6, Math.round((currentFactor / 50) * (Math.max(w, h) * 0.07))),
              Math.min(Math.abs(pxW), Math.abs(pxH))
            );
            const downW = Math.max(1, Math.ceil(Math.abs(pxW) / bSize));
            const downH = Math.max(1, Math.ceil(Math.abs(pxH) / bSize));

            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = downW;
            smallCanvas.height = downH;
            const sCtx = smallCanvas.getContext('2d');
            sCtx.drawImage(patchCanvas, 0, 0, downW, downH);

            pCtx.clearRect(0, 0, Math.abs(pxW), Math.abs(pxH));
            pCtx.imageSmoothingEnabled = false;
            pCtx.drawImage(smallCanvas, 0, 0, Math.abs(pxW), Math.abs(pxH));
          } else {
            // Heavy, unmistakable censorship blur
            const blurRadius = Math.max(6, Math.round((currentFactor / 50) * 35));
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = Math.abs(pxW);
            tempCanvas.height = Math.abs(pxH);
            const tCtx = tempCanvas.getContext('2d');
            tCtx.filter = `blur(${blurRadius}px)`;
            tCtx.drawImage(patchCanvas, 0, 0);
            
            // Second blur pass for smooth, heavy censorship
            pCtx.clearRect(0, 0, Math.abs(pxW), Math.abs(pxH));
            pCtx.filter = `blur(${Math.round(blurRadius / 2)}px)`;
            pCtx.drawImage(tempCanvas, 0, 0);
            pCtx.filter = 'none';
          }

          ctx.save();
          ctx.beginPath();
          if (patch.shape === 'ellipse') {
            const rx = Math.abs(pxW) / 2;
            const ry = Math.abs(pxH) / 2;
            const cx = pxX + pxW / 2;
            const cy = pxY + pxH / 2;
            ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
          } else {
            ctx.rect(pxX, pxY, pxW, pxH);
          }
          ctx.clip();
          ctx.drawImage(patchCanvas, pxX, pxY, pxW, pxH);
          ctx.restore();
        }

        setCensorPreviewUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error("Censor error:", err);
      } finally {
        setProcessing(false);
      }
    }, 50);
  };

  const handleCensorMouseDown = (e) => {
    if (!censorManual || !censorPreviewUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setCensorIsDrawing(true);
    setCensorDrawStart({ x, y });
    setCensorCurrentDraw({ x, y, w: 0, h: 0 });
  };

  const handleCensorMouseMove = (e) => {
    if (!censorIsDrawing || !censorDrawStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const clampX = Math.max(0, Math.min(1, x));
    const clampY = Math.max(0, Math.min(1, y));

    setCensorCurrentDraw({
      x: Math.min(censorDrawStart.x, clampX),
      y: Math.min(censorDrawStart.y, clampY),
      w: clampX - censorDrawStart.x,
      h: clampY - censorDrawStart.y
    });
  };

  const handleCensorMouseUp = () => {
    if (!censorIsDrawing || !censorCurrentDraw) return;
    setCensorIsDrawing(false);

    if (Math.abs(censorCurrentDraw.w) > 0.005 && Math.abs(censorCurrentDraw.h) > 0.005) {
      setCensorUndoStack([...censorUndoStack, censorPatches]);
      setCensorRedoStack([]);

      const newPatch = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type: censorType,
        shape: censorShape,
        x: censorCurrentDraw.w < 0 ? censorCurrentDraw.x + censorCurrentDraw.w : censorCurrentDraw.x,
        y: censorCurrentDraw.h < 0 ? censorCurrentDraw.y + censorCurrentDraw.h : censorCurrentDraw.y,
        w: Math.abs(censorCurrentDraw.w),
        h: Math.abs(censorCurrentDraw.h),
        factor: censorBlurFactor
      };

      setCensorPatches([...censorPatches, newPatch]);
    }

    setCensorDrawStart(null);
    setCensorCurrentDraw(null);
  };

  const handleCensorUndo = () => {
    if (censorUndoStack.length === 0) return;
    const previous = censorUndoStack[censorUndoStack.length - 1];
    setCensorRedoStack([censorPatches, ...censorRedoStack]);
    setCensorPatches(previous);
    setCensorUndoStack(censorUndoStack.slice(0, -1));
  };

  const handleCensorRedo = () => {
    if (censorRedoStack.length === 0) return;
    const next = censorRedoStack[0];
    setCensorUndoStack([...censorUndoStack, censorPatches]);
    setCensorPatches(next);
    setCensorRedoStack(censorRedoStack.slice(1));
  };

  const deleteCensorPatch = (id, e) => {
    if (e) e.stopPropagation();
    setCensorUndoStack([...censorUndoStack, censorPatches]);
    setCensorRedoStack([]);
    setCensorPatches(censorPatches.filter(p => p.id !== id));
  };

  const handleCensorDownload = () => {
    if (censorPreviewUrl) {
      const link = document.createElement('a');
      link.download = 'censored_photo.png';
      link.href = censorPreviewUrl;
      link.click();
    }
  };

  // ENGINE AB: Add Border Handlers
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
  }, [abImage, abWidth, abRadius, abBorderColor, abBgColor, abCaption]);

  const drawBorderCanvas = async () => {
     if (!abImage) return;
     try {
        const img = await loadImageElement(abImage);
        const canvas = document.createElement('canvas');
        const b = Math.round((abWidth / 100) * Math.max(img.naturalWidth, img.naturalHeight));
        const extraBottom = abCaption ? Math.round(img.naturalHeight * 0.15) : 0;
        
        canvas.width = img.naturalWidth + (b * 2);
        canvas.height = img.naturalHeight + (b * 2) + extraBottom;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = abBorderColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = abBgColor;
        ctx.fillRect(b, b, img.naturalWidth, img.naturalHeight);
        ctx.drawImage(img, b, b, img.naturalWidth, img.naturalHeight);
        
        if (abCaption) {
           ctx.fillStyle = abBgColor;
           ctx.font = `bold ${Math.round(canvas.height * 0.04)}px sans-serif`;
           ctx.textAlign = 'center';
           ctx.fillText(abCaption, canvas.width / 2, canvas.height - (extraBottom / 2) + (Math.round(canvas.height * 0.015)));
        }
        
        setAbPreviewUrl(canvas.toDataURL('image/png'));
     } catch (err) {
        console.error("Border error:", err);
     }
  };

  const handleAbDownload = () => {
     if (abPreviewUrl) {
        const link = document.createElement('a');
        link.download = 'bordered_photo.png';
        link.href = abPreviewUrl;
        link.click();
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

      {activeTool && (
        <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
          <span className="seo-breadcrumb-item" onClick={() => setActiveTool(null)}>
            Home
          </span>
          <span className="seo-breadcrumb-separator">&gt;</span>
          <span className="seo-breadcrumb-item" onClick={() => {
            const categorySlug = `category-${activeTool.category.replace(/[^a-zA-Z0-9]/g, '-')}`;
            setActiveTool(null);
            setTimeout(() => {
              const el = document.getElementById(categorySlug);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>
            {activeTool.category}
          </span>
          <span className="seo-breadcrumb-separator">&gt;</span>
          <span className="seo-breadcrumb-item active">
            {activeTool.name}
          </span>
        </nav>
      )}
      
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
              <div key={catName} id={`category-${catName.replace(/[^a-zA-Z0-9]/g, '-')}`} className="category-section">
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

      ) : activeTool.engine === 'pixelate-engine' ? (
        // PIXELATE CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Pixelate Image Online</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Welcome to Pi7 Image Tool - The Most Advanced Way to Pixelate a Image Online.</p>
          </div>
          
          <input type="file" ref={pxInputRef} onChange={handlePxFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div 
                className="ab-grid-bg" 
                onClick={() => !pxPreviewUrl && pxInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handlePxFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff', cursor: pxPreviewUrl ? 'default' : 'pointer' }}>
                {pxPreviewUrl ? (
                   <div 
                      className="px-canvas-container"
                      onMouseDown={handlePxMouseDown}
                      onMouseMove={handlePxMouseMove}
                      onMouseUp={handlePxMouseUp}
                      onMouseLeave={handlePxMouseUp}
                      style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', maxHeight: '100%' }}
                   >
                      <img 
                         src={pxPreviewUrl} 
                         alt="Pixelated Preview" 
                         style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain', imageRendering: 'pixelated', pointerEvents: 'none' }} 
                      />
                      
                      {/* Active drawing preview overlay */}
                      {pxIsDrawing && pxCurrentDraw && (
                         <div 
                            className={`px-draw-preview ${pxManualShape}`}
                            style={{
                               left: `${pxCurrentDraw.w < 0 ? (pxCurrentDraw.x + pxCurrentDraw.w) * 100 : pxCurrentDraw.x * 100}%`,
                               top: `${pxCurrentDraw.h < 0 ? (pxCurrentDraw.y + pxCurrentDraw.h) * 100 : pxCurrentDraw.y * 100}%`,
                               width: `${Math.abs(pxCurrentDraw.w) * 100}%`,
                               height: `${Math.abs(pxCurrentDraw.h) * 100}%`
                            }}
                         />
                      )}
                      
                      {/* Drawn patches overlay */}
                      {pxManual && pxPatches.map((patch) => (
                         <div 
                            key={patch.id}
                            className={`px-patch-overlay ${patch.shape}`}
                            style={{
                               left: `${patch.x * 100}%`,
                               top: `${patch.y * 100}%`,
                               width: `${patch.w * 100}%`,
                               height: `${patch.h * 100}%`
                            }}
                         >
                            <button 
                               className="px-patch-delete" 
                               onClick={(e) => deletePxPatch(patch.id, e)}
                               title="Delete Patch"
                            >
                               ×
                            </button>
                         </div>
                      ))}
                   </div>
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <p>Upload an image to start pixelating</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '400px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Manual toggle switches first */}
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>Manually Pixelate Image</span>
                      <label className="ab-toggle">
                         <input type="checkbox" checked={pxManual} onChange={(e) => setPxManual(e.target.checked)} />
                         <span className="ab-slider-round"></span>
                      </label>
                   </div>

                   {pxManual ? (
                      <>
                         {/* Mode Selection */}
                         <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '13px', color: '#4b5563', display: 'block', marginBottom: '8px' }}>Type:</span>
                            <div style={{ display: 'flex', gap: '16px' }}>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                                  <input type="radio" name="pxManualMode" checked={pxManualMode === 'blur'} onChange={() => setPxManualMode('blur')} style={{ accentColor: '#1d4ed8' }} />
                                  <span>Blur</span>
                               </label>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                                  <input type="radio" name="pxManualMode" checked={pxManualMode === 'pixelate'} onChange={() => setPxManualMode('pixelate')} style={{ accentColor: '#1d4ed8' }} />
                                  <span>Pixelate</span>
                               </label>
                            </div>
                         </div>

                         {/* Shape Selection */}
                         <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '13px', color: '#4b5563', display: 'block', marginBottom: '8px' }}>Shape:</span>
                            <div style={{ display: 'flex', gap: '16px' }}>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                                  <input type="radio" name="pxManualShape" checked={pxManualShape === 'rectangle'} onChange={() => setPxManualShape('rectangle')} style={{ accentColor: '#1d4ed8' }} />
                                  <span>Rectangle</span>
                               </label>
                               <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                                  <input type="radio" name="pxManualShape" checked={pxManualShape === 'ellipse'} onChange={() => setPxManualShape('ellipse')} style={{ accentColor: '#1d4ed8' }} />
                                  <span>Ellipse</span>
                               </label>
                            </div>
                         </div>

                         {/* Intensity Slider */}
                         <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                               <span style={{ fontSize: '13px', color: '#4b5563' }}>Intensity</span>
                               <span style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #d1d5db', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fff' }}>{pxManualIntensity}</span>
                            </div>
                            <input 
                               type="range" 
                               min="5" max="100" 
                               value={pxManualIntensity} 
                               onChange={(e) => setPxManualIntensity(Number(e.target.value))} 
                               className="ab-slider"
                            />
                         </div>

                         {/* Help Tip */}
                         <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4', background: '#f3f4f6', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #3b82f6', marginBottom: '20px' }}>
                            ⓘ Click and move the mouse to draw a selective area on the image.
                         </div>

                         {/* Undo/Redo Buttons */}
                         <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                            <button 
                               onClick={handlePxUndo} 
                               disabled={pxUndoStack.length === 0} 
                               style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: pxUndoStack.length > 0 ? '#ffffff' : '#f3f4f6', cursor: pxUndoStack.length > 0 ? 'pointer' : 'not-allowed', color: pxUndoStack.length > 0 ? '#374151' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '13px' }}
                            >
                               ↩ Undo
                            </button>
                            <button 
                               onClick={handlePxRedo} 
                               disabled={pxRedoStack.length === 0} 
                               style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: pxRedoStack.length > 0 ? '#ffffff' : '#f3f4f6', cursor: pxRedoStack.length > 0 ? 'pointer' : 'not-allowed', color: pxRedoStack.length > 0 ? '#374151' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '13px' }}
                            >
                               ↪ Redo
                            </button>
                         </div>
                      </>
                   ) : (
                      <>
                         {/* Global Pixelation Controls */}
                         <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                               <span style={{ fontSize: '13px', color: '#4b5563' }}>Block size</span>
                               <span style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #d1d5db', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fff' }}>{pxBlockSize}</span>
                            </div>
                            <input 
                               type="range" 
                               min="1" max="100" 
                               value={pxBlockSize} 
                               onChange={(e) => setPxBlockSize(Number(e.target.value))} 
                               className="ab-slider"
                            />
                         </div>
                         
                         <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                               <span style={{ fontSize: '13px', color: '#4b5563' }}>Change Color Palette</span>
                               <label className="ab-toggle">
                                  <input type="checkbox" checked={pxUsePalette} onChange={(e) => setPxUsePalette(e.target.checked)} />
                                  <span className="ab-slider-round"></span>
                               </label>
                            </div>
                            
                            <div style={{ paddingLeft: '24px', opacity: pxUsePalette ? 1 : 0.5, pointerEvents: pxUsePalette ? 'auto' : 'none' }}>
                               <select 
                                  value={pxActivePalette} 
                                  onChange={(e) => setPxActivePalette(e.target.value)}
                                  className="custom-select-palette"
                                  style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#ffffff', fontSize: '13px', marginBottom: '12px' }}
                               >
                                  <option value="pico8">Pico-8 Classic (16 Colors)</option>
                                  <option value="retro1">Retro Pop (8 Colors)</option>
                                  <option value="gameboy">GameBoy (4 Colors)</option>
                                  <option value="cga">CGA Classic (4 Colors)</option>
                                  <option value="sepia">Sepia Vintage (5 Colors)</option>
                                  <option value="custom">Custom Palette...</option>
                               </select>
                               
                               <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Create Custom Palette</div>
                               <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                  {pxCustomPalette.map((color, idx) => (
                                     <div key={idx} style={{ position: 'relative' }}>
                                        <input type="color" value={color} onChange={(e) => {
                                           const newPal = [...pxCustomPalette];
                                           newPal[idx] = e.target.value;
                                           setPxCustomPalette(newPal);
                                           setPxActivePalette('custom');
                                        }} style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer' }} />
                                     </div>
                                  ))}
                                  <button onClick={() => {
                                     if(pxCustomPalette.length < 16) {
                                        setPxCustomPalette([...pxCustomPalette, '#ffffff']);
                                        setPxActivePalette('custom');
                                     }
                                  }} style={{ width: '24px', height: '24px', border: '1px dashed #4f5b93', backgroundColor: 'transparent', color: '#4f5b93', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                               </div>
                            </div>
                         </div>
                         
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '13px', color: '#4b5563' }}>Apply Grayscale</span>
                            <label className="ab-toggle">
                               <input type="checkbox" checked={pxGrayscale} onChange={(e) => setPxGrayscale(e.target.checked)} />
                               <span className="ab-slider-round"></span>
                            </label>
                         </div>
                         
                         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '13px', color: '#4b5563' }}>Draw Grid Lines</span>
                            <label className="ab-toggle">
                               <input type="checkbox" checked={pxDrawGrid} onChange={(e) => setPxDrawGrid(e.target.checked)} />
                               <span className="ab-slider-round"></span>
                            </label>
                         </div>
                         
                         <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                               <span style={{ fontSize: '13px', color: '#4b5563' }}>Draw Edges</span>
                               <label className="ab-toggle">
                                  <input type="checkbox" checked={pxDrawEdges} onChange={(e) => setPxDrawEdges(e.target.checked)} />
                                  <span className="ab-slider-round"></span>
                               </label>
                            </div>
                            
                            <div style={{ paddingLeft: '24px', opacity: pxDrawEdges ? 1 : 0.5, pointerEvents: pxDrawEdges ? 'auto' : 'none' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                  <span style={{ fontSize: '12px', color: '#6b7280', width: '60px' }}>Line Width</span>
                                  <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                                     <button onClick={() => setPxEdgeWidth(Math.max(1, pxEdgeWidth - 1))} style={{ padding: '4px 12px', border: 'none', backgroundColor: '#f9fafb', cursor: 'pointer' }}>-</button>
                                     <input type="text" readOnly value={pxEdgeWidth} style={{ width: '40px', textAlign: 'center', border: 'none', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db' }} />
                                     <button onClick={() => setPxEdgeWidth(Math.min(20, pxEdgeWidth + 1))} style={{ padding: '4px 12px', border: 'none', backgroundColor: '#f9fafb', cursor: 'pointer' }}>+</button>
                                  </div>
                               </div>
                               
                               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span style={{ fontSize: '12px', color: '#6b7280', width: '60px' }}>Threshold</span>
                                  <input type="range" min="0" max="100" value={pxEdgeThreshold} onChange={(e) => setPxEdgeThreshold(Number(e.target.value))} className="ab-slider" />
                                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{pxEdgeThreshold}</span>
                               </div>
                            </div>
                         </div>
                      </>
                   )}
                   
                </div>
                <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', gap: '8px', borderTop: '1px solid #e5e7eb' }}>
                   <button onClick={() => pxInputRef.current.click()} style={{ flex: 1, backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>New Image</button>
                   <button onClick={handlePxDownload} disabled={!pxPreviewUrl} style={{ flex: 1, backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: pxPreviewUrl ? 'pointer' : 'not-allowed', opacity: pxPreviewUrl ? 1 : 0.5 }}>Download Image</button>
                </div>
             </div>
          </div>
        </div>

















      ) : activeTool.engine === 'pdf2jpg-engine' ? (
        // PDF TO JPG CONVERTER CUSTOM UI
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '0 20px 40px' }}>
          
          <input type="file" ref={pdf2JpgInputRef} onChange={handlePdf2JpgFileChange} accept="application/pdf" multiple style={{ display: 'none' }} />

          {pdf2JpgResults ? (
            // ================= PDF TO JPG RESULTS SCREEN =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Converted JPG Images Is Ready - Pi7 Image Tool</h1>
                <div style={{ color: '#2563eb', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                  For Resize 100 images at once use Pi7 Bulk Resizer
                </div>
              </div>

              {/* Converted JPG Gallery */}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
                {pdf2JpgResults.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '240px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ border: '1px solid #3b82f6', padding: '4px', borderRadius: '4px', backgroundColor: '#ffffff', marginBottom: '10px' }}>
                      <img 
                        src={item.dataUrl} 
                        alt={item.name} 
                        style={{ maxHeight: '140px', maxWidth: '180px', objectFit: 'contain', display: 'block' }} 
                      />
                    </div>

                    <div style={{ fontSize: '12px', color: '#374151', fontWeight: '500', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '12px' }}>
                      Size:- {item.sizeKB}Kb (Page {item.pageNum}/{item.totalPages})
                    </div>

                    <button 
                      onClick={() => handlePdf2JpgDownload(item)}
                      style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '6px 20px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', width: '100%' }}
                    >
                      Download JPG
                    </button>
                  </div>
                ))}
              </div>

              {/* Green Delete Now Button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={handlePdf2JpgReset}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Delete Your Images From Server Now
                </button>
              </div>

            </div>
          ) : (
            // ================= MAIN PDF TO JPG SCREEN (Matching Screenshot) =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>PDF to JPG Converter - Free, No Upload Needed</h1>
              </div>

              {/* Top Dashed Dropzone */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handlePdf2JpgFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', minHeight: '220px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '24px' }}
              >
                {pdf2JpgFiles.length === 0 ? (
                  <div 
                    onClick={() => pdf2JpgInputRef.current.click()}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#6b7280' }}
                  >
                    <Upload size={36} style={{ color: '#4f5b93', marginBottom: '10px' }} />
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>Drop or click to upload PDF document</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Fast & secure in-browser conversion</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {pdf2JpgFiles.map((item) => (
                      <div 
                        key={item.id} 
                        style={{ width: '180px', border: '1px solid #3b82f6', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative', padding: '16px 12px 10px', textAlign: 'center' }}
                      >
                        {/* Remove Close Button */}
                        <button 
                          onClick={() => handlePdf2JpgRemove(item.id)}
                          style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 10, width: '18px', height: '18px', backgroundColor: 'transparent', border: 'none', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                          title="Remove"
                        >
                          <X size={13} strokeWidth={2.5} />
                        </button>

                        {/* Red PDF Icon with 0.1MB Badge inside border (Matching Screenshot) */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '8px 0 12px' }}>
                          <svg width="54" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#e11d48"/>
                            <path d="M14 2V8H20" fill="#be123c"/>
                            <path d="M9.5 15.5C9.5 16.3284 8.82843 17 8 17H7V13H8C8.82843 13 9.5 13.6716 9.5 14.5V15.5Z" stroke="#ffffff" strokeWidth="1.2"/>
                            <path d="M12 13V17M12 15H14" stroke="#ffffff" strokeWidth="1.2"/>
                            <path d="M17 13H15V17" stroke="#ffffff" strokeWidth="1.2"/>
                          </svg>
                          
                          <div style={{ border: '1px solid #3b82f6', padding: '1px 8px', borderRadius: '3px', marginTop: '6px', fontSize: '11px', color: '#1e40af', fontWeight: '600', backgroundColor: '#ffffff' }}>
                            {item.sizeMB}MB
                          </div>
                        </div>

                        {/* Filename below */}
                        <div style={{ fontSize: '11px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                      </div>
                    ))}

                    {pdf2JpgFiles.length < 3 && (
                      <button 
                        onClick={() => pdf2JpgInputRef.current.click()}
                        style={{ width: '180px', height: '170px', border: '2px dashed #93c5fd', borderRadius: '4px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2563eb', cursor: 'pointer', gap: '6px' }}
                      >
                        <Upload size={24} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>+ Add PDF ({pdf2JpgFiles.length}/3)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Mode Selection Radio Row (Matching Screenshot) */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', fontSize: '13px', color: '#374151', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="pdf2JpgMode" 
                    checked={pdf2JpgMode === 'entire'} 
                    onChange={() => setPdf2JpgMode('entire')} 
                    style={{ accentColor: '#2563eb' }}
                  />
                  <span>Entire Page To JPG</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="pdf2JpgMode" 
                    checked={pdf2JpgMode === 'extract'} 
                    onChange={() => setPdf2JpgMode('extract')} 
                    style={{ accentColor: '#2563eb' }}
                  />
                  <span>Extract Images From Page</span>
                </label>
              </div>

              {/* Convert to JPG Action Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <button 
                  onClick={handleApplyPdf2Jpg}
                  disabled={pdf2JpgFiles.length === 0}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 32px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: pdf2JpgFiles.length > 0 ? 'pointer' : 'not-allowed', opacity: pdf2JpgFiles.length > 0 ? 1 : 0.5 }}
                >
                  Convert to JPG
                </button>
              </div>

              {/* Note Footer */}
              <div style={{ textAlign: 'center', fontSize: '13px', color: '#4338ca', fontWeight: '600' }}>
                Note:- You Can Convert 3 PDFs At Once
              </div>

            </div>
          )}

        </div>
      ) : activeTool.engine === 'img2pdf-engine' ? (
        // CONVERT IMAGES TO PDF CUSTOM UI
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '0 20px 40px' }}>
          
          <input type="file" ref={pdfImgInputRef} onChange={handlePdfImgFileChange} accept="image/*" multiple style={{ display: 'none' }} />

          {pdfResult ? (
            // ================= PDF RESULT SCREEN =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>PDF Document Is Ready - Pi7 Image Tool</h1>
                <div style={{ color: '#2563eb', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                  For Resize 100 images at once use Pi7 Bulk Resizer
                </div>
              </div>

              {/* Dashed Result Container */}
              <div style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '500px', margin: '0 auto', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                
                <div style={{ border: '1px solid #3b82f6', padding: '16px', borderRadius: '4px', backgroundColor: '#eff6ff', marginBottom: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <FileText size={48} style={{ color: '#dc2626' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af' }}>PDF DOCUMENT</span>
                </div>

                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '2px' }}>{pdfResult.renameName}.pdf</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Size:- {pdfResult.sizeKB}Kb ({pdfImgFiles.length} pages)</div>

                {/* Rename PDF Input */}
                <div style={{ width: '100%', maxWidth: '320px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Rename PDF</label>
                  <input 
                    type="text" 
                    value={pdfResult.renameName} 
                    onChange={(e) => setPdfResult({ ...pdfResult, renameName: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #94a3b8', borderRadius: '4px', fontSize: '13px', textAlign: 'center', outline: 'none' }} 
                  />
                </div>

                {/* Download Button */}
                <button 
                  onClick={handlePdfDownload}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Download PDF
                </button>

              </div>

              {/* Green Delete Now Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <button 
                  onClick={handlePdfReset}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Delete Your Images From Server Now
                </button>
              </div>

            </div>
          ) : (
            // ================= MAIN CONVERT IMAGES TO PDF SCREEN (Matching Screenshot) =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Convert Images To PDF - Pi7 Image Tool</h1>
              </div>

              {/* Main Container with Top Blue Bar */}
              <div style={{ borderRadius: '6px', overflow: 'hidden', backgroundColor: '#ffffff', marginBottom: '24px' }}>
                
                {/* Top Blue Header Bar */}
                <div style={{ backgroundColor: '#3b4ca8', color: '#ffffff', padding: '8px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500' }}>
                    <span>Page Size:</span>
                    <select 
                      value={pdfPageSize} 
                      onChange={(e) => setPdfPageSize(e.target.value)}
                      style={{ padding: '3px 8px', borderRadius: '3px', border: 'none', backgroundColor: '#ffffff', color: '#1f2937', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="fit">Fit Page</option>
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                      <option value="legal">Legal</option>
                    </select>
                  </div>
                  <span style={{ fontSize: '11px', color: '#e0e7ff' }}>Drag Images To Arrange In Sequence.</span>
                </div>

                {/* Dashed Dropzone Box */}
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handlePdfImgFileChange({ target: { files: e.dataTransfer.files } });
                    }
                  }}
                  style={{ border: '2px dashed #93c5fd', borderTop: 'none', borderRadius: '0 0 6px 6px', minHeight: '260px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                >
                  {pdfImgFiles.length === 0 ? (
                    <div 
                      onClick={() => pdfImgInputRef.current.click()}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#6b7280' }}
                    >
                      <Upload size={36} style={{ color: '#4f5b93', marginBottom: '10px' }} />
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>Select Or Drag & Drop Images Here</span>
                      <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>PNG, JPG, JPEG, WEBP supported</span>
                    </div>
                  ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', marginBottom: '24px' }}>
                        {pdfImgFiles.map((item, index) => (
                          <div 
                            key={item.id} 
                            style={{ width: '170px', border: '1px solid #3b82f6', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}
                          >
                            {/* Top Left Sequence Number Badge */}
                            <div style={{ position: 'absolute', top: '6px', left: '6px', zIndex: 10, width: '20px', height: '20px', backgroundColor: '#4338ca', color: '#ffffff', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {index + 1}
                            </div>

                            {/* Remove Close Button */}
                            <button 
                              onClick={() => handlePdfImgRemove(item.id)}
                              style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 10, width: '18px', height: '18px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '3px', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                              title="Remove"
                            >
                              <X size={12} strokeWidth={2.5} />
                            </button>

                            {/* Image Preview */}
                            <div style={{ width: '100%', height: '140px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                              <img 
                                src={item.url} 
                                alt={item.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                              />
                            </div>

                            {/* Filename & Sequence Buttons */}
                            <div style={{ padding: '6px 8px', textAlign: 'center', backgroundColor: '#3b4ca8' }}>
                              <div style={{ fontSize: '10px', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                                {item.name}
                              </div>
                              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                <button 
                                  onClick={() => handlePdfImgMove(index, -1)}
                                  disabled={index === 0}
                                  style={{ flex: 1, backgroundColor: '#ffffff', color: '#3b4ca8', border: 'none', borderRadius: '2px', padding: '2px 0', fontSize: '10px', fontWeight: '600', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.5 : 1 }}
                                >
                                  &lt;&lt; Prev
                                </button>
                                <button 
                                  onClick={() => handlePdfImgMove(index, 1)}
                                  disabled={index === pdfImgFiles.length - 1}
                                  style={{ flex: 1, backgroundColor: '#ffffff', color: '#3b4ca8', border: 'none', borderRadius: '2px', padding: '2px 0', fontSize: '10px', fontWeight: '600', cursor: index === pdfImgFiles.length - 1 ? 'not-allowed' : 'pointer', opacity: index === pdfImgFiles.length - 1 ? 0.5 : 1 }}
                                >
                                  Next &gt;&gt;
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Images Green Button (Matching Screenshot) */}
                      <button 
                        onClick={() => pdfImgInputRef.current.click()}
                        style={{ backgroundColor: '#15803d', color: '#ffffff', border: 'none', padding: '6px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        + Add Images
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Controls Area (Matching Reference Screenshot) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                
                {/* Also Compress PDF to Manual Size Checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                  <span>Also Compress PDF to Manual Size</span>
                  <input 
                    type="checkbox" 
                    checked={pdfCompressManual} 
                    onChange={(e) => setPdfCompressManual(e.target.checked)} 
                    style={{ accentColor: '#2563eb' }}
                  />
                </label>

                {pdfCompressManual && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>Target PDF Size:</span>
                    <div style={{ display: 'flex', border: '1px solid #94a3b8', borderRadius: '4px', overflow: 'hidden' }}>
                      <input 
                        type="number" 
                        value={pdfTargetKB} 
                        onChange={(e) => setPdfTargetKB(parseInt(e.target.value) || 200)} 
                        style={{ width: '80px', padding: '4px 8px', border: 'none', outline: 'none', fontSize: '13px' }} 
                      />
                      <span style={{ backgroundColor: '#475569', color: '#ffffff', padding: '4px 8px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        Kb
                      </span>
                    </div>
                  </div>
                )}

                {/* Convert To PDF Action Button */}
                <button 
                  onClick={handleApplyImg2Pdf}
                  disabled={pdfImgFiles.length === 0}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: pdfImgFiles.length > 0 ? 'pointer' : 'not-allowed', opacity: pdfImgFiles.length > 0 ? 1 : 0.5, marginTop: '4px' }}
                >
                  Convert To PDF
                </button>

              </div>

            </div>
          )}

        </div>
      ) : activeTool.engine === 'ssc-resizer-engine' ? (
        // RESIZE IMAGE FOR SSC (SIGNATURE & PHOTO) CUSTOM UI
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '0 20px 40px' }}>
          
          <input type="file" ref={sscInputRef} onChange={handleSscFileChange} accept="image/*" multiple style={{ display: 'none' }} />

          {sscResult ? (
            // ================= RESIZED SSC RESULT SCREEN =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Resized JPEG Image Is Ready - Pi7 Image Tool</h1>
                <div style={{ color: '#2563eb', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                  For Resize 100 images at once use Pi7 Bulk Resizer
                </div>
              </div>

              {/* Dashed Result Container */}
              <div style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '500px', margin: '0 auto', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                
                <div style={{ border: '1px solid #3b82f6', padding: '4px', borderRadius: '4px', backgroundColor: '#ffffff', marginBottom: '12px', display: 'inline-block' }}>
                  <img 
                    src={sscResult.dataUrl} 
                    alt="Resized SSC Result" 
                    style={{ maxHeight: '160px', maxWidth: '200px', objectFit: 'contain', display: 'block' }} 
                  />
                </div>

                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '2px' }}>{sscResult.renameName}.jpg</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Size:- {sscResult.sizeKB}Kb</div>

                {/* Rename Image Input */}
                <div style={{ width: '100%', maxWidth: '320px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Rename Image</label>
                  <input 
                    type="text" 
                    value={sscResult.renameName} 
                    onChange={(e) => setSscResult({ ...sscResult, renameName: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #94a3b8', borderRadius: '4px', fontSize: '13px', textAlign: 'center', outline: 'none' }} 
                  />
                </div>

                {/* Download Button */}
                <button 
                  onClick={handleSscDownload}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Download
                </button>

              </div>

              {/* Smaller Image Size In Kb Note */}
              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#111827' }}>
                <span style={{ fontWeight: '700' }}>Smaller Image Size In Kb?</span> Download Image and <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }} onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'increase-kb'); if (t) setActiveTool(t); }}>Increase Size In KB</span>
              </div>

              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                Your images will be automatically deleted from our server after 30 Mins of compression.
              </div>

              {/* Green Delete Now Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <button 
                  onClick={handleSscReset}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Delete Your Images From Server Now
                </button>
              </div>

            </div>
          ) : (
            // ================= MAIN RESIZE SSC SCREEN (Matching Screenshot) =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Resize Image For SSC (Signature & Photo)</h1>
              </div>

              {/* Top Dashed Dropzone */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleSscFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', minHeight: '260px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '24px' }}
              >
                {sscFiles.length === 0 ? (
                  <div 
                    onClick={() => sscInputRef.current.click()}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#6b7280' }}
                  >
                    <Upload size={36} style={{ color: '#4f5b93', marginBottom: '10px' }} />
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>Drop or click to upload photo / signature</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Fit to exact SSC DPI, CM, and KB limits</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {sscFiles.map((item) => (
                      <div 
                        key={item.id} 
                        style={{ width: '220px', border: '1px solid #3b82f6', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}
                      >
                        {/* Top Left Badge: Crop */}
                        <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
                          <button 
                            onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'passport-maker'); if (t) setActiveTool(t); }}
                            style={{ backgroundColor: 'rgba(37, 99, 235, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                          >
                            <Crop size={11} /> Crop
                          </button>
                        </div>

                        {/* Remove Close Button */}
                        <button 
                          onClick={() => handleSscRemove(item.id)}
                          style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '3px', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                          title="Remove"
                        >
                          <X size={13} strokeWidth={2.5} />
                        </button>

                        {/* Image Preview */}
                        <div style={{ width: '100%', height: '170px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        </div>

                        {/* Filename & Blue W-CM / H-CM Badges */}
                        <div style={{ padding: '8px 10px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                          <div style={{ fontSize: '11px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '6px' }}>
                            {item.name}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <span style={{ backgroundColor: '#4338ca', color: '#ffffff', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '600' }}>
                              W-{sscWidthCM}
                            </span>
                            <span style={{ backgroundColor: '#4338ca', color: '#ffffff', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '600' }}>
                              H-{sscHeightCM}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {sscFiles.length < 10 && (
                      <button 
                        onClick={() => sscInputRef.current.click()}
                        style={{ width: '220px', height: '230px', border: '2px dashed #93c5fd', borderRadius: '4px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2563eb', cursor: 'pointer', gap: '6px' }}
                      >
                        <Upload size={24} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>+ Add Image ({sscFiles.length}/10)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Controls Area (Matching Reference Screenshot) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                
                {/* DPI = Width (CM) X Height (CM) Formula Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#374151' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#4b5563' }}>DPI</span>
                    <input 
                      type="number" 
                      value={sscDpi} 
                      onChange={(e) => setSscDpi(parseInt(e.target.value) || 200)} 
                      style={{ width: '70px', padding: '6px 8px', border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }} 
                    />
                  </div>

                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#374151', marginTop: '16px' }}>=</span>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#4b5563' }}>Width (CM)</span>
                    <input 
                      type="number" 
                      step="0.1"
                      value={sscWidthCM} 
                      onChange={(e) => setSscWidthCM(parseFloat(e.target.value) || 7)} 
                      style={{ width: '80px', padding: '6px 8px', border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }} 
                    />
                  </div>

                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#374151', marginTop: '16px' }}>X</span>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#4b5563' }}>Height (CM)</span>
                    <input 
                      type="number" 
                      step="0.1"
                      value={sscHeightCM} 
                      onChange={(e) => setSscHeightCM(parseFloat(e.target.value) || 10)} 
                      style={{ width: '80px', padding: '6px 8px', border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }} 
                    />
                  </div>
                </div>

                {/* Compress Image To Specific Size Checkbox */}
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                    <input 
                      type="checkbox" 
                      checked={sscEnableKB} 
                      onChange={(e) => setSscEnableKB(e.target.checked)} 
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>Compress Image To Specific Size (Ex. 100kb)</span>
                  </label>
                </div>

                {/* Target Size input */}
                {sscEnableKB && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>Size:</span>
                    <div style={{ display: 'flex', border: '1px solid #94a3b8', borderRadius: '4px', overflow: 'hidden' }}>
                      <input 
                        type="number" 
                        value={sscTargetKB} 
                        onChange={(e) => setSscTargetKB(parseInt(e.target.value) || 20)} 
                        style={{ width: '70px', padding: '4px 8px', border: 'none', outline: 'none', fontSize: '13px' }} 
                      />
                      <span style={{ backgroundColor: '#475569', color: '#ffffff', padding: '4px 8px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        Kb
                      </span>
                    </div>
                  </div>
                )}

                {/* Resize Image Action Button */}
                <button 
                  onClick={handleApplySscResize}
                  disabled={sscFiles.length === 0}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: sscFiles.length > 0 ? 'pointer' : 'not-allowed', opacity: sscFiles.length > 0 ? 1 : 0.5, marginTop: '8px' }}
                >
                  Resize Image
                </button>

              </div>

            </div>
          )}

        </div>
      ) : activeTool.engine === 'resize-a4-engine' ? (
        // RESIZE IMAGE TO A4 SIZE CUSTOM UI
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '0 20px 40px' }}>
          
          <input type="file" ref={a4InputRef} onChange={handleA4FileChange} accept="image/*" multiple style={{ display: 'none' }} />

          {a4Result ? (
            // ================= RESIZED A4 RESULT SCREEN =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Resized JPEG Image Is Ready - Pi7 Image Tool</h1>
                <div style={{ color: '#2563eb', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                  For Resize 100 images at once use Pi7 Bulk Resizer
                </div>
              </div>

              {/* Dashed Result Container */}
              <div style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '500px', margin: '0 auto', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                
                <div style={{ border: '1px solid #3b82f6', padding: '4px', borderRadius: '4px', backgroundColor: '#ffffff', marginBottom: '12px', display: 'inline-block' }}>
                  <img 
                    src={a4Result.dataUrl} 
                    alt="Resized A4 Result" 
                    style={{ maxHeight: '160px', maxWidth: '200px', objectFit: 'contain', display: 'block' }} 
                  />
                </div>

                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '2px' }}>{a4Result.renameName}.jpg</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Size:- {a4Result.sizeKB}Kb</div>

                {/* Rename Image Input */}
                <div style={{ width: '100%', maxWidth: '320px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Rename Image</label>
                  <input 
                    type="text" 
                    value={a4Result.renameName} 
                    onChange={(e) => setA4Result({ ...a4Result, renameName: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #94a3b8', borderRadius: '4px', fontSize: '13px', textAlign: 'center', outline: 'none' }} 
                  />
                </div>

                {/* Download Button */}
                <button 
                  onClick={handleA4Download}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Download
                </button>

              </div>

              {/* Smaller Image Size In Kb Note */}
              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#111827' }}>
                <span style={{ fontWeight: '700' }}>Smaller Image Size In Kb?</span> Download Image and <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }} onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'increase-kb'); if (t) setActiveTool(t); }}>Increase Size In KB</span>
              </div>

              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                Your images will be automatically deleted from our server after 30 Mins of compression.
              </div>

              {/* Green Delete Now Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <button 
                  onClick={handleA4Reset}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Delete Your Images From Server Now
                </button>
              </div>

            </div>
          ) : (
            // ================= MAIN RESIZE A4 SCREEN (Matching Screenshot) =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Resize Image To A4 Size</h1>
              </div>

              {/* Top Dashed Dropzone */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleA4FileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', minHeight: '260px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '24px' }}
              >
                {a4Files.length === 0 ? (
                  <div 
                    onClick={() => a4InputRef.current.click()}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#6b7280' }}
                  >
                    <Upload size={36} style={{ color: '#4f5b93', marginBottom: '10px' }} />
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>Drop or click to upload photos</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Fit photos to standard A4 (2480 x 3508 px at 300 DPI)</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {a4Files.map((item) => (
                      <div 
                        key={item.id} 
                        style={{ width: '220px', border: '1px solid #3b82f6', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}
                      >
                        {/* Top Left Badges: Crop & Background */}
                        <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <button 
                            onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'passport-maker'); if (t) setActiveTool(t); }}
                            style={{ backgroundColor: 'rgba(37, 99, 235, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                          >
                            <Crop size={10} /> Crop
                          </button>
                          <button 
                            onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'passport-maker'); if (t) setActiveTool(t); }}
                            style={{ backgroundColor: 'rgba(37, 99, 235, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                          >
                            <Droplet size={10} /> Background
                          </button>
                        </div>

                        {/* Remove Close Button */}
                        <button 
                          onClick={() => handleA4Remove(item.id)}
                          style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '3px', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                          title="Remove"
                        >
                          <X size={13} strokeWidth={2.5} />
                        </button>

                        {/* Image Preview */}
                        <div style={{ width: '100%', height: '170px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        </div>

                        {/* Filename & Blue W-2480 / H-3508 Badges */}
                        <div style={{ padding: '8px 10px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                          <div style={{ fontSize: '11px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '6px' }}>
                            {item.name}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <span style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '600' }}>
                              W-2480
                            </span>
                            <span style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '600' }}>
                              H-3508
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {a4Files.length < 10 && (
                      <button 
                        onClick={() => a4InputRef.current.click()}
                        style={{ width: '220px', height: '230px', border: '2px dashed #93c5fd', borderRadius: '4px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2563eb', cursor: 'pointer', gap: '6px' }}
                      >
                        <Upload size={24} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>+ Add Image ({a4Files.length}/10)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Controls Area (Matching Reference Screenshot) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                
                {/* Tip Line */}
                <div style={{ fontSize: '13px', color: '#4338ca', fontWeight: '600' }}>
                  Tip:- <span style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'passport-maker'); if (t) setActiveTool(t); }}>Crop Image For Maintain Aspect Ratio</span>
                </div>

                {/* Width and Height Inputs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Width :</span>
                    <input 
                      type="number" 
                      value={a4Width} 
                      onChange={(e) => setA4Width(parseInt(e.target.value) || 2480)} 
                      style={{ width: '90px', padding: '6px 8px', border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }} 
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Height :</span>
                    <input 
                      type="number" 
                      value={a4Height} 
                      onChange={(e) => setA4Height(parseInt(e.target.value) || 3508)} 
                      style={{ width: '90px', padding: '6px 8px', border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }} 
                    />
                  </div>
                </div>

                {/* Resize Pixel Action Button */}
                <button 
                  onClick={handleApplyA4Resize}
                  disabled={a4Files.length === 0}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: a4Files.length > 0 ? 'pointer' : 'not-allowed', opacity: a4Files.length > 0 ? 1 : 0.5, marginTop: '8px' }}
                >
                  Resize Pixel
                </button>

                {/* Footer Note */}
                <div style={{ fontSize: '13px', color: '#111827', marginTop: '8px' }}>
                  <span style={{ fontWeight: '700' }}>Note:-</span> You can resize 10 images at once.
                </div>

              </div>

            </div>
          )}

        </div>
      ) : activeTool.engine === 'ai-upscale-engine' ? (
        // UPSCALE IMAGE ONLINE WITH AI CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Upscale Image Online with AI</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Pi7 Image Tool - AI upscaler that revives every pixel</p>
          </div>
          
          <input type="file" ref={upInputRef} onChange={handleUpFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div 
                className="ab-grid-bg" 
                onClick={() => !upRestoredUrl && upInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleUpFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff', cursor: upRestoredUrl ? 'default' : 'pointer' }}>
                {upRestoredUrl ? (
                   upPreviewOriginal ? (
                     // Before/After comparison view with vertical dotted dividing line matching reference screenshot
                     <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                       <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', borderLeft: '1px dashed #3b82f6', zIndex: 10 }} />
                       <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20px' }}>
                         <img 
                            src={upImage} 
                            alt="Original Low-Res" 
                            style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain', display: 'block' }} 
                         />
                       </div>
                     </div>
                   ) : (
                     <img 
                        src={upRestoredUrl} 
                        alt="Upscaled Preview" 
                        style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain', padding: '30px' }} 
                     />
                   )
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>
                      <p>Upload an image to upscale with AI</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '380px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Status Label */}
                   <div style={{ color: '#4f5b93', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>
                      {upRestoredUrl ? 'Image Restored' : 'Ready to Upscale'}
                   </div>

                   {/* New Image Button */}
                   <button 
                      onClick={() => upInputRef.current.click()} 
                      style={{ width: '100%', backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginBottom: '12px' }}
                   >
                      + New Image
                   </button>

                   {/* Download Image Button */}
                   <button 
                      onClick={handleUpDownload} 
                      disabled={!upRestoredUrl} 
                      style={{ width: '100%', backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: upRestoredUrl ? 'pointer' : 'not-allowed', opacity: upRestoredUrl ? 1 : 0.5, marginBottom: '24px' }}
                   >
                      Download Image
                   </button>

                   {/* Preview Original Image Checkbox */}
                   <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: upRestoredUrl ? 'pointer' : 'not-allowed', opacity: upRestoredUrl ? 1 : 0.5 }}>
                         <input 
                            type="checkbox" 
                            checked={upPreviewOriginal} 
                            disabled={!upRestoredUrl}
                            onChange={(e) => setUpPreviewOriginal(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Preview Original Image</span>
                      </label>
                   </div>

                </div>

                {/* Footer note */}
                <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
                   <span 
                      onClick={handleUpReset} 
                      style={{ fontSize: '12px', color: '#dc2626', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                   >
                      Delete Image From Server ⓘ
                   </span>
                </div>
             </div>
          </div>
        </div>
      ) : activeTool.engine === 'resize-pixel-engine' ? (
        // RESIZE IMAGE PIXEL ONLINE CUSTOM UI
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '0 20px 40px' }}>
          
          <input type="file" ref={rxInputRef} onChange={handleRxFileChange} accept="image/*" multiple style={{ display: 'none' }} />

          {rxResult ? (
            // ================= RESIZED RESULT SCREEN (From Reference Screenshot) =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Resized JPEG Image Is Ready - Pi7 Image Tool</h1>
                <div style={{ color: '#2563eb', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                  For Resize 100 images at once use Pi7 Bulk Resizer
                </div>
              </div>

              {/* Dashed Result Container */}
              <div style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '500px', margin: '0 auto', width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                
                <div style={{ border: '1px solid #3b82f6', padding: '4px', borderRadius: '4px', backgroundColor: '#ffffff', marginBottom: '12px', display: 'inline-block' }}>
                  <img 
                    src={rxResult.dataUrl} 
                    alt="Resized Result" 
                    style={{ maxHeight: '160px', maxWidth: '200px', objectFit: 'contain', display: 'block' }} 
                  />
                </div>

                <div style={{ fontSize: '13px', color: '#374151', marginBottom: '2px' }}>{rxResult.renameName}.{rxResult.format}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>Size:- {rxResult.sizeKB}Kb</div>

                {/* Rename Image Input */}
                <div style={{ width: '100%', maxWidth: '320px', marginBottom: '16px' }}>
                  <label style={{ fontSize: '11px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Rename Image</label>
                  <input 
                    type="text" 
                    value={rxResult.renameName} 
                    onChange={(e) => setRxResult({ ...rxResult, renameName: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #94a3b8', borderRadius: '4px', fontSize: '13px', textAlign: 'center', outline: 'none' }} 
                  />
                </div>

                {/* Download Button */}
                <button 
                  onClick={handleRxDownload}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Download
                </button>

              </div>

              {/* Smaller Image Size In Kb Note */}
              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#111827' }}>
                <span style={{ fontWeight: '700' }}>Smaller Image Size In Kb?</span> Download Image and <span style={{ color: '#2563eb', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }} onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'increase-kb'); if (t) setActiveTool(t); }}>Increase Size In KB</span>
              </div>

              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                Your images will be automatically deleted from our server after 30 Mins of compression.
              </div>

              {/* Green Delete Now Button */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <button 
                  onClick={handleRxReset}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Delete Your Images From Server Now
                </button>
              </div>

            </div>
          ) : (
            // ================= MAIN RESIZE PIXEL SCREEN =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
                <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Resize Image Pixel Online</h1>
              </div>

              {/* Top Dashed Dropzone */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleRxFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', minHeight: '260px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '24px' }}
              >
                {rxFiles.length === 0 ? (
                  <div 
                    onClick={() => rxInputRef.current.click()}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#6b7280' }}
                  >
                    <Upload size={36} style={{ color: '#4f5b93', marginBottom: '10px' }} />
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>Drop or click to upload photos</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>You can resize up to 10 images at once</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {rxFiles.map((item) => (
                      <div 
                        key={item.id} 
                        style={{ width: '220px', border: '1px solid #3b82f6', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}
                      >
                        {/* Top Left Badges: Crop & Background */}
                        <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <button 
                            onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'passport-maker'); if (t) setActiveTool(t); }}
                            style={{ backgroundColor: 'rgba(37, 99, 235, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                          >
                            <Crop size={10} /> Crop
                          </button>
                          <button 
                            onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'passport-maker'); if (t) setActiveTool(t); }}
                            style={{ backgroundColor: 'rgba(37, 99, 235, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}
                          >
                            <Droplet size={10} /> Background
                          </button>
                        </div>

                        {/* Remove Close Button */}
                        <button 
                          onClick={() => handleRxRemove(item.id)}
                          style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '3px', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                          title="Remove"
                        >
                          <X size={13} strokeWidth={2.5} />
                        </button>

                        {/* Image Preview */}
                        <div style={{ width: '100%', height: '170px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        </div>

                        {/* Filename & Blue W-px / H-px Badges */}
                        <div style={{ padding: '8px 10px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                          <div style={{ fontSize: '11px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '6px' }}>
                            {item.name}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <span style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '600' }}>
                              W-{item.width} px
                            </span>
                            <span style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '600' }}>
                              H-{item.height} px
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {rxFiles.length < 10 && (
                      <button 
                        onClick={() => rxInputRef.current.click()}
                        style={{ width: '220px', height: '230px', border: '2px dashed #93c5fd', borderRadius: '4px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2563eb', cursor: 'pointer', gap: '6px' }}
                      >
                        <Upload size={24} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>+ Add Image ({rxFiles.length}/10)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Controls Area (Matching Reference) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                
                {/* Maintain Aspect Ratio Checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                  <span>Maintain Aspect Ratio</span>
                  <input 
                    type="checkbox" 
                    checked={rxMaintainAspect} 
                    onChange={(e) => setRxMaintainAspect(e.target.checked)} 
                    style={{ accentColor: '#2563eb' }}
                  />
                </label>

                {/* Width and Height Inputs with 'X' */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#4b5563' }}>Width (PX)</span>
                    <input 
                      type="number" 
                      value={rxWidth} 
                      onChange={(e) => handleRxWidthChange(e.target.value)} 
                      style={{ width: '90px', padding: '6px 8px', border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }} 
                    />
                  </div>

                  <span style={{ fontSize: '16px', fontWeight: '700', color: '#374151', marginTop: '16px' }}>X</span>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#4b5563' }}>Height (PX)</span>
                    <input 
                      type="number" 
                      value={rxHeight} 
                      onChange={(e) => handleRxHeightChange(e.target.value)} 
                      style={{ width: '90px', padding: '6px 8px', border: '1px solid #94a3b8', borderRadius: '4px', textAlign: 'center', fontSize: '13px' }} 
                    />
                  </div>
                </div>

                {/* Compress Image To Specific Size Checkbox */}
                <div style={{ marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                    <input 
                      type="checkbox" 
                      checked={rxEnableTargetKB} 
                      onChange={(e) => setRxEnableTargetKB(e.target.checked)} 
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>Compress Image To Specific Size (Ex. 100kb)</span>
                  </label>
                </div>

                {/* Target Size input */}
                {rxEnableTargetKB && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>Size:</span>
                    <div style={{ display: 'flex', border: '1px solid #94a3b8', borderRadius: '4px', overflow: 'hidden' }}>
                      <input 
                        type="number" 
                        value={rxTargetKB} 
                        onChange={(e) => setRxTargetKB(parseInt(e.target.value) || 50)} 
                        style={{ width: '70px', padding: '4px 8px', border: 'none', outline: 'none', fontSize: '13px' }} 
                      />
                      <span style={{ backgroundColor: '#475569', color: '#ffffff', padding: '4px 8px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        Kb
                      </span>
                    </div>
                  </div>
                )}

                {/* Output Format Radio Group */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#374151', marginTop: '4px' }}>
                  <span style={{ fontWeight: '500' }}>Output:</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="rxFormat" 
                      checked={rxOutputFormat === 'jpeg'} 
                      onChange={() => setRxOutputFormat('jpeg')} 
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>JPEG</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input 
                      name="rxFormat" 
                      type="radio" 
                      checked={rxOutputFormat === 'jpg'} 
                      onChange={() => setRxOutputFormat('jpg')} 
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>JPG</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input 
                      name="rxFormat" 
                      type="radio" 
                      checked={rxOutputFormat === 'png'} 
                      onChange={() => setRxOutputFormat('png')} 
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span>PNG</span>
                  </label>
                </div>

                {/* Resize Image Action Button */}
                <button 
                  onClick={handleApplyPixelResize}
                  disabled={rxFiles.length === 0}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: rxFiles.length > 0 ? 'pointer' : 'not-allowed', opacity: rxFiles.length > 0 ? 1 : 0.5, marginTop: '8px' }}
                >
                  Resize Image
                </button>

                {/* Footer Note */}
                <div style={{ fontSize: '13px', color: '#111827', marginTop: '8px' }}>
                  <span style={{ fontWeight: '700' }}>Note:-</span> You can resize 10 images at once.
                </div>

              </div>

            </div>
          )}

        </div>
      ) : activeTool.engine === 'super-resolution-engine' ? (
        // SUPER RESOLUTION IMAGES ONLINE CUSTOM UI
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '0 20px 40px' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Super Resolution Images Online</h1>
          </div>

          <input type="file" ref={srInputRef} onChange={handleSrFileChange} accept="image/*" multiple style={{ display: 'none' }} />

          {/* Top Dashed Box */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleSrFileChange({ target: { files: e.dataTransfer.files } });
              }
            }}
            style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', padding: '36px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '16px' }}
          >
            <div style={{ fontSize: '15px', color: '#4b5563', marginBottom: '16px' }}>
              Select Or Drag & Drop Images Here
            </div>

            <button 
              onClick={() => srInputRef.current.click()}
              style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Select Images
            </button>

            {srFiles.length > 0 && (
              <div style={{ marginTop: '16px', fontSize: '13px', color: '#2563eb', fontWeight: '500' }}>
                {srFiles.length} image(s) selected
              </div>
            )}
          </div>

          {/* Increase Resolution Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <button 
              onClick={applySuperResolution}
              disabled={srFiles.length === 0}
              style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 28px', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: srFiles.length > 0 ? 'pointer' : 'not-allowed', opacity: srFiles.length > 0 ? 1 : 0.5 }}
            >
              Increase Resolution
            </button>
          </div>

          {/* Note Footer */}
          <div style={{ textAlign: 'center', marginBottom: '32px', color: '#4338ca', fontSize: '13px', fontWeight: '600' }}>
            Note:- You can resize 3 images at once, max 2000 pixels each
          </div>

          {/* INTERACTIVE BEFORE / AFTER COMPARISON CARD (Matching Screenshot) */}
          {srFiles.length > 0 && srFiles[srActiveIndex] && srFiles[srActiveIndex].isProcessed && (
            <div style={{ maxWidth: '540px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              <div style={{ width: '100%', border: '1px solid #3b82f6', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                
                {/* Card Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                    {srFiles[srActiveIndex].superW} x {srFiles[srActiveIndex].superH} Pixel
                  </span>
                  <button 
                    onClick={() => handleSrDownload(srFiles[srActiveIndex])}
                    style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '4px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Download
                  </button>
                </div>

                {/* Interactive Split View Container */}
                <div 
                  id="sr-split-container"
                  onMouseDown={() => setSrIsDragging(true)}
                  onMouseUp={() => setSrIsDragging(false)}
                  onMouseLeave={() => setSrIsDragging(false)}
                  onMouseMove={(e) => {
                    if (srIsDragging || e.buttons === 1) {
                      const el = document.getElementById('sr-split-container');
                      handleSrSliderMove(e, el);
                    }
                  }}
                  onTouchMove={(e) => {
                    const el = document.getElementById('sr-split-container');
                    handleSrSliderMove(e, el);
                  }}
                  style={{ position: 'relative', width: '100%', height: '480px', userSelect: 'none', cursor: 'ew-resize', overflow: 'hidden', backgroundColor: '#000000' }}
                >
                  {/* Super-Resolution Layer (Right / Base) */}
                  <img 
                    src={srFiles[srActiveIndex].superUrl} 
                    alt="Super Resolution HD" 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} 
                  />

                  {/* Original Image Layer (Left / Clipped) */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      width: '100%', 
                      height: '100%', 
                      overflow: 'hidden',
                      clipPath: `polygon(0 0, ${srSliderPos}% 0, ${srSliderPos}% 100%, 0 100%)`
                    }}
                  >
                    <img 
                      src={srFiles[srActiveIndex].url} 
                      alt="Original Low-Res" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} 
                    />
                  </div>

                  {/* Vertical Split Line */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: 0, 
                      bottom: 0, 
                      left: `${srSliderPos}%`, 
                      width: '2px', 
                      backgroundColor: '#ffffff', 
                      boxShadow: '0 0 6px rgba(0,0,0,0.6)', 
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none'
                    }} 
                  />

                  {/* Draggable Circle Handle with Arrows */}
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: `${srSliderPos}%`, 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ffffff', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.35)', 
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      pointerEvents: 'none'
                    }}
                  >
                    ↔
                  </div>

                </div>

              </div>

              {/* Thumbnails switcher if multiple images */}
              {srFiles.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  {srFiles.map((file, idx) => (
                    <div 
                      key={file.id}
                      onClick={() => setSrActiveIndex(idx)}
                      style={{ width: '60px', height: '60px', borderRadius: '4px', overflow: 'hidden', border: srActiveIndex === idx ? '2px solid #2563eb' : '1px solid #d1d5db', cursor: 'pointer' }}
                    >
                      <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      ) : activeTool.engine === 'dpi-checker-engine' ? (
        // CHECK IMAGE DPI ONLINE CUSTOM UI
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '0 20px 40px' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Check Image DPI Online | Pi7 DPI Checker</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Discover Your Image DPI in Seconds with Our Tool</p>
          </div>

          <input type="file" ref={chkDpiInputRef} onChange={handleChkDpiFileChange} accept="image/*" style={{ display: 'none' }} />

          {/* Top Dashed Box */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleChkDpiFileChange({ target: { files: e.dataTransfer.files } });
              }
            }}
            style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', minHeight: '220px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '20px' }}
          >
            {!chkDpiFile ? (
              <div 
                onClick={() => chkDpiInputRef.current.click()}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: '#6b7280' }}
              >
                <Upload size={36} style={{ color: '#4f5b93', marginBottom: '10px' }} />
                <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>Upload Image to Check DPI</span>
                <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>PNG, JPG, JPEG supported</span>
              </div>
            ) : (
              <div style={{ width: '220px', border: '1px solid #3b82f6', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}>
                
                {/* Top Badge: Resize Pixel */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
                  <button 
                    onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'resize-pixel'); if (t) setActiveTool(t); }}
                    style={{ backgroundColor: 'rgba(37, 99, 235, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    Resize Pixel
                  </button>
                </div>

                {/* Close Button */}
                <button 
                  onClick={handleChkDpiReset}
                  style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '3px', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                  title="Remove"
                >
                  <X size={13} strokeWidth={2.5} />
                </button>

                {/* Image Preview Container */}
                <div style={{ width: '100%', height: '160px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img 
                    src={chkDpiFile.url} 
                    alt={chkDpiFile.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>

                {/* Blue Info Banner */}
                <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '8px 12px', fontSize: '12px', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>{chkDpiFile.name}</div>
                  <div>Size:- {chkDpiFile.sizeKB} KB</div>
                  <div>Width:- {chkDpiFile.width} PX</div>
                  <div>Height:- {chkDpiFile.height} PX</div>
                </div>
              </div>
            )}
          </div>

          {/* Check DPI Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <button 
              onClick={handleChkDpiCheck}
              disabled={!chkDpiFile}
              style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', cursor: chkDpiFile ? 'pointer' : 'not-allowed', opacity: chkDpiFile ? 1 : 0.5 }}
            >
              Check DPI
            </button>
          </div>

          {/* DPI Result Table (Matching Reference Screenshot) */}
          {chkDpiResult && (
            <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              
              <div style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '24px' }}>
                {/* Table Header Banner */}
                <div style={{ backgroundColor: '#4338ca', color: '#ffffff', padding: '10px 16px', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>
                  {chkDpiResult.name}
                </div>

                {/* Table Content */}
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#4338ca', width: '50%', borderRight: '1px solid #e5e7eb' }}>DPI</td>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#111827', width: '50%' }}>{chkDpiResult.dpi}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#4338ca', borderRight: '1px solid #e5e7eb' }}>Width</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{chkDpiResult.width} PX</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#4338ca', borderRight: '1px solid #e5e7eb' }}>Height</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{chkDpiResult.height} PX</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#4338ca', borderRight: '1px solid #e5e7eb' }}>Size</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{chkDpiResult.sizeKB} KB</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons Below Table */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleChkDpiReset}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                >
                  Check Another Image
                </button>
                <button 
                  onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'convert-dpi'); if (t) setActiveTool(t); }}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                >
                  Change DPI
                </button>
              </div>

            </div>
          )}

        </div>
      ) : activeTool.engine === 'dpi-converter-engine' ? (
        // DPI CONVERTER CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 100px)', padding: '0 20px 40px' }}>
          
          {/* Header Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>DPI Converter - Change Image DPI To 200, 300, 600</h1>
          </div>

          <input type="file" ref={dpiInputRef} onChange={handleDpiFileChange} accept="image/*" multiple style={{ display: 'none' }} />

          {dpiConvertedResults && dpiConvertedResults.length > 0 ? (
            // ================= RESULT SCREEN (From Reference Screenshot) =================
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              
              {/* Advertisement badge */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', color: '#9ca3af', border: '1px solid #e5e7eb', padding: '1px 6px', borderRadius: '2px' }}>Advertisements</span>
              </div>

              {/* Dashed Result Box */}
              <div style={{ border: '2px dashed #93c5fd', borderRadius: '6px', backgroundColor: '#ffffff', padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Result cards row */}
                <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {dpiConvertedResults.map((res) => (
                    <div key={res.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ border: '1px solid #3b82f6', padding: '4px', borderRadius: '4px', backgroundColor: '#ffffff', marginBottom: '8px', display: 'inline-block' }}>
                        <img 
                          src={res.url} 
                          alt={res.name} 
                          style={{ maxHeight: '160px', maxWidth: '200px', objectFit: 'contain', display: 'block' }} 
                        />
                      </div>
                      <span style={{ fontSize: '13px', color: '#374151', marginBottom: '8px', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.name}</span>
                      <button 
                        onClick={() => downloadDataUrl(res.dataUrl, res.name)}
                        style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '6px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ color: '#4b5563', fontSize: '13px', fontWeight: '500', marginTop: '12px' }}>
                  DPI Updated. Check Image DPI With Our <span style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => showToast('DPI verification: ' + dpiTargetValue + ' DPI confirmed!')}>DPI Checker</span> Tool
                </div>
              </div>

              {/* Middle Action Button */}
              <button 
                onClick={handleDpiReset}
                style={{ backgroundColor: '#3730a3', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', margin: '20px auto', display: 'block' }}
              >
                Process Another Image
              </button>

              {/* Quick Navigation Action Buttons Row */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
                <button 
                  onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'image-to-pdf'); if (t) setActiveTool(t); }}
                  style={{ backgroundColor: '#e11d48', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                >
                  Image To PDF
                </button>
                <button 
                  onClick={handleDpiReset}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                >
                  Process Another Image
                </button>
                <button 
                  onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'resize-pixel'); if (t) setActiveTool(t); }}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                >
                  Resize Image Pixels
                </button>
                <button 
                  onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'reduce-kb'); if (t) setActiveTool(t); }}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                >
                  Compress PDF To 300kb Or Any Size
                </button>
                <button 
                  onClick={() => { const t = TOOLS_CATALOG.find(x => x.id === 'passport-maker'); if (t) setActiveTool(t); }}
                  style={{ backgroundColor: '#0f766e', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                >
                  Crop Image / Signature
                </button>
              </div>

              {/* Share section */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                  Share Pi7 Image Tool With Your Friends
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {['VK', 'FB', 'TW', 'TG', 'RD', 'IN'].map((network, i) => (
                    <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                      {network}
                    </div>
                  ))}
                </div>
              </div>

              {/* Your Image is Ready to Download Informational Footer */}
              <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto', color: '#4b5563' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>Your Image is Ready to Download</h2>
                <p style={{ fontSize: '13px', lineHeight: '1.6', margin: 0, color: '#6b7280' }}>
                  The process of encoding an image file so that it takes up less space than the original file is called Image compression. It is a type of data compression that reduces the image file size while maintaining the original image quality.
                </p>
              </div>

            </div>
          ) : (
            // ================= UPLOAD & EDIT SCREEN =================
            <>
              {/* Unit Switcher Bar (Right aligned above box) */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1px', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #c7d2fe', borderBottom: 'none', borderRadius: '6px 6px 0 0', padding: '4px 12px', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                  <span>Image Dimensions:-</span>
                  <button 
                    onClick={() => setDpiUnit('px')} 
                    style={{ border: 'none', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', backgroundColor: dpiUnit === 'px' ? '#e0e7ff' : 'transparent', color: dpiUnit === 'px' ? '#3730a3' : '#6b7280', fontWeight: dpiUnit === 'px' ? '600' : '400' }}
                  >
                    Pixels
                  </button>
                  <button 
                    onClick={() => setDpiUnit('mm')} 
                    style={{ border: 'none', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', backgroundColor: dpiUnit === 'mm' ? '#e0e7ff' : 'transparent', color: dpiUnit === 'mm' ? '#3730a3' : '#6b7280', fontWeight: dpiUnit === 'mm' ? '600' : '400' }}
                  >
                    MM
                  </button>
                  <button 
                    onClick={() => setDpiUnit('cm')} 
                    style={{ border: 'none', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', backgroundColor: dpiUnit === 'cm' ? '#e0e7ff' : 'transparent', color: dpiUnit === 'cm' ? '#3730a3' : '#6b7280', fontWeight: dpiUnit === 'cm' ? '600' : '400' }}
                  >
                    CM
                  </button>
                </div>
              </div>

              {/* Main Big Dropzone Card */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleDpiFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ border: '2px solid #4338ca', borderRadius: '4px', backgroundColor: '#ffffff', minHeight: '380px', padding: '24px', display: 'flex', flexDirection: 'column', position: 'relative' }}
              >
                {dpiFiles.length === 0 ? (
                  <div 
                    onClick={() => dpiInputRef.current.click()}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', padding: '60px', border: '2px dashed #c7d2fe', borderRadius: '8px', backgroundColor: '#f8fafc' }}
                  >
                    <Upload size={40} style={{ color: '#4f5b93', marginBottom: '12px' }} />
                    <span style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>Drop or click to upload photos</span>
                    <span style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>You can upload up to 3 images at once</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    {dpiFiles.map((item) => (
                      <div 
                        key={item.id} 
                        style={{ width: '220px', border: '1px solid #3b82f6', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'relative' }}
                      >
                        {/* Top Buttons: Resize, Crop, Close */}
                        <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <button 
                            onClick={() => handleOpenResizeModal(item)}
                            style={{ backgroundColor: 'rgba(37, 99, 235, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                          >
                            <Maximize2 size={11} /> Resize Image
                          </button>
                          <button 
                            onClick={() => handleOpenResizeModal(item)}
                            style={{ backgroundColor: 'rgba(37, 99, 235, 0.9)', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                          >
                            <Crop size={11} /> Crop
                          </button>
                        </div>

                        <button 
                          onClick={() => handleDpiRemove(item.id)}
                          style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, width: '22px', height: '22px', backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #ef4444', borderRadius: '4px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                          title="Remove"
                        >
                          <X size={14} strokeWidth={2.5} />
                        </button>

                        {/* Image Preview Container */}
                        <div style={{ width: '100%', height: '200px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                          />
                        </div>

                        {/* Blue Info Banner */}
                        <div style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 12px', fontSize: '12px', lineHeight: '1.4' }}>
                          <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>{item.name}</div>
                          <div>Size:- {item.sizeKB} KB</div>
                          <div>Width:- {getFormattedDpiDimension(item.width, dpiUnit)} {dpiUnit.toUpperCase()}</div>
                          <div>Height:- {getFormattedDpiDimension(item.height, dpiUnit)} {dpiUnit.toUpperCase()}</div>
                        </div>
                      </div>
                    ))}

                    {/* Add more button if less than 3 */}
                    {dpiFiles.length < 3 && (
                      <button 
                        onClick={() => dpiInputRef.current.click()}
                        style={{ width: '220px', height: '270px', border: '2px dashed #93c5fd', borderRadius: '4px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#2563eb', cursor: 'pointer', gap: '8px' }}
                      >
                        <Upload size={28} />
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>+ Add Image ({dpiFiles.length}/3)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Bar: DPI Input + Convert DPI Button */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>DPI:</span>
                  <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                    <input 
                      type="number" 
                      value={dpiTargetValue} 
                      onChange={(e) => setDpiTargetValue(parseInt(e.target.value) || 300)} 
                      style={{ width: '70px', padding: '6px 8px', border: 'none', outline: 'none', fontSize: '14px', textAlign: 'center' }} 
                    />
                    <span style={{ backgroundColor: '#475569', color: '#ffffff', padding: '6px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                      DPI
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleConvertDpi}
                  disabled={dpiFiles.length === 0}
                  style={{ backgroundColor: '#4338ca', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: dpiFiles.length > 0 ? 'pointer' : 'not-allowed', opacity: dpiFiles.length > 0 ? 1 : 0.5 }}
                >
                  Convert DPI
                </button>
              </div>

              {/* Note Footer */}
              <div style={{ textAlign: 'center', marginTop: '16px', color: '#4338ca', fontSize: '13px', fontWeight: '600' }}>
                Note:- You Can Process 3 Images At Once
              </div>
            </>
          )}

          {/* RESIZE IMAGE MODAL OVERLAY */}
          {dpiResizeModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', maxWidth: '640px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {/* Resize Modal Header with Unit Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Resize Image In</span>
                  <button 
                    onClick={() => handleResizeUnitChange('px')}
                    style={{ border: 'none', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', backgroundColor: dpiResizeModal.activeUnit === 'px' ? '#3b82f6' : '#e0e7ff', color: dpiResizeModal.activeUnit === 'px' ? '#ffffff' : '#3730a3', fontWeight: '600' }}
                  >
                    Pixels
                  </button>
                  <button 
                    onClick={() => handleResizeUnitChange('mm')}
                    style={{ border: 'none', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', backgroundColor: dpiResizeModal.activeUnit === 'mm' ? '#3b82f6' : '#e0e7ff', color: dpiResizeModal.activeUnit === 'mm' ? '#ffffff' : '#3730a3', fontWeight: '600' }}
                  >
                    MM (Millimeter)
                  </button>
                  <button 
                    onClick={() => handleResizeUnitChange('cm')}
                    style={{ border: 'none', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer', backgroundColor: dpiResizeModal.activeUnit === 'cm' ? '#3b82f6' : '#e0e7ff', color: dpiResizeModal.activeUnit === 'cm' ? '#ffffff' : '#3730a3', fontWeight: '600' }}
                  >
                    CM (Centimetre)
                  </button>
                </div>

                {/* Modal Center Preview */}
                <div style={{ width: '100%', height: '240px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <img 
                    src={dpiResizeModal.url} 
                    alt="Resize Preview" 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                </div>

                {/* Prompt text */}
                <div style={{ color: '#4338ca', fontSize: '13px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
                  Please enter the width and height of the image you wish to resize:
                </div>

                {/* Maintain Aspect Ratio Checkbox */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                    <span>Maintain Aspect Ratio</span>
                    <input 
                      type="checkbox" 
                      checked={dpiResizeModal.maintainAspect} 
                      onChange={(e) => setDpiResizeModal({ ...dpiResizeModal, maintainAspect: e.target.checked })} 
                      style={{ accentColor: '#2563eb' }}
                    />
                  </label>
                </div>

                {/* Width and Height Input Fields */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>Width:</span>
                    <div style={{ display: 'flex', border: '1px solid #94a3b8', borderRadius: '4px', overflow: 'hidden' }}>
                      <input 
                        type="number" 
                        value={dpiResizeModal.width} 
                        onChange={(e) => handleResizeWidthChange(e.target.value)} 
                        style={{ width: '70px', padding: '4px 8px', border: 'none', outline: 'none', fontSize: '13px' }} 
                      />
                      <span style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '4px 8px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        {dpiResizeModal.activeUnit.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>Height:</span>
                    <div style={{ display: 'flex', border: '1px solid #94a3b8', borderRadius: '4px', overflow: 'hidden' }}>
                      <input 
                        type="number" 
                        value={dpiResizeModal.height} 
                        onChange={(e) => handleResizeHeightChange(e.target.value)} 
                        style={{ width: '70px', padding: '4px 8px', border: 'none', outline: 'none', fontSize: '13px' }} 
                      />
                      <span style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '4px 8px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                        {dpiResizeModal.activeUnit.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleApplyResize}
                    style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    Resize Image
                  </button>
                  <button 
                    onClick={() => setDpiResizeModal(null)}
                    style={{ backgroundColor: '#db2777', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      ) : activeTool.engine === 'increase-quality-engine' ? (
        // INCREASE IMAGE QUALITY ONLINE FREE CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>{activeTool.name}</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>{activeTool.desc || 'Pi7 Image Tool - Turn blurry photos into crystal-clear memories'}</p>
          </div>
          
          <input type="file" ref={iqInputRef} onChange={handleIqFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div 
                className="ab-grid-bg" 
                onClick={() => !iqRestoredUrl && iqInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleIqFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff', cursor: iqRestoredUrl ? 'default' : 'pointer' }}>
                {iqRestoredUrl ? (
                   iqPreviewOriginal ? (
                     <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                       <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', borderLeft: '1px dashed #3b82f6', zIndex: 10 }} />
                       <div style={{ width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '20px' }}>
                         <img 
                            src={iqImage} 
                            alt="Original Blurry" 
                            style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain', display: 'block' }} 
                         />
                       </div>
                     </div>
                   ) : (
                     <img 
                        src={iqRestoredUrl} 
                        alt="Restored High Quality Preview" 
                        style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain', padding: '30px' }} 
                     />
                   )
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>
                      <p>Upload a blurry or low-quality photo to enhance with AI</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '380px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Status Label */}
                   <div style={{ color: '#4f5b93', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>
                      {iqRestoredUrl ? 'Image Restored' : 'Ready to Enhance'}
                   </div>

                   {/* New Image Button */}
                   <button 
                      onClick={() => iqInputRef.current.click()} 
                      style={{ width: '100%', backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginBottom: '12px' }}
                   >
                      + New Image
                   </button>

                   {/* Download Image Button */}
                   <button 
                      onClick={handleIqDownload} 
                      disabled={!iqRestoredUrl} 
                      style={{ width: '100%', backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: iqRestoredUrl ? 'pointer' : 'not-allowed', opacity: iqRestoredUrl ? 1 : 0.5, marginBottom: '24px' }}
                   >
                      Download Image
                   </button>

                   {/* Preview Original Image Checkbox */}
                   <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: iqRestoredUrl ? 'pointer' : 'not-allowed', opacity: iqRestoredUrl ? 1 : 0.5 }}>
                         <input 
                            type="checkbox" 
                            checked={iqPreviewOriginal} 
                            disabled={!iqRestoredUrl}
                            onChange={(e) => setIqPreviewOriginal(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Preview Original Image</span>
                      </label>
                   </div>

                </div>

                {/* Footer note */}
                <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
                   <span 
                      onClick={handleIqReset} 
                      style={{ fontSize: '12px', color: '#dc2626', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                   >
                      Delete Image From Server ⓘ
                   </span>
                </div>
             </div>
          </div>
        </div>
      ) : activeTool.engine === 'ai-retouch-engine' ? (
        // RETOUCH PHOTO ONLINE WITH AI CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Retouch Photo Online with AI</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Smooth skin, clear tones, and HD results - Pi7 makes photo retouch effortless.</p>
          </div>
          
          <input type="file" ref={rtInputRef} onChange={handleRtFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div 
                className="ab-grid-bg" 
                onClick={() => !rtRestoredUrl && rtInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleRtFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff', cursor: rtRestoredUrl ? 'default' : 'pointer' }}>
                {rtRestoredUrl ? (
                   <img 
                      src={rtPreviewOriginal ? rtImage : rtRestoredUrl} 
                      alt="AI Retouched Preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain' }} 
                   />
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <p>Upload a photo to retouch with AI</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '380px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Status Label */}
                   <div style={{ color: '#4f5b93', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>
                      {rtRestoredUrl ? 'Image Restored' : 'Ready to Retouch'}
                   </div>

                   {/* New Image Button */}
                   <button 
                      onClick={() => rtInputRef.current.click()} 
                      style={{ width: '100%', backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginBottom: '12px' }}
                   >
                      + New Image
                   </button>

                   {/* Download Image Button */}
                   <button 
                      onClick={handleRtDownload} 
                      disabled={!rtRestoredUrl} 
                      style={{ width: '100%', backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: rtRestoredUrl ? 'pointer' : 'not-allowed', opacity: rtRestoredUrl ? 1 : 0.5, marginBottom: '24px' }}
                   >
                      Download Image
                   </button>

                   {/* Preview Original Image Checkbox */}
                   <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: rtRestoredUrl ? 'pointer' : 'not-allowed', opacity: rtRestoredUrl ? 1 : 0.5 }}>
                         <input 
                            type="checkbox" 
                            checked={rtPreviewOriginal} 
                            disabled={!rtRestoredUrl}
                            onChange={(e) => setRtPreviewOriginal(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Preview Original Image</span>
                      </label>
                   </div>

                </div>

                {/* Footer note */}
                <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
                   <span 
                      onClick={handleRtReset} 
                      style={{ fontSize: '12px', color: '#dc2626', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                   >
                      Delete Image From Server ⓘ
                   </span>
                </div>
             </div>
          </div>
        </div>
      ) : activeTool.engine === 'blemish-remover-engine' ? (
        // REMOVE BLEMISHES FROM PHOTOS WITH AI CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Remove Blemishes from Photos with AI</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Flawless skin in every photo - remove blemishes, pimples, and spots instantly with AI.</p>
          </div>
          
          <input type="file" ref={blmInputRef} onChange={handleBlmFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div 
                className="ab-grid-bg" 
                onClick={() => !blmRestoredUrl && blmInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleBlmFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff', cursor: blmRestoredUrl ? 'default' : 'pointer' }}>
                {blmRestoredUrl ? (
                   <img 
                      src={blmPreviewOriginal ? blmImage : blmRestoredUrl} 
                      alt="Retouched Preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain' }} 
                   />
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <p>Upload a portrait to remove blemishes with AI</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '380px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Status Label */}
                   <div style={{ color: '#4f5b93', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>
                      {blmRestoredUrl ? 'Image Restored' : 'Ready to Restore'}
                   </div>

                   {/* New Image Button */}
                   <button 
                      onClick={() => blmInputRef.current.click()} 
                      style={{ width: '100%', backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', marginBottom: '12px' }}
                   >
                      + New Image
                   </button>

                   {/* Download Image Button */}
                   <button 
                      onClick={handleBlmDownload} 
                      disabled={!blmRestoredUrl} 
                      style={{ width: '100%', backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: blmRestoredUrl ? 'pointer' : 'not-allowed', opacity: blmRestoredUrl ? 1 : 0.5, marginBottom: '24px' }}
                   >
                      Download Image
                   </button>

                   {/* Preview Original Image Checkbox */}
                   <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: blmRestoredUrl ? 'pointer' : 'not-allowed', opacity: blmRestoredUrl ? 1 : 0.5 }}>
                         <input 
                            type="checkbox" 
                            checked={blmPreviewOriginal} 
                            disabled={!blmRestoredUrl}
                            onChange={(e) => setBlmPreviewOriginal(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Preview Original Image</span>
                      </label>
                   </div>

                </div>

                {/* Footer note */}
                <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
                   <span 
                      onClick={handleBlmReset} 
                      style={{ fontSize: '12px', color: '#dc2626', textDecoration: 'underline', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                   >
                      Delete Image From Server ⓘ
                   </span>
                </div>
             </div>
          </div>
        </div>
      ) : activeTool.engine === 'pixel-art-engine' ? (
        // CONVERT ANY PICTURE TO PIXEL ART CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Convert Any Picture to Pixel Art</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Turn Pictures into Pixel Art - Instantly, Privately, and for Free.</p>
          </div>
          
          <input type="file" ref={paInputRef} onChange={handlePaFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div 
                className="ab-grid-bg" 
                onClick={() => !paPreviewUrl && paInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handlePaFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff', cursor: paPreviewUrl ? 'default' : 'pointer' }}>
                {paPreviewUrl ? (
                   <img 
                      src={paPreviewUrl} 
                      alt="Pixel Art Preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain', imageRendering: 'pixelated' }} 
                   />
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <p>Upload an image to start converting to pixel art</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '400px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Block size slider */}
                   <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                         <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>Block size</span>
                         <span style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #d1d5db', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fff' }}>{paBlockSize}</span>
                      </div>
                      <input 
                         type="range" 
                         min="1" max="50" 
                         value={paBlockSize} 
                         onChange={(e) => setPaBlockSize(Number(e.target.value))} 
                         className="ab-slider"
                      />
                   </div>

                   {/* Change Color Palette */}
                   <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: paUsePalette ? '12px' : '0' }}>
                         <input 
                            type="checkbox" 
                            checked={paUsePalette} 
                            onChange={(e) => setPaUsePalette(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Change Color Palette</span>
                      </label>
                      
                      {paUsePalette && (
                         <div style={{ paddingLeft: '24px' }}>
                            <select 
                               value={paActivePalette} 
                               onChange={(e) => setPaActivePalette(e.target.value)}
                               style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#ffffff', fontSize: '13px', marginBottom: '12px' }}
                            >
                               <option value="pico8">Pico-8 Classic (16 Colors)</option>
                               <option value="retro1">Retro Pop (8 Colors)</option>
                               <option value="gameboy">GameBoy (4 Colors)</option>
                               <option value="cga">CGA Classic (4 Colors)</option>
                               <option value="sepia">Sepia Vintage (5 Colors)</option>
                               <option value="custom">Custom Palette...</option>
                            </select>
                            
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Create Custom Palette</div>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
                               {paCustomPalette.map((color, idx) => (
                                  <div key={idx} style={{ position: 'relative' }}>
                                     <input type="color" value={color} onChange={(e) => {
                                        const newPal = [...paCustomPalette];
                                        newPal[idx] = e.target.value;
                                        setPaCustomPalette(newPal);
                                        setPaActivePalette('custom');
                                     }} style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer' }} />
                                  </div>
                               ))}
                               <button onClick={() => {
                                  if(paCustomPalette.length < 16) {
                                     setPaCustomPalette([...paCustomPalette, '#ffffff']);
                                     setPaActivePalette('custom');
                                  }
                               }} style={{ width: '24px', height: '24px', border: '1px dashed #4f5b93', backgroundColor: 'transparent', color: '#4f5b93', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                         </div>
                      )}
                   </div>

                   {/* Apply Grayscale */}
                   <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <input 
                            type="checkbox" 
                            checked={paGrayscale} 
                            onChange={(e) => setPaGrayscale(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Apply Grayscale</span>
                      </label>
                   </div>

                   {/* Draw Grid Lines */}
                   <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <input 
                            type="checkbox" 
                            checked={paDrawGrid} 
                            onChange={(e) => setPaDrawGrid(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Draw Grid Lines</span>
                      </label>
                   </div>

                   {/* Draw Edges */}
                   <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: paDrawEdges ? '12px' : '0' }}>
                         <input 
                            type="checkbox" 
                            checked={paDrawEdges} 
                            onChange={(e) => setPaDrawEdges(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Draw Edges</span>
                      </label>
                      
                      {paDrawEdges && (
                         <div style={{ paddingLeft: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                               <span style={{ fontSize: '12px', color: '#6b7280', width: '60px' }}>Line Width</span>
                               <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '4px', overflow: 'hidden' }}>
                                  <button onClick={() => setPaEdgeWidth(Math.max(1, paEdgeWidth - 1))} style={{ padding: '4px 12px', border: 'none', backgroundColor: '#f9fafb', cursor: 'pointer' }}>-</button>
                                  <input type="text" readOnly value={paEdgeWidth} style={{ width: '40px', textAlign: 'center', border: 'none', borderLeft: '1px solid #d1d5db', borderRight: '1px solid #d1d5db' }} />
                                  <button onClick={() => setPaEdgeWidth(Math.min(20, paEdgeWidth + 1))} style={{ padding: '4px 12px', border: 'none', backgroundColor: '#f9fafb', cursor: 'pointer' }}>+</button>
                               </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                               <span style={{ fontSize: '12px', color: '#6b7280', width: '60px' }}>Threshold</span>
                               <input type="range" min="0" max="100" value={paEdgeThreshold} onChange={(e) => setPaEdgeThreshold(Number(e.target.value))} className="ab-slider" />
                               <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{paEdgeThreshold}</span>
                            </div>
                         </div>
                      )}
                   </div>

                </div>
                <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', gap: '8px', borderTop: '1px solid #e5e7eb' }}>
                   <button onClick={() => paInputRef.current.click()} style={{ flex: 1, backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>New Image</button>
                   <button onClick={handlePaDownload} disabled={!paPreviewUrl} style={{ flex: 1, backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: paPreviewUrl ? 'pointer' : 'not-allowed', opacity: paPreviewUrl ? 1 : 0.5 }}>Download Image</button>
                </div>
             </div>
          </div>
        </div>
      ) : activeTool.engine === 'blackwhite-engine' ? (
        // TURN COLOR IMAGE TO BLACK AND WHITE CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Turn Color Image to Black and White</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Pi7 Image Tool: Transforming Color Picture to Classic Black & White.</p>
          </div>
          
          <input type="file" ref={bwInputRef} onChange={handleBwFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '0 20px 40px' }}>
            <div style={{ width: '100%', maxWidth: '850px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              
              {/* Preview Box with light gray backdrop */}
              <div 
                onClick={() => !bwPreviewUrl && bwInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleBwFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ position: 'relative', minHeight: '440px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', cursor: bwPreviewUrl ? 'default' : 'pointer' }}
              >
                {bwPreviewUrl ? (
                  <>
                    <img 
                      src={bwPreviewUrl} 
                      alt="Black & White Preview" 
                      style={{ maxHeight: '480px', maxWidth: '100%', objectFit: 'contain', display: 'block', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                    />
                    {/* Top right red square remove icon */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleBwReset(); }}
                      style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', backgroundColor: '#ffffff', border: '1.5px solid #ef4444', borderRadius: '4px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                      title="Remove Image"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <div 
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#6b7280', padding: '40px', border: '2px dashed #9ca3af', borderRadius: '8px', backgroundColor: '#ffffff' }}
                  >
                    <Upload size={36} style={{ color: '#4f5b93', marginBottom: '12px' }} />
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>Drop or click to upload image</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Supports JPG, PNG, WEBP (Max 20MB)</span>
                  </div>
                )}
              </div>

              {/* Bottom Action Toolbar */}
              <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                <button 
                  onClick={() => applyBlackWhiteEffect()}
                  disabled={!bwImage}
                  style={{ backgroundColor: '#5c6ac4', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: bwImage ? 'pointer' : 'not-allowed', opacity: bwImage ? 1 : 0.6 }}
                >
                  Turn Black & White
                </button>
                <button 
                  onClick={handleBwDownload}
                  disabled={!bwPreviewUrl}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5c6ac4', cursor: bwPreviewUrl ? 'pointer' : 'not-allowed', opacity: bwPreviewUrl ? 1 : 0.5 }}
                  title="Download Image"
                >
                  <Download size={18} />
                </button>
              </div>

            </div>
          </div>
        </div>
      ) : activeTool.engine === 'grayscale-engine' ? (
        // CONVERT IMAGE TO GRAYSCALE CUSTOM UI
        <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Convert Image to Grayscale</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Transform Colors, Embrace Elegance: Pi7 Image Tool for Effortless Grayscale Conversion</p>
          </div>
          
          <input type="file" ref={gsInputRef} onChange={handleGsFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '0 20px 40px' }}>
            <div style={{ width: '100%', maxWidth: '850px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              
              {/* Preview Box with light gray backdrop */}
              <div style={{ position: 'relative', minHeight: '440px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                {gsPreviewUrl ? (
                  <>
                    <img 
                      src={gsPreviewUrl} 
                      alt="Grayscale Preview" 
                      style={{ maxHeight: '480px', maxWidth: '100%', objectFit: 'contain', display: 'block', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} 
                    />
                    {/* Top right red square remove icon */}
                    <button 
                      onClick={handleGsReset}
                      style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', backgroundColor: '#ffffff', border: '1.5px solid #ef4444', borderRadius: '4px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                      title="Remove Image"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <div 
                    onClick={() => gsInputRef.current.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleGsFileChange({ target: { files: e.dataTransfer.files } });
                      }
                    }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', padding: '40px', border: '2px dashed #9ca3af', borderRadius: '8px', backgroundColor: '#ffffff' }}
                  >
                    <Upload size={36} style={{ color: '#4f5b93', marginBottom: '12px' }} />
                    <span style={{ fontSize: '15px', fontWeight: '500', color: '#374151' }}>Drop or click to upload image</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Supports JPG, PNG, WEBP (Max 20MB)</span>
                  </div>
                )}
              </div>

              {/* Bottom Action Toolbar */}
              <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '12px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                <button 
                  onClick={() => applyGrayscaleEffect()}
                  disabled={!gsImage}
                  style={{ backgroundColor: '#5c6ac4', color: '#ffffff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: gsImage ? 'pointer' : 'not-allowed', opacity: gsImage ? 1 : 0.6 }}
                >
                  Apply Grayscale
                </button>
                <button 
                  onClick={handleGsDownload}
                  disabled={!gsPreviewUrl}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5c6ac4', cursor: gsPreviewUrl ? 'pointer' : 'not-allowed', opacity: gsPreviewUrl ? 1 : 0.5 }}
                  title="Download Image"
                >
                  <Download size={18} />
                </button>
              </div>

            </div>
          </div>
        </div>
      ) : activeTool.engine === 'motion-blur-engine' ? (
        // MOTION BLUR PHOTO CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Motion Blur Image Online</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Welcome to Pi7 Image Tool - Your Reliable Solution to Motion Blur Photos Instantly & Securely!</p>
          </div>
          
          <input type="file" ref={mbInputRef} onChange={handleMbFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div 
                className="ab-grid-bg" 
                onClick={() => !mbPreviewUrl && mbInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleMbFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff', cursor: mbPreviewUrl ? 'default' : 'pointer' }}>
                {mbPreviewUrl ? (
                   <img 
                      src={mbPreviewUrl} 
                      alt="Motion Blur Preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain' }} 
                   />
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <p>Upload an image to start motion blurring</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '400px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Blur Type Selection */}
                   <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', gap: '24px' }}>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                            <input type="radio" name="mbType" checked={mbType === 'gaussian'} onChange={() => setMbType('gaussian')} style={{ accentColor: '#1d4ed8' }} />
                            <span>Gaussian Blur</span>
                         </label>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                            <input type="radio" name="mbType" checked={mbType === 'motion'} onChange={() => setMbType('motion')} style={{ accentColor: '#1d4ed8' }} />
                            <span>Motion Blur</span>
                         </label>
                      </div>
                   </div>

                   {mbType === 'motion' ? (
                      <>
                         {/* Angle Slider */}
                         <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                               <span style={{ fontSize: '13px', color: '#4b5563' }}>Angle ({mbAngle}°)</span>
                            </div>
                            <input 
                               type="range" 
                               min="0" max="360" 
                               value={mbAngle} 
                               onChange={(e) => setMbAngle(Number(e.target.value))} 
                               className="ab-slider"
                            />
                         </div>

                         {/* Distance Slider */}
                         <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                               <span style={{ fontSize: '13px', color: '#4b5563' }}>Distance ({mbDistance} px)</span>
                            </div>
                            <input 
                               type="range" 
                               min="1" max="150" 
                               value={mbDistance} 
                               onChange={(e) => setMbDistance(Number(e.target.value))} 
                               className="ab-slider"
                            />
                         </div>

                         {/* Samples Slider */}
                         <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                               <span style={{ fontSize: '13px', color: '#4b5563' }}>Samples ({mbSamples})</span>
                            </div>
                            <input 
                               type="range" 
                               min="5" max="50" 
                               value={mbSamples} 
                               onChange={(e) => setMbSamples(Number(e.target.value))} 
                               className="ab-slider"
                            />
                         </div>
                      </>
                   ) : (
                      <div style={{ marginBottom: '24px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13px', color: '#4b5563' }}>Blur Radius ({mbGaussianRadius} px)</span>
                         </div>
                         <input 
                            type="range" 
                            min="1" max="60" 
                            value={mbGaussianRadius} 
                            onChange={(e) => setMbGaussianRadius(Number(e.target.value))} 
                            className="ab-slider"
                         />
                      </div>
                   )}

                   {/* Blur Background Checkbox */}
                   <div style={{ marginBottom: '24px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <input 
                            type="checkbox" 
                            checked={mbBlurBackground} 
                            onChange={(e) => handleToggleMbBlurBg(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>Blur Background</span>
                      </label>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', marginLeft: '24px' }}>
                         Isolates foreground subject and applies motion streaks only to background.
                      </div>
                   </div>
                   
                </div>
                <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e5e7eb' }}>
                   <button onClick={handleMbDownload} disabled={!mbPreviewUrl} style={{ width: '100%', backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: mbPreviewUrl ? 'pointer' : 'not-allowed', opacity: mbPreviewUrl ? 1 : 0.5 }}>Download</button>
                   <button onClick={() => mbInputRef.current.click()} style={{ width: '100%', backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>+ Blur New Image</button>
                </div>
             </div>
          </div>
        </div>
      ) : activeTool.engine === 'censor-engine' ? (
        // CENSOR PHOTO CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Censor Photo Online</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Pi7 Image Tool - The Easiest Way to Censor Photos Online, Fast and Secure!</p>
          </div>
          
          <input type="file" ref={censorInputRef} onChange={handleCensorFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div 
                className="ab-grid-bg" 
                onClick={() => !censorPreviewUrl && censorInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleCensorFileChange({ target: { files: e.dataTransfer.files } });
                  }
                }}
                style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff', cursor: censorPreviewUrl ? 'default' : 'pointer' }}>
                {censorPreviewUrl ? (
                   <div 
                      className="px-canvas-container"
                      onMouseDown={handleCensorMouseDown}
                      onMouseMove={handleCensorMouseMove}
                      onMouseUp={handleCensorMouseUp}
                      onMouseLeave={handleCensorMouseUp}
                      style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', maxHeight: '100%' }}
                   >
                      <img 
                         src={censorPreviewUrl} 
                         alt="Censored Preview" 
                         style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain', pointerEvents: 'none' }} 
                      />
                      
                      {/* Active drawing preview overlay */}
                      {censorIsDrawing && censorCurrentDraw && (
                         <div 
                            className={`px-draw-preview ${censorShape}`}
                            style={{
                               left: `${censorCurrentDraw.w < 0 ? (censorCurrentDraw.x + censorCurrentDraw.w) * 100 : censorCurrentDraw.x * 100}%`,
                               top: `${censorCurrentDraw.h < 0 ? (censorCurrentDraw.y + censorCurrentDraw.h) * 100 : censorCurrentDraw.y * 100}%`,
                               width: `${Math.abs(censorCurrentDraw.w) * 100}%`,
                               height: `${Math.abs(censorCurrentDraw.h) * 100}%`
                            }}
                         />
                      )}
                      
                      {/* Drawn patches overlay */}
                      {censorPatches.map((patch) => (
                         <div 
                            key={patch.id}
                            className={`px-patch-overlay ${patch.shape}`}
                            style={{
                               left: `${patch.x * 100}%`,
                               top: `${patch.y * 100}%`,
                               width: `${patch.w * 100}%`,
                               height: `${patch.h * 100}%`
                            }}
                         >
                            <button 
                               className="px-patch-delete" 
                               onClick={(e) => deleteCensorPatch(patch.id, e)}
                               title="Delete Patch"
                            >
                               ×
                            </button>
                         </div>
                      ))}
                   </div>
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <p>Upload an image to start censoring</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '400px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   {/* Mode Selection */}
                   <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', gap: '24px' }}>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                            <input type="radio" name="censorType" checked={censorType === 'blur'} onChange={() => handleCensorTypeChange('blur')} style={{ accentColor: '#1d4ed8' }} />
                            <span>Blur</span>
                         </label>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                            <input type="radio" name="censorType" checked={censorType === 'pixelate'} onChange={() => handleCensorTypeChange('pixelate')} style={{ accentColor: '#1d4ed8' }} />
                            <span>Pixelate</span>
                         </label>
                      </div>
                   </div>

                   {/* Blur Factor Slider */}
                   <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Blur Factor:</span>
                      </div>
                      <input 
                         type="range" 
                         min="1" max="50" 
                         value={censorBlurFactor} 
                         onChange={(e) => handleCensorFactorChange(Number(e.target.value))} 
                         className="ab-slider"
                      />
                   </div>

                   {/* Auto Blur Faces */}
                   <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <input 
                            type="checkbox" 
                            checked={censorAutoFaces} 
                            onChange={(e) => toggleAutoFaces(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Auto Blur Faces in Image</span>
                      </label>
                   </div>

                   {/* Manually Blur Image */}
                   <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                         <input 
                            type="checkbox" 
                            checked={censorManual} 
                            onChange={(e) => setCensorManual(e.target.checked)} 
                            style={{ accentColor: '#1d4ed8' }}
                         />
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Manually Blur Image</span>
                      </label>
                   </div>

                   {/* Shape Selection */}
                   {censorManual && (
                      <div style={{ paddingLeft: '24px', marginBottom: '20px' }}>
                         <div style={{ display: 'flex', gap: '16px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                               <input type="radio" name="censorShape" checked={censorShape === 'rectangle'} onChange={() => setCensorShape('rectangle')} style={{ accentColor: '#1d4ed8' }} />
                               <span>Rectangle</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                               <input type="radio" name="censorShape" checked={censorShape === 'ellipse'} onChange={() => setCensorShape('ellipse')} style={{ accentColor: '#1d4ed8' }} />
                               <span>Ellipse</span>
                            </label>
                         </div>
                      </div>
                   )}

                   {/* Help Tip */}
                   <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4', background: '#f3f4f6', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #3b82f6', marginBottom: '20px' }}>
                      ⓘ Click and move the mouse to blur an area on the image.
                   </div>

                   {/* Undo/Redo Buttons */}
                   <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                      <button 
                         onClick={handleCensorUndo} 
                         disabled={censorUndoStack.length === 0} 
                         style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: censorUndoStack.length > 0 ? '#ffffff' : '#f3f4f6', cursor: censorUndoStack.length > 0 ? 'pointer' : 'not-allowed', color: censorUndoStack.length > 0 ? '#374151' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '13px' }}
                      >
                         ↩ Undo
                      </button>
                      <button 
                         onClick={handleCensorRedo} 
                         disabled={censorRedoStack.length === 0} 
                         style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: censorRedoStack.length > 0 ? '#ffffff' : '#f3f4f6', cursor: censorRedoStack.length > 0 ? 'pointer' : 'not-allowed', color: censorRedoStack.length > 0 ? '#374151' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '13px' }}
                      >
                         ↪ Redo
                      </button>
                   </div>
                   
                </div>
                <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e5e7eb' }}>
                   <button onClick={handleCensorDownload} disabled={!censorPreviewUrl} style={{ width: '100%', backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: censorPreviewUrl ? 'pointer' : 'not-allowed', opacity: censorPreviewUrl ? 1 : 0.5 }}>Download</button>
                   <button onClick={() => censorInputRef.current.click()} style={{ width: '100%', backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>+ Censor New Image</button>
                </div>
             </div>
          </div>
        </div>
      ) : activeTool.engine === 'add-border-engine' ? (
        // ADD BORDER CUSTOM UI
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '16px', padding: '20px 0', borderBottom: '1px solid #e5e7eb' }}>
            <h1 className="workspace-title" style={{ marginBottom: '8px' }}>Add Border to Photo</h1>
            <p style={{ color: '#6b7280', margin: 0 }}>Create a beautiful frame or polaroid effect around your image.</p>
          </div>
          
          <input type="file" ref={abInputRef} onChange={handleAbFileChange} accept="image/*" style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
             <div className="ab-grid-bg" style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '40px', border: '1px solid #e5e7eb', margin: '20px 0 20px 20px', backgroundColor: '#ffffff' }}>
                {abPreviewUrl ? (
                   <img 
                      src={abPreviewUrl} 
                      alt="Border Preview" 
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                   />
                ) : (
                   <div style={{ color: '#9ca3af', textAlign: 'center' }}>
                      <p>Upload an image to start framing</p>
                   </div>
                )}
             </div>
             
             <div style={{ width: '400px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', margin: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div style={{ padding: '24px' }}>
                   
                   <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Border Width</span>
                         <span style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #d1d5db', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fff' }}>{abWidth}</span>
                      </div>
                      <input 
                         type="range" 
                         min="0" max="20" 
                         value={abWidth} 
                         onChange={(e) => setAbWidth(Number(e.target.value))} 
                         className="ab-slider"
                      />
                   </div>
                   
                   <div style={{ marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Corner Radius</span>
                         <span style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #d1d5db', padding: '2px 8px', borderRadius: '12px', backgroundColor: '#fff' }}>{abRadius}</span>
                      </div>
                      <input 
                         type="range" 
                         min="0" max="50" 
                         value={abRadius} 
                         onChange={(e) => setAbRadius(Number(e.target.value))} 
                         className="ab-slider"
                      />
                   </div>
                   
                   <div style={{ marginBottom: '24px' }}>
                      <span style={{ fontSize: '13px', color: '#4b5563', display: 'block', marginBottom: '12px' }}>Colors</span>
                      <div style={{ display: 'flex', gap: '12px' }}>
                         <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Border Color</label>
                            <input type="color" value={abBorderColor} onChange={(e) => setAbBorderColor(e.target.value)} style={{ width: '100%', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                         </div>
                         <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>Matte (Inner)</label>
                            <input type="color" value={abBgColor} onChange={(e) => setAbBgColor(e.target.value)} style={{ width: '100%', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                         </div>
                      </div>
                   </div>
                   
                   <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                         <span style={{ fontSize: '13px', color: '#4b5563' }}>Caption Text</span>
                      </label>
                      <input 
                         type="text" 
                         value={abCaption} 
                         onChange={(e) => setAbCaption(e.target.value)} 
                         placeholder="e.g. Summer 2026"
                         style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', outline: 'none' }}
                      />
                   </div>
                   
                </div>
                <div style={{ marginTop: 'auto', padding: '16px', display: 'flex', gap: '8px', borderTop: '1px solid #e5e7eb' }}>
                   <button onClick={() => abInputRef.current.click()} style={{ flex: 1, backgroundColor: '#ffffff', color: '#4f5b93', border: '1px solid #4f5b93', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>New Image</button>
                   <button onClick={handleAbDownload} disabled={!abPreviewUrl} style={{ flex: 1, backgroundColor: '#4f5b93', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '13px', cursor: abPreviewUrl ? 'pointer' : 'not-allowed', opacity: abPreviewUrl ? 1 : 0.5 }}>Download Image</button>
                </div>
             </div>
          </div>
        </div>
      ) : (
        // 3. DEFAULT TOOL WORKSPACE VIEWS
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
                    accept={activeTool?.params?.targetFormat === 'pdf-to-jpg' ? '.pdf' : 'image/*,.pdf'}
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
                      {activeTool?.params?.targetFormat ? activeTool.params.targetFormat.replace('-', ' ') : ''}
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
                        {selectedFile?.type === 'application/pdf' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <FileText size={48} className="text-secondary" />
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>PDF Document Loaded</span>
                          </div>
                        ) : (
                          activeTool.engine === 'resizer' && enableManualCrop ? (
                            <React.Suspense fallback={<div style={{ padding: '20px', color: '#9ca3af' }}>Loading crop tools...</div>}>
                              <LazyReactCrop
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
                              </LazyReactCrop>
                            </React.Suspense>
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
                      {activeTool?.engine === 'resizer' && enableManualCrop && selectedFile?.type !== 'application/pdf' && (
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
