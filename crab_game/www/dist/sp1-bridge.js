/**
 * SP1 Bridge - Bridge between Crab Game and SP1 ZK Proof system
 */

const SP1Bridge = {
    // Main proof generation function
    generateProof: async function(gameData) {
        console.log("SP1Bridge: Proof generation started", gameData);
        
        // Automatically use simulation mode on Vercel
        const isVercel = window.location.hostname.includes('vercel.app');
        const forceSimulation = isVercel || localStorage.getItem('forceSimulation') === 'true';
        
        // Check for log function
        if (typeof window.logToProofPanel === 'function') {
            window.logToProofPanel("Starting SP1 Proof system...");
            
            if (forceSimulation) {
                window.logToProofPanel("Using Vercel environment/simulation mode.");
                window.logToProofPanel("Note: Real SP1 proofs only work in local environment.");
            }
            
            window.logToProofPanel(`Score: ${gameData.score}, Yellow Stars: ${gameData.yellowStars}, Pink Stars: ${gameData.pinkStars}, Purple Stars: ${gameData.purpleStars}`);
            window.logToProofPanel("Running SP1 ZK program...");
        } else {
            console.warn("logToProofPanel function not found, log messages will be written to console");
        }
        
        try {
            // If on Vercel or simulation forced, go directly to simulation
            if (forceSimulation) {
                return this.simulateProofProcess(gameData);
            }
            
            // Try real proof generation
            const result = await this.generateRealProof(gameData);
            if (result.success) {
                return result;
            }
            
            // Fall back to simulation mode if failed
            if (typeof window.logToProofPanel === 'function') {
                window.logToProofPanel("Switching to simulation mode...");
            }
            return this.simulateProofProcess(gameData);
        } catch (error) {
            console.error("Real proof generation error:", error);
            if (typeof window.logToProofPanel === 'function') {
                window.logToProofPanel(`Error: ${error.message}`);
                window.logToProofPanel("Switching to simulation mode...");
            }
            
            // Fall back to simulation mode on error
            return this.simulateProofProcess(gameData);
        }
    },
    
    // Call real SP1 proof API
    generateRealProof: async function(gameData) {
        if (typeof window.logToProofPanel === 'function') {
            window.logToProofPanel("Connecting to SP1 backend...");
        }
        
        try {
            // API call
            const response = await fetch('http://localhost:3000/api/generate-proof', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData)
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("Result from API:", result);
            
            if (typeof window.logToProofPanel === 'function') {
                window.logToProofPanel("SP1 Proof successfully generated!");
                window.logToProofPanel(`Proof Hash: ${result.proofHash}`);
                
                if (result.scoreIsValid) {
                    window.logToProofPanel("Score verification: SUCCESS");
                } else {
                    window.logToProofPanel("Score verification: FAILED. Reported score could not be verified!");
                }
            }
            
            // Create visual result
            try {
                this.createVisualProofResult(gameData, result.proofHash, result.scoreIsValid);
            } catch (visualError) {
                console.error("Error creating visual result:", visualError);
                if (typeof window.logToProofPanel === 'function') {
                    window.logToProofPanel(`Visual result creation error: ${visualError.message}`);
                }
            }
            
            // Show final result
            try {
                if (typeof window.showProofResult === 'function') {
                    window.showProofResult(result.scoreIsValid, result.proofHash);
                }
            } catch (showError) {
                console.error("Error showing result:", showError);
            }
            
            return result;
        } catch (error) {
            console.error("API call failed:", error);
            if (typeof window.logToProofPanel === 'function') {
                window.logToProofPanel(`API Error: ${error.message}`);
            }
            throw error;
        }
    },
    
    // Simulate proof process
    simulateProofProcess: function(gameData) {
        // Calculated score
        const calculatedScore = (gameData.yellowStars * 5) + (gameData.pinkStars * 10) + (gameData.purpleStars * 20);
        const scoreIsValid = calculatedScore === gameData.score;
        
        const steps = [
            { message: "Loading SP1 RISC-V program...", delay: 500 },
            { message: "Preparing game data for verification...", delay: 500 },
            { message: `Input values: Yellow=${gameData.yellowStars}, Pink=${gameData.pinkStars}, Purple=${gameData.purpleStars}, Score=${gameData.score}`, delay: 1000 },
            { message: "Verifying game rules...", delay: 800 },
            { message: `Score calculation: (Yellow*5)+(Pink*10)+(Purple*20) = ${calculatedScore}`, delay: 1200 },
            { message: `Score verification: ${scoreIsValid ? "SUCCESS" : "FAILED!"}`, delay: 1000 },
            { message: "Creating SP1 ZK circuit...", delay: 1000 },
            { message: "Generating cryptographic proof (1/3)...", delay: 1200 },
            { message: "Generating cryptographic proof (2/3)...", delay: 1200 },
            { message: "Generating cryptographic proof (3/3)...", delay: 1200 },
            { message: "Verifying proof...", delay: 1000 },
            { message: "Proof successfully generated and verified! (SIMULATION)", delay: 800 }
        ];
        
        let currentStep = 0;
        
        // Show steps sequentially
        const processNextStep = () => {
            if (currentStep < steps.length) {
                if (typeof window.logToProofPanel === 'function') {
                    window.logToProofPanel(steps[currentStep].message);
                }
                
                setTimeout(() => {
                    currentStep++;
                    processNextStep();
                }, steps[currentStep].delay);
            } else {
                // All steps completed, show result
                this.completeProof(gameData, scoreIsValid);
            }
        };
        
        // Start first step
        processNextStep();
        
        return {
            success: true,
            simulation: true,
            calculatedScore: calculatedScore,
            scoreIsValid: scoreIsValid
        };
    },
    
    // Complete proof process and show result
    completeProof: function(gameData, scoreIsValid) {
        // Generate proof hash
        const hash = this.generateProofHash(gameData);
        
        // Show result
        if (typeof window.logToProofPanel === 'function') {
            window.logToProofPanel("=== PROOF RESULT ===");
            window.logToProofPanel(`Hash: ${hash}`);
            window.logToProofPanel(`Verification: ${scoreIsValid ? "SUCCESS" : "FAILED"}`);
            window.logToProofPanel("===================");
        }
        
        // Create visual result elements
        this.createVisualProofResult(gameData, hash, scoreIsValid);
        
        // Show final result
        if (typeof window.showProofResult === 'function') {
            window.showProofResult(scoreIsValid, hash);
        }
    },
    
    // Create visual proof result
    createVisualProofResult: function(gameData, hash, scoreIsValid) {
        // Create div to show proof result
        const proofResultDiv = document.createElement('div');
        proofResultDiv.id = 'proof-result';
        proofResultDiv.style.marginTop = '15px';
        proofResultDiv.style.padding = '12px';
        proofResultDiv.style.backgroundColor = 'rgba(20, 20, 35, 0.9)';
        proofResultDiv.style.borderRadius = '8px';
        proofResultDiv.style.border = scoreIsValid ? 
            '1px solid #2ecc71' : '1px solid #e74c3c';
        proofResultDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        proofResultDiv.style.fontSize = '13px';
        
        // Calculated score
        const calculatedScore = (gameData.yellowStars * 5) + (gameData.pinkStars * 10) + (gameData.purpleStars * 20);
        
        // Add result div to proof-log area
        const proofLog = document.getElementById('proof-log');
        if (proofLog) {
            // Create result content - more compact and balanced design
            const resultHTML = `
                <div style="text-align: center; margin-bottom: 8px;">
                    <span style="font-size: 18px; color: ${scoreIsValid ? '#2ecc71' : '#e74c3c'}; display: inline-block; margin-right: 6px;">
                        ${scoreIsValid ? '✓' : '✗'}
                    </span>
                    <span style="font-weight: bold; font-size: 16px; color: ${scoreIsValid ? '#2ecc71' : '#e74c3c'};">
                        Proof ${scoreIsValid ? 'Verified!' : 'Failed!'}
                    </span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <div style="flex: 1; background-color: rgba(52, 152, 219, 0.1); padding: 6px; border-radius: 4px; margin-right: 4px;">
                        <div style="font-weight: bold; color: #3498db; font-size: 12px;">Reported</div>
                        <div style="font-size: 14px;">${gameData.score}</div>
                    </div>
                    <div style="flex: 1; background-color: rgba(46, 204, 113, 0.1); padding: 6px; border-radius: 4px; margin-left: 4px;">
                        <div style="font-weight: bold; color: #2ecc71; font-size: 12px;">Calculated</div>
                        <div style="font-size: 14px;">${calculatedScore} ${!scoreIsValid ? '<span style="color:#e74c3c; font-size: 11px;">(Mismatch!)</span>' : ''}</div>
                    </div>
                </div>
                
                <div style="background-color: rgba(241, 196, 15, 0.1); padding: 6px; border-radius: 4px; margin-bottom: 8px;">
                    <div style="font-weight: bold; color: #f1c40f; font-size: 12px; margin-bottom: 4px;">Stars Collected</div>
                    <div style="display: flex; justify-content: space-between; text-align: center; font-size: 12px;">
                        <div style="flex: 1;">
                            <div>🟡 ${gameData.yellowStars} × 5</div>
                            <div>${gameData.yellowStars * 5}</div>
                        </div>
                        <div style="flex: 1;">
                            <div>🟠 ${gameData.pinkStars} × 10</div>
                            <div>${gameData.pinkStars * 10}</div>
                        </div>
                        <div style="flex: 1;">
                            <div>🟣 ${gameData.purpleStars} × 20</div>
                            <div>${gameData.purpleStars * 20}</div>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
                    <div style="flex: 1; background-color: rgba(155, 89, 182, 0.1); padding: 6px; border-radius: 4px; margin-right: 4px;">
                        <div style="font-weight: bold; color: #9b59b6; margin-bottom: 2px;">Game Time</div>
                        <div>${gameData.gameTime} seconds</div>
                    </div>
                    <div style="flex: 1; background-color: rgba(231, 76, 60, 0.1); padding: 6px; border-radius: 4px; margin-left: 4px;">
                        <div style="font-weight: bold; color: #e74c3c; margin-bottom: 2px;">Lives Remaining</div>
                        <div>${gameData.lives}</div>
                    </div>
                </div>
                
                <div style="background-color: rgba(52, 152, 219, 0.05); padding: 6px; border-radius: 4px; margin-bottom: 10px; word-break: break-all; border: 1px dashed #3498db;">
                    <div style="font-weight: bold; color: #3498db; font-size: 11px; margin-bottom: 2px;">Proof Hash</div>
                    <div style="font-family: monospace; font-size: 11px; color: #7f8c8d;">${hash}</div>
                </div>
                
                <!-- Twitter Share Button -->
                <div style="text-align: center;">
                    <button id="share-twitter-button" style="
                        background: linear-gradient(45deg, #1DA1F2, #1a91da);
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-weight: bold;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        margin: 0 auto;
                        font-size: 12px;
                        box-shadow: 0 2px 4px rgba(29, 161, 242, 0.3);
                    ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Share Score
                    </button>
                </div>
            `;
            
            proofResultDiv.innerHTML = resultHTML;
            proofLog.appendChild(proofResultDiv);
            
            // Add event listener to Twitter share button
            setTimeout(() => {
                const shareButton = document.getElementById('share-twitter-button');
                if (shareButton) {
                    shareButton.addEventListener('click', () => this.shareOnTwitter(gameData, calculatedScore));
                }
            }, 100);
        } else {
            console.error("proof-log element not found!");
        }
    },
    
    // Share score on Twitter
    shareOnTwitter: function(gameData, calculatedScore) {
        const scoreText = gameData.score === calculatedScore ? 
            `${calculatedScore} points` : 
            `${calculatedScore} actual points (${gameData.score} reported)`;
            
        const shareText = `gprove! I scored ${scoreText} in Space Crab Game and proved it with SP1! @SuccinctLabs `;
        const encodedText = encodeURIComponent(shareText);
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        
        // Open Twitter share page in new window
        window.open(twitterUrl, '_blank');
    },
    
    // Generate proof hash (simulation of a real proof hash)
    generateProofHash: function(gameData) {
        // Convert score and star values to hex
        const scoreHex = gameData.score.toString(16).padStart(4, '0');
        const yellowHex = gameData.yellowStars.toString(16).padStart(2, '0');
        const pinkHex = gameData.pinkStars.toString(16).padStart(2, '0');
        const purpleHex = gameData.purpleStars.toString(16).padStart(2, '0');
        const timePart = Date.now().toString(16).slice(-8);
        
        return `0xSIM${scoreHex}${yellowHex}${pinkHex}${purpleHex}${timePart}`;
    }
};

// Global SP1Bridge object
window.SP1Bridge = SP1Bridge;

// Global proof generation function
window.generateSP1Proof = function(gameData) {
    return SP1Bridge.generateProof(gameData);
};

console.log("SP1Bridge loaded - Crab Game ZK integration ready!");