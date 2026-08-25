import React from 'react';
import { 
  Search, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Crop, 
  FileText, 
  Sliders, 
  Palette, 
  Edit3, 
  Wand2, 
  Sparkles, 
  Eraser, 
  RotateCw, 
  FlipHorizontal, 
  Stamp, 
  Pipette, 
  Flame, 
  Type, 
  Frame, 
  ShieldAlert, 
  Wind, 
  Gamepad2, 
  Printer, 
  Gauge, 
  Cpu, 
  GraduationCap, 
  CreditCard, 
  MessageCircle, 
  RefreshCw, 
  Globe, 
  FileImage, 
  FileStack, 
  Image, 
  Scan, 
  Contrast, 
  Zap, 
  SlidersHorizontal, 
  FolderArchive, 
  UserCheck, 
  Scaling, 
  Focus,
  SunMedium
} from 'lucide-react';

export function getToolIcon(tool, size = 18) {
  if (!tool) return <SlidersHorizontal size={size} />;
  const id = tool.id || '';

  // 1. Tool-Specific Icons
  switch (id) {
    // Most Used Tools
    case 'passport-maker': return <UserCheck size={size} />;
    case 'reduce-kb': return <Minimize2 size={size} />;
    case 'resize-pixel': return <Scaling size={size} />;
    case 'gen-sig': return <Edit3 size={size} />;
    case 'increase-kb': return <Maximize2 size={size} />;
    case 'ai-enhancer': return <Sparkles size={size} />;
    case 'remove-blemishes': return <Eraser size={size} />;
    case 'ai-retouch': return <Wand2 size={size} />;
    case 'increase-quality': return <Zap size={size} />;
    case 'resize-sig': return <Edit3 size={size} />;

    // Basic Editing
    case 'blur-bg': return <Focus size={size} />;
    case 'rotate-img': return <RotateCw size={size} />;
    case 'flip-img': return <FlipHorizontal size={size} />;
    case 'watermark': return <Stamp size={size} />;
    case 'round-corners': return <Crop size={size} />;
    case 'img-colorpicker': return <Pipette size={size} />;

    // Blur, Pixelate and Special Effects
    case 'blur-image': return <Contrast size={size} />;
    case 'pixelate-image': return <Gamepad2 size={size} />;
    case 'grayscale': return <Contrast size={size} />;
    case 'black-white': return <SunMedium size={size} />;
    case 'deep-fry': return <Flame size={size} />;
    case 'add-text': return <Type size={size} />;
    case 'add-border': return <Frame size={size} />;
    case 'censor-photo': return <ShieldAlert size={size} />;
    case 'motion-blur': return <Wind size={size} />;
    case 'pixel-art': return <Gamepad2 size={size} />;

    // DPI & Quality
    case 'convert-dpi': return <Printer size={size} />;
    case 'check-dpi': return <Scan size={size} />;
    case 'super-resolution': return <Cpu size={size} />;
    case 'ai-upscale': return <Sparkles size={size} />;

    // Passport & ID Photo Sizes
    case 'resize-a4': return <FileText size={size} />;
    case 'red-bg-passport': return <UserCheck size={size} />;
    case 'white-bg-passport': return <UserCheck size={size} />;
    case 'ssc-resize': return <GraduationCap size={size} />;
    case 'pancard-resize': return <CreditCard size={size} />;

    // Social Media
    case 'whatsapp-dp': return <MessageCircle size={size} />;

    // Format Conversions
    case 'image-to-jpg': return <FileImage size={size} />;
    case 'png-to-jpeg': return <RefreshCw size={size} />;
    case 'jpeg-to-png': return <Image size={size} />;
    case 'webp-to-jpg': return <FileImage size={size} />;
    case 'favicon-gen': return <Globe size={size} />;

    // Image to PDF
    case 'image-to-pdf': return <FileStack size={size} />;
    case 'pdf-to-jpg': return <FileText size={size} />;
    case 'jpg-to-pdf-50kb':
    case 'jpg-to-pdf-100kb':
    case 'jpeg-to-pdf-200kb':
    case 'jpg-to-pdf-300kb':
    case 'jpg-to-pdf-500kb':
      return <FolderArchive size={size} />;

    // Exact Target Sizes
    case 'comp-5kb':
    case 'comp-10kb':
    case 'comp-20kb':
      return <Gauge size={size} />;

    default:
      break;
  }

  // 2. Engine Fallbacks
  if (tool.engine === 'resizer' || tool.engine === 'resize-pixel-engine' || tool.engine === 'resize-a4-engine') return <Scaling size={size} />;
  if (tool.engine === 'compressor') return <Minimize2 size={size} />;
  if (tool.engine === 'sig') return <Edit3 size={size} />;
  if (tool.engine === 'img2pdf-engine') return <FileStack size={size} />;
  if (tool.engine === 'pdf2jpg-engine') return <FileText size={size} />;
  if (tool.engine === 'converter') return <FileImage size={size} />;
  if (tool.engine === 'increase-quality-engine' || tool.engine === 'ai-retouch-engine' || tool.engine === 'super-resolution-engine' || tool.engine === 'ai-upscale-engine') return <Sparkles size={size} />;
  if (tool.engine === 'dpi-converter-engine' || tool.engine === 'dpi-checker-engine') return <Printer size={size} />;
  if (tool.engine === 'censor-engine') return <ShieldAlert size={size} />;
  if (tool.engine === 'motion-blur-engine') return <Wind size={size} />;
  if (tool.engine === 'pixelate-engine' || tool.engine === 'pixel-art-engine') return <Gamepad2 size={size} />;
  if (tool.engine === 'add-border-engine') return <Frame size={size} />;
  if (tool.engine === 'deep-fry-engine') return <Flame size={size} />;
  if (tool.engine === 'whatsapp-dp-engine') return <MessageCircle size={size} />;

  return <SlidersHorizontal size={size} />;
}
