import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0xEF98Ee564d4a60Ab75CBE2F39438fa015364683E");

(async () => {
  try {
    const tokenModule = await app.deployTokenModule({
      name: "TravelDAO Governance Token",
      symbol: "TDAO",
    });
    console.log(
      "Successfully deployed token module, address",
      tokenModule.address
    );
  } catch (err) {
    console.error("Failed to deploy token module", err);
  }
})();
