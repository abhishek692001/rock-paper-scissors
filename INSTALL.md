# Installation Guide for Rock Paper Scissors 3D Chrome Extension

## Prerequisites
- Google Chrome browser (version 80 or later recommended)
- Basic knowledge of how to install Chrome extensions manually

## Installation Steps

### 1. Download the Extension Files
First, make sure you have all the necessary files for the extension:
- manifest.json
- popup.html
- popup.js
- styles.css
- background.js
- three.min.js
- images folder with icon files

### 2. Load the Extension in Chrome
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click on "Load unpacked" button
5. Browse to the folder containing the extension files
6. Select the folder and click "Select Folder"

The extension should now appear in your list of installed extensions!

### 3. Access the Extension
- Click on the extensions icon in the Chrome toolbar (puzzle piece icon)
- Find "Rock Paper Scissors 3D" in the list and click on it
- Alternatively, pin the extension to your toolbar for easy access

## Usage
1. Click on the extension icon to open the game popup
2. Choose your move by clicking "Rock", "Paper", or "Scissors"
3. Watch the 3D hand animation and see who wins!
4. Your score is tracked at the top of the game
5. Click "Reset Game" to start over

## Troubleshooting

### If the game doesn't show 3D hands:
The extension includes a fallback mode that will automatically activate if:
- Your browser doesn't support WebGL
- Three.js library fails to load
- Any other 3D initialization error occurs

The fallback mode will still let you play the game with a simplified visual representation.

### If buttons don't work:
1. Make sure you've loaded the extension correctly
2. Check your Chrome console for any error messages (Press F12, then select Console tab)
3. Try reloading the extension by going to `chrome://extensions/`, finding the extension, and clicking the refresh icon
4. If problems persist, try restarting Chrome

### If you see "THREE.js not loaded" error:
1. Make sure the `three.min.js` file is included in your extension folder
2. Try reinstalling the extension
3. Check if your Chrome version is up-to-date

## Uninstallation
1. Go to `chrome://extensions/`
2. Find "Rock Paper Scissors 3D"
3. Click "Remove" or the trash icon
4. Confirm removal when prompted

Enjoy playing Rock Paper Scissors in 3D! 