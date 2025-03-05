# Error Hash Extractor

A Node.js utility script that extracts custom error signatures from Solidity contract ABIs and generates a mapping of error hashes to their corresponding error names. This is particularly useful for decoding custom error messages in Ethereum transaction traces.

## Features

- Extracts error definitions from contract ABIs
- Supports both JSON and JavaScript ABI files
- Generates keccak256 hashes for each error signature
- Creates a JavaScript-compatible output file with error hash mappings

## Installation

1. Clone this repository
2. Install dependencies
3. Run "node script_path abi_path"
