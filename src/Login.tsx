import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/Button";
import { Wallet as WalletIcon, Shield, AlertTriangle, CirclePlus, Import, View } from "lucide-react";
import { ethers } from "ethers";
import { saveWallet, isValidMnemonic, isValidAddress } from "./utils/walletUtils";

export default function WalletPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"options" | "create" | "import" | "view" | "confirmation">("options");
  const [walletInfo, setWalletInfo] = useState<{
    address: string;
    privateKey?: string;
    mnemonic?: string;
  } | null>(null);
  const [address, setAddress] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const createNewWallet = async () => {
    setIsCreating(true);
    setError("");

    try {
      if (!window.crypto?.getRandomValues) {
        throw new Error("Your browser doesn't support secure wallet generation");
      }
      
      const wallet = ethers.Wallet.createRandom();
      
      setWalletInfo({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase,
      });
      
      setStep("confirmation");
    } catch (err) {
      setError("Failed to create wallet. Please try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const importWallet = async () => {
    setIsCreating(true);
    setError("");

    try {
      console.log("Mnemonic phrase:", mnemonic);
      const isValid = isValidMnemonic(mnemonic);
      console.log("Is mnemonic valid:", isValid);
      
      if (!isValid) {
        throw new Error("Invalid mnemonic phrase format");
      }

      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      
      setWalletInfo({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
      
      setStep("confirmation");
    } catch (err) {
      setError("Invalid mnemonic phrase. Please check and try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const viewWallet = async () => {
    setIsCreating(true);
    setError("");

    try {
      const isValid = isValidAddress(address);
      console.log("Is address valid:", isValid);
      
      if (!isValid) {
        throw new Error("Invalid address format");
      }
      
      setWalletInfo({
        address: address
      });
      
      setStep("confirmation");
    } catch (err) {
      setError("Invalid address key. Please check and try again.");
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };


  const saveWalletAndContinue = () => {
    if (!walletInfo) return;
    saveWallet(walletInfo);
    navigate("/Dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case "options":
        return (
          <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Wallet Setup</h1>
              <p className="text-gray-400">
                Choose an option below to setup your Ethereum wallet
              </p>
            </div>

            <div className="grid gap-4">
              <div className="border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-start mb-4">
                  <div className="p-3 rounded-lg bg-blue-900/20 mr-4">
                    <CirclePlus className="h-6 w-6 text-blue-400" />
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

              <div className="border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-start mb-4">
                  <div className="p-3 rounded-lg bg-blue-900/20 mr-4">
                    <div className="relative">
                      <Import className="h-6 w-6 text-blue-400" />
                    </div>
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

              <div className="border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <div className="flex items-start mb-4">
                  <div className="p-3 rounded-lg bg-blue-900/20 mr-4">
                    <div className="relative">
                      <View className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">View Existing Wallet</h3>
                    <p className="text-gray-400 text-sm">
                      Want to view items in a wallet? Enter the wallet address to view balances and transactions.
                    </p>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setStep("view")}
                >
                  View Wallet
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

            {error && <p className="text-red-500 text-center">{error}</p>}
            
            <Button 
              className="w-full py-4"
              onClick={createNewWallet}
              disabled={isCreating}
            >
              {isCreating ? "Generating Secure Wallet..." : "Generate New Wallet"}
            </Button>

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
                <span className="text-gray-300 mb-1 block">Mnemonic Phrase</span>
                <input
                  type="text"
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                />
                <span className="text-gray-500 text-xs mt-1 block">
                  Your mnemonic phrase should be 12 words long
                </span>
              </label>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <Button 
                className="w-full py-4 mt-4"
                onClick={importWallet}
                disabled={isCreating}
              >
                {isCreating ? "Importing Wallet..." : "Import Wallet"}
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setStep("options");
                  setError("");
                }}
                disabled={isCreating}
              >
                Back
              </Button>
            </div>
          </div>
        );
      
      // Create a import page where it just takes address, not a private key. Just for viewing wallet balances.
      case 'view':
        return (
          <div className="space-y-8 max-w-md mx-auto">
            <div className="text-center mb-8">              
              <h1 className="text-3xl font-bold mb-4">View Existing Wallet</h1>
              <p className="text-gray-400">
                Enter wallet address to view wallet balances
              </p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-300 mb-1 block">Wallet Address</span>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}  
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:outline-none"
                />
              </label>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <Button 
                className="w-full py-4 mt-4"
                onClick={viewWallet}
                disabled={isCreating}
              >
                {isCreating ? "Importing Wallet..." : "View Wallet"}
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setStep("options");
                  setError("");
                }}
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

              {walletInfo?.privateKey && (
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
              )}
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
    <div className="bg-gray-950 text-white">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center mr-2">
            <WalletIcon className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold">ChainFusion</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-14">
        {renderStep()}
      </main>
    </div>
  );
}
