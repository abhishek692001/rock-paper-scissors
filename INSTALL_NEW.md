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
- popup-simple.html
- popup-simple.js
- simple-styles.css
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
2. Choose your preferred game mode:
   - **Advanced 3D Mode**: More detailed hand models with finger animations
   - **Simple 3D Mode**: Clean, CSS-based 3D visuals that work on any system
3. Choose your move by clicking "Rock", "Paper", or "Scissors"
4. Watch the 3D hand animation and see who wins!
5. Your score is tracked at the top of the game
6. Click "Reset Game" to start over

## Game Modes

### Advanced 3D Mode
This is the default mode that features:
- Detailed hand models with realistic finger positions
- Complex hand animations
- More elaborate 3D effects

### Simple 3D Mode
A lightweight alternative that features:
- CSS-based 3D effects
- Simple but effective hand representations
- Works reliably on all systems
- Lower resource usage

You can switch between modes at any time using the mode selector at the top of the game.

## Troubleshooting

### If buttons don't work:
1. Make sure you've loaded the extension correctly
2. Check your Chrome console for any error messages (Press F12, then select Console tab)
3. Try reloading the extension by going to `chrome://extensions/`, finding the extension, and clicking the refresh icon
4. If problems persist, try restarting Chrome

### If the hand models don't display properly:
1. Try switching to the Simple 3D mode
2. Make sure all CSS files are included in your extension folder
3. Try reinstalling the extension
4. Check if your Chrome version is up-to-date

## Uninstallation
1. Go to `chrome://extensions/`
2. Find "Rock Paper Scissors 3D"
3. Click "Remove" or the trash icon
4. Confirm removal when prompted

Enjoy playing Rock Paper Scissors in 3D! 