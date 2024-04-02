"use client";

import { useEffect } from "react";
// import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
// import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
// import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
// import { appChains } from "~~/services/web3/wagmiConnectors";
import { DynamicContextProvider, EvmNetwork } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

// Setting up list of evmNetworks
const evmNetworks: EvmNetwork[] = [
  {
    networkId: 11155111,
    name: "Sepolia",
    chainId: 11155111,
    rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    iconUrls: ["https://ethereum.org/_ipx/w_1920,q_75/%2F_next%2Fstatic%2Fmedia%2Feth-diamond-purple.7929ed26.png"],
  },
  // {
  //   networkId: 31337,
  //   name: "Localhost",
  //   chainId: 31337,
  //   rpcUrls: ["http://127.0.0.1:8545"],
  //   blockExplorerUrls: ["https://sepolia.etherscan.io/"],
  //   nativeCurrency: {
  //     name: "Ethereum",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   iconUrls: ["https://ethereum.org/_ipx/w_1920,q_75/%2F_next%2Fstatic%2Fmedia%2Feth-diamond-purple.7929ed26.png"],
  // },
  // {
  //   networkId: 1,
  //   name: "Ethereum Mainnet",
  //   chainId: 1,
  //   rpcUrls: ["https://mainnet.infura.io/v3/"],
  //   blockExplorerUrls: ["https://etherscan.io/"],
  //   nativeCurrency: {
  //     name: "Ethereum",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   iconUrls: ["https://ethereum.org/_ipx/w_1920,q_75/%2F_next%2Fstatic%2Fmedia%2Feth-diamond-purple.7929ed26.png"],
  // }
];

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  // const { resolvedTheme } = useTheme();
  // const isDarkMode = resolvedTheme === "dark";
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  
  return (
    <DynamicContextProvider
    settings={{
      environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || "",
      walletConnectors: [EthereumWalletConnectors],
      evmNetworks: evmNetworks,
    }}>
    <WagmiConfig config={wagmiConfig}>
      <ProgressBar />
      <DynamicWagmiConnector>
        <ScaffoldEthApp>{children}</ScaffoldEthApp>
      </DynamicWagmiConnector>
    </WagmiConfig>
    </DynamicContextProvider>
  );
};
