import { useEffort, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";

const App = () => {
  // Use connect wallet
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  // If they haven't connected thier wallet
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
