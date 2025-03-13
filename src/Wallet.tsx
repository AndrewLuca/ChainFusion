import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/Button";
import { Wallet, Shield, AlertTriangle } from "lucide-react";

// Globally declare the ethers variable that will be loaded from CDN
declare global {
  interface Window {
    ethers: any;
  }
}

declare const ethers: any;

export default function WalletPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"options" | "create" | "import" | "confirmation">("options");
  const [walletInfo, setWalletInfo] = useState<{
    address: string;
    privateKey: string;
    mnemonic?: string;
  } | null>(null);
  const [importKey, setImportKey] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load ethers.js from CDN
  useEffect(() => {
    if (typeof window.ethers !== 'undefined') {
      setScriptLoaded(true);
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://unpkg.com/ethers@5.7.2/dist/ethers.umd.min.js";
    script.async = true;
    
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError("Failed to load wallet library. Please refresh and try again.");
    
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  
  // Add logging to track script loading
  useEffect(() => {
    console.log("Script loaded state:", scriptLoaded);
  }, [scriptLoaded]);

  // Function to generate a new wallet
  const createNewWallet = async () => {
    if (!scriptLoaded) {
      setError("Wallet libraries are still loading. Please try again.");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      if (!window.crypto?.getRandomValues) {
        throw new Error("Your browser doesn't support secure wallet generation");
      }
      
      const randomBytes = new Uint8Array(32);
      window.crypto.getRandomValues(randomBytes);
      const extraEntropy = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      const wallet = window.ethers.Wallet.createRandom({ extraEntropy });
      
      setWalletInfo({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
      });
      
      setStep("confirmation");
    } catch (err) {
      setError("Failed to create wallet. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Function to import a wallet from private key
  const importWallet = async () => {
    if (!scriptLoaded) {
      setError("Wallet libraries are still loading. Please try again.");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      if (typeof window.ethers === 'undefined') {
        throw new Error("Wallet library not loaded properly");
      }
      
      const wallet = new window.ethers.Wallet(importKey);
      
      setWalletInfo({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
      
      setStep("confirmation");
    } catch (err) {
      setError("Invalid private key. Please check and try again.");
    } finally {
      setIsCreating(false);
    }
  };

  // Function to save wallet to local storage and proceed
  const saveWalletAndContinue = () => {
    if (!walletInfo) return;
    navigate("/Dashboard");
  };

  // Render different steps based on current step
  const renderStep = () => {
    switch (step) {
      case "options":
        return (
          <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Wallet Setup</h1>
              <p className="text-gray-400">
                Choose an option below to setup your crypto wallet
              </p>
            </div>

            <div className="grid gap-4">
              {/* Create New Wallet Card */}
              <div className="border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-start mb-4">
                  <div className="p-3 rounded-lg bg-blue-900/20 mr-4">
                    <Wallet className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Create New Wallet</h3>
                    <p className="text-gray-400 text-sm">
                      Generate a brand new wallet with a unique address and private key. 
                      You'll also receive a recovery phrase to backup your wallet.
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setStep("create")}
                >
                  Create New Wallet
                </Button>
              </div>

              {/* Import Existing Wallet Card */}
              <div className="border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-start mb-4">
                  <div className="p-3 rounded-lg bg-blue-900/20 mr-4">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Import Existing Wallet</h3>
                    <p className="text-gray-400 text-sm">
                      Already have a wallet? Import it using your private key to access your 
                      existing tokens and assets.
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setStep("import")}
                >
                  Import Wallet
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        );
        
      case "create":
        return (
          <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Create New Wallet</h1>
              <p className="text-gray-400">
                We'll generate a secure wallet for you on the Binance Smart Chain
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mr-3" />
                <div className="text-yellow-200 text-sm">
                  <p className="font-semibold mb-1">Security Warning</p>
                  <p>
                    Your private key and recovery phrase are the only way to access your wallet. 
                    Make sure to store them securely offline. Never share them with anyone.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full py-4"
              onClick={createNewWallet}
              disabled={isCreating || !scriptLoaded}
            >
              {isCreating ? "Generating Secure Wallet..." : "Generate New Wallet"}
              {!scriptLoaded && " (Loading Libraries...)"}
            </Button>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setStep("options")}
              disabled={isCreating}
            >
              Back
            </Button>
          </div>
        );

      case "import":
        return (
          <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Import Existing Wallet</h1>
              <p className="text-gray-400">
                Enter your private key to access your wallet
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mr-3" />
                <div className="text-yellow-200 text-sm">
                  <p className="font-semibold mb-1">Security Warning</p>
                  <p>
                    Never enter your private key on a website you don't trust. 
                    ChainFusion stores your key locally and never sends it to any server.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-300 mb-1 block">Private Key</span>
                <input
                  type="text"
                  value={importKey}
                  onChange={(e) => setImportKey(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="text-gray-500 text-xs mt-1 block">
                  Your private key should start with 0x and be 64 characters long
                </span>
              </label>

              <Button 
                className="w-full py-4 mt-4"
                onClick={importWallet}
                disabled={importKey.length < 66 || isCreating || !scriptLoaded}
              >
                {isCreating ? "Importing Wallet..." : "Import Wallet"}
                {!scriptLoaded && " (Loading Libraries...)"}
              </Button>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setStep("options")}
                disabled={isCreating}
              >
                Back
              </Button>
            </div>
          </div>
        );

      case "confirmation":
        return (
          <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Wallet Ready</h1>
              <p className="text-gray-400">
                Your wallet has been {walletInfo?.mnemonic ? "created" : "imported"} successfully
              </p>
            </div>

            <div className="border border-gray-700 rounded-lg p-4 space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Wallet Address</p>
                <p className="font-mono bg-gray-900 p-3 rounded text-sm break-all">
                  {walletInfo?.address}
                </p>
              </div>

              {walletInfo?.mnemonic && (
                <div>
                  <p className="text-gray-400 text-sm mb-1 flex justify-between">
                    <span>Recovery Phrase</span>
                    <span className="text-yellow-400 text-xs">
                      Write this down and keep it safe!
                    </span>
                  </p>
                  <p className="font-mono bg-gray-900 p-3 rounded text-sm break-all">
                    {walletInfo.mnemonic}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-400 text-sm mb-1 flex justify-between">
                  <span>Private Key</span>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)} 
                    className="text-blue-400 text-xs hover:underline"
                  >
                    {showPrivateKey ? "Hide" : "Show"}
                  </button>
                </p>
                <p className="font-mono bg-gray-900 p-3 rounded text-sm break-all">
                  {showPrivateKey 
                    ? walletInfo?.privateKey 
                    : "•".repeat(64)}
                </p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex">
                <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mr-3" />
                <div className="text-gray-200 text-sm">
                  <p className="font-semibold mb-1">Important Security Reminder</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-400">
                    <li>Store your private key and recovery phrase securely offline</li>
                    <li>Never share these with anyone</li>
                    <li>ChainFusion never stores your private keys on our servers</li>
                    <li>If you lose your private key and recovery phrase, you will permanently lose access to your funds</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button 
                className="w-full py-4"
                onClick={saveWalletAndContinue}
              >
                Continue to Wallet
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setStep("options")}
              >
                Start Over
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center mr-2">
            <Wallet className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold">ChainFusion</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {renderStep()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-600 h-6 w-6 rounded-lg flex items-center justify-center mr-2">
                <Wallet className="h-4 w-4" />
              </div>
              <span className="font-semibold">ChainFusion</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} ChainFusion. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
