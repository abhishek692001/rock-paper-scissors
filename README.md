# Rock Paper Scissors Chrome Extension

A fun and interactive Rock Paper Scissors game as a Chrome extension, featuring multiple game modes with different visual styles.

## Features

- **Three Game Modes**: Choose between Advanced 3D, Simple 3D, and Emoji Style
- **Interactive 3D Hands**: Realistic hand models in the Advanced 3D mode
- **Cute Emoji Style**: Colorful and playful emoji-like hand gestures
- **Sound Effects**: Audio feedback for a more immersive experience
- **Score Tracking**: Keep track of wins and losses
- **Compact Design**: Fits perfectly in a popup window without scrolling
- **Responsive Design**: Works on different screen sizes

## Game Modes

### Advanced 3D
- Uses Three.js for realistic 3D hand models
- Full WebGL implementation for a premium experience
- Detailed hand meshes and lighting

### Simple 3D
- CSS-based 3D effects for better compatibility
- Works even when WebGL is not available
- Stylish gesture representations

### Emoji Style
- Cute and colorful emoji-like interface
- Playful animations and effects
- Fun sound effects
- Kid-friendly design

## How to Play

1. Select your preferred game mode using the dropdown menu
2. Click "Let's Play" (in Emoji mode) or just select a gesture to begin
3. Choose Rock, Paper, or Scissors by clicking the corresponding button
4. Watch the animation and see who wins
5. Track your score at the top of the screen
6. Click "Reset Game" to start over

## Installation

1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The Rock Paper Scissors extension is now installed!

## Development

This extension was built using:
- HTML5, CSS3, and JavaScript
- Three.js for 3D rendering in Advanced mode
- CSS animations for visual effects
- Chrome Extension API

## Troubleshooting

If the Advanced 3D mode doesn't work properly:
1. Make sure WebGL is enabled in your browser
2. Try switching to Simple 3D or Emoji Style mode
3. Check the browser console for any error messages

## Credits

- Developed by: Your Name
- Icons and design: Original creation
- Sound effects: Creative Commons licensed

Enjoy playing Rock Paper Scissors with style!

## Compatible Browsers
- Google Chrome (version 80+)
- Chromium-based browsers (Edge, Brave, Opera, etc.)

## Technical Details
- Built with HTML5, CSS3, and JavaScript
- Uses CSS 3D transforms for reliable 3D effects
- Implements Chrome Extensions Manifest V3
- Includes a service worker for background processes
- Optimized dimensions (480px × 560px) for perfect fit in extension popup
- Carefully designed to avoid scrolling for better user experience

## License
This project is open source and available under the MIT License.

## Acknowledgments
- Three.js library for 3D graphics
- The Chrome Extensions API
