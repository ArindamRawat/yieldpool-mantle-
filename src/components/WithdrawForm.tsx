import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import PoolABI from "../abi/CommunityYieldPool.json";
import { COMMUNITY_YIELD_POOL_ADDRESS } from "../utils/constants";
import { Wallet, Download, AlertCircle, CheckCircle, Loader2, Clock } from "lucide-react";
import clsx from "clsx";

export default function WithdrawForm() {
  const { signer, isConnected } = useWeb3();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stakedBalance, setStakedBalance] = useState<string>("0");
  const [lockExpiry, setLockExpiry] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);

  // Fetch user staked balance and lock status
  useEffect(() => {
    const fetchStakedData = async () => {
      if (!signer || !isConnected) return;
      
      try {
        const contract = new ethers.Contract(COMMUNITY_YIELD_POOL_ADDRESS, PoolABI, signer);
        const userAddress = await signer.getAddress();
        const userData = await contract.users(userAddress);
        
        setStakedBalance(ethers.formatUnits(userData.balance, 18));
        setLockExpiry(Number(userData.lockExpiry));
        
        // Check if tokens are still locked
        const currentTime = Math.floor(Date.now() / 1000);
        setIsLocked(currentTime < Number(userData.lockExpiry));
        
      } catch (err) {
        console.error("Failed to fetch staked data:", err);
      }
    };

    fetchStakedData();
  }, [signer, isConnected]);

  const validateInputs = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    
    if (parseFloat(amount) > parseFloat(stakedBalance)) {
      setError("Insufficient staked balance");
      return false;
    }
    
    return true;
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!validateInputs()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const contract = new ethers.Contract(COMMUNITY_YIELD_POOL_ADDRESS, PoolABI, signer);
      
      const tx = await contract.withdraw(ethers.parseUnits(amount, 18));
      await tx.wait();
      
      setSuccess("Withdrawal successful! Your tokens have been returned.");
      setAmount("");
      
      // Refresh staked balance
      const userAddress = await signer.getAddress();
      const userData = await contract.users(userAddress);
      setStakedBalance(ethers.formatUnits(userData.balance, 18));
      setLockExpiry(Number(userData.lockExpiry));
      
      const currentTime = Math.floor(Date.now() / 1000);
      setIsLocked(currentTime < Number(userData.lockExpiry));
      
    } catch (err: any) {
      console.error("Withdrawal failed:", err);
      setError(err.message || "Withdrawal failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxAmount = () => {
    setAmount(stakedBalance);
  };

  const formatTimeRemaining = () => {
    if (!isLocked) return "Unlocked";
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeRemaining = lockExpiry - currentTime;
    
    if (timeRemaining <= 0) return "Unlocked";
    
    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-danger-100 rounded-lg">
          <Download className="w-6 h-6 text-danger-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Withdraw Tokens</h2>
          <p className="text-sm text-gray-600">Unstake your tokens and claim rewards</p>
        </div>
      </div>

      {!isConnected && (
        <div className="mb-4 p-4 bg-warning-50 border border-warning-200 rounded-xl">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-warning-600" />
            <span className="text-warning-800 font-medium">Wallet not connected</span>
          </div>
          <p className="text-sm text-warning-700 mt-1">Connect your wallet to withdraw</p>
        </div>
      )}

      {isConnected && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Staked Balance:</span>
            <span className="text-lg font-semibold text-gray-900">
              {parseFloat(stakedBalance).toFixed(4)} tokens
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm font-medium text-gray-700">Lock Status:</span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className={clsx(
                "text-sm font-medium",
                isLocked ? "text-warning-600" : "text-success-600"
              )}>
                {formatTimeRemaining()}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Withdraw
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pr-20"
              disabled={!isConnected || isLoading || parseFloat(stakedBalance) === 0}
            />
            <button
              onClick={handleMaxAmount}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors"
              disabled={!isConnected || isLoading || parseFloat(stakedBalance) === 0}
            >
              MAX
            </button>
          </div>
        </div>

        {isLocked && (
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning-600" />
              <span className="text-warning-800 font-medium">Tokens are locked</span>
            </div>
            <p className="text-sm text-warning-700 mt-1">
              Early withdrawal will incur a penalty. Consider waiting until the lock period expires.
            </p>
          </div>
        )}

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
          onClick={handleWithdraw}
          disabled={!isConnected || isLoading || parseFloat(stakedBalance) === 0}
          className={clsx(
            "w-full btn-danger",
            (!isConnected || isLoading || parseFloat(stakedBalance) === 0) && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Withdrawing...
            </div>
          ) : (
            "Withdraw Tokens"
          )}
        </button>
      </div>
    </div>
  );
}
