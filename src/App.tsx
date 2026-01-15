import { Web3Provider } from "./context/Web3Context";
import DepositForm from "./components/DepositForm";
import WithdrawForm from "./components/WithdrawForm";
import ClaimRewards from "./components/ClaimRewards";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import { Wallet, LogOut, AlertCircle, Menu, X } from "lucide-react";
import { useWeb3 } from "./context/Web3Context";
import { useState } from "react";

function AppContent() {
  const { isConnected, isConnecting, connect, disconnect, error, account } = useWeb3();
  const [currentPage, setCurrentPage] = useState<"landing" | "app">("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // If on landing page, show the landing page
  if (currentPage === "landing") {
    return <LandingPage onLaunchApp={() => setCurrentPage("app")} />;
  }

  // Main app interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-gray-900">Community Yield Pool</h1>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => setCurrentPage("landing")}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </button>
                <a href="#dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </a>
                <a href="#docs" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Docs
                </a>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              {error && (
                <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-danger-50 border border-danger-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-danger-600" />
                  <span className="text-sm text-danger-700">{error}</span>
                </div>
              )}
              
              {!isConnected ? (
                <button
                  onClick={connect}
                  disabled={isConnecting}
                  className="btn-primary"
                >
                  {isConnecting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </div>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block px-3 py-2 bg-primary-50 border border-primary-200 rounded-lg">
                    <span className="text-sm font-medium text-primary-700">
                      {formatAddress(account!)}
                    </span>
                  </div>
                  <button
                    onClick={disconnect}
                    className="btn-secondary"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setCurrentPage("landing");
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </button>
                <a href="#dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </a>
                <a href="#docs" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Documentation
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard />
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Pool Actions</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div id="deposit">
              <DepositForm />
            </div>
            <div id="withdraw">
              <WithdrawForm />
            </div>
            <div id="claim">
              <ClaimRewards />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Community Yield Pool - A lightweight DeFi protocol for pooling stablecoins and earning yield
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Built with React, TypeScript, and Ethers.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Web3Provider>
      <AppContent />
    </Web3Provider>
  );
}

export default App;
