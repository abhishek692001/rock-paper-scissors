document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');
  
  // Game variables
  let userScore = 0;
  let computerScore = 0;
  const userScoreSpan = document.getElementById('user-score');
  const computerScoreSpan = document.getElementById('computer-score');
  const statusMessage = document.getElementById('status-message');
  const rockBtn = document.getElementById('rock');
  const paperBtn = document.getElementById('paper');
  const scissorsBtn = document.getElementById('scissors');
  const resetBtn = document.getElementById('reset-btn');
  const userHandDiv = document.getElementById('user-hand');
  const computerHandDiv = document.getElementById('computer-hand');
  
  // Mode switching elements
  const gameModeSelect = document.getElementById('game-mode');
  const applyModeBtn = document.getElementById('apply-mode');
  
  // Log elements to make sure they're found
  console.log('Rock button found:', rockBtn !== null);
  console.log('Paper button found:', paperBtn !== null);
  console.log('Scissors button found:', scissorsBtn !== null);
  console.log('Reset button found:', resetBtn !== null);
  console.log('User hand div found:', userHandDiv !== null);
  console.log('Computer hand div found:', computerHandDiv !== null);
  console.log('Status message found:', statusMessage !== null);
  console.log('Game mode select found:', gameModeSelect !== null);
  console.log('Apply mode button found:', applyModeBtn !== null);
  
  // Set up the CSS-based 3D hand models
  setupCSSHandModels();
  
  // Set up button click handlers
  rockBtn.addEventListener('click', function() {
    console.log('Rock button clicked');
    play('rock');
  });
  
  paperBtn.addEventListener('click', function() {
    console.log('Paper button clicked');
    play('paper');
  });
  
  scissorsBtn.addEventListener('click', function() {
    console.log('Scissors button clicked');
    play('scissors');
  });
  
  resetBtn.addEventListener('click', function() {
    console.log('Reset button clicked');
    resetGame();
  });
  
  // Set up mode switching
  applyModeBtn.addEventListener('click', function() {
    const selectedMode = gameModeSelect.value;
    console.log(`Switching to ${selectedMode} mode`);
    
    if (selectedMode === 'simple') {
      window.location.href = 'popup-simple.html';
    } else {
      // We're already in advanced mode, just reset the game
      resetGame();
      statusMessage.textContent = 'Advanced 3D mode active';
    }
  });
  
  // Set up CSS-based hand models
  function setupCSSHandModels() {
    console.log('Setting up CSS-based 3D hand models');
    
    // Clear divs
    userHandDiv.innerHTML = '';
    computerHandDiv.innerHTML = '';
    
    // Create hand models
    createCSSHandModel(userHandDiv, 'rock', false);
    createCSSHandModel(computerHandDiv, 'rock', true);
    
    // Show status message
    statusMessage.textContent = 'Advanced 3D mode active';
    
    console.log('CSS-based hand models set up successfully');
  }
  
  // Create a CSS-based hand model based on the gesture
  function createCSSHandModel(container, gesture, mirrored) {
    // Create hand container with perspective
    const handContainer = document.createElement('div');
    handContainer.className = 'css-hand-container';
    handContainer.style.perspective = '400px';
    handContainer.style.width = '100%';
    handContainer.style.height = '100%';
    handContainer.style.position = 'relative';
    handContainer.style.transform = mirrored ? 'scaleX(-1)' : '';
    
    // Create 3D hand
    const hand = document.createElement('div');
    hand.className = 'css-hand';
    hand.setAttribute('data-gesture', gesture);
    hand.style.width = '100%';
    hand.style.height = '100%';
    hand.style.position = 'relative';
    hand.style.transformStyle = 'preserve-3d';
    hand.style.transition = 'transform 0.5s ease';
    hand.style.transform = 'rotateY(0deg) rotateX(20deg)';
    
    // Add palm (always present)
    const palm = createPalmElement();
    hand.appendChild(palm);
    
    // Add fingers based on gesture
    if (gesture === 'rock') {
      // Clenched fist - curled fingers
      for (let i = 0; i < 4; i++) {
        const finger = createFingerElement(i, true); // curled
        hand.appendChild(finger);
      }
      // Add thumb
      const thumb = createThumbElement();
      hand.appendChild(thumb);
    } 
    else if (gesture === 'paper') {
      // Open hand - extended fingers
      for (let i = 0; i < 4; i++) {
        const finger = createFingerElement(i, false); // extended
        hand.appendChild(finger);
      }
      // Add thumb
      const thumb = createThumbElement();
      hand.appendChild(thumb);
    } 
    else if (gesture === 'scissors') {
      // Scissors - two extended fingers, rest curled
      for (let i = 0; i < 2; i++) {
        const finger = createFingerElement(i, false); // extended
        hand.appendChild(finger);
      }
      for (let i = 2; i < 4; i++) {
        const finger = createFingerElement(i, true); // curled
        hand.appendChild(finger);
      }
      // Add thumb
      const thumb = createThumbElement();
      hand.appendChild(thumb);
    }
    
    // Add gesture label
    const label = document.createElement('div');
    label.className = 'css-hand-label';
    label.textContent = gesture.charAt(0).toUpperCase() + gesture.slice(1);
    label.style.position = 'absolute';
    label.style.bottom = '5px';
    label.style.left = '0';
    label.style.width = '100%';
    label.style.textAlign = 'center';
    label.style.fontWeight = 'bold';
    label.style.fontSize = '16px';
    label.style.color = '#2c3e50';
    label.style.textShadow = '1px 1px 2px rgba(255,255,255,0.7)';
    hand.appendChild(label);
    
    // Add hand to container
    handContainer.appendChild(hand);
    
    // Add container to parent
    container.appendChild(handContainer);
    
    // Start animation
    animateHand(hand);
    
    return hand;
  }
  
  // Create palm element
  function createPalmElement() {
    const palm = document.createElement('div');
    palm.className = 'css-palm';
    palm.style.width = '95px';
    palm.style.height = '120px';
    palm.style.position = 'absolute';
    palm.style.top = '50%';
    palm.style.left = '50%';
    palm.style.transform = 'translate(-50%, -50%)';
    palm.style.backgroundColor = '#f5d0a9';
    palm.style.backgroundImage = 'linear-gradient(to bottom right, #f5d0a9, #e6c09f)';
    palm.style.borderRadius = '18px';
    palm.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
    palm.style.border = '1px solid rgba(0,0,0,0.1)';
    return palm;
  }
  
  // Create finger element
  function createFingerElement(index, curled) {
    const finger = document.createElement('div');
    finger.className = 'css-finger';
    finger.style.width = '24px';
    finger.style.height = curled ? '40px' : '85px';
    finger.style.position = 'absolute';
    
    // Position based on index
    const leftPos = 27 + (index * 20);
    finger.style.left = `${leftPos}px`;
    finger.style.top = curled ? '35px' : '0px';
    
    finger.style.backgroundColor = '#f5d0a9';
    finger.style.backgroundImage = 'linear-gradient(to bottom right, #f5d0a9, #e6c09f)';
    finger.style.borderRadius = '12px';
    finger.style.transformOrigin = 'bottom center';
    finger.style.transform = curled ? 'rotateX(90deg)' : 'rotateX(0deg)';
    finger.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    finger.style.border = '1px solid rgba(0,0,0,0.1)';
    return finger;
  }
  
  // Create thumb element
  function createThumbElement() {
    const thumb = document.createElement('div');
    thumb.className = 'css-thumb';
    thumb.style.width = '30px';
    thumb.style.height = '55px';
    thumb.style.position = 'absolute';
    thumb.style.left = '10px';
    thumb.style.top = '60px';
    thumb.style.backgroundColor = '#f5d0a9';
    thumb.style.backgroundImage = 'linear-gradient(to bottom right, #f5d0a9, #e6c09f)';
    thumb.style.borderRadius = '12px';
    thumb.style.transformOrigin = 'top center';
    thumb.style.transform = 'rotate(-30deg)';
    thumb.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    thumb.style.border = '1px solid rgba(0,0,0,0.1)';
    return thumb;
  }
  
  // Animate the hand with a gentle rotation and floating effect
  function animateHand(hand) {
    let rotation = 0;
    let floatY = 0;
    let floatDirection = 1;
    
    function animate() {
      rotation += 0.5;
      floatY += 0.05 * floatDirection;
      
      // Change direction when reaching limits
      if (floatY > 5 || floatY < -5) {
        floatDirection *= -1;
      }
      
      hand.style.transform = `rotateY(${rotation % 20 - 10}deg) rotateX(20deg) translateY(${floatY}px)`;
      requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  // Play the game
  function play(userChoice) {
    console.log(`Playing with choice: ${userChoice}`);
    
    // Update user's choice display
    updateCSSHandModel(userHandDiv, userChoice, false);
    
    // Add shake animation
    userHandDiv.parentElement.classList.add('shake');
    computerHandDiv.parentElement.classList.add('shake');
    
    // Remove winner class from both hands
    userHandDiv.parentElement.classList.remove('winner');
    computerHandDiv.parentElement.classList.remove('winner');
    
    // Wait for shake animation
    setTimeout(() => {
      // Remove shake animation
      userHandDiv.parentElement.classList.remove('shake');
      computerHandDiv.parentElement.classList.remove('shake');
      
      // Get computer choice
      const choices = ['rock', 'paper', 'scissors'];
      const computerChoice = choices[Math.floor(Math.random() * 3)];
      console.log(`Computer chose: ${computerChoice}`);
      
      // Update computer's choice display
      updateCSSHandModel(computerHandDiv, computerChoice, true);
      
      // Determine winner
      const result = getWinner(userChoice, computerChoice);
      console.log(`Result: ${result}`);
      updateScore(result, userChoice, computerChoice);
      
      // Highlight winner
      if (result === 'user') {
        userHandDiv.parentElement.classList.add('winner');
      } else if (result === 'computer') {
        computerHandDiv.parentElement.classList.add('winner');
      }
    }, 500);
  }
  
  // Update CSS hand model to show a different gesture
  function updateCSSHandModel(container, gesture, mirrored) {
    // Clear the container
    container.innerHTML = '';
    
    // Create new hand model with the new gesture
    createCSSHandModel(container, gesture, mirrored);
  }
  
  // Determine the winner
  function getWinner(user, computer) {
    if (user === computer) return 'draw';
    
    if (
      (user === 'rock' && computer === 'scissors') ||
      (user === 'paper' && computer === 'rock') ||
      (user === 'scissors' && computer === 'paper')
    ) {
      return 'user';
    } else {
      return 'computer';
    }
  }
  
  // Update the score and display the result
  function updateScore(result, userChoice, computerChoice) {
    let resultMessage = '';
    
    if (result === 'user') {
      userScore++;
      resultMessage = `You win! ${userChoice} beats ${computerChoice} 🎉`;
    } else if (result === 'computer') {
      computerScore++;
      resultMessage = `Computer wins! ${computerChoice} beats ${userChoice} 😢`;
    } else {
      resultMessage = "It's a draw! 🤝";
    }
    
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    statusMessage.textContent = resultMessage;
    console.log(`Score updated - User: ${userScore}, Computer: ${computerScore}`);
  }
  
  // Reset the game
  function resetGame() {
    console.log('Resetting game');
    userScore = 0;
    computerScore = 0;
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    statusMessage.textContent = 'Choose your gesture!';
    
    // Reset to rock hands
    updateCSSHandModel(userHandDiv, 'rock', false);
    updateCSSHandModel(computerHandDiv, 'rock', true);
    
    // Remove winner class from both hands
    userHandDiv.parentElement.classList.remove('winner');
    computerHandDiv.parentElement.classList.remove('winner');
    console.log('Game reset complete');
  }
}); 