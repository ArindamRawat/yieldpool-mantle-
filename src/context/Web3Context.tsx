import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ethers } from "ethers";

interface IWeb3Context {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<IWeb3Context>({
  provider: null,
  signer: null,
  account: null,
  isConnecting: false,
  isConnected: false,
  error: null,
  connect: async () => {},
  disconnect: () => {}
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to use this app.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const prov = new ethers.BrowserProvider(window.ethereum);
      setProvider(prov);

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await prov.getSigner();
      
      setAccount(accounts[0]);
      setSigner(signer);

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setSigner(null);
        } else {
          setAccount(accounts[0]);
          prov.getSigner().then(setSigner);
        }
      });

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setError(null);
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          connect();
        }
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{ 
      provider, 
      signer, 
      account, 
      isConnecting, 
      isConnected: !!account, 
      error, 
      connect, 
      disconnect 
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
