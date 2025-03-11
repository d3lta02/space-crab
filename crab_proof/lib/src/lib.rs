use alloy_sol_types::sol;

sol! {
    /// Structure containing game results that can be easily deserialized by Solidity.
    struct PublicValuesStruct {
        uint32 score;
        uint32 yellowStars;
        uint32 pinkStars;
        uint32 purpleStars;
        uint32 gameTime;
        uint32 lives;
    }
}

/// Function to calculate score based on star types
pub fn calculate_score(yellow_stars: u32, pink_stars: u32, purple_stars: u32) -> u32 {
    (yellow_stars * 5) + (pink_stars * 10) + (purple_stars * 20)
}

/// Calculates total number of stars
pub fn total_stars(yellow_stars: u32, pink_stars: u32, purple_stars: u32) -> u32 {
    yellow_stars + pink_stars + purple_stars
}