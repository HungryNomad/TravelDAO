import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x5bE2C11CdbB7E9b5a82f1A56598d37d31F349452",
);

const App = () => {
  // Use connect wallet
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  const signer = provider ? provider.getSigner() : undefined;
  // Use isClaiming to keep a loading state while NFT is minting
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // If wallet isn't connected, exit
    if (!address) {
      return;
    }

    // Check the user's NFT balance
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If greater than 0, they are already a member
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("User has an NFT membership");
        } else {
          setHasClaimedNFT(false);
          console.log("User does not have an NFT membership");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("Failed to get NFT balance", error);
      });
  }, [address]);

  // If they haven't connected their wallet
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Travel DAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  const mintNFT = () => {
    setIsClaiming(true);
    // Call bundleDropModule to mint the NFT to the user
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        setHasClaimedNFT(true);
        console.log(
          `Successfully minted, check it out on https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
        );
      })
      .catch((err) => {
        console.error("Failed to claim", err);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  }

  return (
    <div className="mint-nft">
      <h1>Mint your free TravelDAO membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNFT()}>
        {isClaiming ? "Minting..." : "Mint you NFT (FREE)"}
      </button>
    </div>
  );
};

export default App;
