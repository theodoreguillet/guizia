require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

// Import the required modules
const hre = require('hardhat');

const initialSupply = 1000000000;
const sleepDuration = 5000;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const Guizia = await ethers.getContractFactory('Guizia');

  const contract = await Guizia.deploy(initialSupply);

  console.log('Contract deployed at:', contract.address);

  // Wait for the contract deployement to finish
  await new Promise((r) => setTimeout(r, sleepDuration));

  // Verify the contract after deployment
  console.log('Verifying the contract...');

  try {
    await hre.run('verify:verify', {
      address: contract.address,
      constructorArguments: [initialSupply],
    });
    console.log('Contract verified successfully.');
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
