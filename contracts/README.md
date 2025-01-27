# Guizia thirdweb hardhat project

This project is used as a guide to show how to deploy Guizia contracts with Hardhat & Thirdweb.

Install dependencies

```bash
yarn install
```

To compile the contracts code

```bash
npx hardhat clean
npx hardhat compile
```

Then , you'll need to fill the .env variables;
You can get the sonicscan api key on https://sonicscan.org/ by creating an account

To deploy and verify with hardhat

```bash
npx hardhat run scripts/deployGuizia.js --network sonicBlaze
npx hardhat run scripts/deployGuiziaNFT.js --network sonicBlaze
```

To deploy it using thirdweb

```bash
yarn deploy -k YOUR_THIRDWEB_SECRET_KEY
```
