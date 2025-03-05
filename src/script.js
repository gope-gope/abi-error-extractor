const fs = require("fs");
const path = require("path");
const { keccak256 } = require("ethers");

// Function to extract error hashes from ABI
function getErrorHashesFromABI(abi) {
  const errorHashes = {};

  abi.forEach((item) => {
    if (item.type === "error") {
      const errorName = item.name;
      const paramTypes = item.inputs.map((input) => input.type).join(",");

      // Compute keccak256 hash
      const signature = `${errorName}(${paramTypes})`;
      const errorHash = keccak256(Buffer.from(signature)).slice(0, 10);

      // Store hash and error name in object
      errorHashes[errorHash] = errorName;
    }
  });

  return errorHashes;
}

// Read input file from command line arguments
const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: node extractErrors.js <inputABI.json|inputABI.js>");
  process.exit(1);
}

// Determine file extension
const fileExt = path.extname(inputFile).toLowerCase();

// Function to read and parse the ABI file
function parseABIFile(filePath) {
  if (fileExt === ".json") {
    // Read and parse JSON file
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } else if (fileExt === ".js") {
    // Require JS file (must export the ABI)
    return require(path.resolve(filePath));
  } else {
    console.error("Unsupported file format. Use a .json or .js file.");
    process.exit(1);
  }
}

try {
  const abi = parseABIFile(inputFile);
  const errorHashes = getErrorHashesFromABI(abi);

  // Format as a JavaScript object and write to output.js
  const output = `const errorHashes = ${JSON.stringify(
    errorHashes,
    null,
    2
  )};\n\nexport default errorHashes;`;
  fs.writeFileSync("./output/output.js", output);

  console.log("Extracted errors saved to output.js");
} catch (error) {
  console.error("Error processing ABI:", error);
  process.exit(1);
}
