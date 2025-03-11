/**
 * Crab Game - A simple game with SP1 ZK Proof integration
 */

// Global variables
let wasmLoaded = false;
let gameManager = null;
let animationFrameId;
let lastTimestamp = 0;
let soundEnabled = true;
let proofPanelVisible = false;

// DOM elements
const mainMenuScreen = document.getElementById('main-menu');
const howToPlayScreen = document.getElementById('how-to-play');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over');
const initialLoadingScreen = document.getElementById('initial-loading-screen');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Scoreboard elements
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const starsElement = document.getElementById('game-stars');
const finalScoreElement = document.getElementById('final-score');
const finalStatsElement = document.getElementById('final-stats');

// Buttons
const toggleSoundBtn = document.getElementById('toggle-sound-btn');
const pauseGameBtn = document.getElementById('pause-game-btn');
const pauseMenu = document.getElementById('pause-menu');
const resumeGameBtn = document.getElementById('resume-game-btn');
const restartPauseBtn = document.getElementById('restart-pause-btn');
const homePauseBtn = document.getElementById('home-pause-btn');
const startGameBtn = document.getElementById('start-game-btn');
const howToPlayBtn = document.getElementById('how-to-play-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const homeBtn = document.getElementById('home-btn');
const shareBtn = document.getElementById('share-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const proveBtn = document.getElementById('prove-btn');

// Images
const crabImg = document.getElementById('crab-img');
const crabShieldImg = document.getElementById('crab-shield-img');
const crabDoubleImg = document.getElementById('crab-double-img');
const yellowStarImg = document.getElementById('yellow-star-img');
const pinkStarImg = document.getElementById('pink-star-img');
const purpleStarImg = document.getElementById('purple-star-img');
const rockImg = document.getElementById('rock-img');
const shieldImg = document.getElementById('shield-img');
const doublePointsImg = document.getElementById('double-points-img');
const extraLifeImg = document.getElementById('extra-life-img');
const slowdownImg = document.getElementById('slowdown-img');
const bgMainImg = document.getElementById('bg-main-img');
const bgGameImg = document.getElementById('bg-game-img');
const bgGameoverImg = document.getElementById('bg-gameover-img');

// Sounds
const starSound = document.getElementById('star-sound');
const rockSound = document.getElementById('rock-sound');
const buttonSound = document.getElementById('button-sound');
const backgroundMusic = document.getElementById('background-music');
const shieldHitSound = document.getElementById('shield-hit-sound');

/**
 * Updates loading progress bar
 * @param {number} percent - Progress percentage
 */
function updateLoadingProgress(percent) {
  const loadingBar = document.getElementById('loading-progress');
  if (loadingBar) {
    loadingBar.style.width = `${percent}%`;
  }
}

/**
 * Loads WASM module
 * @returns {Promise<boolean>} Success status
 */
async function loadWasmModule() {
  updateLoadingProgress(20);
  
  try {
    // Load WASM module from the correct path
    // NOTE: Using '../pkg/crab_game.js' to go up one level from www to find pkg
    const wasm = await import('../pkg/crab_game.js');
    window.wasm = wasm;
    console.log("WASM loaded successfully!");
    wasmLoaded = true;
    updateLoadingProgress(60);
    return true;
  } catch (error) {
    console.error("Error loading WASM module:", error);
    updateLoadingProgress(40);
    return false;
  }
}

/**
 * Toggle pause menu visibility
 * @param {boolean} show - Whether to show or hide
 */
function togglePauseMenu(show) {
  if (show) {
    pauseMenu.classList.remove('hidden');
    if (gameManager) {
      gameManager.stop();
    }
  } else {
    pauseMenu.classList.add('hidden');
    if (gameManager) {
      gameManager.start();
    }
  }
}

/**
 * Check if all required images are loaded
 * @returns {boolean} Whether all images are loaded
 */
function areImagesLoaded() {
  const images = [
    crabImg, crabShieldImg, crabDoubleImg, 
    yellowStarImg, pinkStarImg, purpleStarImg, 
    rockImg, shieldImg, doublePointsImg, extraLifeImg, slowdownImg,
    bgMainImg, bgGameImg, bgGameoverImg
  ];
  
  return images.every(img => img && img.complete);
}

/**
 * Set up canvas dimensions
 */
function setupCanvas() {
  const container = document.querySelector('.container');
  const gameInfo = document.querySelector('.game-info');
  
  // Calculate canvas height (subtract game info area)
  const gameInfoHeight = gameInfo.offsetHeight;
  const canvasHeight = container.offsetHeight - gameInfoHeight - 20; // extra space for padding
  
  canvas.width = container.offsetWidth - 40; // space for padding
  canvas.height = canvasHeight;
  
  // Set background image
  if (bgGameImg && bgGameImg.complete) {
    document.getElementById('game-screen').style.backgroundImage = `url(${bgGameImg.src})`;
  }
}

/**
 * Show selected screen, hide others
 * @param {HTMLElement} screen - Screen element to show
 */
function showScreen(screen) {
  console.log(`Showing screen: ${screen.id}`);
  
  if (!screen) {
    console.error("Invalid screen parameter!");
    return;
  }
  
  try {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });
    
    // Show selected screen
    screen.classList.add('active');
    screen.style.display = 'flex';
    
    // Play sound if enabled and loaded
    if (buttonSound && buttonSound.readyState >= 2 && soundEnabled) {
      try {
        buttonSound.currentTime = 0;
        buttonSound.play().catch(error => console.log("Could not play sound:", error));
      } catch (e) {
        console.warn("Error playing sound:", e);
      }
    }
    
    // Set background for each screen
    if (screen.id === 'main-menu' || screen.id === 'how-to-play') {
      if (bgMainImg && bgMainImg.complete) {
        screen.style.backgroundImage = `url(${bgMainImg.src})`;
      }
    }
    else if (screen.id === 'game-screen') {
      if (bgGameImg && bgGameImg.complete) {
        screen.style.backgroundImage = `url(${bgGameImg.src})`;
      }
    }
    else if (screen.id === 'game-over') {
      if (bgGameoverImg && bgGameoverImg.complete) {
        screen.style.backgroundImage = `url(${bgGameoverImg.src})`;
      }
      screen.style.zIndex = 100;
    }
  } catch (error) {
    console.error("Error showing screen:", error);
  }
}

