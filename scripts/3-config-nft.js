import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x5bE2C11CdbB7E9b5a82f1A56598d37d31F349452"
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Chii traveling across  the desert",
        description: "This NFT will give you access to TravelDAO",
        image: readFileSync("scripts/assets/ChiiBeach.jpg"),
      },
    ]);
    console.log("Successfully created the NFT for the drop!");
  } catch (error) {
    console.error("Failed to creat NFT", error);
  }
})();