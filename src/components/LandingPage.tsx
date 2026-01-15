import { useState } from "react";
import { ArrowRight, TrendingUp, Shield, Users, Coins, Zap, CheckCircle, Star, ArrowUpRight } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

interface LandingPageProps {
  onLaunchApp: () => void;
}

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const { connect, isConnecting } = useWeb3();
  const [activeTab, setActiveTab] = useState("features");

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "High Yield Farming",
      description: "Earn competitive yields by staking your stablecoins in our community pool"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Audited",
      description: "Built with OpenZeppelin contracts and best security practices"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Fair distribution based on contribution and staking duration"
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Flexible Staking",
      description: "Choose your lock duration and earn higher rewards for longer commitments"
    }
  ];

  const stats = [
    { label: "Total Value Locked", value: "$2.5M+", change: "+12.5%" },
    { label: "Active Users", value: "1,200+", change: "+8.3%" },
    { label: "Total Rewards Distributed", value: "$180K+", change: "+15.2%" },
    { label: "Average APY", value: "18.5%", change: "+2.1%" }
  ];

  const benefits = [
    "No minimum deposit requirements",
    "Instant rewards accumulation",
    "Early withdrawal with penalty protection",
    "Transparent fee structure",
    "Community governance ready",
    "Multi-chain compatibility"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4" />
              <span>DeFi Innovation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Community
              <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Yield Pool
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Pool your stablecoins together and earn yield through our innovative 
              <span className="font-semibold text-primary-600"> community-driven DeFi protocol</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onLaunchApp}
                className="btn-primary text-lg px-8 py-4 flex items-center gap-2"
              >
                Launch App
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
                Learn More
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-success-600 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Community Yield Pool?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of DeFi with our innovative yield farming protocol
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-primary-200 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Connect Wallet</h3>
              <p className="text-gray-600">
                Connect your MetaMask or any Web3 wallet to get started
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Deposit & Stake</h3>
              <p className="text-gray-600">
                Deposit your stablecoins and choose your lock duration
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Earn Rewards</h3>
              <p className="text-gray-600">
                Start earning yield immediately and claim rewards anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for the Community
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our protocol is designed with community-first principles, ensuring fair 
                distribution of rewards and transparent governance.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-8 h-8" />
                  <h3 className="text-2xl font-bold">Live Stats</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-100">Current APY</span>
                    <span className="text-2xl font-bold">18.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-100">Total Staked</span>
                    <span className="text-2xl font-bold">$2.5M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-100">Active Users</span>
                    <span className="text-2xl font-bold">1,200+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-100">Rewards Today</span>
                    <span className="text-2xl font-bold">$12.5K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of users already earning yield with our community-driven protocol
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onLaunchApp}
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Launch App
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Community Yield Pool</h3>
              <p className="text-gray-400">
                The future of community-driven DeFi yield farming
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Community Yield Pool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
