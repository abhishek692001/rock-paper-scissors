// Initialization script for the Rock Paper Scissors extension
// This script ensures proper initialization sequence

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing Rock Paper Scissors extension...');
  
  try {
    // Check which mode we're in
    const currentUrl = window.location.href;
    
    if (currentUrl.includes('popup-simple.html')) {
      console.log('Simple 3D mode detected');
    } else if (currentUrl.includes('popup-emoji.html')) {
      console.log('Emoji Style mode detected');
    } else {
      console.log('Advanced 3D mode detected');
    }
    
    // Log which scripts are loaded
    const scripts = document.querySelectorAll('script');
    console.log(`${scripts.length} scripts loaded:`);
    scripts.forEach(script => {
      if (script.src) {
        console.log(`- ${script.src.split('/').pop()}`);
      } else {
        console.log('- inline script');
      }
    });
    
    // Log mode switcher elements
    const gameModeSelect = document.getElementById('game-mode');
    const applyModeBtn = document.getElementById('apply-mode');
    
    if (gameModeSelect) {
      console.log('Game mode select found');
    } else {
      console.error('Game mode select not found');
    }
    
    if (applyModeBtn) {
      console.log('Apply mode button found');
    } else {
      console.error('Apply mode button not found');
    }
    
  } catch (error) {
    console.error('Error during initialization:', error);
  }
}); 