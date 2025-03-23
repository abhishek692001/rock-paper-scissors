// Sound Effects for Rock Paper Scissors game
// Uses Web Audio API to generate sounds in-memory without external files

const SoundEffects = {
  audioContext: null,
  sounds: {},
  enabled: true,
  initialized: false,
  
  // Initialize the audio context
  init() {
    try {
      // Already initialized
      if (this.initialized) {
        console.log('Sound effects already initialized');
        return true;
      }
      
      // Create audio context - use AudioContext or webkitAudioContext for wider browser support
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported in this browser');
        return false;
      }
      
      this.audioContext = new AudioContextClass();
      
      // Create all sound effects
      this.createClickSound();
      this.createWinSound();
      this.createLoseSound();
      this.createDrawSound();
      
      console.log('Sound effects initialized successfully with AudioContext state:', this.audioContext.state);
      
      // Add global click handler to ensure sounds can be played on all browsers
      document.addEventListener('click', this.unlockAudio.bind(this), { once: true });
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  },
  
  // Unlock audio on user interaction (required for many browsers)
  unlockAudio() {
    if (!this.audioContext) return;
    
    // Resume the audio context if it's suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        console.log('AudioContext resumed successfully');
        // Play a silent sound to fully unlock audio on iOS/Safari
        this.playSilentSound();
      }).catch(error => {
        console.warn('Failed to resume AudioContext:', error);
      });
    } else {
      // Play a silent sound even if not suspended (helps on some mobile browsers)
      this.playSilentSound();
    }
  },
  
  // Play a silent sound to unlock audio on iOS/Safari
  playSilentSound() {
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      gainNode.gain.value = 0.001; // Nearly silent
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(0);
      oscillator.stop(this.audioContext.currentTime + 0.1);
      
      console.log('Silent sound played to unlock audio');
    } catch (error) {
      console.warn('Error playing silent sound:', error);
    }
  },
  
  // Helper method to play a sound
  play(soundName) {
    if (!this.enabled || !this.initialized) {
      console.warn(`Sound ${soundName} not played - sound effects disabled or not initialized`);
      return null;
    }
    
    // Try to resume the audio context if needed
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        console.log('AudioContext resumed on play attempt');
        this._playSound(soundName);
      }).catch(error => {
        console.warn('Failed to resume AudioContext on play:', error);
      });
    } else {
      return this._playSound(soundName);
    }
  },
  
  // Internal method to actually play the sound
  _playSound(soundName) {
    if (this.sounds[soundName]) {
      try {
        console.log(`Playing sound: ${soundName}`);
        const sound = this.sounds[soundName]();
        return sound; // Return the sound object for stopping if needed
      } catch (error) {
        console.error(`Error playing sound ${soundName}:`, error);
        return null;
      }
    } else {
      console.warn(`Sound "${soundName}" not found`);
      return null;
    }
  },
  
  // Create a short click/tap sound
  createClickSound() {
    this.sounds.click = () => {
      // Get current time from audio context
      const time = this.audioContext.currentTime;
      
      // Create oscillator and gain node
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Configure sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, time); // Higher frequency
      oscillator.frequency.exponentialRampToValueAtTime(600, time + 0.1); // Quick drop
      
      // Configure envelope
      gainNode.gain.setValueAtTime(0.2, time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1); // Quick fade out
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Play sound
      oscillator.start(time);
      oscillator.stop(time + 0.1);
      
      return {
        stop: () => {
          try {
            oscillator.stop();
            oscillator.disconnect();
            gainNode.disconnect();
          } catch (e) {
            // Ignore errors when stopping already stopped oscillators
          }
        }
      };
    };
  },
  
  // Create a win sound (happy ascending notes)
  createWinSound() {
    this.sounds.win = () => {
      const time = this.audioContext.currentTime;
      const duration = 0.6;
      
      // Create master gain node for overall volume
      const masterGain = this.audioContext.createGain();
      masterGain.gain.setValueAtTime(0.3, time);
      masterGain.connect(this.audioContext.destination);
      
      // Create notes for a happy sound
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      // Create oscillators for each note
      const oscillators = notes.map((freq, i) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        // Configure oscillator
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time + i * 0.08);
        
        // Configure envelope
        gain.gain.setValueAtTime(0, time + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, time + i * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + i * 0.08 + 0.15);
        
        // Connect nodes
        osc.connect(gain);
        gain.connect(masterGain);
        
        // Play sound
        osc.start(time + i * 0.08);
        osc.stop(time + i * 0.08 + 0.2);
        
        return { oscillator: osc, gain: gain };
      });
      
      return {
        stop: () => {
          try {
            oscillators.forEach(({ oscillator, gain }) => {
              oscillator.stop();
              oscillator.disconnect();
              gain.disconnect();
            });
            masterGain.disconnect();
          } catch (e) {
            // Ignore errors when stopping already stopped oscillators
          }
        }
      };
    };
  },
  
  // Create a lose sound (sad descending notes)
  createLoseSound() {
    this.sounds.lose = () => {
      const time = this.audioContext.currentTime;
      
      // Create master gain node for overall volume
      const masterGain = this.audioContext.createGain();
      masterGain.gain.setValueAtTime(0.3, time);
      masterGain.connect(this.audioContext.destination);
      
      // Create oscillator for a sad sound (falling tone)
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      // Configure sound
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, time); // A4
      oscillator.frequency.linearRampToValueAtTime(220, time + 0.5); // A3 (one octave down)
      
      // Configure envelope
      gain.gain.setValueAtTime(0.01, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
      
      // Connect nodes
      oscillator.connect(gain);
      gain.connect(masterGain);
      
      // Play sound
      oscillator.start(time);
      oscillator.stop(time + 0.5);
      
      return {
        stop: () => {
          try {
            oscillator.stop();
            oscillator.disconnect();
            gain.disconnect();
            masterGain.disconnect();
          } catch (e) {
            // Ignore errors when stopping already stopped oscillators
          }
        }
      };
    };
  },
  
  // Create a draw sound (neutral two-tone sound)
  createDrawSound() {
    this.sounds.draw = () => {
      const time = this.audioContext.currentTime;
      
      // Create master gain node for overall volume
      const masterGain = this.audioContext.createGain();
      masterGain.gain.setValueAtTime(0.3, time);
      masterGain.connect(this.audioContext.destination);
      
      // Create oscillators for two-tone sound
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();
      const gain2 = this.audioContext.createGain();
      
      // Configure sounds
      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(330, time); // E4
      
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(392, time); // G4
      
      // Configure envelopes
      gain1.gain.setValueAtTime(0.01, time);
      gain1.gain.linearRampToValueAtTime(0.15, time + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
      
      gain2.gain.setValueAtTime(0.01, time + 0.15);
      gain2.gain.linearRampToValueAtTime(0.15, time + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
      
      // Connect nodes
      oscillator1.connect(gain1);
      oscillator2.connect(gain2);
      gain1.connect(masterGain);
      gain2.connect(masterGain);
      
      // Play sounds
      oscillator1.start(time);
      oscillator1.stop(time + 0.3);
      oscillator2.start(time + 0.15);
      oscillator2.stop(time + 0.4);
      
      return {
        stop: () => {
          try {
            oscillator1.stop();
            oscillator2.stop();
            oscillator1.disconnect();
            oscillator2.disconnect();
            gain1.disconnect();
            gain2.disconnect();
            masterGain.disconnect();
          } catch (e) {
            // Ignore errors when stopping already stopped oscillators
          }
        }
      };
    };
  }
}; 