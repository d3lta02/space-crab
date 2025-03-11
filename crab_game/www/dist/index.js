/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("/**\n * Crab Game - A simple game with SP1 ZK Proof integration\n */\n\n// Global variables\nlet wasmLoaded = false;\nlet gameManager = null;\nlet animationFrameId;\nlet lastTimestamp = 0;\nlet soundEnabled = true;\nlet proofPanelVisible = false;\n\n// DOM elements\nconst mainMenuScreen = document.getElementById('main-menu');\nconst howToPlayScreen = document.getElementById('how-to-play');\nconst gameScreen = document.getElementById('game-screen');\nconst gameOverScreen = document.getElementById('game-over');\nconst initialLoadingScreen = document.getElementById('initial-loading-screen');\nconst canvas = document.getElementById('game-canvas');\nconst ctx = canvas.getContext('2d');\n\n// Scoreboard elements\nconst scoreElement = document.getElementById('score');\nconst livesElement = document.getElementById('lives');\nconst starsElement = document.getElementById('game-stars');\nconst finalScoreElement = document.getElementById('final-score');\nconst finalStatsElement = document.getElementById('final-stats');\n\n// Buttons\nconst toggleSoundBtn = document.getElementById('toggle-sound-btn');\nconst pauseGameBtn = document.getElementById('pause-game-btn');\nconst pauseMenu = document.getElementById('pause-menu');\nconst resumeGameBtn = document.getElementById('resume-game-btn');\nconst restartPauseBtn = document.getElementById('restart-pause-btn');\nconst homePauseBtn = document.getElementById('home-pause-btn');\nconst startGameBtn = document.getElementById('start-game-btn');\nconst howToPlayBtn = document.getElementById('how-to-play-btn');\nconst backToMenuBtn = document.getElementById('back-to-menu-btn');\nconst homeBtn = document.getElementById('home-btn');\nconst shareBtn = document.getElementById('share-btn');\nconst playAgainBtn = document.getElementById('play-again-btn');\nconst proveBtn = document.getElementById('prove-btn');\n\n// Images\nconst crabImg = document.getElementById('crab-img');\nconst crabShieldImg = document.getElementById('crab-shield-img');\nconst crabDoubleImg = document.getElementById('crab-double-img');\nconst yellowStarImg = document.getElementById('yellow-star-img');\nconst pinkStarImg = document.getElementById('pink-star-img');\nconst purpleStarImg = document.getElementById('purple-star-img');\nconst rockImg = document.getElementById('rock-img');\nconst shieldImg = document.getElementById('shield-img');\nconst doublePointsImg = document.getElementById('double-points-img');\nconst extraLifeImg = document.getElementById('extra-life-img');\nconst slowdownImg = document.getElementById('slowdown-img');\nconst bgMainImg = document.getElementById('bg-main-img');\nconst bgGameImg = document.getElementById('bg-game-img');\nconst bgGameoverImg = document.getElementById('bg-gameover-img');\n\n// Sounds\nconst starSound = document.getElementById('star-sound');\nconst rockSound = document.getElementById('rock-sound');\nconst buttonSound = document.getElementById('button-sound');\nconst backgroundMusic = document.getElementById('background-music');\nconst shieldHitSound = document.getElementById('shield-hit-sound');\n\n/**\n * Updates loading progress bar\n * @param {number} percent - Progress percentage\n */\nfunction updateLoadingProgress(percent) {\n  const loadingBar = document.getElementById('loading-progress');\n  if (loadingBar) {\n    loadingBar.style.width = `${percent}%`;\n  }\n}\n\n/**\n * Loads WASM module\n * @returns {Promise<boolean>} Success status\n */\nasync function loadWasmModule() {\n  updateLoadingProgress(20);\n  \n  try {\n    // Load WASM module from the correct path\n    // NOTE: Using '../pkg/crab_game.js' to go up one level from www to find pkg\n    const wasm = await __webpack_require__.e(/*! import() */ \"pkg_crab_game_js\").then(__webpack_require__.bind(__webpack_require__, /*! ../pkg/crab_game.js */ \"../pkg/crab_game.js\"));\n    window.wasm = wasm;\n    console.log(\"WASM loaded successfully!\");\n    wasmLoaded = true;\n    updateLoadingProgress(60);\n    return true;\n  } catch (error) {\n    console.error(\"Error loading WASM module:\", error);\n    updateLoadingProgress(40);\n    return false;\n  }\n}\n\n/**\n * Toggle pause menu visibility\n * @param {boolean} show - Whether to show or hide\n */\nfunction togglePauseMenu(show) {\n  if (show) {\n    pauseMenu.classList.remove('hidden');\n    if (gameManager) {\n      gameManager.stop();\n    }\n  } else {\n    pauseMenu.classList.add('hidden');\n    if (gameManager) {\n      gameManager.start();\n    }\n  }\n}\n\n/**\n * Check if all required images are loaded\n * @returns {boolean} Whether all images are loaded\n */\nfunction areImagesLoaded() {\n  const images = [\n    crabImg, crabShieldImg, crabDoubleImg, \n    yellowStarImg, pinkStarImg, purpleStarImg, \n    rockImg, shieldImg, doublePointsImg, extraLifeImg, slowdownImg,\n    bgMainImg, bgGameImg, bgGameoverImg\n  ];\n  \n  return images.every(img => img && img.complete);\n}\n\n/**\n * Set up canvas dimensions\n */\nfunction setupCanvas() {\n  const container = document.querySelector('.container');\n  const gameInfo = document.querySelector('.game-info');\n  \n  // Calculate canvas height (subtract game info area)\n  const gameInfoHeight = gameInfo.offsetHeight;\n  const canvasHeight = container.offsetHeight - gameInfoHeight - 20; // extra space for padding\n  \n  canvas.width = container.offsetWidth - 40; // space for padding\n  canvas.height = canvasHeight;\n  \n  // Set background image\n  if (bgGameImg && bgGameImg.complete) {\n    document.getElementById('game-screen').style.backgroundImage = `url(${bgGameImg.src})`;\n  }\n}\n\n/**\n * Show selected screen, hide others\n * @param {HTMLElement} screen - Screen element to show\n */\nfunction showScreen(screen) {\n  console.log(`Showing screen: ${screen.id}`);\n  \n  if (!screen) {\n    console.error(\"Invalid screen parameter!\");\n    return;\n  }\n  \n  try {\n    // Hide all screens\n    document.querySelectorAll('.screen').forEach(s => {\n      s.classList.remove('active');\n      s.style.display = 'none';\n    });\n    \n    // Show selected screen\n    screen.classList.add('active');\n    screen.style.display = 'flex';\n    \n    // Play sound if enabled and loaded\n    if (buttonSound && buttonSound.readyState >= 2 && soundEnabled) {\n      try {\n        buttonSound.currentTime = 0;\n        buttonSound.play().catch(error => console.log(\"Could not play sound:\", error));\n      } catch (e) {\n        console.warn(\"Error playing sound:\", e);\n      }\n    }\n    \n    // Set background for each screen\n    if (screen.id === 'main-menu' || screen.id === 'how-to-play') {\n      if (bgMainImg && bgMainImg.complete) {\n        screen.style.backgroundImage = `url(${bgMainImg.src})`;\n      }\n    }\n    else if (screen.id === 'game-screen') {\n      if (bgGameImg && bgGameImg.complete) {\n        screen.style.backgroundImage = `url(${bgGameImg.src})`;\n      }\n    }\n    else if (screen.id === 'game-over') {\n      if (bgGameoverImg && bgGameoverImg.complete) {\n        screen.style.backgroundImage = `url(${bgGameoverImg.src})`;\n      }\n      screen.style.zIndex = 100;\n    }\n  } catch (error) {\n    console.error(\"Error showing screen:\", error);\n  }\n}\n\n/**\n * Navigate to main menu\n */\nfunction showMainMenu() {\n  showScreen(mainMenuScreen);\n}\n\n/**\n * Toggle sound on/off\n */\nfunction toggleSound() {\n  soundEnabled = !soundEnabled;\n  \n  if (soundEnabled) {\n    toggleSoundBtn.textContent = '🔊';\n    backgroundMusic.play().catch(error => {\n      console.log(\"Could not play background music:\", error);\n    });\n    console.log(\"Sounds enabled\");\n  } else {\n    toggleSoundBtn.textContent = '🔇';\n    backgroundMusic.pause();\n    console.log(\"Sounds disabled\");\n  }\n  \n  // Play button sound\n  if (soundEnabled && buttonSound) {\n    buttonSound.currentTime = 0;\n    buttonSound.play().catch(error => {\n      console.log(\"Could not play button sound:\", error);\n    });\n  }\n  \n  // Notify GameManager\n  if (gameManager && typeof gameManager.set_sound_enabled === 'function') {\n    gameManager.set_sound_enabled(soundEnabled);\n  }\n}\n\n/**\n * Start the game\n */\nfunction startGame() {\n  // Check if WASM is loaded\n  if (!wasmLoaded) {\n    console.error(\"WASM module not loaded yet!\");\n    alert(\"Game module not loaded yet, please wait a moment and try again.\");\n    return;\n  }\n\n  // Hide pause menu\n  togglePauseMenu(false);\n  \n  // Show game screen\n  showScreen(gameScreen);\n  setupCanvas();\n  \n  // Clear animation loop\n  if (animationFrameId) {\n    cancelAnimationFrame(animationFrameId);\n    animationFrameId = null;\n  }\n  \n  // Reset timestamp\n  lastTimestamp = 0;\n  \n  try {\n    if (gameManager) {\n      gameManager.restart();\n    } else {\n      console.log(\"Creating GameManager...\");\n      \n      // Create GameManager\n      gameManager = window.wasm.GameManager.new(\n        canvas,\n        crabImg,\n        crabShieldImg,\n        crabDoubleImg,\n        yellowStarImg,\n        pinkStarImg,\n        purpleStarImg,\n        rockImg,\n        shieldImg,\n        doublePointsImg,\n        extraLifeImg,\n        slowdownImg,\n        starSound,\n        rockSound,\n        shieldHitSound\n      );\n    }\n    \n    gameManager.start();\n    \n    // Start music\n    if (soundEnabled) {\n      backgroundMusic.currentTime = 0;\n      backgroundMusic.play().catch(error => {\n        console.log(\"Could not play background music:\", error);\n      });\n    }\n    \n    // Start game loop\n    animationFrameId = requestAnimationFrame(gameLoop);\n  } catch (error) {\n    console.error(\"Error starting game:\", error);\n    alert(\"An error occurred while starting the game: \" + error.message);\n  }\n}\n\n/**\n * Stop the game\n */\nfunction stopGame() {\n  if (gameManager) {\n    gameManager.stop();\n  }\n  \n  if (animationFrameId) {\n    cancelAnimationFrame(animationFrameId);\n    animationFrameId = null;\n  }\n  \n  backgroundMusic.pause();\n}\n\n/**\n * Game loop function\n * @param {number} timestamp - Current time\n */\nfunction gameLoop(timestamp) {\n  if (!lastTimestamp) lastTimestamp = timestamp;\n  \n  const deltaTime = (timestamp - lastTimestamp) / 1000; // in seconds\n  lastTimestamp = timestamp;\n  \n  // If pause menu is open, just refresh the animation frame\n  if (!pauseMenu.classList.contains('hidden')) {\n    animationFrameId = requestAnimationFrame(gameLoop);\n    return;\n  }\n  \n  // Update game state\n  if (gameManager) {\n    try {\n      const gameOver = gameManager.update(deltaTime);\n      \n      // Update score and lives\n      const score = gameManager.get_score();\n      const lives = gameManager.get_lives();\n      let visualScore = score;\n  \n      // Use visual_score method if available\n      try {\n        if (typeof gameManager.get_visual_score === 'function') {\n          visualScore = gameManager.get_visual_score();\n        }\n      } catch (e) {\n        console.warn(\"Could not get visual score:\", e);\n      }\n  \n      // Get star counts\n      const yellowStars = gameManager.get_yellow_stars_count();\n      const pinkStars = gameManager.get_pink_stars_count();\n      const purpleStars = gameManager.get_purple_stars_count();\n      \n      // Update UI\n      scoreElement.textContent = `Score: ${visualScore}`;\n      livesElement.textContent = `Lives: ${lives}`;\n      starsElement.textContent = `Stars: 🟡${yellowStars} 🟠${pinkStars} 🟣${purpleStars}`;\n      \n      // Check if game is over\n      if (gameOver || gameManager.is_game_over() || gameManager.get_game_state() === 3) {\n        console.log(\"Game over detected!\");\n        endGame();\n        return;\n      }\n    } catch (error) {\n      console.error(\"Error in game loop:\", error);\n      stopGame();\n      alert(\"An error occurred during the game: \" + error.message);\n      return;\n    }\n  }\n  \n  // Schedule next frame\n  animationFrameId = requestAnimationFrame(gameLoop);\n}\n\n/**\n * End the game and show game over screen\n */\nfunction endGame() {\n  console.log(\"Game ended\");\n  \n  // Stop animation loop\n  if (animationFrameId) {\n    cancelAnimationFrame(animationFrameId);\n    animationFrameId = null;\n  }\n  \n  // Play sound effect\n  if (soundEnabled && rockSound) {\n    try {\n      rockSound.currentTime = 0;\n      rockSound.play().catch(error => console.warn(\"Could not play sound:\", error));\n    } catch (e) {\n      console.warn(\"Error playing sound:\", e);\n    }\n  }\n  \n  // Update UI with game results\n  if (gameManager) {\n    try {\n      gameManager.stop();\n      \n      // Get game results\n      const score = gameManager.get_score();\n      const yellowStars = gameManager.get_yellow_stars_count();\n      const pinkStars = gameManager.get_pink_stars_count();\n      const purpleStars = gameManager.get_purple_stars_count();\n      \n      // Hide all screens\n      document.querySelectorAll('.screen').forEach(screen => {\n        screen.style.display = 'none';\n      });\n      \n      // Update results screen\n      finalScoreElement.textContent = `Your Score: ${score}`;\n      finalStatsElement.textContent = `Stars Collected: 🟡${yellowStars} 🟠${pinkStars} 🟣${purpleStars}`;\n      \n      // Set background\n      gameOverScreen.style.backgroundImage = `url(${bgGameoverImg.src})`;\n      \n      // Show game over screen\n      gameOverScreen.style.display = 'flex';\n      gameOverScreen.style.zIndex = '100';\n    } catch (error) {\n      console.error(\"Error ending game:\", error);\n      alert(\"An error occurred while ending the game: \" + error.message);\n    }\n  }\n}\n\n/**\n * Go to main menu\n */\nfunction goToMainMenu() {\n  stopGame();\n  window.hideProofPanel();\n  console.log(\"Returning to main menu...\");\n  showScreen(mainMenuScreen);\n}\n\n/**\n * Restart the game\n */\nfunction restartGame() {\n  console.log(\"Restarting game...\");\n  window.hideProofPanel();\n  \n  // Clear animation loop\n  if (animationFrameId) {\n    cancelAnimationFrame(animationFrameId);\n    animationFrameId = null;\n  }\n  \n  // Reset timestamp\n  lastTimestamp = 0;\n  \n  // Show game screen\n  showScreen(gameScreen);\n  \n  // Setup canvas\n  setupCanvas();\n  \n  // Reset game object\n  try {\n    if (gameManager) {\n      gameManager.restart();\n    } else {\n      gameManager = window.wasm.GameManager.new(\n        canvas,\n        crabImg,\n        crabShieldImg,\n        crabDoubleImg,\n        yellowStarImg,\n        pinkStarImg,\n        purpleStarImg,\n        rockImg,\n        shieldImg,\n        doublePointsImg,\n        extraLifeImg,\n        slowdownImg,\n        starSound,\n        rockSound,\n        shieldHitSound\n      );\n    }\n    \n    // Start the game\n    gameManager.start();\n    \n    // Start music\n    if (soundEnabled) {\n      backgroundMusic.currentTime = 0;\n      backgroundMusic.play().catch(error => {\n        console.log(\"Could not play background music:\", error);\n      });\n    }\n    \n    // Start a new game loop\n    animationFrameId = requestAnimationFrame(gameLoop);\n  } catch (error) {\n    console.error(\"Error restarting game:\", error);\n    alert(\"An error occurred while restarting the game: \" + error.message);\n  }\n}\n\n/**\n * Share score on Twitter\n */\nfunction shareOnTwitter() {\n  if (!gameManager) return;\n  \n  try {\n    const score = gameManager.get_score();\n    const yellowStars = gameManager.get_yellow_stars_count();\n    const pinkStars = gameManager.get_pink_stars_count();\n    const purpleStars = gameManager.get_purple_stars_count();\n    \n    const text = `I scored ${score} points in Crab Game! Collected 🟡${yellowStars} 🟠${pinkStars} 🟣${purpleStars} stars!`;\n    const url = window.location.href;\n    \n    window.open(\n      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,\n      '_blank'\n    );\n  } catch (error) {\n    console.error(\"Error sharing:\", error);\n    alert(\"An error occurred while sharing: \" + error.message);\n  }\n}\n\n/**\n * Load all game resources\n * @returns {Promise<boolean>} Success status\n */\nasync function loadAllResources() {\n  // Update loading progress\n  updateLoadingProgress(10);\n  \n  // Load WASM module\n  const wasmSuccess = await loadWasmModule();\n  \n  if (!wasmSuccess) {\n    // WASM loading failed\n    console.error(\"WASM not available or failed to load!\");\n    updateLoadingProgress(40);\n    \n    // Show error message\n    const loadingText = document.querySelector('#initial-loading-screen h1');\n    if (loadingText) {\n      loadingText.textContent = \"Error Loading Game!\";\n      loadingText.style.color = \"#ff3333\";\n    }\n    \n    // Add reload button\n    const loadingContainer = document.querySelector('.loading-container');\n    if (loadingContainer) {\n      const reloadButton = document.createElement('button');\n      reloadButton.textContent = \"Reload Game\";\n      reloadButton.className = \"game-button\";\n      reloadButton.style.marginTop = \"20px\";\n      reloadButton.onclick = () => window.location.reload();\n      loadingContainer.appendChild(reloadButton);\n    }\n    \n    return false;\n  }\n  \n  // Check if images are loaded\n  if (areImagesLoaded()) {\n    updateLoadingProgress(100);\n    console.log(\"All images loaded!\");\n    \n    // Show main menu\n    setTimeout(() => {\n      showMainMenu();\n    }, 500);\n    \n    return true;\n  } else {\n    // Some images still loading\n    console.warn(\"Some images still loading...\");\n    updateLoadingProgress(80);\n    \n    // Wait and check again\n    await new Promise(resolve => setTimeout(resolve, 2000));\n    \n    // Final check and proceed anyway\n    updateLoadingProgress(100);\n    setTimeout(() => {\n      showMainMenu();\n    }, 500);\n    \n    return true;\n  }\n}\n\n// SP1 Proof Panel functions\nwindow.createProofPanel = function() {\n  console.log(\"Creating proof panel...\");\n  \n  // Clear old panel if exists\n  const oldPanel = document.getElementById('proof-panel');\n  if (oldPanel) oldPanel.remove();\n  \n  // Create new panel\n  const panel = document.createElement('div');\n  panel.id = 'proof-panel';\n  panel.style.position = 'fixed';\n  panel.style.top = '50%';\n  panel.style.left = '50%';\n  panel.style.transform = 'translate(-50%, -50%)';\n  panel.style.width = '80%';\n  panel.style.maxWidth = '800px';\n  panel.style.height = '400px';\n  panel.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';\n  panel.style.color = '#fe11c5';\n  panel.style.padding = '20px';\n  panel.style.borderRadius = '10px';\n  panel.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';\n  panel.style.zIndex = '1000';\n  panel.style.display = 'flex';\n  panel.style.flexDirection = 'column';\n  \n  // Panel header\n  const header = document.createElement('div');\n  header.style.display = 'flex';\n  header.style.justifyContent = 'space-between';\n  header.style.alignItems = 'center';\n  header.style.paddingBottom = '10px';\n  header.style.borderBottom = '1px solid #2ecc71';\n  header.style.marginBottom = '10px';\n  \n  const title = document.createElement('div');\n  title.textContent = 'SP1 Zero-Knowledge Proof Terminal';\n  title.style.fontWeight = 'bold';\n  title.style.fontSize = '16px';\n  \n  const closeBtn = document.createElement('button');\n  closeBtn.textContent = '✖';\n  closeBtn.style.background = 'none';\n  closeBtn.style.border = 'none';\n  closeBtn.style.color = '#fe11c5';\n  closeBtn.style.cursor = 'pointer';\n  closeBtn.style.fontSize = '16px';\n  closeBtn.onclick = window.hideProofPanel;\n  \n  header.appendChild(title);\n  header.appendChild(closeBtn);\n  \n  // Log area\n  const logArea = document.createElement('div');\n  logArea.id = 'proof-log';\n  logArea.style.flexGrow = '1';\n  logArea.style.overflowY = 'auto';\n  logArea.style.whiteSpace = 'pre-wrap';\n  logArea.style.fontSize = '14px';\n  logArea.style.lineHeight = '1.4';\n  logArea.style.padding = '5px';\n  logArea.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';\n  logArea.style.borderRadius = '4px';\n  \n  // Assemble panel\n  panel.appendChild(header);\n  panel.appendChild(logArea);\n  \n  // Add panel to page\n  document.body.appendChild(panel);\n  \n  console.log(\"Proof panel created!\");\n  return panel;\n};\n\nwindow.logToProofPanel = function(message) {\n  console.log(\"Log message:\", message);\n  const logArea = document.getElementById('proof-log');\n  if (!logArea) {\n      console.error(\"proof-log element not found!\");\n      return;\n  }\n  \n  // Add timestamp\n  const date = new Date();\n  const timestamp = `[${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}] `;\n  \n  // Create new line\n  const line = document.createElement('div');\n  line.textContent = timestamp + message;\n  \n  // Add line to log area\n  logArea.appendChild(line);\n  \n  // Auto-scroll\n  logArea.scrollTop = logArea.scrollHeight;\n};\n\nwindow.showProofPanel = function() {\n  console.log(\"showProofPanel called\");\n  \n  // GameManager check\n  if (typeof gameManager === \"undefined\" || gameManager === null) {\n      console.error(\"gameManager not defined!\");\n      alert(\"Game not started or GameManager not found!\");\n      return;\n  }\n  \n  try {\n      // Create proof panel\n      window.createProofPanel();\n      \n      // Collect game data\n      const score = gameManager.get_score();\n      const yellowStars = gameManager.get_yellow_stars_count();\n      const pinkStars = gameManager.get_pink_stars_count();\n      const purpleStars = gameManager.get_purple_stars_count();\n      const gameTime = gameManager.get_game_time();\n      const lives = gameManager.get_lives();\n      \n      // Show game data\n      console.log(\"Game Data:\", {\n          score, yellowStars, pinkStars, purpleStars, gameTime, lives\n      });\n      \n      // Show log in proof panel\n      window.logToProofPanel(\"Starting SP1 Zero-Knowledge Proof system...\");\n      window.logToProofPanel(`Game Data: Score=${score}, Yellow=${yellowStars}, Pink=${pinkStars}, Purple=${purpleStars}, Time=${gameTime}s, Lives=${lives}`);\n      \n      // Send request to backend\n      const gameData = {\n          score,\n          yellowStars,\n          pinkStars,\n          purpleStars,\n          gameTime,\n          lives\n      };\n      \n      // Call SP1 Bridge\n      window.generateSP1Proof(gameData)\n          .then(result => {\n              console.log(\"Proof generation successful:\", result);\n          })\n          .catch(error => {\n              console.error(\"Proof generation error:\", error);\n              window.logToProofPanel(\"Proof generation error: \" + error.message);\n          });\n  } catch (error) {\n      console.error(\"Error showing proof panel:\", error);\n      alert(\"An error occurred while showing proof panel: \" + error.message);\n  }\n};\n\n// Define hideProofPanel as global function\nwindow.hideProofPanel = function() {\n  const panel = document.getElementById('proof-panel');\n  if (panel) panel.remove();\n  proofPanelVisible = false;\n  console.log(\"Proof panel hidden\");\n};\n\n// Event listeners\nstartGameBtn.addEventListener('click', startGame);\nhowToPlayBtn.addEventListener('click', () => showScreen(howToPlayScreen));\nbackToMenuBtn.addEventListener('click', () => showScreen(mainMenuScreen));\nhomeBtn.addEventListener('click', goToMainMenu);\nshareBtn.addEventListener('click', shareOnTwitter);\nplayAgainBtn.addEventListener('click', restartGame);\ntoggleSoundBtn.addEventListener('click', toggleSound);\npauseGameBtn.addEventListener('click', () => {\n  if (soundEnabled && buttonSound) buttonSound.play().catch(e => {});\n  togglePauseMenu(true);\n});\nresumeGameBtn.addEventListener('click', () => {\n  if (soundEnabled && buttonSound) buttonSound.play().catch(e => {});\n  togglePauseMenu(false);\n  \n  if (!animationFrameId) {\n    lastTimestamp = 0;\n    animationFrameId = requestAnimationFrame(gameLoop);\n  }\n});\nrestartPauseBtn.addEventListener('click', () => {\n  if (soundEnabled && buttonSound) buttonSound.play().catch(e => {});\n  togglePauseMenu(false);\n  restartGame();\n});\nhomePauseBtn.addEventListener('click', () => {\n  if (soundEnabled && buttonSound) buttonSound.play().catch(e => {});\n  togglePauseMenu(false);\n  goToMainMenu();\n});\nproveBtn.addEventListener('click', function() {\n  console.log(\"Prove button clicked\");\n  \n  if (typeof window.showProofPanel === 'function') {\n    window.showProofPanel();\n  } else {\n    console.error(\"showProofPanel function not found!\");\n    alert(\"Proof panel function could not be loaded. Please refresh the page.\");\n  }\n});\n\n// Handle window resize\nwindow.addEventListener('resize', () => {\n  if (gameScreen.classList.contains('active')) {\n    setupCanvas();\n  }\n});\n\n// Handle keyboard events\nwindow.addEventListener('keydown', (event) => {\n  if (gameScreen.classList.contains('active') && gameManager) {\n    try {\n      // ESC key toggles pause menu\n      if (event.key === \"Escape\") {\n        togglePauseMenu(!pauseMenu.classList.contains('hidden'));\n        return;\n      }\n      \n      // If pause menu is open, don't process keyboard inputs\n      if (!pauseMenu.classList.contains('hidden')) {\n        return;\n      }\n      \n      gameManager.handle_key_press(event);\n    } catch (error) {\n      console.error(\"Error handling keyboard event:\", error);\n    }\n  }\n});\n\n// Game initialization\ndocument.addEventListener('DOMContentLoaded', () => {\n  console.log(\"DOM loaded, initializing game...\");\n  \n  // Show loading screen\n  if (initialLoadingScreen) {\n    initialLoadingScreen.style.display = 'flex';\n    initialLoadingScreen.classList.add('active');\n  }\n  \n  // Load resources after a short delay\n  setTimeout(() => {\n    loadAllResources();\n  }, 1000);\n});\n\n// Notify that SP1 Proof panel functions are defined\nconsole.log(\"SP1 Proof panel functions defined\");\n\n//# sourceURL=webpack://crab-game-sp1/./index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".index.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "crab-game-sp1:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/wasm loading */
/******/ 	(() => {
/******/ 		__webpack_require__.v = (exports, wasmModuleId, wasmModuleHash, importsObj) => {
/******/ 		
/******/ 			var req = fetch(__webpack_require__.p + "" + wasmModuleHash + ".module.wasm");
/******/ 			var fallback = () => (req
/******/ 				.then((x) => (x.arrayBuffer()))
/******/ 				.then((bytes) => (WebAssembly.instantiate(bytes, importsObj)))
/******/ 				.then((res) => (Object.assign(exports, res.instance.exports))));
/******/ 			return req.then((res) => {
/******/ 				if (typeof WebAssembly.instantiateStreaming === "function") {
/******/ 		
/******/ 					return WebAssembly.instantiateStreaming(res, importsObj)
/******/ 						.then(
/******/ 							(res) => (Object.assign(exports, res.instance.exports)),
/******/ 							(e) => {
/******/ 								if(res.headers.get("Content-Type") !== "application/wasm") {
/******/ 									console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
/******/ 									return fallback();
/******/ 								}
/******/ 								throw e;
/******/ 							}
/******/ 						);
/******/ 				}
/******/ 				return fallback();
/******/ 			});
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if(true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 		
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcrab_game_sp1"] = self["webpackChunkcrab_game_sp1"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;