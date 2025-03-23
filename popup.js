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
    handContainer.style.perspective = '500px';  // Increased perspective for more 3D effect
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
      const thumb = createThumbElement(true);  // Curled thumb for rock
      hand.appendChild(thumb);
    } 
    else if (gesture === 'paper') {
      // Open hand - extended fingers
      for (let i = 0; i < 4; i++) {
        const finger = createFingerElement(i, false); // extended
        hand.appendChild(finger);
      }
      // Add thumb
      const thumb = createThumbElement(false);  // Extended thumb for paper
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
      const thumb = createThumbElement(true);  // Curled thumb for scissors
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
    label.style.fontSize = '14px';  // Smaller font size
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
    palm.style.width = '70px';  // Reduced from 80px
    palm.style.height = '90px';  // Reduced from 105px
    palm.style.position = 'absolute';
    palm.style.top = '50%';
    palm.style.left = '50%';
    palm.style.transform = 'translate(-50%, -50%)';
    palm.style.backgroundColor = '#f5d0a9';
    // More advanced skin tone gradient
    palm.style.backgroundImage = 'linear-gradient(135deg, #f8d5b2 0%, #e6b887 50%, #d9a872 100%)';
    palm.style.borderRadius = '15px';  // Reduced from 18px
    palm.style.boxShadow = '0 6px 15px rgba(0,0,0,0.3), inset 2px 2px 5px rgba(255,255,255,0.5), inset -2px -2px 5px rgba(0,0,0,0.1)';  // Reduced shadow
    palm.style.border = '1px solid rgba(0,0,0,0.1)';
    
    // Add palm lines for realism
    const palmLines = document.createElement('div');
    palmLines.style.position = 'absolute';
    palmLines.style.top = '30%';
    palmLines.style.left = '20%';
    palmLines.style.width = '60%';
    palmLines.style.height = '40%';
    palmLines.style.borderTop = '1px solid rgba(0,0,0,0.1)';
    palmLines.style.borderBottom = '1px solid rgba(0,0,0,0.1)';
    palmLines.style.borderRadius = '50%';
    palm.appendChild(palmLines);
    
    return palm;
  }
  
  // Create finger element
  function createFingerElement(index, curled) {
    const finger = document.createElement('div');
    finger.className = 'css-finger';
    finger.style.width = '16px';  // Reduced from 20px
    finger.style.height = curled ? '30px' : '60px';  // Reduced from 35px/70px
    finger.style.position = 'absolute';
    
    // Position based on index
    const leftPos = 22 + (index * 15);  // Adjusted finger spacing (was 25 + index * 17)
    finger.style.left = `${leftPos}px`;
    finger.style.top = curled ? '25px' : '0px';  // Adjusted from 30px/0px
    
    finger.style.backgroundColor = '#f5d0a9';
    // More advanced skin tone gradient
    finger.style.backgroundImage = 'linear-gradient(135deg, #f8d5b2 0%, #e6b887 50%, #d9a872 100%)';
    finger.style.borderRadius = '8px';  // Reduced from 10px
    finger.style.transformOrigin = 'bottom center';
    finger.style.transform = curled ? 'rotateX(90deg)' : 'rotateX(0deg)';
    finger.style.boxShadow = '0 3px 6px rgba(0,0,0,0.2), inset 1px 1px 3px rgba(255,255,255,0.5)';  // Reduced shadow
    finger.style.border = '1px solid rgba(0,0,0,0.1)';
    
    // Add finger joint for extended fingers
    if (!curled) {
      const joint = document.createElement('div');
      joint.style.position = 'absolute';
      joint.style.width = '100%';
      joint.style.height = '1px';
      joint.style.backgroundColor = 'rgba(0,0,0,0.1)';
      joint.style.top = '40%';
      joint.style.left = '0';
      finger.appendChild(joint);
    }
    
    return finger;
  }
  
  // Create thumb element
  function createThumbElement(curled) {
    const thumb = document.createElement('div');
    thumb.className = 'css-thumb';
    thumb.style.width = '20px';  // Reduced from 25px
    thumb.style.height = '38px';  // Reduced from 45px
    thumb.style.position = 'absolute';
    thumb.style.left = '8px';  // Adjusted from 10px
    thumb.style.top = '45px';  // Adjusted from 50px
    thumb.style.backgroundColor = '#f5d0a9';
    // More advanced skin tone gradient
    thumb.style.backgroundImage = 'linear-gradient(135deg, #f8d5b2 0%, #e6b887 50%, #d9a872 100%)';
    thumb.style.borderRadius = '8px';  // Reduced from 10px
    thumb.style.transformOrigin = 'top center';
    thumb.style.transform = curled ? 'rotate(-20deg)' : 'rotate(-40deg) translateX(8px)';  // Adjusted translateX from 10px to 8px
    thumb.style.boxShadow = '0 3px 6px rgba(0,0,0,0.2), inset 1px 1px 3px rgba(255,255,255,0.5)';  // Reduced shadow
    thumb.style.border = '1px solid rgba(0,0,0,0.1)';
    
    // Add thumb joint
    const joint = document.createElement('div');
    joint.style.position = 'absolute';
    joint.style.width = '100%';
    joint.style.height = '1px';
    joint.style.backgroundColor = 'rgba(0,0,0,0.1)';
    joint.style.top = '40%';
    joint.style.left = '0';
    thumb.appendChild(joint);
    
    return thumb;
  }
  
  // Animate the hand with a gentle rotation and floating effect
  function animateHand(hand) {
    let rotation = 0;
    let floatY = 0;
    let floatDirection = 1;
    
    function animate() {
      rotation += 0.4;  // Slower rotation for more natural movement
      floatY += 0.04 * floatDirection;  // Slower floating
      
      // Change direction when reaching limits
      if (floatY > 3 || floatY < -3) {  // Reduced from 4/-4
        floatDirection *= -1;
      }
      
      hand.style.transform = `rotateY(${rotation % 12 - 6}deg) rotateX(15deg) translateY(${floatY}px)`;  // Reduced rotation and tilt
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
      
      // Add pulse animation to winner
      const userHandModel = userHandDiv.querySelector('.css-hand');
      if (userHandModel) pulseAnimation(userHandModel);
    } else if (result === 'computer') {
      computerScore++;
      resultMessage = `Computer wins! ${computerChoice} beats ${userChoice} 😢`;
      
      // Add pulse animation to winner
      const computerHandModel = computerHandDiv.querySelector('.css-hand');
      if (computerHandModel) pulseAnimation(computerHandModel);
    } else {
      resultMessage = "It's a draw! 🤝";
    }
    
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    statusMessage.textContent = resultMessage;
    console.log(`Score updated - User: ${userScore}, Computer: ${computerScore}`);
  }
  
  // Add a pulse animation effect to the winning hand
  function pulseAnimation(element) {
    let scale = 1;
    let growing = true;
    let animationCount = 0;
    
    function pulse() {
      if (growing) {
        scale += 0.01;
        if (scale >= 1.1) growing = false;
      } else {
        scale -= 0.01;
        if (scale <= 1) {
          growing = true;
          animationCount++;
        }
      }
      
      element.style.transform = `rotateY(${element.style.transform.match(/rotateY\(([^)]+)\)/)[1]}) rotateX(20deg) translateY(${element.style.transform.match(/translateY\(([^)]+)\)/)[1]}) scale(${scale})`;
      
      if (animationCount < 3) {
        requestAnimationFrame(pulse);
      }
    }
    
    pulse();
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