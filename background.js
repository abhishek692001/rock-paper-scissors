// Background script for the Rock Paper Scissors extension
// Handles game mode selection and persistence

// Default game mode
const DEFAULT_MODE = 'advanced'; // Other modes: 'simple', 'emoji'

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('3D Rock Paper Scissors extension installed');
  
  // Initialize game mode setting
  chrome.storage.sync.get('gameMode', (data) => {
    if (!data.gameMode) {
      chrome.storage.sync.set({ gameMode: DEFAULT_MODE });
      console.log('Game mode initialized to:', DEFAULT_MODE);
    }
  });
});

// Listen for when the extension's action is clicked
chrome.action.onClicked.addListener((tab) => {
  // This won't be triggered since we specified a popup in manifest.json,
  // but it's included here for completeness in case we change how the extension works
  console.log('Extension icon clicked in tab', tab.id);
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setGameMode') {
    chrome.storage.sync.set({ gameMode: request.mode }, () => {
      console.log('Game mode set to:', request.mode);
      sendResponse({ success: true });
    });
    return true; // Indicates we'll respond asynchronously
  }
  
  if (request.action === 'getGameMode') {
    chrome.storage.sync.get('gameMode', (data) => {
      const mode = data.gameMode || DEFAULT_MODE;
      console.log('Current game mode:', mode);
      sendResponse({ mode: mode });
    });
    return true; // Indicates we'll respond asynchronously
  }
});

// Helper functions for game mode management
function switchToGameMode(mode) {
  switch (mode) {
    case 'advanced':
      return 'popup.html';
    case 'simple':
      return 'popup-simple.html';
    case 'emoji':
      return 'popup-emoji.html';
    default:
      return 'popup.html';
  }
}

// You could add more background functionality here if needed in future versions
// For example: tracking statistics, setting up context menus, etc. 