/**
 * Navigate to main menu
 */
function showMainMenu() {
  showScreen(mainMenuScreen);
}

/**
 * Toggle sound on/off
 */
function toggleSound() {
  soundEnabled = !soundEnabled;
  
  if (soundEnabled) {
    toggleSoundBtn.textContent = '🔊';
    backgroundMusic.play().catch(error => {
      console.log("Could not play background music:", error);
    });
    console.log("Sounds enabled");
  } else {
    toggleSoundBtn.textContent = '🔇';
    backgroundMusic.pause();
    console.log("Sounds disabled");
  }
  
  // Play button sound
  if (soundEnabled && buttonSound) {
    buttonSound.currentTime = 0;
    buttonSound.play().catch(error => {
      console.log("Could not play button sound:", error);
    });
  }
  
  // Notify GameManager
  if (gameManager && typeof gameManager.set_sound_enabled === 'function') {
    gameManager.set_sound_enabled(soundEnabled);
  }
}

/**
 * Start the game
 */
function startGame() {
  // Check if WASM is loaded
  if (!wasmLoaded) {
    console.error("WASM module not loaded yet!");
    alert("Game module not loaded yet, please wait a moment and try again.");
    return;
  }

  // Hide pause menu
  togglePauseMenu(false);
  
  // Show game screen
  showScreen(gameScreen);
  setupCanvas();
  
  // Clear animation loop
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // Reset timestamp
  lastTimestamp = 0;
  
  try {
    if (gameManager) {
      gameManager.restart();
    } else {
      console.log("Creating GameManager...");
      
      // Create GameManager
      gameManager = window.wasm.GameManager.new(
        canvas,
        crabImg,
        crabShieldImg,
        crabDoubleImg,
        yellowStarImg,
        pinkStarImg,
        purpleStarImg,
        rockImg,
        shieldImg,
        doublePointsImg,
        extraLifeImg,
        slowdownImg,
        starSound,
        rockSound,
        shieldHitSound
      );
    }
    
    gameManager.start();
    
    // Start music
    if (soundEnabled) {
      backgroundMusic.currentTime = 0;
      backgroundMusic.play().catch(error => {
        console.log("Could not play background music:", error);
      });
    }
    
    // Start game loop
    animationFrameId = requestAnimationFrame(gameLoop);
  } catch (error) {
    console.error("Error starting game:", error);
    alert("An error occurred while starting the game: " + error.message);
  }
}

/**
 * Stop the game
 */
function stopGame() {
  if (gameManager) {
    gameManager.stop();
  }
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  backgroundMusic.pause();
}

/**
 * Game loop function
 * @param {number} timestamp - Current time
 */
