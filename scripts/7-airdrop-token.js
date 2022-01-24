import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const bundleDropModule = sdk.getBundleDropModule(
  "0x5bE2C11CdbB7E9b5a82f1A56598d37d31F349452"
);

const tokenModule = sdk.getTokenModule(
  "0xCa7c3f9a1E33D1F9359968AD7e2588F715423427"
);
(async () => {
  try {
    const walletAddresses = await bundleDropModule.getAllClaimerAddresses("0");
    if (walletAddresses.length === 0) {
      console.log("No NFTs have been claimed yet.");
      process.exit(0);
    }

    // Loop though addresses
    const airdropTargets = walletAddresses.map((address) => {
      // Give away random amounts that
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
        console.log("Going to drop", randomAmount, "tokens to", address);

        // Set up target
        const airdropTarget = {
          address,
          amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
        };
        return airdropTarget;
    });
    // Batch transfer to send all the tokens
    console.log("Starting airdrop!!!")
    await tokenModule.transferBatch(airdropTargets);
    console.log("Successfully airdropped all the tokens to all NFT holders")
  } catch (error) {
    console.error("Failed to airdrop", error);
  }
})();