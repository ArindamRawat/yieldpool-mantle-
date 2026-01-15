import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import PoolABI from "../abi/CommunityYieldPool.json";
import { COMMUNITY_YIELD_POOL_ADDRESS } from "../utils/constants";
import { Wallet, Lock, Coins, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import clsx from "clsx";

export default function DepositForm() {
  const { signer, isConnected } = useWeb3();
  const [amount, setAmount] = useState("");
  const [lockDuration, setLockDuration] = useState("30"); // Will be updated based on contract
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<string>("0");
  const [maxLockSeconds, setMaxLockSeconds] = useState<number>(0);

  // Fetch user balance and contract parameters
  useEffect(() => {
    const fetchData = async () => {
      if (!signer || !isConnected) return;
      
      try {
        const contract = new ethers.Contract(COMMUNITY_YIELD_POOL_ADDRESS, PoolABI, signer);
        
        // Fetch max lock duration from contract
        const maxLock = await contract.maxLock();
        setMaxLockSeconds(Number(maxLock));
        
        // Set default lock duration to 50% of max lock (in seconds)
        const defaultLockSeconds = Math.floor(Number(maxLock) * 0.5);
        setLockDuration(defaultLockSeconds.toString());
        
        // Fetch user balance
        const stakingToken = await contract.stakingToken();
        const tokenContract = new ethers.Contract(stakingToken, [
          "function balanceOf(address) view returns (uint256)",
          "function decimals() view returns (uint8)"
        ], signer);
        
        const balance = await tokenContract.balanceOf(await signer.getAddress());
        const decimals = await tokenContract.decimals();
        setUserBalance(ethers.formatUnits(balance, decimals));
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, [signer, isConnected]);

  const validateInputs = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    
    if (parseFloat(amount) > parseFloat(userBalance)) {
      setError("Insufficient balance");
      return false;
    }
    
    const lockSeconds = parseInt(lockDuration);
    if (!lockDuration || lockSeconds <= 0) {
      setError("Please enter a valid lock duration");
      return false;
    }
    
    if (lockSeconds > maxLockSeconds) {
      setError(`Lock duration cannot exceed ${maxLockSeconds} seconds (${(maxLockSeconds / 3600).toFixed(2)} hours)`);
      return false;
    }
    
    return true;
  };

  const handleDeposit = async () => {
    if (!isConnected || !signer) {
      setError("Please connect your wallet first");
      return;
    }

    if (!validateInputs()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const contract = new ethers.Contract(COMMUNITY_YIELD_POOL_ADDRESS, PoolABI, signer);
      const stakingToken = await contract.stakingToken();
      const tokenContract = new ethers.Contract(stakingToken, [
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ], signer);
      
      const amount18 = ethers.parseUnits(amount, 18);
      const userAddress = await signer.getAddress();
      
      // Check current allowance
      const allowance = await tokenContract.allowance(userAddress, COMMUNITY_YIELD_POOL_ADDRESS);
      
      // If allowance is insufficient, approve the amount
      if (allowance < amount18) {
        setSuccess("Approving token spend...");
        const approveTx = await tokenContract.approve(COMMUNITY_YIELD_POOL_ADDRESS, amount18);
        await approveTx.wait();
        setSuccess("Approval successful! Now depositing...");
      }
      
      // Use lock duration directly in seconds (no conversion needed)
      const lockDurationSeconds = parseInt(lockDuration);
      
      const tx = await contract.deposit(amount18, lockDurationSeconds);
      
      await tx.wait();
      
      setSuccess("Deposit successful! Your tokens are now staked.");
      setAmount("");
      
      // Refresh balance
      const balance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      setUserBalance(ethers.formatUnits(balance, decimals));
      
    } catch (err: any) {
      console.error("Deposit failed:", err);
      setError(err.message || "Deposit failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxAmount = () => {
    setAmount(userBalance);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Coins className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Deposit Tokens</h2>
          <p className="text-sm text-gray-600">Stake your tokens to earn yield</p>
        </div>
      </div>

      {!isConnected && (
        <div className="mb-4 p-4 bg-warning-50 border border-warning-200 rounded-xl">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-warning-600" />
            <span className="text-warning-800 font-medium">Wallet not connected</span>
          </div>
          <p className="text-sm text-warning-700 mt-1">Connect your wallet to start staking</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Deposit
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pr-20"
              disabled={!isConnected || isLoading}
            />
            <button
              onClick={handleMaxAmount}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
              disabled={!isConnected || isLoading}
            >
              MAX
            </button>
          </div>
          {isConnected && (
            <p className="text-sm text-gray-500 mt-1">
              Balance: {parseFloat(userBalance).toFixed(4)} tokens
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lock Duration (seconds)
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="30"
              value={lockDuration}
              onChange={(e) => setLockDuration(e.target.value)}
              className="input-field pr-12"
              disabled={!isConnected || isLoading}
              min="1"
              max={maxLockSeconds}
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              Current: {formatDuration(parseInt(lockDuration) || 0)}
            </p>
            <p className="text-sm text-gray-500">
              Max: {formatDuration(maxLockSeconds)}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Longer lock periods earn higher rewards
          </p>
        </div>

        {error && (
          <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-danger-600" />
              <span className="text-danger-800 font-medium">Error</span>
            </div>
            <p className="text-sm text-danger-700 mt-1">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-success-50 border border-success-200 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <span className="text-success-800 font-medium">Success</span>
            </div>
            <p className="text-sm text-success-700 mt-1">{success}</p>
          </div>
        )}

        <button
          onClick={handleDeposit}
          disabled={!isConnected || isLoading}
          className={clsx(
            "w-full btn-primary",
            (!isConnected || isLoading) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Depositing...
            </div>
          ) : (
            "Deposit Tokens"
          )}
        </button>
      </div>
    </div>
  );
}
