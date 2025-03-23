// Game mode switching functionality
document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const gameModeSelect = document.getElementById('game-mode');
  const applyModeBtn = document.getElementById('apply-mode');
  
  // Check if the elements exist before trying to use them
  if (!gameModeSelect || !applyModeBtn) {
    console.error('Mode switcher elements not found in the DOM');
    return; // Exit early if elements not found
  }
  
  // Check current mode
  chrome.runtime.sendMessage({ action: 'getGameMode' }, response => {
    if (response && response.mode) {
      gameModeSelect.value = response.mode;
    }
  });
  
  // Handle mode switching
  applyModeBtn.addEventListener('click', () => {
    const selectedMode = gameModeSelect.value;
    
    // Don't switch if we're already on the current mode
    const currentUrl = window.location.href;
    const currentMode = getCurrentMode(currentUrl);
    
    if (selectedMode === currentMode) {
      console.log(`Already in ${selectedMode} mode`);
      return;
    }
    
    chrome.runtime.sendMessage({ 
      action: 'setGameMode', 
      mode: selectedMode 
    }, response => {
      if (response && response.success) {
        // Reload extension with the new mode
        if (selectedMode === 'advanced') {
          window.location.href = 'popup.html';
        } else if (selectedMode === 'simple') {
          window.location.href = 'popup-simple.html';
        } else if (selectedMode === 'emoji') {
          window.location.href = 'popup-emoji.html';
        }
      }
    });
  });
});

// Helper function to determine current mode from URL
function getCurrentMode(url) {
  if (url.includes('popup-simple.html')) {
    return 'simple';
  } else if (url.includes('popup-emoji.html')) {
    return 'emoji';
  } else {
    return 'advanced'; // Default to advanced for popup.html
  }
} 