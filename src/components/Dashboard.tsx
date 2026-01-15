import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../context/Web3Context";
import PoolABI from "../abi/CommunityYieldPool.json";
import { COMMUNITY_YIELD_POOL_ADDRESS } from "../utils/constants";
import { TrendingUp, Users, Lock, Coins, Wallet } from "lucide-react";

export default function Dashboard() {
  const { signer, isConnected, account } = useWeb3();
  const [poolStats, setPoolStats] = useState({
    totalStaked: "0",
    rewardRate: "0",
    maxLock: "0",
    penaltyBps: "0"
  });
  const [userStats, setUserStats] = useState({
    stakedBalance: "0",
    pendingRewards: "0",
    lockExpiry: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!signer) return;
      
      try {
        const contract = new ethers.Contract(COMMUNITY_YIELD_POOL_ADDRESS, PoolABI, signer);
        
        const [rewardRate, maxLock, penaltyBps] = await Promise.all([
          contract.rewardRate(),
          contract.maxLock(),
          contract.penaltyBps()
        ]);

        const stakingToken = await contract.stakingToken();
        const tokenContract = new ethers.Contract(stakingToken, [
          "function balanceOf(address) view returns (uint256)",
          "function decimals() view returns (uint8)"
        ], signer);
        
        const poolBalance = await tokenContract.balanceOf(COMMUNITY_YIELD_POOL_ADDRESS);
        const decimals = await tokenContract.decimals();

        setPoolStats({
          totalStaked: ethers.formatUnits(poolBalance, decimals),
          rewardRate: ethers.formatUnits(rewardRate, 18),
          maxLock: formatDuration(Number(maxLock)),
          penaltyBps: (Number(penaltyBps) / 100).toString()
        });

        if (isConnected && account) {
          const userData = await contract.users(account);
          setUserStats({
            stakedBalance: ethers.formatUnits(userData.balance, 18),
            pendingRewards: ethers.formatUnits(userData.rewards, 18),
            lockExpiry: Number(userData.lockExpiry)
          });
        }
        
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [signer, isConnected, account]);

  const formatNumber = (num: string) => {
    const n = parseFloat(num);
    if (n === 0) return "0";
    if (n < 0.0001) return "< 0.0001";
    if (n >= 1000000) return (n / 1000000).toFixed(2) + "M";
    if (n >= 1000) return (n / 1000).toFixed(2) + "K";
    return n.toFixed(4);
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Yield Pool</h1>
        <p className="text-lg text-gray-600">Pool your stablecoins and earn yield together</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Coins className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Staked</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(poolStats.totalStaked)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reward Rate</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(poolStats.rewardRate)}/sec</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Lock className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Max Lock</p>
              <p className="text-2xl font-bold text-gray-900">{poolStats.maxLock}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger-100 rounded-lg">
              <Users className="w-6 h-6 text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Early Exit Penalty</p>
              <p className="text-2xl font-bold text-gray-900">{poolStats.penaltyBps}%</p>
            </div>
          </div>
        </div>
      </div>

      {isConnected && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Portfolio</h2>
              <p className="text-sm text-gray-600">Connected: {formatAddress(account!)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">Staked Balance</p>
              <p className="text-xl font-bold text-gray-900">{formatNumber(userStats.stakedBalance)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">Pending Rewards</p>
              <p className="text-xl font-bold text-success-600">{formatNumber(userStats.pendingRewards)}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">Lock Status</p>
              <p className="text-xl font-bold text-gray-900">
                {userStats.lockExpiry > Math.floor(Date.now() / 1000) ? "Locked" : "Unlocked"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
