import sdk from "./1-initialize-sdk.js";

const appModule = sdk.getAppModule(
  "0xEF98Ee564d4a60Ab75CBE2F39438fa015364683E"
);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      name: "TravelDAO's Proposals",
      votingTokenAddress: "0xCa7c3f9a1E33D1F9359968AD7e2588F715423427",
      proposalStartWaitTimeInSeconds: 0,
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: "0",
    });
    console.log(
      "Successfully deployed vote module, address",
      voteModule.address
    );
  } catch (error) {
    console.error("Failed to deploy vote module", error);
  }
})();