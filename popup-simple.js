document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');
  
  // Game variables
  let userScore = 0;
  let computerScore = 0;
  const userScoreSpan = document.getElementById('user-score');
  const computerScoreSpan = document.getElementById('computer-score');
  const statusMessage = document.getElementById('status-message');
  const rockBtn = document.getElementById('rock-btn');
  const paperBtn = document.getElementById('paper-btn');
  const scissorsBtn = document.getElementById('scissors-btn');
  const resetBtn = document.getElementById('reset-btn');
  const userHandDiv = document.getElementById('user-hand-div');
  const computerHandDiv = document.getElementById('computer-hand-div');
  const switchToAdvancedBtn = document.getElementById('switch-to-advanced');
  
  // Log elements to make sure they're found
  console.log('Rock button found:', rockBtn !== null);
  console.log('Paper button found:', paperBtn !== null);
  console.log('Scissors button found:', scissorsBtn !== null);
  console.log('Reset button found:', resetBtn !== null);
  console.log('User hand div found:', userHandDiv !== null);
  console.log('Computer hand div found:', computerHandDiv !== null);
  console.log('Status message found:', statusMessage !== null);
  console.log('Switch to advanced button found:', switchToAdvancedBtn !== null);
  
  // Initialize sound effects
  if (!SoundEffects.init()) {
    console.warn('Sound effects could not be initialized. Game will continue without sound.');
  }
  
  // Add click event for any interaction to enable audio on iOS/Safari
  document.addEventListener('click', function enableAudio() {
    // Try to resume AudioContext if it was suspended
    if (SoundEffects.audioContext && SoundEffects.audioContext.state === 'suspended') {
      SoundEffects.audioContext.resume();
    }
    // Remove the event listener after first click
    document.removeEventListener('click', enableAudio);
  }, { once: true });
  
  // Set up the game
  setupGame();
  
  // Set up button click handlers
  rockBtn.addEventListener('click', function() {
    SoundEffects.play('click');
    play('rock');
  });
  
  paperBtn.addEventListener('click', function() {
    SoundEffects.play('click');
    play('paper');
  });
  
  scissorsBtn.addEventListener('click', function() {
    SoundEffects.play('click');
    play('scissors');
  });
  
  resetBtn.addEventListener('click', function() {
    SoundEffects.play('click');
    resetGame();
  });
  
  // Set up mode switch handler
  switchToAdvancedBtn.addEventListener('click', function() {
    console.log('Switching to advanced mode');
    window.location.href = 'popup.html';
  });
  
  // Set up CSS-based hand models
  function setupGame() {
    console.log('Setting up CSS-based game');
    
    // Clear divs
    userHandDiv.innerHTML = '';
    computerHandDiv.innerHTML = '';
    
    // Create hand models with images
    createHandModel(userHandDiv, 'rock');
    createHandModel(computerHandDiv, 'rock');
    
    // Show status message
    statusMessage.textContent = 'Simple 3D mode active - Choose your move!';
    
    console.log('Game set up successfully');
  }
  
  // Create a hand model with image
  function createHandModel(container, gesture) {
    // Create image for hand
    const handImage = document.createElement('div');
    handImage.className = 'hand-image-container';
    handImage.style.width = '100%';
    handImage.style.height = '100%';
    handImage.style.display = 'flex';
    handImage.style.alignItems = 'center';
    handImage.style.justifyContent = 'center';
    handImage.style.flexDirection = 'column';
    handImage.style.perspective = '500px';
    
    // Use different HTML/CSS for each gesture
    let handHtml = '';
    
    if (gesture === 'rock') {
      handHtml = `
        <div class="gesture-shape rock">
          <div class="fist"></div>
        </div>
        <div class="gesture-label">${gesture.charAt(0).toUpperCase() + gesture.slice(1)}</div>
      `;
    } 
    else if (gesture === 'paper') {
      handHtml = `
        <div class="gesture-shape paper">
          <div class="palm"></div>
          <div class="fingers"></div>
        </div>
        <div class="gesture-label">${gesture.charAt(0).toUpperCase() + gesture.slice(1)}</div>
      `;
    } 
    else if (gesture === 'scissors') {
      handHtml = `
        <div class="gesture-shape scissors">
          <div class="palm"></div>
          <div class="v-shape"></div>
        </div>
        <div class="gesture-label">${gesture.charAt(0).toUpperCase() + gesture.slice(1)}</div>
      `;
    }
    
    handImage.innerHTML = handHtml;
    container.appendChild(handImage);
    
    // Add custom animation with JavaScript for more control
    const gestureShape = handImage.querySelector('.gesture-shape');
    if (gestureShape) {
      animateGestureShape(gestureShape);
    }
    
    return handImage;
  }
  
  // Animate the gesture shape with a floating effect
  function animateGestureShape(element) {
    let time = 0;
    let direction = 1;
    
    function animate() {
      time += 0.02;
      
      // Create a floating and rotation effect with smaller values
      const rotateY = Math.sin(time) * 8;
      const rotateX = 15 + Math.sin(time * 0.5) * 3;
      const translateY = Math.sin(time * 0.7) * 4;
      const translateZ = 15 + Math.sin(time * 0.3) * 3;
      
      element.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(${translateY}px) translateZ(${translateZ}px)`;
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  // Play the game
  function play(userChoice) {
    console.log(`Playing with choice: ${userChoice}`);
    
    // Update user's choice display
    updateHandModel(userHandDiv, userChoice);
    
    // Add shake animation
    userHandDiv.classList.add('shake');
    computerHandDiv.classList.add('shake');
    
    // Remove winner class from both hands
    userHandDiv.classList.remove('winner');
    computerHandDiv.classList.remove('winner');
    
    // Wait for shake animation
    setTimeout(() => {
      // Remove shake animation
      userHandDiv.classList.remove('shake');
      computerHandDiv.classList.remove('shake');
      
      // Get computer choice
      const choices = ['rock', 'paper', 'scissors'];
      const computerChoice = choices[Math.floor(Math.random() * 3)];
      console.log(`Computer chose: ${computerChoice}`);
      
      // Update computer's choice display
      updateHandModel(computerHandDiv, computerChoice);
      
      // Determine winner
      const result = getWinner(userChoice, computerChoice);
      console.log(`Result: ${result}`);
      updateScore(result, userChoice, computerChoice);
      
      // Highlight winner with enhanced animation
      if (result === 'user') {
        userHandDiv.classList.add('winner');
        pulseAnimation(userHandDiv);
      } else if (result === 'computer') {
        computerHandDiv.classList.add('winner');
        pulseAnimation(computerHandDiv);
      }
    }, 500);
  }
  
  // Update hand model to show a different gesture
  function updateHandModel(container, gesture) {
    // Clear the container
    container.innerHTML = '';
    
    // Create new hand model with the new gesture
    createHandModel(container, gesture);
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
      SoundEffects.play('win');
    } else if (result === 'computer') {
      computerScore++;
      resultMessage = `Computer wins! ${computerChoice} beats ${userChoice} 😢`;
      SoundEffects.play('lose');
    } else {
      resultMessage = "It's a draw! 🤝";
      SoundEffects.play('draw');
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
    statusMessage.textContent = 'Simple 3D mode active - Choose your move!';
    
    // Reset to rock hands
    updateHandModel(userHandDiv, 'rock');
    updateHandModel(computerHandDiv, 'rock');
    
    // Remove winner class from both hands
    userHandDiv.classList.remove('winner');
    computerHandDiv.classList.remove('winner');
    console.log('Game reset complete');
  }
  
  // Add a pulsing animation to the winner
  function pulseAnimation(element) {
    const gestureShape = element.querySelector('.gesture-shape');
    if (!gestureShape) return;
    
    // Add an additional pulse effect
    let scale = 1;
    let growing = true;
    let pulseCount = 0;
    
    function pulse() {
      if (growing) {
        scale += 0.01;
        if (scale >= 1.1) growing = false;
      } else {
        scale -= 0.01;
        if (scale <= 1) {
          growing = true;
          pulseCount++;
        }
      }
      
      // Apply the scale on top of existing transform
      const currentTransform = gestureShape.style.transform || '';
      const baseTransform = currentTransform.replace(/scale\([^)]*\)/, '').trim();
      gestureShape.style.transform = `${baseTransform} scale(${scale})`;
      
      // Continue animation for a while
      if (pulseCount < 5 && element.classList.contains('winner')) {
        requestAnimationFrame(pulse);
      }
    }
    
    pulse();
  }
}); 