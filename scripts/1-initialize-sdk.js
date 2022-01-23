import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

//Test that the variables exist
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.log("Prive key not found");
}
if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.log("WALLET_ADDRESS  not found");
}
if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
  console.log("ALCHEMY_API_URL not found");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL)
  )
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})();

// Export for use in other scripts
export default sdk;

