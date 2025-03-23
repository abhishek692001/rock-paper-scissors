// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  const initBtn = document.getElementById('init-btn');
  const clickBtn = document.getElementById('click-btn');
  const winBtn = document.getElementById('win-btn');
  const loseBtn = document.getElementById('lose-btn');
  const drawBtn = document.getElementById('draw-btn');
  const audioStateSpan = document.getElementById('audio-state');
  const logSection = document.getElementById('log-section');
  
  // Log function
  function log(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = message;
    logSection.appendChild(logEntry);
    logSection.scrollTop = logSection.scrollHeight;
  }
  
  // Update audio context state display
  function updateAudioState() {
    if (window.SoundEffects && SoundEffects.audioContext) {
      audioStateSpan.textContent = SoundEffects.audioContext.state;
      audioStateSpan.className = SoundEffects.audioContext.state === 'running' ? 'success' : 'error';
    } else {
      audioStateSpan.textContent = 'Not initialized';
      audioStateSpan.className = 'error';
    }
  }
  
  // Initialize Sound System
  initBtn.addEventListener('click', function() {
    log('Initializing sound system...');
    
    if (window.SoundEffects && SoundEffects.init()) {
      log('Sound system initialized successfully!', 'success');
    } else {
      log('Failed to initialize sound system!', 'error');
    }
    
    updateAudioState();
  });
  
  // Play click sound
  clickBtn.addEventListener('click', function() {
    log('Attempting to play click sound...');
    try {
      if (window.SoundEffects) {
        const sound = SoundEffects.play('click');
        if (sound) {
          log('Click sound played successfully', 'success');
        } else {
          log('No sound object returned', 'error');
        }
      } else {
        log('SoundEffects module not found', 'error');
      }
    } catch (error) {
      log(`Error playing click sound: ${error.message}`, 'error');
    }
    updateAudioState();
  });
  
  // Play win sound
  winBtn.addEventListener('click', function() {
    log('Attempting to play win sound...');
    try {
      if (window.SoundEffects) {
        const sound = SoundEffects.play('win');
        if (sound) {
          log('Win sound played successfully', 'success');
        } else {
          log('No sound object returned', 'error');
        }
      } else {
        log('SoundEffects module not found', 'error');
      }
    } catch (error) {
      log(`Error playing win sound: ${error.message}`, 'error');
    }
    updateAudioState();
  });
  
  // Play lose sound
  loseBtn.addEventListener('click', function() {
    log('Attempting to play lose sound...');
    try {
      if (window.SoundEffects) {
        const sound = SoundEffects.play('lose');
        if (sound) {
          log('Lose sound played successfully', 'success');
        } else {
          log('No sound object returned', 'error');
        }
      } else {
        log('SoundEffects module not found', 'error');
      }
    } catch (error) {
      log(`Error playing lose sound: ${error.message}`, 'error');
    }
    updateAudioState();
  });
  
  // Play draw sound
  drawBtn.addEventListener('click', function() {
    log('Attempting to play draw sound...');
    try {
      if (window.SoundEffects) {
        const sound = SoundEffects.play('draw');
        if (sound) {
          log('Draw sound played successfully', 'success');
        } else {
          log('No sound object returned', 'error');
        }
      } else {
        log('SoundEffects module not found', 'error');
      }
    } catch (error) {
      log(`Error playing draw sound: ${error.message}`, 'error');
    }
    updateAudioState();
  });
  
  // Update audio state every second
  setInterval(updateAudioState, 1000);
  
  // Initial state update
  updateAudioState();
  
  // Initial log message
  log('Sound test page loaded. Click "Initialize Sound System" to start.', 'info');
}); 