function gameLoop(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  
  const deltaTime = (timestamp - lastTimestamp) / 1000; // in seconds
  lastTimestamp = timestamp;
  
  // If pause menu is open, just refresh the animation frame
  if (!pauseMenu.classList.contains('hidden')) {
    animationFrameId = requestAnimationFrame(gameLoop);
    return;
  }
  
  // Update game state
  if (gameManager) {
    try {
      const gameOver = gameManager.update(deltaTime);
      
      // Update score and lives
      const score = gameManager.get_score();
      const lives = gameManager.get_lives();
      let visualScore = score;
  
      // Use visual_score method if available
      try {
        if (typeof gameManager.get_visual_score === 'function') {
          visualScore = gameManager.get_visual_score();
        }
      } catch (e) {
        console.warn("Could not get visual score:", e);
      }
  
      // Get star counts
      const yellowStars = gameManager.get_yellow_stars_count();
      const pinkStars = gameManager.get_pink_stars_count();
      const purpleStars = gameManager.get_purple_stars_count();
      
      // Update UI
      scoreElement.textContent = `Score: ${visualScore}`;
      livesElement.textContent = `Lives: ${lives}`;
      starsElement.textContent = `Stars: 🟡${yellowStars} 🟠${pinkStars} 🟣${purpleStars}`;
      
      // Check if game is over
      if (gameOver || gameManager.is_game_over() || gameManager.get_game_state() === 3) {
        console.log("Game over detected!");
        endGame();
        return;
      }
    } catch (error) {
      console.error("Error in game loop:", error);
      stopGame();
      alert("An error occurred during the game: " + error.message);
      return;
    }
  }
  
  // Schedule next frame
  animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * End the game and show game over screen
 */
function endGame() {
  console.log("Game ended");
  
  // Stop animation loop
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // Play sound effect
  if (soundEnabled && rockSound) {
    try {
      rockSound.currentTime = 0;
      rockSound.play().catch(error => console.warn("Could not play sound:", error));
    } catch (e) {
      console.warn("Error playing sound:", e);
    }
  }
  
  // Update UI with game results
  if (gameManager) {
    try {
      gameManager.stop();
      
      // Get game results
      const score = gameManager.get_score();
      const yellowStars = gameManager.get_yellow_stars_count();
      const pinkStars = gameManager.get_pink_stars_count();
      const purpleStars = gameManager.get_purple_stars_count();
      
      // Hide all screens
      document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
      });
      
      // Update results screen
      finalScoreElement.textContent = `Your Score: ${score}`;
      finalStatsElement.textContent = `Stars Collected: 🟡${yellowStars} 🟠${pinkStars} 🟣${purpleStars}`;
      
      // Set background
      gameOverScreen.style.backgroundImage = `url(${bgGameoverImg.src})`;
      
      // Show game over screen
      gameOverScreen.style.display = 'flex';
      gameOverScreen.style.zIndex = '100';
    } catch (error) {
      console.error("Error ending game:", error);
      alert("An error occurred while ending the game: " + error.message);
    }
  }
}

/**
 * Go to main menu
 */
function goToMainMenu() {
  stopGame();
  window.hideProofPanel();
  console.log("Returning to main menu...");
  showScreen(mainMenuScreen);
}

/**
 * Restart the game
 */
function restartGame() {
  console.log("Restarting game...");
  window.hideProofPanel();
  
  // Clear animation loop
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  
  // Reset timestamp
  lastTimestamp = 0;
  
  // Show game screen
  showScreen(gameScreen);
  
  // Setup canvas
  setupCanvas();
  
  // Reset game object
  try {
    if (gameManager) {
      gameManager.restart();
    } else {
      gameManager = window.wasm.GameManager.new(
        canvas,
        crabImg,
        crabShieldImg,
        crabDoubleImg,
        yellowStarImg,
        pinkStarImg,
        purpleStarImg,
        rockImg,
        shieldImg,
        doublePointsImg,
        extraLifeImg,
        slowdownImg,
        starSound,
        rockSound,
        shieldHitSound
      );
    }
    
    // Start the game
    gameManager.start();
    
    // Start music
    if (soundEnabled) {
      backgroundMusic.currentTime = 0;
      backgroundMusic.play().catch(error => {
        console.log("Could not play background music:", error);
      });
    }
    
    // Start a new game loop
    animationFrameId = requestAnimationFrame(gameLoop);
  } catch (error) {
    console.error("Error restarting game:", error);
    alert("An error occurred while restarting the game: " + error.message);
  }
}

/**
 * Share score on Twitter
 */
