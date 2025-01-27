require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

// Import the required modules
const hre = require('hardhat');

const tokenContract = '0xbFB5f204DeFB5D066B499368948B24eb3EC62bDE';
const sleepDuration = 5000;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const GuiziaNFT = await ethers.getContractFactory('GuiziaNFT');

  const contract = await GuiziaNFT.deploy(tokenContract);

  console.log('Contract deployed at:', contract.address);

  // Wait for the contract deployement to finish
  await new Promise((r) => setTimeout(r, sleepDuration));

  // Verify the contract after deployment
  console.log('Verifying the contract...');

  try {
    await hre.run('verify:verify', {
      address: contract.address,
      constructorArguments: [tokenContract],
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
