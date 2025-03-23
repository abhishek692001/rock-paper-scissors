# Rock Paper Scissors 3D Chrome Extension

A fun and interactive Chrome extension that lets you play the classic game of Rock Paper Scissors with 3D hand animations.

## Features

### Two Game Modes
- **Advanced 3D Mode**: Detailed hand models with complex finger animations
- **Simple 3D Mode**: Clean CSS-based 3D visuals that work on any system
- Easy switch between modes with a single click

### 3D Hand Animations
- Realistic 3D hand models that show rock, paper, and scissors gestures
- Smooth animations during gameplay
- CSS 3D transforms for reliable rendering across all browsers

### Smart Fallback System
- Automatically detects if 3D rendering is available
- Gracefully falls back to a simplified version if:
  - WebGL is not supported by your browser
  - Three.js fails to load
  - Any other 3D initialization issues occur

### Game Mechanics
- Play against a computer opponent with random selection
- Score tracking that persists during your session
- Intuitive interface with clear feedback on wins, losses, and draws
- Reset button to start a new game

### Lightweight and Fast
- Optimized code for smooth performance
- No external dependencies
- Clean, responsive design that works on any Chrome installation

## How to Play
1. Click the extension icon in your Chrome toolbar
2. Choose your preferred mode (Advanced 3D or Simple 3D)
3. Select your move by clicking Rock, Paper, or Scissors
4. Watch as the 3D hands change to show your choice and the computer's choice
5. See who wins based on the classic rules:
   - Rock crushes Scissors
   - Scissors cuts Paper
   - Paper covers Rock
6. Keep track of your score at the top of the game
7. Click "Reset Game" when you want to start over

## Compatible Browsers
- Google Chrome (version 80+)
- Chromium-based browsers (Edge, Brave, Opera, etc.)

## Technical Details
- Built with HTML5, CSS3, and JavaScript
- Uses CSS 3D transforms for reliable 3D effects
- Implements Chrome Extensions Manifest V3
- Includes a service worker for background processes

## Installation
See [INSTALL.md](INSTALL.md) for detailed installation instructions.

## License
This project is open source and available under the MIT License.

## Acknowledgments
- Three.js library for 3D graphics
- The Chrome Extensions API
