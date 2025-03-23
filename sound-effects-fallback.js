// Sound Effects Fallback
// This script creates a dummy SoundEffects object if the real one isn't available
// It prevents "SoundEffects not found" errors while providing no-op implementations

console.log("Sound Effects Fallback script loaded");

(function() {
  // Check if SoundEffects already exists
  if (window.SoundEffects) {
    console.log("SoundEffects already exists, no need for fallback");
    return;
  }
  
  // Create a dummy SoundEffects object
  window.SoundEffects = {
    audioContext: null,
    sounds: {},
    enabled: false,
    initialized: false,
    
    init() {
      console.log("Fallback SoundEffects.init() called");
      this.initialized = true;
      return true;
    },
    
    play(soundName) {
      console.log(`Fallback SoundEffects.play('${soundName}') called`);
      return {
        stop: function() { 
          console.log(`Fallback stop for '${soundName}' called`); 
        }
      };
    },
    
    unlockAudio() {
      console.log("Fallback SoundEffects.unlockAudio() called");
    },
    
    playSilentSound() {
      console.log("Fallback SoundEffects.playSilentSound() called");
    }
  };
  
  console.log("Created fallback SoundEffects object");
})(); 