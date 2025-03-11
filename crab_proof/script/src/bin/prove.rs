use alloy_sol_types::SolType;
use clap::Parser;
use crab_proof_lib::{calculate_score, PublicValuesStruct};
use sp1_sdk::{include_elf, HashableKey, ProverClient, SP1Stdin};

/// RISC-V ELF file for the Crab game proof program.
pub const CRAB_PROOF_ELF: &[u8] = include_elf!("crab_proof_program");

/// Command line arguments
#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
struct Args {
    #[clap(long)]
    execute: bool,

    #[clap(long)]
    prove: bool,

    #[clap(long, default_value = "0")]
    yellow_stars: u32,

    #[clap(long, default_value = "0")]
    pink_stars: u32,

    #[clap(long, default_value = "0")]
    purple_stars: u32,

    #[clap(long, default_value = "0")]
    score: u32,

    #[clap(long, default_value = "0")]
    game_time: u32,

    #[clap(long, default_value = "3")]
    lives: u32,
}

fn main() {
    // Setup logger
    sp1_sdk::utils::setup_logger();
    dotenv::dotenv().ok();

    // Parse command line arguments
    let args = Args::parse();

    if args.execute == args.prove {
        eprintln!("Error: You must specify either --execute or --prove");
        std::process::exit(1);
    }

    // Setup prover client
    let client = ProverClient::from_env();

    // Prepare inputs
    let mut stdin = SP1Stdin::new();
    stdin.write(&args.yellow_stars);
    stdin.write(&args.pink_stars);
    stdin.write(&args.purple_stars);
    stdin.write(&args.score);
    stdin.write(&args.game_time);
    stdin.write(&args.lives);

    println!("Game Data: Yellow Stars = {}, Pink Stars = {}, Purple Stars = {}, Score = {}",
             args.yellow_stars, args.pink_stars, args.purple_stars, args.score);

    if args.execute {
        // Run program without generating proof
        let (output, report) = client.execute(CRAB_PROOF_ELF, &stdin).run().unwrap();
        println!("Program executed successfully.");

        // Read output
        let decoded = PublicValuesStruct::abi_decode(output.as_slice(), true).unwrap();
        let PublicValuesStruct { score, yellowStars, pinkStars, purpleStars, gameTime, lives } = decoded;
        
        // Compare calculated score with reported score
        let expected_score = calculate_score(args.yellow_stars, args.pink_stars, args.purple_stars);
        let is_valid = expected_score == args.score;
        
        println!("Calculated Score: {}", score);
        println!("Reported Score: {}", args.score);
        println!("Score Verification: {}", if is_valid { "SUCCESS" } else { "FAILED" });
        println!("Yellow Stars: {}", yellowStars);
        println!("Pink Stars: {}", pinkStars);
        println!("Purple Stars: {}", purpleStars);
        println!("Game Time: {}s", gameTime);
        println!("Lives: {}", lives);

        // Log executed instruction count
        println!("Number of instructions executed: {}", report.total_instruction_count());
    } else {
        // Setup program for proof generation
        let (pk, vk) = client.setup(CRAB_PROOF_ELF);

        // Generate proof
        let proof = client
            .prove(&pk, &stdin)
            .run()
            .expect("proof generation failed");

        println!("Proof successfully generated!");

        // Verify proof
        client.verify(&proof, &vk).expect("proof verification failed");
        println!("Proof successfully verified!");
        
        // Save proof to disk
        let proof_path = "crab_game_proof.bin";
        proof.save(proof_path).expect("failed to save proof");
        println!("Proof saved to file: {}", proof_path);
    }
}