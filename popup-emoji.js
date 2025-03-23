document.addEventListener('DOMContentLoaded', () => {
  // Game state variables
  let userScore = 0;
  let computerScore = 0;
  let isGameActive = false;
  
  // DOM elements
  const playBtn = document.getElementById('play-btn');
  const rockBtn = document.getElementById('rock-btn');
  const paperBtn = document.getElementById('paper-btn');
  const scissorsBtn = document.getElementById('scissors-btn');
  const resetBtn = document.getElementById('reset-btn');
  const userScoreDisplay = document.getElementById('user-score');
  const computerScoreDisplay = document.getElementById('computer-score');
  const resultMessage = document.getElementById('result-message');
  const userHandContainer = document.getElementById('user-hand-container');
  const computerHandContainer = document.getElementById('computer-hand-container');
  
  // Sound elements
  const clickSound = document.getElementById('click-sound');
  const winSound = document.getElementById('win-sound');
  const loseSound = document.getElementById('lose-sound');
  const drawSound = document.getElementById('draw-sound');
  
  // Initialize the game
  function init() {
    setupEventListeners();
    handleSounds();
    resetGame();
  }
  
  // Handle sound loading
  function handleSounds() {
    // Set fallback for audio playback errors
    [clickSound, winSound, loseSound, drawSound].forEach(sound => {
      if (sound) {
        sound.addEventListener('error', () => {
          console.log('Audio file could not be loaded, using silent audio');
        });
      }
    });
  }
  
  // Set up event listeners
  function setupEventListeners() {
    playBtn.addEventListener('click', startGame);
    rockBtn.addEventListener('click', () => playHand('rock'));
    paperBtn.addEventListener('click', () => playHand('paper'));
    scissorsBtn.addEventListener('click', () => playHand('scissors'));
    resetBtn.addEventListener('click', resetGame);
  }
  
  // Start the game
  function startGame() {
    playSound(clickSound);
    isGameActive = true;
    playBtn.style.display = 'none';
    toggleChoiceButtons(true);
    resultMessage.textContent = 'Choose your move!';
    resultMessage.classList.add('wiggle-animation');
    
    // Initial hand setup
    createHandElements('rock', 'user');
    createHandElements('rock', 'computer');
  }
  
  // Toggle the choice buttons
  function toggleChoiceButtons(enabled) {
    rockBtn.style.pointerEvents = enabled ? 'auto' : 'none';
    paperBtn.style.pointerEvents = enabled ? 'auto' : 'none';
    scissorsBtn.style.pointerEvents = enabled ? 'auto' : 'none';
    
    if (enabled) {
      rockBtn.classList.add('float-animation');
      paperBtn.classList.add('float-animation');
      scissorsBtn.classList.add('float-animation');
    } else {
      rockBtn.classList.remove('float-animation');
      paperBtn.classList.remove('float-animation');
      scissorsBtn.classList.remove('float-animation');
    }
  }
  
  // Create hand elements
  function createHandElements(gesture, player) {
    const container = player === 'user' ? userHandContainer : computerHandContainer;
    
    // Save the title element
    const title = container.querySelector('h2');
    
    // Clear the container except for the title
    container.innerHTML = '';
    
    // Re-add the title if it existed
    if (title) {
      container.appendChild(title);
    }
    
    // Create a container for centering the hand
    const handContainer = document.createElement('div');
    handContainer.className = 'emoji-hand-container';
    
    const handElement = document.createElement('div');
    handElement.className = `emoji-hand ${gesture}-hand ${player}-hand float-animation`;
    
    // Add fingers for paper
    if (gesture === 'paper') {
      for (let i = 0; i < 3; i++) {
        const finger = document.createElement('div');
        finger.className = 'finger';
        handElement.appendChild(finger);
      }
    }
    
    // Add fingers for scissors
    if (gesture === 'scissors') {
      for (let i = 0; i < 2; i++) {
        const finger = document.createElement('div');
        finger.className = 'finger';
        handElement.appendChild(finger);
      }
    }
    
    handContainer.appendChild(handElement);
    container.appendChild(handContainer);
  }
  
  // Play a hand
  function playHand(userChoice) {
    if (!isGameActive) return;
    
    playSound(clickSound);
    
    // Disable choice buttons during animation
    toggleChoiceButtons(false);
    
    // Choices
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    // Update hand displays
    updateHandDisplay(userChoice, computerChoice);
    
    // Determine winner after a delay for animation
    setTimeout(() => {
      const result = determineWinner(userChoice, computerChoice);
      updateScore(result);
      animateResult(result, userChoice, computerChoice);
      
      // Re-enable choice buttons
      setTimeout(() => {
        toggleChoiceButtons(true);
      }, 1500);
    }, 1000);
  }
  
  // Update hand display
  function updateHandDisplay(userChoice, computerChoice) {
    createHandElements(userChoice, 'user');
    createHandElements(computerChoice, 'computer');
    
    // Add wiggle animation
    const userHandContainer = document.querySelector('#user-hand-container .emoji-hand-container');
    const computerHandContainer = document.querySelector('#computer-hand-container .emoji-hand-container');
    const userHand = userHandContainer ? userHandContainer.querySelector('.emoji-hand') : null;
    const computerHand = computerHandContainer ? computerHandContainer.querySelector('.emoji-hand') : null;
    
    if (userHand) {
      userHand.classList.remove('float-animation');
      userHand.classList.add('wiggle-animation');
    }
    
    if (computerHand) {
      computerHand.classList.remove('float-animation');
      computerHand.classList.add('wiggle-animation');
    }
    
    setTimeout(() => {
      if (userHand) userHand.classList.remove('wiggle-animation');
      if (computerHand) computerHand.classList.remove('wiggle-animation');
    }, 1000);
  }
  
  // Determine winner
  function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
      return 'draw';
    }
    
    if (
      (userChoice === 'rock' && computerChoice === 'scissors') ||
      (userChoice === 'paper' && computerChoice === 'rock') ||
      (userChoice === 'scissors' && computerChoice === 'paper')
    ) {
      return 'user';
    }
    
    return 'computer';
  }
  
  // Update score
  function updateScore(result) {
    if (result === 'user') {
      userScore++;
      userScoreDisplay.textContent = userScore;
      playSound(winSound);
    } else if (result === 'computer') {
      computerScore++;
      computerScoreDisplay.textContent = computerScore;
      playSound(loseSound);
    } else {
      playSound(drawSound);
    }
  }
  
  // Animate result
  function animateResult(result, userChoice, computerChoice) {
    const userHandContainer = document.querySelector('#user-hand-container .emoji-hand-container');
    const computerHandContainer = document.querySelector('#computer-hand-container .emoji-hand-container');
    const userHand = userHandContainer ? userHandContainer.querySelector('.emoji-hand') : null;
    const computerHand = computerHandContainer ? computerHandContainer.querySelector('.emoji-hand') : null;
    
    // Remove any existing winner classes
    if (userHand) userHand.classList.remove('winner');
    if (computerHand) computerHand.classList.remove('winner');
    
    // Display result message
    if (result === 'user') {
      resultMessage.textContent = `You win! ${capitalizeFirstLetter(userChoice)} beats ${computerChoice}.`;
      if (userHand) userHand.classList.add('winner');
      resultMessage.style.backgroundColor = 'rgba(6, 214, 160, 0.2)';
    } else if (result === 'computer') {
      resultMessage.textContent = `Computer wins! ${capitalizeFirstLetter(computerChoice)} beats ${userChoice}.`;
      if (computerHand) computerHand.classList.add('winner');
      resultMessage.style.backgroundColor = 'rgba(239, 71, 111, 0.2)';
    } else {
      resultMessage.textContent = `It's a draw! Both chose ${userChoice}.`;
      resultMessage.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
    }
  }
  
  // Reset game
  function resetGame() {
    playSound(clickSound);
    userScore = 0;
    computerScore = 0;
    isGameActive = false;
    
    userScoreDisplay.textContent = '0';
    computerScoreDisplay.textContent = '0';
    
    playBtn.style.display = 'block';
    resultMessage.textContent = 'Ready to play?';
    resultMessage.classList.remove('wiggle-animation');
    resultMessage.style.backgroundColor = 'rgba(255, 209, 102, 0.2)';
    
    // Clear hand containers while preserving titles
    const userTitle = userHandContainer.querySelector('h2');
    const computerTitle = computerHandContainer.querySelector('h2');
    
    userHandContainer.innerHTML = '';
    computerHandContainer.innerHTML = '';
    
    // Re-add titles
    if (userTitle) userHandContainer.appendChild(userTitle);
    if (computerTitle) computerHandContainer.appendChild(computerTitle);
    
    // Disable choice buttons
    toggleChoiceButtons(false);
  }
  
  // Helper function to play sound
  function playSound(soundElement) {
    if (soundElement && soundElement.play) {
      soundElement.currentTime = 0;
      soundElement.play().catch(err => {
        console.log('Audio playback error:', err);
      });
    }
  }
  
  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Initialize the game
  init();
}); 