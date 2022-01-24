import { useEffect, useMemo, useState } from "react";


import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk"

// Set setup on Rinkby
const sdk = new ThirdwebSDK("rinkeby")

// Grab the reference to the ERC-1155
const bundleDropModule = sdk.getBundleDropModule(
  "0x5bE2C11CdbB7E9b5a82f1A56598d37d31F349452"
);

const App = () => {
  // Use connect wallet
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  // Does the user have the NFT yet?
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

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
        console.log("User has an NFT membership")
      } else {
        setHasClaimedNFT(false);
        console.log("User does not have an NFT membership")
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

  return (
    <div className="landing">
      <h1>Wallet connect! What next?</h1>
    </div>
  );
};

export default App;