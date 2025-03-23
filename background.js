// This is a simple background script for the Rock Paper Scissors extension
// It can be used for background processing or handling events

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('3D Rock Paper Scissors extension installed');
});

// Listen for when the extension's action is clicked
chrome.action.onClicked.addListener((tab) => {
  // This won't be triggered since we specified a popup in manifest.json,
  // but it's included here for completeness in case we change how the extension works
  console.log('Extension icon clicked in tab', tab.id);
});

// You could add more background functionality here if needed in future versions
// For example: tracking statistics, setting up context menus, etc. 