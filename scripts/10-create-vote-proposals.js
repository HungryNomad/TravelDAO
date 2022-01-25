import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "0xCa7c3f9a1E33D1F9359968AD7e2588F715423427"
);

const voteModule = sdk.getVoteModule(
  "0x3ECd66c22D80248F8E4a82dC8213417E86c3b802"
);

(async () => {
    try {
      const amount = 500_000;
      // Create proposal to mint 500,000 new token to the treasury.
      await voteModule.propose(
        "Should the DAO mint an additional " + amount + " tokens into the treasury?",
        [
          {
            nativeTokenValue: 0,
            transactionData: tokenModule.contract.interface.encodeFunctionData(
              "mint",
              [
                voteModule.address,
                ethers.utils.parseUnits(amount.toString(), 18),
              ]
            ),
            toAddress: tokenModule.address,
          },
        ]
      );
  
      console.log("Successfully created proposal to mint tokens");
    } catch (error) {
      console.error("failed to create first proposal", error);
      process.exit(1);
    }
  
    try {
      const amount = 9_000;
      // Create proposal to transfer ourselves 6,900 tokens for being awesome.
      await voteModule.propose(
        "Should the DAO transfer " +
        amount + " tokens from the treasury to " +
        process.env.WALLET_ADDRESS + " for being awesome?",
        [
          {
            nativeTokenValue: 0,
            transactionData: tokenModule.contract.interface.encodeFunctionData(
              "transfer",
              [
                process.env.WALLET_ADDRESS,
                ethers.utils.parseUnits(amount.toString(), 18),
              ]
            ),
  
            toAddress: tokenModule.address,
          },
        ]
      );
  
      console.log(
        "Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
      );
    } catch (error) {
      console.error("failed to create second proposal", error);
    }
  })();
