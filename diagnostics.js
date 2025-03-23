// Diagnostics script to help debug SoundEffects issues
console.log("Diagnostics script loaded");

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Content Loaded in diagnostics");
  
  // Check for SoundEffects
  console.log("Window.SoundEffects exists:", !!window.SoundEffects);
  
  // Check all scripts on the page
  const scripts = document.querySelectorAll('script');
  console.log(`Found ${scripts.length} scripts:`);
  scripts.forEach((script, index) => {
    if (script.src) {
      console.log(`${index + 1}. ${script.src}`);
    } else {
      console.log(`${index + 1}. Inline script`);
    }
  });
  
  // Try to load SoundEffects manually
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log(`Successfully loaded: ${src}`);
        resolve();
      };
      script.onerror = (err) => {
        console.error(`Failed to load: ${src}`, err);
        reject(err);
      };
      document.head.appendChild(script);
    });
  }
  
  // Check if SoundEffects is already loaded
  if (!window.SoundEffects) {
    console.log("SoundEffects not found, attempting to load manually...");
    loadScript('sound-effects.js')
      .then(() => {
        console.log("SoundEffects manually loaded. Available:", !!window.SoundEffects);
        if (window.SoundEffects) {
          console.log("SoundEffects methods:", Object.keys(window.SoundEffects));
        }
      })
      .catch(err => {
        console.error("Failed to manually load SoundEffects:", err);
      });
  } else {
    console.log("SoundEffects already available:", Object.keys(window.SoundEffects));
  }
}); 