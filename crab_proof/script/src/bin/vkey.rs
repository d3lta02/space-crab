use sp1_sdk::{include_elf, HashableKey, ProverClient};

/// RISC-V ELF file for the Crab game proof program.
pub const CRAB_PROOF_ELF: &[u8] = include_elf!("crab_proof_program");

fn main() {
    // Setup prover client
    let client = ProverClient::from_env();
    
    // Get verification key for the program
    let (_, vk) = client.setup(CRAB_PROOF_ELF);
    
    // Print verification key
    println!("Program VKey: {}", vk.bytes32());
}