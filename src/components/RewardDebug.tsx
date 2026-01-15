import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import PoolABI from "../abi/CommunityYieldPool.json";
import { COMMUNITY_YIELD_POOL_ADDRESS, REWARD_TOKEN_ADDRESS } from "../utils/constants";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function RewardDebug() {
  const { signer, isConnected, account } = useWeb3();
  const [debug, setDebug] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugInfo = async () => {
    if (!signer || !isConnected || !account) return;

    setLoading(true);
    try {
      const contract = new ethers.Contract(COMMUNITY_YIELD_POOL_ADDRESS, PoolABI, signer);
      
      const [
        userData,
        rewardRate,
        totalShares,
        accRewardPerShare,
        lastUpdate,
        totalStaked,
        boostMaxE18,
        rewardToken
      ] = await Promise.all([
        contract.users(account),
        contract.rewardRate(),
        contract.totalShares(),
        contract.accRewardPerShareE18(),
        contract.lastUpdate(),
        contract.stakingToken(),
        contract.boostMaxE18(),
        contract.rewardToken(),
      ]);

      const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
      const lastUpdateBig = BigInt(lastUpdate.toString());
      const timeSinceUpdate = currentTimestamp - lastUpdateBig;

      // Get staking token contract to check pool balance
      const stakingTokenContract = new ethers.Contract(totalStaked, [
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ], signer);

      const [poolBalance, decimals] = await Promise.all([
        stakingTokenContract.balanceOf(COMMUNITY_YIELD_POOL_ADDRESS),
        stakingTokenContract.decimals(),
      ]);

      // Calculate step by step
      const rateBig = BigInt(rewardRate.toString());
      const sharesBig = BigInt(userData.shares.toString());
      const userRewardsPaid = BigInt(userData.userRewardPerSharePaid.toString());
      const accRewardBig = BigInt(accRewardPerShare.toString());
      
      const rewardPerSecond = timeSinceUpdate > 0n ? (rateBig * timeSinceUpdate * 1000000000000000000n) / BigInt(totalShares.toString()) : 0n;
      const rewardDifference = accRewardBig - userRewardsPaid;
      const pendingCalc = sharesBig > 0n ? (sharesBig * rewardDifference) / 1000000000000000000n : 0n;

      setDebug({
        // User Info
        userAddress: account,
        userShares: userData.shares.toString(),
        userBalance: ethers.formatUnits(userData.balance, decimals),
        userRewards: ethers.formatUnits(userData.rewards, 18),
        userRewardPerSharePaid: userData.userRewardPerSharePaid.toString(),
        
        // Pool Info
        poolBalance: ethers.formatUnits(poolBalance, decimals),
        totalPoolShares: ethers.formatUnits(totalShares, 18),
        rewardRate: ethers.formatUnits(rewardRate, 18),
        accRewardPerShare: accRewardPerShare.toString(),
        
        // Time Info
        lastUpdate: lastUpdate.toString(),
        currentTimestamp: currentTimestamp.toString(),
        timeSinceUpdate: timeSinceUpdate.toString(),
        
        // Calculation Info
        rewardPerSecond: ethers.formatUnits(rewardPerSecond, 18),
        rewardDifference: rewardDifference.toString(),
        pendingCalculated: ethers.formatUnits(pendingCalc, 18),
        
        // Boost info
        boostMax: ethers.formatUnits(boostMaxE18, 18),
        
        // Contract addresses
        rewardTokenAddress: rewardToken,
        stakingTokenAddress: totalStaked,
      });
    } catch (err) {
      console.error("Debug fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebugInfo();
    const interval = setInterval(fetchDebugInfo, 5000);
    return () => clearInterval(interval);
  }, [signer, isConnected, account]);

  if (!debug) return null;

  const hasRewards = parseFloat(debug.userRewards) > 0;

  return (
    <div className="card bg-yellow-50 border border-yellow-300 p-4 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-yellow-900">Pool & Rewards Diagnostic</h3>
        </div>
        <button
          onClick={fetchDebugInfo}
          disabled={loading}
          className="p-1 hover:bg-yellow-200 rounded transition-colors"
        >
          <RefreshCw className={`w-4 h-4 text-yellow-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4 text-sm text-yellow-800">
        {/* User Info */}
        <div>
          <h4 className="font-semibold text-yellow-900 mb-2">Your Rewards</h4>
          <div className="bg-white rounded p-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span>Pending Rewards:</span>
              <span className={hasRewards ? "text-green-600 font-bold" : "text-red-600"}>{debug.userRewards} tokens</span>
            </div>
            <div className="flex justify-between">
              <span>Your Shares:</span>
              <span>{ethers.formatUnits(debug.userShares, 18)}</span>
            </div>
            <div className="flex justify-between">
              <span>Your Staked:</span>
              <span>{debug.userBalance}</span>
            </div>
          </div>
        </div>

        {/* Pool Info */}
        <div>
          <h4 className="font-semibold text-yellow-900 mb-2">Pool Status</h4>
          <div className="bg-white rounded p-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span>Pool Total Staked:</span>
              <span>{ethers.formatUnits(debug.poolBalance, 18)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Shares:</span>
              <span>{debug.totalPoolShares}</span>
            </div>
            <div className="flex justify-between">
              <span>Reward Rate:</span>
              <span>{debug.rewardRate} tokens/sec</span>
            </div>
          </div>
        </div>

        {/* Calculation Details */}
        <div>
          <h4 className="font-semibold text-yellow-900 mb-2">Reward Calculation</h4>
          <div className="bg-white rounded p-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span>Time Since Update:</span>
              <span>{debug.timeSinceUpdate} seconds</span>
            </div>
            <div className="flex justify-between">
              <span>Reward Per Second:</span>
              <span>{debug.rewardPerSecond}</span>
            </div>
            <div className="flex justify-between">
              <span>Acc Reward Diff:</span>
              <span>{debug.rewardDifference}</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Calculated Pending:</span>
              <span>{debug.pendingCalculated}</span>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded p-3">
          <h4 className="font-semibold text-yellow-900 mb-2">Diagnosis</h4>
          <div className="space-y-1 text-xs">
            {hasRewards && (
              <div className="text-green-600">✅ You have claimable rewards! Click "Claim Rewards"</div>
            )}
            {!hasRewards && parseFloat(debug.userShares) === 0 && (
              <div className="text-red-600">❌ No stakes found. Deposit tokens first.</div>
            )}
            {!hasRewards && parseFloat(debug.userShares) > 0 && parseFloat(debug.timeSinceUpdate) < 10 && (
              <div className="text-orange-600">⏳ Pool was just updated. Rewards will appear shortly.</div>
            )}
            {!hasRewards && parseFloat(debug.userShares) > 0 && parseFloat(debug.timeSinceUpdate) >= 10 && parseFloat(debug.poolBalance) === 0 && (
              <div className="text-red-600">❌ Pool balance is 0. Rewards cannot be distributed.</div>
            )}
            {!hasRewards && parseFloat(debug.userShares) > 0 && parseFloat(debug.timeSinceUpdate) >= 10 && parseFloat(debug.poolBalance) > 0 && (
              <div className="text-orange-600">⚠️ Rewards may be rounding to 0 due to precision. Try larger stake amounts.</div>
            )}
            <div className="text-gray-600 mt-2">
              Contract: {COMMUNITY_YIELD_POOL_ADDRESS}
            </div>
            <div className="text-gray-600">
              Reward Token: {REWARD_TOKEN_ADDRESS}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

