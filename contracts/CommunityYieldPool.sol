// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IRewardToken {
    function mint(address to, uint256 amount) external;
}

contract CommunityYieldPool is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // -----------------------
    // State
    // -----------------------
    IERC20 public stakingToken;         // e.g., your MockUSD token
    IRewardToken public rewardToken;    // reward token that mints yield

    uint256 public rewardRate;          // reward tokens distributed per second
    uint256 public lastUpdate;          // last global reward update
    uint256 public accRewardPerShareE18; // accumulated rewards per share, scaled 1e18

    uint256 public totalShares;         // total shares (time-weighted)
    uint256 public penaltyBps;          // penalty for early withdrawal (basis points, 100 = 1%)
    uint256 public maxLock;             // max lock duration in seconds
    uint256 public boostMaxE18;         // maximum boost multiplier (scaled 1e18)

    struct UserInfo {
        uint256 balance;                 // how many tokens user deposited
        uint256 shares;                  // boosted shares
        uint256 rewards;                 // pending reward tokens
        uint256 userRewardPerSharePaid;  // user’s snapshot of accRewardPerShareE18
        uint256 lockExpiry;              // timestamp until which withdrawal penalty applies
    }
    mapping(address => UserInfo) public users;

    // -----------------------
    // Events
    // -----------------------
    event Deposited(address indexed user, uint256 amount, uint256 lockDuration, uint256 totalShares);
    event Withdrawn(address indexed user, uint256 amount, uint256 penalty, uint256 totalShares);
    event Claimed(address indexed user, uint256 reward);

    // -----------------------
    // Constructor
    // -----------------------
    constructor(
        address _stakingToken,
        address _rewardToken,
        uint256 _rewardRate,
        uint256 _penaltyBps,
        uint256 _maxLock,
        uint256 _boostMaxE18
    ) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IRewardToken(_rewardToken);
        rewardRate = _rewardRate;
        penaltyBps = _penaltyBps;
        maxLock = _maxLock;
        boostMaxE18 = _boostMaxE18;
        lastUpdate = block.timestamp;
    }

    // -----------------------
    // Internal Helpers
    // -----------------------
    function _multiplierForLock(uint256 lockDuration) internal view returns (uint256) {
        if (lockDuration == 0) return 1e18; // 1.0x
        if (lockDuration >= maxLock) return boostMaxE18;
        uint256 extra = ((boostMaxE18 - 1e18) * lockDuration) / maxLock;
        return 1e18 + extra;
    }

    function _updateGlobal() internal {
        if (block.timestamp > lastUpdate) {
            if (totalShares > 0) {
                uint256 duration = block.timestamp - lastUpdate;
                uint256 reward = duration * rewardRate;
                accRewardPerShareE18 += (reward * 1e18) / totalShares;
            }
            lastUpdate = block.timestamp;
        }
    }

    function _updateUser(address userAddr) internal {
        UserInfo storage u = users[userAddr];
        if (u.shares > 0) {
            uint256 pending = (u.shares * (accRewardPerShareE18 - u.userRewardPerSharePaid)) / 1e18;
            u.rewards += pending;
        }
        u.userRewardPerSharePaid = accRewardPerShareE18;
    }

    // -----------------------
    // User Functions
    // -----------------------
    function deposit(uint256 amount, uint256 lockDuration) external nonReentrant {
        require(amount > 0, "amount=0");
        require(lockDuration <= maxLock, "lock>max");

        _updateGlobal();
        _updateUser(msg.sender);

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        uint256 m = _multiplierForLock(lockDuration); // 1e18-scaled
        uint256 mintedShares = (amount * m) / 1e18;

        UserInfo storage u = users[msg.sender];
        u.balance += amount;
        u.shares += mintedShares;
        totalShares += mintedShares;

        uint256 newExpiry = block.timestamp + lockDuration;
        if (newExpiry > u.lockExpiry) u.lockExpiry = newExpiry;

        emit Deposited(msg.sender, amount, lockDuration, u.shares);
    }

    function withdraw(uint256 amount) public nonReentrant {
        require(amount > 0, "amount=0");
        UserInfo storage u = users[msg.sender];
        require(u.balance >= amount, "insufficient");

        _updateGlobal();
        _updateUser(msg.sender);

        uint256 sharesToBurn = (u.shares * amount) / u.balance;
        u.balance -= amount;
        u.shares -= sharesToBurn;
        totalShares -= sharesToBurn;

        uint256 penalty = 0;
        if (block.timestamp < u.lockExpiry && penaltyBps > 0) {
            penalty = (amount * penaltyBps) / 10_000;
            amount -= penalty; // penalty stays in contract
        }

        stakingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount, penalty, u.shares);
    }

    function claim() public nonReentrant {
        _updateGlobal();
        _updateUser(msg.sender);

        uint256 reward = users[msg.sender].rewards;
        require(reward > 0, "no rewards");

        users[msg.sender].rewards = 0;
        rewardToken.mint(msg.sender, reward);

        emit Claimed(msg.sender, reward);
    }

    function exit() external {
        uint256 bal = users[msg.sender].balance;
        if (bal > 0) {
            withdraw(bal);
        }
        if (users[msg.sender].rewards > 0) {
            claim();
        }
    }
}
