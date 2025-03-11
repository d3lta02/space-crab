mod entities;
mod game;
mod utils;

use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, KeyboardEvent, HtmlImageElement, HtmlAudioElement, Document, Element};


// For debugging in case of panic
#[cfg(feature = "console_error_panic_hook")]
pub use console_error_panic_hook::set_once as set_panic_hook;

// More efficient memory allocator for WebAssembly
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Game states exported to JavaScript
#[wasm_bindgen]
pub enum GameState {
    NotStarted,
    Playing,
    Paused,
    GameOver,
}

// Main function called from JavaScript
#[wasm_bindgen]
pub struct GameManager {
    game: game::Game,
    yellow_stars: u32, // Number of collected yellow stars
    pink_stars: u32,   // Number of collected pink stars
    purple_stars: u32, // Number of collected purple stars
    game_time: u32,    // Game time (seconds)
}

#[wasm_bindgen]
impl GameManager {
    // Create a new game
    pub fn new(
        canvas: HtmlCanvasElement,
        crab_img: HtmlImageElement,
        crab_shield_img: HtmlImageElement,
        crab_double_img: HtmlImageElement,
        yellow_star_img: HtmlImageElement,
        pink_star_img: HtmlImageElement,
        purple_star_img: HtmlImageElement,
        rock_img: HtmlImageElement,
        shield_img: HtmlImageElement,
        double_points_img: HtmlImageElement,
        extra_life_img: HtmlImageElement,
        slowdown_img: HtmlImageElement,        // New slowdown image
        star_sound: HtmlAudioElement,
        rock_sound: HtmlAudioElement,
        shield_hit_sound: HtmlAudioElement,    // Shield hit sound
    ) -> GameManager {
        utils::set_panic_hook();
        
        let context = canvas
            .get_context("2d")
            .unwrap()
            .unwrap()
            .dyn_into::<CanvasRenderingContext2d>()
            .unwrap();
        
        let game = game::Game::new(
            canvas.width() as f64,
            canvas.height() as f64,
            context,
            crab_img,
            crab_shield_img,
            crab_double_img,
            yellow_star_img,
            pink_star_img,
            purple_star_img,
            rock_img,
            shield_img,
            double_points_img,
            extra_life_img,
            slowdown_img,         // Add slowdown image
            star_sound,
            rock_sound,
            shield_hit_sound,     // Add shield hit sound
        );
        
        GameManager { 
            game,
            yellow_stars: 0,
            pink_stars: 0,
            purple_stars: 0,
            game_time: 0
        }
    }
    
    // Process keyboard input
    #[wasm_bindgen]
    pub fn handle_key_press(&mut self, event: KeyboardEvent) {
        self.game.handle_key_press(event);
    }
    
    // Start the game
    #[wasm_bindgen]
    pub fn start(&mut self) {
        self.game.start();
        
        // Reset star counters
        self.yellow_stars = 0;
        self.pink_stars = 0;
        self.purple_stars = 0;
        self.game_time = 0;
    }
    
    // Stop the game
    #[wasm_bindgen]
    pub fn stop(&mut self) {
        self.game.stop();
    }
    
    // Restart the game
    #[wasm_bindgen]
    pub fn restart(&mut self) {
        self.game.restart();
        
        // Reset star counters
        self.yellow_stars = 0;
        self.pink_stars = 0;
        self.purple_stars = 0;
        self.game_time = 0;
    }
    
    // Update and draw the game
    #[wasm_bindgen]
    pub fn update(&mut self, delta_time: f64) -> bool {
        // Increase game time (1 second = 1000 ms)
        if self.game.get_state() == game::GameState::Playing {
            self.game_time = self.game.get_elapsed_time() as u32;
        }
        
        // Check for newly collected stars
        if let Some(item_type) = self.game.get_last_collected_item() {
            match item_type {
                entities::FallingItemType::YellowStar => self.yellow_stars += 1,
                entities::FallingItemType::PinkStar => self.pink_stars += 1,
                entities::FallingItemType::PurpleStar => self.purple_stars += 1,
                _ => {} // Don't process other items
            }
        }
        
        // Update the game
        self.game.update(delta_time)
    }
    
