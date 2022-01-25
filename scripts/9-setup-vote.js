import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const voteModule = sdk.getVoteModule(
  "0x3ECd66c22D80248F8E4a82dC8213417E86c3b802"
);
const tokenModule = sdk.getTokenModule(
  "0xCa7c3f9a1E33D1F9359968AD7e2588F715423427"
);

(async () => {
  // Give mint rights to the vote module
  try {
    await tokenModule.grantRole("minter", voteModule.address);
    console.log("Successfully gave vote module permission to mint.");
  } catch (error) {
    console.error("Failed to grant vote permissions", error);
    process.exit(1);
  }

  // Give my tokens to the vote contract
  try {
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);

    await tokenModule.transfer(voteModule.address, percent90);
    console.log("Successfully transferred tokens to the vote contract.");
  } catch (error) {
    console.error("Failed to transfer tokens to the vote contract", error);
  }
})();
