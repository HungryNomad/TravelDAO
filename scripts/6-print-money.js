import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0xCa7c3f9a1E33D1F9359968AD7e2588F715423427"
);

(async () => {
  try {
    const amount = 1_000_000;
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();
    console.log(
      "There now is",
      ether.utils.formatUnits(totalSupply, 18),
      "$TDAO in circulation"
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