    // Get the current score
    #[wasm_bindgen]
    pub fn get_score(&self) -> u32 {
        self.game.get_score()
    }
    
    // Get the remaining lives
    #[wasm_bindgen]
    pub fn get_lives(&self) -> u32 {
        self.game.get_lives()
    }
    
    // Check if the game is over
    #[wasm_bindgen]
    pub fn is_game_over(&self) -> bool {
        self.game.is_game_over()
    }
    
    // Get the game state (exposed to JavaScript)
    #[wasm_bindgen]
    pub fn get_game_state(&self) -> GameState {
        match self.game.get_state() {
            game::GameState::NotStarted => GameState::NotStarted,
            game::GameState::Playing => GameState::Playing,
            game::GameState::Paused => GameState::Paused,
            game::GameState::GameOver => GameState::GameOver,
        }
    }
    
    // Set sound status
    #[wasm_bindgen]
    pub fn set_sound_enabled(&mut self, enabled: bool) {
        // Pass sound state to the Game object
        self.game.set_sound_enabled(enabled);
        utils::log(&format!("Sound status: {}", if enabled { "on" } else { "off" }));
    }
    
    // Get the number of collected yellow stars
    #[wasm_bindgen]
    pub fn get_yellow_stars_count(&self) -> u32 {
        self.yellow_stars
    }
    
    // Get the number of collected pink stars
    #[wasm_bindgen]
    pub fn get_pink_stars_count(&self) -> u32 {
        self.pink_stars
    }
    
    // Get the number of collected purple stars
    #[wasm_bindgen]
    pub fn get_purple_stars_count(&self) -> u32 {
        self.purple_stars
    }
    
    // Get the game time
    #[wasm_bindgen]
    pub fn get_game_time(&self) -> u32 {
        self.game_time
    }
    
    // Show SP1 Proof interface
    #[wasm_bindgen]
    pub fn show_sp1_proof_interface(&self) -> Result<(), JsValue> {
        let window = web_sys::window().expect("no global window");
        let document = window.document().expect("no global document");
        
        // Temporarily hide the canvas in the game screen
        if let Some(canvas) = document.get_element_by_id("game-canvas") {
            canvas.set_attribute("style", "display: none;").ok();
        }
        
        // Create and show the SP1 terminal interface
        self.create_sp1_terminal(&document)?;
        
        Ok(())
    }
    
    // Hide SP1 proof interface
    #[wasm_bindgen]
    pub fn hide_sp1_proof_interface(&self) -> Result<(), JsValue> {
        let window = web_sys::window().expect("no global window");
        let document = window.document().expect("no global document");
        
        // Show the game screen canvas again
        if let Some(canvas) = document.get_element_by_id("game-canvas") {
            canvas.set_attribute("style", "display: block;").ok();
        }
        
        // Remove the SP1 terminal interface
        if let Some(terminal) = document.get_element_by_id("sp1-terminal") {
            terminal.parent_element().unwrap().remove_child(&terminal).ok();
        }
        
        Ok(())
    }
    
