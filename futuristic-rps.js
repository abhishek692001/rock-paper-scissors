// Futuristic Rock Paper Scissors Game
document.addEventListener('DOMContentLoaded', () => {
  // Game elements
  const computer = document.querySelector(".computer img");
  const player = document.querySelector(".player img");
  const computerPoints = document.querySelector(".computerPoints");
  const playerPoints = document.querySelector(".playerPoints");
  const drawPoints = document.querySelector(".drawPoints");
  const optionBtns = document.querySelectorAll(".option-btn");
  const resetBtn = document.querySelector(".reset-btn");
  const resultMessage = document.querySelector(".result-message");
  const message = document.querySelector(".message");

  // Game state
  let gameActive = true;
  let lastResult = null;
  let computerChoice = null;
  let playerChoice = null;
  let gameHistory = [];
  
  // Sound effects
  const sounds = {
    click: new Audio(),
    win: new Audio(),
    lose: new Audio(),
    draw: new Audio(),
    shake: new Audio()
  };

  // Initialize synthetic sounds (no external files needed)
  function initSounds() {
    // Create sounds using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create click sound
    function createClickSound() {
      const clickBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
      const clickData = clickBuffer.getChannelData(0);
      
      for (let i = 0; i < clickBuffer.length; i++) {
        // Short click with decay
        clickData[i] = Math.random() * 0.2 * Math.exp(-i / (clickBuffer.length / 10));
      }
      
      sounds.click.src = URL.createObjectURL(bufferToWave(clickBuffer, audioContext.sampleRate));
    }
    
    // Create win sound
    function createWinSound() {
      const winBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
      const winData = winBuffer.getChannelData(0);
      
      for (let i = 0; i < winBuffer.length; i++) {
        // Ascending tone with modulation
        const t = i / audioContext.sampleRate;
        winData[i] = 0.2 * Math.sin(2 * Math.PI * 440 * t * (1 + 0.3 * t)) * Math.exp(-3 * t);
      }
      
      sounds.win.src = URL.createObjectURL(bufferToWave(winBuffer, audioContext.sampleRate));
    }
    
    // Create lose sound
    function createLoseSound() {
      const loseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate);
      const loseData = loseBuffer.getChannelData(0);
      
      for (let i = 0; i < loseBuffer.length; i++) {
        // Descending tone with modulation
        const t = i / audioContext.sampleRate;
        loseData[i] = 0.2 * Math.sin(2 * Math.PI * 330 * t * (1 - 0.2 * t)) * Math.exp(-3 * t);
      }
      
      sounds.lose.src = URL.createObjectURL(bufferToWave(loseBuffer, audioContext.sampleRate));
    }
    
    // Create draw sound
    function createDrawSound() {
      const drawBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.3, audioContext.sampleRate);
      const drawData = drawBuffer.getChannelData(0);
      
      for (let i = 0; i < drawBuffer.length; i++) {
        // Steady tone with slight modulation
        const t = i / audioContext.sampleRate;
        drawData[i] = 0.2 * Math.sin(2 * Math.PI * 220 * t) * Math.sin(2 * Math.PI * 3 * t) * Math.exp(-5 * t);
      }
      
      sounds.draw.src = URL.createObjectURL(bufferToWave(drawBuffer, audioContext.sampleRate));
    }
    
    // Create shake sound
    function createShakeSound() {
      const shakeBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.8, audioContext.sampleRate);
      const shakeData = shakeBuffer.getChannelData(0);
      
      for (let i = 0; i < shakeBuffer.length; i++) {
        // Whooshing sound
        const t = i / audioContext.sampleRate;
        const phase = 10 * t % 1;
        shakeData[i] = 0.1 * Math.sin(2 * Math.PI * 100 * phase) * Math.exp(-1 * t);
      }
      
      sounds.shake.src = URL.createObjectURL(bufferToWave(shakeBuffer, audioContext.sampleRate));
    }
    
    // Utility to convert AudioBuffer to WAV format
    function bufferToWave(buffer, sampleRate) {
      const numChannels = buffer.numberOfChannels;
      const length = buffer.length * numChannels * 2;
      const arrayBuffer = new ArrayBuffer(44 + length);
      const view = new DataView(arrayBuffer);
      
      // RIFF chunk descriptor
      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + length, true);
      writeString(view, 8, 'WAVE');
      
      // fmt sub-chunk
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numChannels * 2, true);
      view.setUint16(32, numChannels * 2, true);
      view.setUint16(34, 16, true);
      
      // data sub-chunk
      writeString(view, 36, 'data');
      view.setUint32(40, length, true);
      
      // Write the PCM samples
      const data = buffer.getChannelData(0);
      let offset = 44;
      for (let i = 0; i < data.length; i++) {
        const sample = Math.max(-1, Math.min(1, data[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
      
      return new Blob([view], { type: 'audio/wav' });
    }
    
    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
    
    // Create all sounds
    createClickSound();
    createWinSound();
    createLoseSound();
    createDrawSound();
    createShakeSound();
    
    // Set volume
    Object.values(sounds).forEach(sound => {
      sound.volume = 0.5;
    });
  }
  
  // Initialize sounds
  try {
    initSounds();
    console.log("Sound effects initialized");
  } catch (e) {
    console.error("Failed to initialize sound effects:", e);
  }
  
  // Play a sound effect
  function playSound(name) {
    try {
      if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(e => console.log("Error playing sound:", e));
      }
    } catch (e) {
      console.error("Error playing sound:", e);
    }
  }

  // Add event listeners to option buttons
  optionBtns.forEach((option) => {
    option.addEventListener("click", () => {
      if (!gameActive) return;
      
      // Play click sound
      playSound('click');
      
      // Get player choice
      playerChoice = option.getAttribute("data-choice");
      
      // Update message
      message.textContent = "ROCK PAPER SCISSORS...";
      
      // Update player hand display
      updateHandDisplay(playerChoice, "player");
      
      // Add shake animation
      computer.classList.add("shakeComputer");
      player.classList.add("shakePlayer");
      
      // Play shake sound
      playSound('shake');

      // Remove winner class if present
      computer.classList.remove("winner");
      player.classList.remove("winner");
      
      // Temporarily disable game
      gameActive = false;

      setTimeout(() => {
        // Remove shake animation
        computer.classList.remove("shakeComputer");
        player.classList.remove("shakePlayer");

        // Generate computer choice
        const choices = ["STONE", "PAPER", "SCISSORS"];
        const randomIndex = Math.floor(Math.random() * 3);
        computerChoice = choices[randomIndex];
        
        // Update computer's hand
        updateHandDisplay(computerChoice, "computer");

        // Get current scores
        let cPoints = parseInt(computerPoints.innerHTML);
        let pPoints = parseInt(playerPoints.innerHTML);
        let dPoints = parseInt(drawPoints.innerHTML);

        // Determine the winner
        let result;
        if (playerChoice === computerChoice) {
          result = "draw";
          drawPoints.innerHTML = dPoints + 1;
          resultMessage.textContent = "It's a draw!";
          playSound('draw');
        } else if (
          (playerChoice === "STONE" && computerChoice === "SCISSORS") ||
          (playerChoice === "PAPER" && computerChoice === "STONE") ||
          (playerChoice === "SCISSORS" && computerChoice === "PAPER")
        ) {
          result = "player";
          playerPoints.innerHTML = pPoints + 1;
          resultMessage.textContent = "You win! 🎉";
          player.classList.add("winner");
          playSound('win');
        } else {
          result = "computer";
          computerPoints.innerHTML = cPoints + 1;
          resultMessage.textContent = "Computer wins! 💻";
          computer.classList.add("winner");
          playSound('lose');
        }
        
        // Add to game history
        gameHistory.push({
          playerChoice,
          computerChoice,
          result
        });
        
        // Update game state
        lastResult = result;
        
        // Re-enable game
        setTimeout(() => {
          gameActive = true;
          message.textContent = "CHOOSE AN OPTION";
        }, 1500);
        
      }, 900);
    });
  });

  // Function to update hand display
  function updateHandDisplay(choice, side) {
    // Get the hand element
    const handElement = side === "player" ? 
      player.querySelector(".futuristic-hand") : 
      computer.querySelector(".futuristic-hand");
    
    // Remove existing hand classes
    handElement.classList.remove("rock-hand", "paper-hand", "scissors-hand");
    
    // Add appropriate class based on choice
    if (choice === "STONE") {
      handElement.classList.add("rock-hand");
    } else if (choice === "PAPER") {
      handElement.classList.add("paper-hand");
    } else if (choice === "SCISSORS") {
      handElement.classList.add("scissors-hand");
    }
  }

  // Reset game
  resetBtn.addEventListener("click", () => {
    playSound('click');
    
    // Reset scores
    playerPoints.innerHTML = "0";
    computerPoints.innerHTML = "0";
    drawPoints.innerHTML = "0";
    
    // Reset display
    resultMessage.textContent = "Game reset. Ready to play!";
    message.textContent = "CHOOSE AN OPTION";
    
    // Reset state
    gameActive = true;
    lastResult = null;
    gameHistory = [];
    
    // Reset hands
    updateHandDisplay("STONE", "player");
    updateHandDisplay("STONE", "computer");
    
    // Remove winner classes
    computer.classList.remove("winner");
    player.classList.remove("winner");
  });

  // Initial setup
  resultMessage.textContent = "Ready to play!";
  
  // Add audio context initialization on first user interaction
  document.addEventListener('click', function initAudio() {
    // Try to resume audio context if needed
    if (window.AudioContext || window.webkitAudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }
    
    // Play a silent sound to unlock audio on iOS
    const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBA//8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==");
    silentSound.play().catch(e => {});
    
    // Remove event listener to avoid repeat initializations
    document.removeEventListener('click', initAudio);
  });
}); 