function shareOnTwitter() {
  if (!gameManager) return;
  
  try {
    const score = gameManager.get_score();
    const yellowStars = gameManager.get_yellow_stars_count();
    const pinkStars = gameManager.get_pink_stars_count();
    const purpleStars = gameManager.get_purple_stars_count();
    
    const text = `I scored ${score} points in Crab Game! Collected 🟡${yellowStars} 🟠${pinkStars} 🟣${purpleStars} stars!`;
    const url = window.location.href;
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  } catch (error) {
    console.error("Error sharing:", error);
    alert("An error occurred while sharing: " + error.message);
  }
}

/**
 * Load all game resources
 * @returns {Promise<boolean>} Success status
 */
async function loadAllResources() {
  // Update loading progress
  updateLoadingProgress(10);
  
  // Load WASM module
  const wasmSuccess = await loadWasmModule();
  
  if (!wasmSuccess) {
    // WASM loading failed
    console.error("WASM not available or failed to load!");
    updateLoadingProgress(40);
    
    // Show error message
    const loadingText = document.querySelector('#initial-loading-screen h1');
    if (loadingText) {
      loadingText.textContent = "Error Loading Game!";
      loadingText.style.color = "#ff3333";
    }
    
    // Add reload button
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
      const reloadButton = document.createElement('button');
      reloadButton.textContent = "Reload Game";
      reloadButton.className = "game-button";
      reloadButton.style.marginTop = "20px";
      reloadButton.onclick = () => window.location.reload();
      loadingContainer.appendChild(reloadButton);
    }
    
    return false;
  }
  
  // Check if images are loaded
  if (areImagesLoaded()) {
    updateLoadingProgress(100);
    console.log("All images loaded!");
    
    // Show main menu
    setTimeout(() => {
      showMainMenu();
    }, 500);
    
    return true;
  } else {
    // Some images still loading
    console.warn("Some images still loading...");
    updateLoadingProgress(80);
    
    // Wait and check again
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Final check and proceed anyway
    updateLoadingProgress(100);
    setTimeout(() => {
      showMainMenu();
    }, 500);
    
    return true;
  }
}

// SP1 Proof Panel functions
window.createProofPanel = function() {
  console.log("Creating proof panel...");
  
  // Clear old panel if exists
  const oldPanel = document.getElementById('proof-panel');
  if (oldPanel) oldPanel.remove();
  
  // Create new panel
  const panel = document.createElement('div');
  panel.id = 'proof-panel';
  panel.style.position = 'fixed';
  panel.style.top = '50%';
  panel.style.left = '50%';
  panel.style.transform = 'translate(-50%, -50%)';
  panel.style.width = '80%';
  panel.style.maxWidth = '800px';
  panel.style.height = '400px';
  panel.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  panel.style.color = '#fe11c5';
  panel.style.padding = '20px';
  panel.style.borderRadius = '10px';
  panel.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
  panel.style.zIndex = '1000';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  
  // Panel header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.paddingBottom = '10px';
  header.style.borderBottom = '1px solid #2ecc71';
  header.style.marginBottom = '10px';
  
  const title = document.createElement('div');
  title.textContent = 'SP1 Zero-Knowledge Proof Terminal';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '16px';
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✖';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.color = '#fe11c5';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontSize = '16px';
  closeBtn.onclick = window.hideProofPanel;
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Log area
  const logArea = document.createElement('div');
  logArea.id = 'proof-log';
  logArea.style.flexGrow = '1';
  logArea.style.overflowY = 'auto';
  logArea.style.whiteSpace = 'pre-wrap';
  logArea.style.fontSize = '14px';
  logArea.style.lineHeight = '1.4';
  logArea.style.padding = '5px';
  logArea.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  logArea.style.borderRadius = '4px';
  
  // Assemble panel
  panel.appendChild(header);
  panel.appendChild(logArea);
  
  // Add panel to page
  document.body.appendChild(panel);
  
  console.log("Proof panel created!");
  return panel;
};

window.logToProofPanel = function(message) {
  console.log("Log message:", message);
  const logArea = document.getElementById('proof-log');
  if (!logArea) {
      console.error("proof-log element not found!");
      return;
  }
  
  // Add timestamp
  const date = new Date();
  const timestamp = `[${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}] `;
  
  // Create new line
  const line = document.createElement('div');
  line.textContent = timestamp + message;
  
  // Add line to log area
  logArea.appendChild(line);
  
  // Auto-scroll
  logArea.scrollTop = logArea.scrollHeight;
};