    // Create SP1 Terminal interface
    fn create_sp1_terminal(&self, document: &Document) -> Result<(), JsValue> {
        // Remove existing terminal if present
        if let Some(existing_terminal) = document.get_element_by_id("sp1-terminal") {
            existing_terminal.parent_element().unwrap().remove_child(&existing_terminal).ok();
        }
        
        // Create terminal container
        let terminal = document.create_element("div")?;
        terminal.set_id("sp1-terminal");
        terminal.set_attribute("style", 
            "position: fixed; bottom: 20px; left: 20px; width: calc(100% - 40px); \
            max-width: 1024px; height: 300px; background-color: rgba(0, 0, 0, 0.85); \
            color: #fe11c5; border-radius: 8px; font-family: monospace; padding: 10px; \
            overflow-y: auto; z-index: 100; box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); \
            border: 1px solid #2ecc71; display: flex; flex-direction: column;"
        )?;
        
        // Terminal header
        let terminal_header = document.create_element("div")?;
        terminal_header.set_attribute("style", 
            "display: flex; justify-content: space-between; align-items: center; \
            padding-bottom: 10px; border-bottom: 1px solid #2ecc71; margin-bottom: 10px;"
        )?;
        
        let title = document.create_element("div")?;
        title.set_text_content(Some("SP1 Zero-Knowledge Proof Terminal"));
        title.set_attribute("style", "font-weight: bold; font-size: 16px;")?;
        
        let close_button = document.create_element("button")?;
        close_button.set_text_content(Some("✖"));
        close_button.set_attribute("style", 
            "background: none; border: none; color: #fe11c5; cursor: pointer; font-size: 16px;"
        )?;
        close_button.set_attribute("id", "close-terminal-button")?;
        
        terminal_header.append_child(&title)?;
        terminal_header.append_child(&close_button)?;
        
        // Terminal output area
        let terminal_output = document.create_element("div")?;
        terminal_output.set_id("proof-log");
        terminal_output.set_attribute("style", 
            "flex-grow: 1; overflow-y: auto; white-space: pre-wrap; font-size: 14px; \
            line-height: 1.4; padding: 5px; background-color: rgba(0, 0, 0, 0.5); border-radius: 4px;"
        )?;
        
        // Add components to terminal
        terminal.append_child(&terminal_header)?;
        terminal.append_child(&terminal_output)?;
        
        // Add terminal to game-screen
        if let Some(game_screen) = document.get_element_by_id("game-screen") {
            game_screen.append_child(&terminal)?;
            
            // Add event listener to close button via JavaScript
            js_sys::eval("
                document.getElementById('close-terminal-button').addEventListener('click', function() {
                    window.hideProofPanel();
                });
            ").ok();
        }
        
        Ok(())
    }
}

// Add log message to proof area
#[wasm_bindgen]
pub fn log_to_proof_area(message: &str) {
    let window = web_sys::window().expect("No global window");
    let document = window.document().expect("No global document");
    
    if let Some(proof_log) = document.get_element_by_id("proof-log") {
        // Add timestamp
        let date = js_sys::Date::new_0();
        let timestamp = format!("[{:02}:{:02}:{:02}] ", 
            date.get_hours(), 
            date.get_minutes(), 
            date.get_seconds()
        );
        
        // Create new line
        if let Ok(line_element) = document.create_element("div") {
            line_element.set_text_content(Some(&format!("{}{}", timestamp, message)));
            
            // Set line color
            if message.contains("error") || message.contains("failed") || message.contains("ERROR") {
                line_element.set_attribute("style", "color: #e74c3c;").ok(); // Red
            } else if message.contains("success") || message.contains("verified") || message.contains("SUCCESS") {
                line_element.set_attribute("style", "color: #2ecc71;").ok(); // Green
            } else if message.contains("generating") || message.contains("wait") {
                line_element.set_attribute("style", "color: #f39c12;").ok(); // Orange
            }
            
            // Add line to log area
            proof_log.append_child(&line_element).ok();
            
            // Auto-scroll
            let _ = js_sys::eval(&format!("document.getElementById('proof-log').scrollTop = document.getElementById('proof-log').scrollHeight"));
        }
    }
}

// Show proof result
#[wasm_bindgen]
pub fn show_sp1_proof_result(success: bool, hash: &str) {
    log_to_proof_area(&format!("Proof result: {}", if success { "SUCCESS" } else { "FAILED" }));
    log_to_proof_area(&format!("Proof Hash: {}", hash));
    
    if success {
        log_to_proof_area("Congratulations! Your game score has been successfully verified.");
    } else {
        log_to_proof_area("Warning: Your score could not be verified. The reported score does not match the calculated score.");
    }
}