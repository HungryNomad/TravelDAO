import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "0x5bE2C11CdbB7E9b5a82f1A56598d37d31F349452"
);

const tokenModule = sdk.getTokenModule(
  "0xCa7c3f9a1E33D1F9359968AD7e2588F715423427"
);

const App = () => {
  // Use connect wallet
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address);

  const signer = provider ? provider.getSigner() : undefined;
  // Use isClaiming to keep a loading state while NFT is minting
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);
  // Shorten the address
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // Grab addresses of NFT holders
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("Member addresses", addresses);
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("Failed to get member list", err);
      });
  }, [hasClaimedNFT]);

  // Grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("Amounts", amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, [hasClaimedNFT]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

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

  // Show DAO to members
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>Travel DAO Member Page</h1>
      <p>Thank you for being a member, more things to come.</p>
      <div>
        <div>
          <h2>Member List</h2>
          <table className="card">
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

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
  };

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
