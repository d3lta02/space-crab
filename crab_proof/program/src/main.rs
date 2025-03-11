//! SP1 proof program for the Crab game.
//! 
//! This program verifies game data and generates a proof.

#![no_main]
sp1_zkvm::entrypoint!(main);

use alloy_sol_types::SolType;
use crab_proof_lib::{calculate_score, total_stars, PublicValuesStruct};

pub fn main() {
    // Read input data
    let n_yellow = sp1_zkvm::io::read::<u32>();
    let n_pink = sp1_zkvm::io::read::<u32>();
    let n_purple = sp1_zkvm::io::read::<u32>();
    let reported_score = sp1_zkvm::io::read::<u32>();
    let game_time = sp1_zkvm::io::read::<u32>();
    let lives = sp1_zkvm::io::read::<u32>();
    
    // Verify score
    let calculated_score = calculate_score(n_yellow, n_pink, n_purple);
    let score_is_valid = reported_score == calculated_score;
    
    // Calculate total number of stars collected
    let total_collected = total_stars(n_yellow, n_pink, n_purple);
    
    // Encode results and provide as output
    let public_values = PublicValuesStruct {
        score: calculated_score,
        yellowStars: n_yellow,
        pinkStars: n_pink,
        purpleStars: n_purple,
        gameTime: game_time,
        lives: lives
    };
    
    // Debug output
    println!("Star counts: Yellow={}, Pink={}, Purple={}", n_yellow, n_pink, n_purple);
    println!("Reported score: {}, Calculated score: {}", reported_score, calculated_score);
    println!("Score verification: {}", if score_is_valid { "SUCCESS" } else { "FAILED" });
    println!("Total stars collected: {}", total_collected);
    
    // Process as output (in a format that can be verified in Solidity)
    let bytes = PublicValuesStruct::abi_encode(&public_values);
    sp1_zkvm::io::commit_slice(&bytes);
}