const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf8');

const targetStart = `  const predefinedPalettes = {`;
const targetEnd = `  };`;

if (content.includes(targetStart) && content.includes(targetEnd)) {
    const parts = content.split(targetStart);
    const endParts = parts[1].split(targetEnd);
    
    const newPalettes = `  const predefinedPalettes = {
     retro1: ['#2B0F54', '#AB1F65', '#FF4F69', '#FFF7F8', '#FF8142', '#FFDA45', '#3368DC', '#49E7EC'],
     gameboy: ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'],
     cga: ['#000000', '#55FFFF', '#FF55FF', '#FFFFFF'],
     sepia: ['#3e2a14', '#704f2a', '#a67b4b', '#d9b48f', '#ffe8cc'],
     pico8: ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA']`;

    fs.writeFileSync('src/App.jsx', parts[0] + newPalettes + targetEnd + endParts[1]);
    
    // Update default state to 'pico8'
    let finalContent = fs.readFileSync('src/App.jsx', 'utf8');
    finalContent = finalContent.replace(
       `const [pxActivePalette, setPxActivePalette] = useState('retro1');`,
       `const [pxActivePalette, setPxActivePalette] = useState('pico8');`
    );
    // Update the HTML select dropdown
    finalContent = finalContent.replace(
       `<option value="retro1">Retro Pop (8 Colors)</option>`,
       `<option value="pico8">Pico-8 Classic (16 Colors)</option>\n                            <option value="retro1">Retro Pop (8 Colors)</option>`
    );
    
    fs.writeFileSync('src/App.jsx', finalContent);
    console.log("Successfully updated Pixelate Palettes.");
} else {
    console.log("Target strings not found in App.jsx.");
}