window.showProofPanel = function() {
  console.log("showProofPanel called");
  
  // GameManager check
  if (typeof gameManager === "undefined" || gameManager === null) {
      console.error("gameManager not defined!");
      alert("Game not started or GameManager not found!");
      return;
  }
  
  try {
      // Create proof panel
      window.createProofPanel();
      
      // Collect game data
      const score = gameManager.get_score();
      const yellowStars = gameManager.get_yellow_stars_count();
      const pinkStars = gameManager.get_pink_stars_count();
      const purpleStars = gameManager.get_purple_stars_count();
      const gameTime = gameManager.get_game_time();
      const lives = gameManager.get_lives();
      
      // Show game data
      console.log("Game Data:", {
          score, yellowStars, pinkStars, purpleStars, gameTime, lives
      });
      
      // Show log in proof panel
      window.logToProofPanel("Starting SP1 Zero-Knowledge Proof system...");
      window.logToProofPanel(`Game Data: Score=${score}, Yellow=${yellowStars}, Pink=${pinkStars}, Purple=${purpleStars}, Time=${gameTime}s, Lives=${lives}`);
      
      // Send request to backend
      const gameData = {
          score,
          yellowStars,
          pinkStars,
          purpleStars,
          gameTime,
          lives
      };
      
      // Call SP1 Bridge
      window.generateSP1Proof(gameData)
          .then(result => {
              console.log("Proof generation successful:", result);
          })
          .catch(error => {
              console.error("Proof generation error:", error);
              window.logToProofPanel("Proof generation error: " + error.message);
          });
  } catch (error) {
      console.error("Error showing proof panel:", error);
      alert("An error occurred while showing proof panel: " + error.message);
  }
};

// Define hideProofPanel as global function
window.hideProofPanel = function() {
  const panel = document.getElementById('proof-panel');
  if (panel) panel.remove();
  proofPanelVisible = false;
  console.log("Proof panel hidden");
};

// Event listeners
startGameBtn.addEventListener('click', startGame);
howToPlayBtn.addEventListener('click', () => showScreen(howToPlayScreen));
backToMenuBtn.addEventListener('click', () => showScreen(mainMenuScreen));
homeBtn.addEventListener('click', goToMainMenu);
shareBtn.addEventListener('click', shareOnTwitter);
playAgainBtn.addEventListener('click', restartGame);
toggleSoundBtn.addEventListener('click', toggleSound);
pauseGameBtn.addEventListener('click', () => {
  if (soundEnabled && buttonSound) buttonSound.play().catch(e => {});
  togglePauseMenu(true);
});
resumeGameBtn.addEventListener('click', () => {
  if (soundEnabled && buttonSound) buttonSound.play().catch(e => {});
  togglePauseMenu(false);
  
  if (!animationFrameId) {
    lastTimestamp = 0;
    animationFrameId = requestAnimationFrame(gameLoop);
  }
});
restartPauseBtn.addEventListener('click', () => {
  if (soundEnabled && buttonSound) buttonSound.play().catch(e => {});
  togglePauseMenu(false);
  restartGame();
});
homePauseBtn.addEventListener('click', () => {
  if (soundEnabled && buttonSound) buttonSound.play().catch(e => {});
  togglePauseMenu(false);
  goToMainMenu();
});
proveBtn.addEventListener('click', function() {
  console.log("Prove button clicked");
  
  if (typeof window.showProofPanel === 'function') {
    window.showProofPanel();
  } else {
    console.error("showProofPanel function not found!");
    alert("Proof panel function could not be loaded. Please refresh the page.");
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  if (gameScreen.classList.contains('active')) {
    setupCanvas();
  }
});

// Handle keyboard events
window.addEventListener('keydown', (event) => {
  if (gameScreen.classList.contains('active') && gameManager) {
    try {
      // ESC key toggles pause menu
      if (event.key === "Escape") {
        togglePauseMenu(!pauseMenu.classList.contains('hidden'));
        return;
      }
      
      // If pause menu is open, don't process keyboard inputs
      if (!pauseMenu.classList.contains('hidden')) {
        return;
      }
      
      gameManager.handle_key_press(event);
    } catch (error) {
      console.error("Error handling keyboard event:", error);
    }
  }
});

// Game initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing game...");
  
  // Show loading screen
  if (initialLoadingScreen) {
    initialLoadingScreen.style.display = 'flex';
    initialLoadingScreen.classList.add('active');
  }
  
  // Load resources after a short delay
  setTimeout(() => {
    loadAllResources();
  }, 1000);
});

// Notify that SP1 Proof panel functions are defined
console.log("SP1 Proof panel functions defined");