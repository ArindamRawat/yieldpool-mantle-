# Community Yield Pool

A modern, lightweight DeFi protocol where users pool stablecoins together, and the protocol automatically distributes yield back fairly based on contribution and staking duration.

## 🚀 Features

- **Beautiful Landing Page**: Modern, responsive landing page with compelling content and clear call-to-actions
- **Modern UI/UX**: Beautiful, responsive interface built with React, TypeScript, and Tailwind CSS
- **Wallet Integration**: Seamless MetaMask integration with proper error handling
- **Real-time Updates**: Live pool statistics and user balance updates
- **Smart Contract Integration**: Full integration with Ethereum smart contracts
- **Yield Farming**: Earn rewards based on staking amount and lock duration
- **Lock Periods**: Flexible staking with configurable lock periods
- **Early Exit Penalties**: Incentivize long-term staking with penalty system
- **Navigation System**: Easy switching between landing page and main application
 
## Video Demo:

[View](https://youtu.be/VCv9bXFDjfU)


## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Web3**: Ethers.js v6
- **Blockchain**: Mantle Testnet (EVM compatible)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd community-yield-pool
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏃‍♂️ Run Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔧 Configuration

### Smart Contract Addresses (Mantle Testnet)

The contracts have been deployed on Mantle Testnet with the following addresses:

- **CommunityYieldPool**: `0x99E1e7aFddd4380Ea510B0e16C27B0df93C809db`
- **StableToken (mUSD)**: `0xd6ab42c85DA47FD1ccCc5A8A4c109157bc16b5a2`
- **RewardToken (RT)**: `0x3E90F36A70eE6A2C4D4133d4ED5B62E06Ae2a5b5`

These addresses are automatically loaded from the `.env` file.

### Environment Variables

A `.env` file has been created in the root directory with Mantle Testnet configuration:

```env
VITE_CHAIN_ID=5003
VITE_RPC_URL=https://rpc.sepolia.mantle.xyz

VITE_COMMUNITY_YIELD_POOL_ADDRESS=0x99E1e7aFddd4380Ea510B0e16C27B0df93C809db
VITE_MOCK_STABLE_ADDRESS=0xd6ab42c85DA47FD1ccCc5A8A4c109157bc16b5a2
VITE_REWARD_TOKEN_ADDRESS=0x3E90F36A70eE6A2C4D4133d4ED5B62E06Ae2a5b5

VITE_REWARD_RATE=100000000000000000
VITE_PENALTY_BPS=500
VITE_MAX_LOCK=2592000
VITE_BOOST_MAX_E18=2000000000000000000
```

**Note**: Make sure to add `.env.local` to your `.gitignore` if you have local overrides.

## 📱 Usage

### Network Setup

Before using the application, ensure your MetaMask wallet is connected to **Mantle Sepolia Testnet**:
- **Chain ID**: 5003
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **Block Explorer**: https://explorer.sepolia.mantle.xyz
- You can add this network to MetaMask or it will be automatically added on first connection

### Connecting Wallet

1. Click "Connect Wallet" in the header
2. If not on Mantle Sepolia Testnet, MetaMask will prompt you to switch networks
3. Approve the connection in MetaMask
4. Your wallet address will be displayed in the header

### Depositing Tokens

1. Navigate to the "Deposit Tokens" section
2. Enter the amount you want to stake
3. Set your desired lock duration (in days)
4. Click "Deposit Tokens"
5. Confirm the transaction in MetaMask

### Withdrawing Tokens

1. Navigate to the "Withdraw Tokens" section
2. View your current staked balance and lock status
3. Enter the amount you want to withdraw
4. Click "Withdraw Tokens"
5. Confirm the transaction in MetaMask

**Note**: Early withdrawals may incur penalties based on your lock period.

### Claiming Rewards

1. Navigate to the "Claim Rewards" section
2. View your pending rewards
3. Click "Claim Rewards"
4. Confirm the transaction in MetaMask

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard with pool stats
│   ├── DepositForm.tsx # Token deposit form
│   ├── WithdrawForm.tsx # Token withdrawal form
│   └── ClaimRewards.tsx # Reward claiming component
├── context/            # React context providers
│   └── Web3Context.tsx # Web3 wallet integration
├── abi/               # Smart contract ABIs
│   ├── CommunityYieldPool.json
│   ├── MockStable.json
│   └── RewardToken.json
├── utils/             # Utility functions
│   └── constants.ts   # Contract addresses and constants
└── App.tsx           # Main application component
```

## 🔒 Smart Contracts

The application integrates with the following smart contracts:

- **CommunityYieldPool**: Main staking contract
- **MockStable**: Stablecoin token for staking
- **RewardToken**: Token distributed as rewards

- **Mock Stable Coin**: 0xb53fe944711072481EA792b44E08986206ceA723
- **Reward Token**: 0x53476cC0bEa57D4B862397b2520d5Eb0eE5Fa751
- **Community Yield Pool**: 0x927aa880Eab7EA338CeD283E78DBAFD8564D8f20

### Key Contract Functions

- `deposit(amount, lockDuration)`: Stake tokens with lock period
- `withdraw(amount)`: Withdraw staked tokens
- `claim()`: Claim accumulated rewards
- `users(address)`: Get user staking information

## 🎨 UI Components

### Design System

- **Colors**: Primary blue, success green, warning orange, danger red
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Shadows**: Subtle elevation with hover effects

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Grid layouts that adapt to screen size

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Wallet Connection Errors**: Clear messages for MetaMask issues
- **Transaction Errors**: Detailed error messages for failed transactions
- **Network Errors**: Handling for RPC connection issues
- **Validation Errors**: Input validation with helpful feedback

## ⚠️ Known Issues

- Rewards are being distributed correctly at the smart contract level, but there is currently a UI integration issue causing them not to be reflected properly in the frontend.  
- This is a minor issue, and fixes are in progress to ensure rewards display accurately in the dashboard.

## 🔄 State Management

- **Web3 Context**: Global wallet and contract state
- **Local State**: Component-specific state for forms and UI
- **Real-time Updates**: Automatic refresh of pool and user data

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm test:watch
```

## 📦 Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables

### Traditional Hosting

1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your server to serve `index.html` for all routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Ensure MetaMask is installed and connected
3. Verify you're on the correct network
4. Check that you have sufficient tokens and ETH for gas

## 🔮 Roadmap

- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Governance features
- [ ] Additional reward tokens
- [ ] Social features and leaderboards

---

Built with ❤️ for the DeFi community
