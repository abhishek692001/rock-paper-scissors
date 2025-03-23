document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');
  
  // Game variables that are always needed
  let userScore = 0;
  let computerScore = 0;
  const userScoreSpan = document.getElementById('user-score');
  const computerScoreSpan = document.getElementById('computer-score');
  const resultText = document.getElementById('result-text');
  const rockBtn = document.getElementById('rock');
  const paperBtn = document.getElementById('paper');
  const scissorsBtn = document.getElementById('scissors');
  const resetBtn = document.getElementById('reset');
  const userHandDiv = document.getElementById('user-hand');
  const computerHandDiv = document.getElementById('computer-hand');
  const statusMessage = document.getElementById('status-message');
  
  // Make sure the hand divs have explicit dimensions
  ensureHandDivDimensions();
  
  // Function to ensure hand divs have proper dimensions
  function ensureHandDivDimensions() {
    console.log('Ensuring hand divs have proper dimensions');
    
    // Check if dimensions are valid
    if (!userHandDiv.clientWidth || !userHandDiv.clientHeight) {
      console.log('User hand div has invalid dimensions, setting explicit size');
      userHandDiv.style.width = '150px';
      userHandDiv.style.height = '150px';
    }
    
    if (!computerHandDiv.clientWidth || !computerHandDiv.clientHeight) {
      console.log('Computer hand div has invalid dimensions, setting explicit size');
      computerHandDiv.style.width = '150px';
      computerHandDiv.style.height = '150px';
    }
    
    console.log('User hand div dimensions after check:', userHandDiv.clientWidth, 'x', userHandDiv.clientHeight);
    console.log('Computer hand div dimensions after check:', computerHandDiv.clientWidth, 'x', computerHandDiv.clientHeight);
  }
  
  // Log elements to make sure they're found
  console.log('Rock button found:', rockBtn !== null);
  console.log('Paper button found:', paperBtn !== null);
  console.log('Scissors button found:', scissorsBtn !== null);
  console.log('Reset button found:', resetBtn !== null);
  console.log('User hand div found:', userHandDiv !== null);
  console.log('Computer hand div found:', computerHandDiv !== null);
  console.log('Status message found:', statusMessage !== null);
  
  // Always set up button click handlers regardless of Three.js
  rockBtn.addEventListener('click', function() {
    console.log('Rock button clicked');
    if (typeof THREE !== 'undefined' && threeDEnabled) {
      play('rock');
    } else {
      playFallback('rock');
    }
  });
  
  paperBtn.addEventListener('click', function() {
    console.log('Paper button clicked');
    if (typeof THREE !== 'undefined' && threeDEnabled) {
      play('paper');
    } else {
      playFallback('paper');
    }
  });
  
  scissorsBtn.addEventListener('click', function() {
    console.log('Scissors button clicked');
    if (typeof THREE !== 'undefined' && threeDEnabled) {
      play('scissors');
    } else {
      playFallback('scissors');
    }
  });
  
  resetBtn.addEventListener('click', function() {
    console.log('Reset button clicked');
    if (typeof THREE !== 'undefined' && threeDEnabled) {
      resetGame();
    } else {
      resetGameFallback();
    }
  });
  
  // Check if WebGL is supported and works
  function isWebGLAvailable() {
    console.log('Checking WebGL availability...');
    
    if (!window.WebGLRenderingContext) {
      console.error('WebGL not supported: WebGLRenderingContext not available');
      return false;
    }
    
    // Try to create a WebGL context
    const canvas = document.createElement('canvas');
    let context = null;
    
    try {
      // Try to get WebGL2 first
      context = canvas.getContext('webgl2');
      if (context) {
        console.log('WebGL2 is available');
        return true;
      }
      
      // Fall back to WebGL1
      context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (context) {
        console.log('WebGL1 is available');
        return true;
      }
      
      console.error('WebGL context creation failed');
      return false;
    } catch (e) {
      console.error('WebGL context error:', e.message);
      return false;
    } finally {
      // Clean up
      if (context && context.getExtension) {
        // Test if we can get basic extensions as an additional check
        try {
          const ext = context.getExtension('WEBGL_debug_renderer_info');
          if (ext) {
            const renderer = context.getParameter(ext.UNMASKED_RENDERER_WEBGL);
            console.log('WebGL renderer:', renderer);
          }
        } catch (e) {
          console.warn('Unable to get WebGL renderer info:', e.message);
        }
      }
    }
  }
  
  // Check for THREE.js and WebGL
  let threeDEnabled = false;
  
  if (!isWebGLAvailable()) {
    console.error('WebGL is not supported in this browser');
    resultText.textContent = 'Choose your move!';
    statusMessage.textContent = 'Running in simple mode (WebGL not supported)';
    setupFallbackGame();
  } else if (typeof THREE === 'undefined') {
    console.error('THREE.js library is not loaded!');
    resultText.textContent = 'Choose your move!';
    statusMessage.textContent = 'Running in simple mode (THREE.js not loaded)';
    setupFallbackGame();
  } else {
    console.log('THREE.js is loaded correctly');
    threeDEnabled = true;
    statusMessage.textContent = 'Running in 3D mode';
    
    try {
      console.log('Trying to initialize 3D mode...');
      init();
    } catch (error) {
      console.error('Failed to initialize 3D game:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      resultText.textContent = 'Choose your move!';
      statusMessage.textContent = 'Running in simple mode (3D initialization failed)';
      threeDEnabled = false;
      setupFallbackGame();
    }
  }
  
  // Function to set up a fallback game without Three.js
  function setupFallbackGame() {
    console.log('Setting up fallback game');
    
    // Replace 3D models with simple colored divs
    userHandDiv.innerHTML = '';
    computerHandDiv.innerHTML = '';
    
    userHandDiv.style.backgroundColor = '#f5d0a9';
    computerHandDiv.style.backgroundColor = '#f5d0a9';
    
    // Add text indicating current choice
    const userChoiceText = document.createElement('div');
    userChoiceText.style.textAlign = 'center';
    userChoiceText.style.fontWeight = 'bold';
    userChoiceText.style.marginTop = '10px';
    userChoiceText.style.color = '#2c3e50';
    userChoiceText.textContent = 'Rock';
    userHandDiv.appendChild(userChoiceText);
    
    const computerChoiceText = document.createElement('div');
    computerChoiceText.style.textAlign = 'center';
    computerChoiceText.style.fontWeight = 'bold';
    computerChoiceText.style.marginTop = '10px';
    computerChoiceText.style.color = '#2c3e50';
    computerChoiceText.textContent = 'Rock';
    computerHandDiv.appendChild(computerChoiceText);
  }
  
  // Fallback game play function
  function playFallback(userChoice) {
    console.log(`Playing fallback with choice: ${userChoice}`);
    
    // Get the text elements
    const userChoiceText = userHandDiv.querySelector('div');
    const computerChoiceText = computerHandDiv.querySelector('div');
    
    // Update user's choice display
    userChoiceText.textContent = userChoice.charAt(0).toUpperCase() + userChoice.slice(1);
    
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
      computerChoiceText.textContent = computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1);
      
      // Determine winner
      const result = getWinner(userChoice, computerChoice);
      console.log(`Result: ${result}`);
      updateScore(result);
      
      // Highlight winner
      if (result === 'user') {
        userHandDiv.parentElement.classList.add('winner');
      } else if (result === 'computer') {
        computerHandDiv.parentElement.classList.add('winner');
      }
    }, 500);
  }
  
  // Reset game in fallback mode
  function resetGameFallback() {
    console.log('Resetting fallback game');
    userScore = 0;
    computerScore = 0;
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    resultText.textContent = 'Choose your move!';
    
    // Get the text elements
    const userChoiceText = userHandDiv.querySelector('div');
    const computerChoiceText = computerHandDiv.querySelector('div');
    
    // Reset choices
    userChoiceText.textContent = 'Rock';
    computerChoiceText.textContent = 'Rock';
    
    // Remove winner class from both hands
    userHandDiv.parentElement.classList.remove('winner');
    computerHandDiv.parentElement.classList.remove('winner');
    console.log('Game reset complete');
  }
  
  // Determine the winner (used in both modes)
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
  
  // Update the score and display the result (used in both modes)
  function updateScore(result) {
    if (result === 'user') {
      userScore++;
      resultText.textContent = 'You win! 🎉';
    } else if (result === 'computer') {
      computerScore++;
      resultText.textContent = 'Computer wins! 😢';
    } else {
      resultText.textContent = "It's a draw! 🤝";
    }
    
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    console.log(`Score updated - User: ${userScore}, Computer: ${computerScore}`);
  }
  
  // The following is the 3D implementation which will only run if THREE is available
  
  // Three.js variables
  let userHandScene, userHandCamera, userHandRenderer;
  let computerHandScene, computerHandCamera, computerHandRenderer;
  let userHandModel, computerHandModel;
  let userCurrentGesture = 'rock';
  let computerCurrentGesture = 'rock';
  
  // Initialize the 3D game
  function init() {
    console.log('Initializing 3D game...');
    
    // Set up 3D environments
    try {
      console.log('Setting up user hand 3D environment...');
      setupUserHand();
      console.log('User hand setup successful');
    } catch (error) {
      console.error('Error in setupUserHand:', error.message);
      throw new Error('Failed to setup user hand: ' + error.message);
    }
    
    try {
      console.log('Setting up computer hand 3D environment...');
      setupComputerHand();
      console.log('Computer hand setup successful');
    } catch (error) {
      console.error('Error in setupComputerHand:', error.message);
      throw new Error('Failed to setup computer hand: ' + error.message);
    }
    
    // Start animation loop
    try {
      console.log('Starting animation loop...');
      animate();
      console.log('Animation loop started successfully');
    } catch (error) {
      console.error('Error in animation loop:', error.message);
      throw new Error('Failed to start animation: ' + error.message);
    }
    
    console.log('3D game initialized successfully');
  }
  
  // Set up user's hand 3D environment
  function setupUserHand() {
    console.log('Setting up user hand...');
    
    try {
      userHandScene = new THREE.Scene();
      console.log('User hand scene created');
    } catch (error) {
      console.error('Error creating user hand scene:', error);
      throw error;
    }
    
    try {
      userHandScene.background = new THREE.Color(0x2c3e50);
      console.log('User hand scene background set');
    } catch (error) {
      console.error('Error setting user hand scene background:', error);
      throw error;
    }
    
    try {
      // Double-check dimensions
      const width = userHandDiv.clientWidth || 150;
      const height = userHandDiv.clientHeight || 150;
      console.log('User hand div dimensions:', width, 'x', height);
      
      userHandCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      userHandCamera.position.z = 5;
      console.log('User hand camera created and positioned');
    } catch (error) {
      console.error('Error creating user hand camera:', error);
      throw error;
    }
    
    try {
      // Ensure the container has dimensions before creating renderer
      const width = userHandDiv.clientWidth || 150;
      const height = userHandDiv.clientHeight || 150;
      
      // Try with explicit renderer settings and catch-handling
      try {
        userHandRenderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false
        });
        console.log('User hand renderer created with default settings');
      } catch (error) {
        console.error('Error creating renderer with default settings, trying fallback:', error.message);
        userHandRenderer = new THREE.WebGLRenderer({ 
          antialias: false,
          alpha: true,
          precision: 'lowp'
        });
        console.log('User hand renderer created with fallback settings');
      }
      
      userHandRenderer.setSize(width, height);
      console.log('User hand renderer size set');
      
      // Clear any existing content
      while (userHandDiv.firstChild) {
        userHandDiv.removeChild(userHandDiv.firstChild);
      }
      
      userHandDiv.appendChild(userHandRenderer.domElement);
      console.log('User hand renderer added to DOM');
    } catch (error) {
      console.error('Error creating user hand renderer:', error);
      throw error;
    }
    
    // Add lighting
    try {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      userHandScene.add(ambientLight);
      console.log('User hand ambient light added');
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 1, 2);
      userHandScene.add(directionalLight);
      console.log('User hand directional light added');
    } catch (error) {
      console.error('Error adding user hand lighting:', error);
      throw error;
    }
    
    // Create hand model
    try {
      console.log('Creating user hand model...');
      createHandModel(userHandScene, 'rock').then(model => {
        userHandModel = model;
        console.log('User hand model created successfully');
      }).catch(error => {
        console.error('Error creating user hand model:', error);
      });
    } catch (error) {
      console.error('Error setting up user hand model creation:', error);
      throw error;
    }
    
    console.log('User hand setup complete');
  }
  
  // Set up computer's hand 3D environment
  function setupComputerHand() {
    console.log('Setting up computer hand...');
    
    try {
      computerHandScene = new THREE.Scene();
      console.log('Computer hand scene created');
    } catch (error) {
      console.error('Error creating computer hand scene:', error);
      throw error;
    }
    
    try {
      computerHandScene.background = new THREE.Color(0x2c3e50);
      console.log('Computer hand scene background set');
    } catch (error) {
      console.error('Error setting computer hand scene background:', error);
      throw error;
    }
    
    try {
      // Double-check dimensions
      const width = computerHandDiv.clientWidth || 150;
      const height = computerHandDiv.clientHeight || 150;
      console.log('Computer hand div dimensions:', width, 'x', height);
      
      computerHandCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      computerHandCamera.position.z = 5;
      console.log('Computer hand camera created and positioned');
    } catch (error) {
      console.error('Error creating computer hand camera:', error);
      throw error;
    }
    
    try {
      // Ensure the container has dimensions before creating renderer
      const width = computerHandDiv.clientWidth || 150;
      const height = computerHandDiv.clientHeight || 150;
      
      // Try with explicit renderer settings and catch-handling
      try {
        computerHandRenderer = new THREE.WebGLRenderer({ 
          antialias: true,
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false
        });
        console.log('Computer hand renderer created with default settings');
      } catch (error) {
        console.error('Error creating renderer with default settings, trying fallback:', error.message);
        computerHandRenderer = new THREE.WebGLRenderer({ 
          antialias: false,
          alpha: true,
          precision: 'lowp'
        });
        console.log('Computer hand renderer created with fallback settings');
      }
      
      computerHandRenderer.setSize(width, height);
      console.log('Computer hand renderer size set');
      
      // Clear any existing content
      while (computerHandDiv.firstChild) {
        computerHandDiv.removeChild(computerHandDiv.firstChild);
      }
      
      computerHandDiv.appendChild(computerHandRenderer.domElement);
      console.log('Computer hand renderer added to DOM');
    } catch (error) {
      console.error('Error creating computer hand renderer:', error);
      throw error;
    }
    
    // Add lighting
    try {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      computerHandScene.add(ambientLight);
      console.log('Computer hand ambient light added');
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 1, 2);
      computerHandScene.add(directionalLight);
      console.log('Computer hand directional light added');
    } catch (error) {
      console.error('Error adding computer hand lighting:', error);
      throw error;
    }
    
    // Create hand model (mirrored)
    try {
      console.log('Creating computer hand model...');
      createHandModel(computerHandScene, 'rock', true).then(model => {
        computerHandModel = model;
        console.log('Computer hand model created successfully');
      }).catch(error => {
        console.error('Error creating computer hand model:', error);
      });
    } catch (error) {
      console.error('Error setting up computer hand model creation:', error);
      throw error;
    }
    
    console.log('Computer hand setup complete');
  }
  
  // Create a 3D hand model based on the gesture
  async function createHandModel(scene, gesture, mirrored = false) {
    console.log(`Creating ${gesture} hand model (mirrored: ${mirrored})`);
    
    try {
      // Remove existing model if any
      if (scene.getObjectByName('hand')) {
        scene.remove(scene.getObjectByName('hand'));
        console.log('Removed existing hand model');
      }
      
      // Create a group to hold all parts of the hand
      const hand = new THREE.Group();
      hand.name = 'hand';
      console.log('Created hand group');
      
      // Materials
      const skinMaterial = new THREE.MeshPhongMaterial({
        color: 0xf5d0a9,
        shininess: 10
      });
      console.log('Created skin material');
      
      // Create palm
      const palmGeometry = new THREE.BoxGeometry(1.5, 1, 0.3);
      const palm = new THREE.Mesh(palmGeometry, skinMaterial);
      palm.position.y = -0.2;
      hand.add(palm);
      console.log('Created palm');
      
      // Create thumb
      const thumbGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 8);
      const thumb = new THREE.Mesh(thumbGeometry, skinMaterial);
      thumb.position.set(mirrored ? 0.8 : -0.8, 0, 0.1);
      thumb.rotation.z = Math.PI / 2;
      hand.add(thumb);
      console.log('Created thumb');
      
      // Finger geometries
      const fingerGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
      console.log('Created finger geometry');
      
      // Create fingers based on gesture
      if (gesture === 'rock') {
        // Clenched fist - fingers curled into palm
        console.log('Creating rock gesture fingers');
        for (let i = 0; i < 4; i++) {
          const finger = new THREE.Mesh(fingerGeometry, skinMaterial);
          finger.position.set((i - 1.5) * 0.3, 0.4, 0);
          finger.rotation.x = Math.PI / 2;
          hand.add(finger);
          console.log(`Created rock finger ${i+1}`);
        }
      } else if (gesture === 'paper') {
        // Open hand - fingers extended
        console.log('Creating paper gesture fingers');
        for (let i = 0; i < 4; i++) {
          const finger = new THREE.Mesh(fingerGeometry, skinMaterial);
          finger.position.set((i - 1.5) * 0.3, 0.8, 0);
          hand.add(finger);
          console.log(`Created paper finger ${i+1}`);
        }
      } else if (gesture === 'scissors') {
        // Scissors - two fingers extended, rest curled
        console.log('Creating scissors gesture fingers');
        for (let i = 0; i < 2; i++) {
          const finger = new THREE.Mesh(fingerGeometry, skinMaterial);
          finger.position.set((i - 0.5) * 0.3, 0.8, 0);
          hand.add(finger);
          console.log(`Created scissors extended finger ${i+1}`);
        }
        
        // Curled fingers
        for (let i = 2; i < 4; i++) {
          const finger = new THREE.Mesh(fingerGeometry, skinMaterial);
          finger.position.set((i - 1.5) * 0.3, 0.4, 0);
          finger.rotation.x = Math.PI / 2;
          hand.add(finger);
          console.log(`Created scissors curled finger ${i+1}`);
        }
      }
      
      // Flip the model if it's the computer's hand
      if (mirrored) {
        hand.rotation.y = Math.PI;
        console.log('Mirrored the hand model');
      }
      
      scene.add(hand);
      console.log(`${mirrored ? 'Computer' : 'User'} hand model added to scene`);
      return hand;
    } catch (error) {
      console.error(`Error creating ${mirrored ? 'computer' : 'user'} hand model:`, error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
  
  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    try {
      // Rotate the hand models slightly to give them life
      if (userHandModel) {
        userHandModel.rotation.y += 0.01;
      } else {
        // console.log('User hand model not yet available for animation');
      }
      
      if (computerHandModel) {
        computerHandModel.rotation.y += 0.01;
      } else {
        // console.log('Computer hand model not yet available for animation');
      }
      
      // Render the scenes
      if (userHandRenderer && userHandScene && userHandCamera) {
        try {
          userHandRenderer.render(userHandScene, userHandCamera);
        } catch (error) {
          console.error('Error rendering user hand scene:', error.message);
        }
      } else {
        console.warn('Cannot render user hand - missing renderer, scene, or camera');
        if (!userHandRenderer) console.warn('User hand renderer is missing');
        if (!userHandScene) console.warn('User hand scene is missing');
        if (!userHandCamera) console.warn('User hand camera is missing');
      }
      
      if (computerHandRenderer && computerHandScene && computerHandCamera) {
        try {
          computerHandRenderer.render(computerHandScene, computerHandCamera);
        } catch (error) {
          console.error('Error rendering computer hand scene:', error.message);
        }
      } else {
        console.warn('Cannot render computer hand - missing renderer, scene, or camera');
        if (!computerHandRenderer) console.warn('Computer hand renderer is missing');
        if (!computerHandScene) console.warn('Computer hand scene is missing');
        if (!computerHandCamera) console.warn('Computer hand camera is missing');
      }
    } catch (error) {
      console.error('Error in animation loop:', error.message);
      console.error('Animation error stack:', error.stack);
      // Don't throw here as it would stop the animation loop completely
    }
  }
  
  // Play the game with 3D
  function play(userChoice) {
    console.log(`Playing with choice: ${userChoice}`);
    userCurrentGesture = userChoice;
    
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
      computerCurrentGesture = computerChoice;
      console.log(`Computer chose: ${computerChoice}`);
      
      // Update 3D models
      createHandModel(userHandScene, userChoice).then(model => {
        userHandModel = model;
      }).catch(error => {
        console.error('Error updating user hand model:', error);
      });
      
      createHandModel(computerHandScene, computerChoice, true).then(model => {
        computerHandModel = model;
      }).catch(error => {
        console.error('Error updating computer hand model:', error);
      });
      
      // Determine winner
      const result = getWinner(userChoice, computerChoice);
      console.log(`Result: ${result}`);
      updateScore(result);
      
      // Highlight winner
      if (result === 'user') {
        userHandDiv.parentElement.classList.add('winner');
      } else if (result === 'computer') {
        computerHandDiv.parentElement.classList.add('winner');
      }
    }, 500);
  }
  
  // Reset the game with 3D
  function resetGame() {
    console.log('Resetting game');
    userScore = 0;
    computerScore = 0;
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    resultText.textContent = 'Choose your move!';
    
    // Reset to rock hands
    userCurrentGesture = 'rock';
    computerCurrentGesture = 'rock';
    
    createHandModel(userHandScene, 'rock').then(model => {
      userHandModel = model;
    }).catch(error => {
      console.error('Error resetting user hand model:', error);
    });
    
    createHandModel(computerHandScene, 'rock', true).then(model => {
      computerHandModel = model;
    }).catch(error => {
      console.error('Error resetting computer hand model:', error);
    });
    
    // Remove winner class from both hands
    userHandDiv.parentElement.classList.remove('winner');
    computerHandDiv.parentElement.classList.remove('winner');
    console.log('Game reset complete');
  }
}); 