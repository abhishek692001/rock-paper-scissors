// This script creates simple icon files for the extension
// Run with Node.js: node create_icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

// Create icons of different sizes
const sizes = [16, 48, 128];

// Function to create a simple rock-paper-scissors icon
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#2c3e50';
  ctx.fillRect(0, 0, size, size);
  
  // Draw a simple hand outline
  ctx.strokeStyle = '#f1c40f';
  ctx.lineWidth = size / 10;
  
  // Draw palm
  const palmWidth = size * 0.6;
  const palmHeight = size * 0.5;
  const x = (size - palmWidth) / 2;
  const y = size * 0.4;
  
  ctx.beginPath();
  ctx.roundRect(x, y, palmWidth, palmHeight, [size * 0.1]);
  ctx.stroke();
  
  // Draw fingers
  const fingerWidth = size * 0.12;
  const fingerHeight = size * 0.25;
  const spacing = (palmWidth - fingerWidth * 3) / 4;
  
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.roundRect(
      x + spacing + i * (fingerWidth + spacing),
      y - fingerHeight,
      fingerWidth,
      fingerHeight,
      [size * 0.05]
    );
    ctx.stroke();
  }
  
  // Draw thumb
  ctx.beginPath();
  ctx.roundRect(
    x - fingerWidth * 0.8,
    y + palmHeight * 0.2,
    fingerHeight,
    fingerWidth,
    [size * 0.05]
  );
  ctx.stroke();
  
  return canvas.toBuffer('image/png');
}

// Create icons for each size
sizes.forEach(size => {
  const iconBuffer = createIcon(size);
  fs.writeFileSync(`icon${size}.png`, iconBuffer);
  console.log(`Created icon${size}.png`);
});

console.log('All icons created successfully!'); 