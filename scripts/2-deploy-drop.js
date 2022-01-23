import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0xEF98Ee564d4a60Ab75CBE2F39438fa015364683E");

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      name: "TravelDAO Membership",
      description: "A DAO to help others get out of the house",
      image: readFileSync("scripts/assets/ChiiBeach.jpg"),
      primarySaleRecipientAddress: process.env.WALLET_ADDRESS,
    });

    console.log(
      "Successfully deployed bundleDrop module, address:",
      bundleDropModule.address
    );
    console.log("bundleDrop metadata:", await bundleDropModule.getMetadata());
  } catch (error) {
    console.log("Failed to deploy bundleDrop module", error);
  }
})();
