import { useNavigate, Routes, Route } from "react-router-dom";
import { Button } from "./components/Button";
import { FeatureCard } from "./components/FeatureCard";
import { Wallet, BarChart3, Send, Shield, Lock } from "lucide-react";
import LoginPage from "./Login";
import WalletPage from "./Wallet";


export default function App() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Routes> 
        <Route path="/Login" element={<div className="flex-grow"><LoginPage /></div>} />
        <Route path="/Wallet" element={<div className="flex-grow"><WalletPage /></div>} />
        <Route path="/" element={
          <div className="flex-grow">
            
            {/* Header */}
            <header className="container mx-auto py-6 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center mr-2">
                  <Wallet className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold">ChainFusion</h1>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate("/Login")}
                className="text-gray-300 hover:text-white"
              >
                Login
              </Button>
            </header>

            <main>
              {/* Hero Section */}
              <section className="container mx-auto px-4 pt-20 flex flex-col items-center text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  Secure & Simple Crypto{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">
                    Ethereum
                  </span>{" "}
                  Wallet
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mb-10">
                  Access, manage, and transfer your crypto tokens with confidence. 
                  Full control of your crypto in a secure and intuitive interface.
                </p>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto"
                  onClick={() => navigate("/Login")}
                >
                  Get Started
                </Button>
                
                {/* Security Indicator */}
                <div className="flex items-center mt-8 text-gray-400">
                  <Lock className="h-4 w-4 mr-2" />
                  <span className="text-sm">Enterprise-grade security protocols</span>
                </div>
              </section>

              {/* Features Section */}
              <section className="container mx-auto px-4 pt-36">
                <h3 className="text-2xl font-bold mb-12 text-center">Powerful Features, Simplistic Design</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FeatureCard 
                    icon={Wallet}
                    title="Create or Import Wallets"
                    description="Easily generate a new wallet or import an existing one using your private key."
                  />
                  <FeatureCard 
                    icon={BarChart3}
                    title="Real-time Balances"
                    description="View your token balances and their current USD value with live market data."
                  />
                  <FeatureCard 
                    icon={Send}
                    title="Seamless Transfers"
                    description="Send crypto to any wallet address with just a few clicks. Fast and secure."
                  />
                </div>
              </section>

              {/* Security Section */}
              <section className="container mx-auto px-4 pt-36 pb-26 bg-gradient-to-b from-transparent to-black/30">
                <div className="max-w-3xl mx-auto text-center">
                  <Shield className="h-12 w-12 mx-auto mb-6 text-blue-500" />
                  <h3 className="text-2xl font-bold mb-4">Your Security is Our Priority</h3>
                  <p className="text-gray-400 mb-8">
                    ChainFusion never stores your private keys on our servers. All sensitive data is encrypted 
                    and stored locally on your device, giving you complete control over your assets.
                  </p>
                  <div className="flex justify-center flex-wrap gap-4">
                    <div className="bg-black/40 p-4 rounded-lg flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Non-custodial</span>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Client-side encryption</span>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Open-source code</span>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        } />
      </Routes>
      
      {/* Global Footer */}
      <footer className="border-t border-gray-800 h-[60px]">
        <div className="container mx-auto px-4 h-full">
          <div className="h-full grid grid-cols-2 items-center">
            <div className="flex items-center">
              <div className="bg-blue-600 h-6 w-6 rounded-lg flex items-center justify-center mr-2">
                <Wallet className="h-4 w-4" />
              </div>
              <span className="font-semibold">ChainFusion</span>
            </div>
            <div className="text-sm text-gray-500 text-right">
              © {new Date().getFullYear()} ChainFusion. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}