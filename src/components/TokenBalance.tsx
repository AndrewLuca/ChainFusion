import React from "react";
import { Copy } from "lucide-react";

interface Props {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string | null;
  iconUrl?: string;
  contractAddress?: string;
  isLoading?: boolean;
}

export function TokenBalance({
  symbol,
  name,
  balance,
  usdValue,
  iconUrl,
  contractAddress,
  isLoading = false,
}: Props) {
  return (
    <div className="border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-900/50 transition-colors">
      <div className="flex items-center">
        {/* Token Icon */}
        <div className="w-10 h-10 rounded-full bg-blue-900/20 flex items-center justify-center mr-3 overflow-hidden">
          {iconUrl ? (
            <img src={iconUrl} alt={symbol} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-blue-900/50 flex items-center justify-center text-blue-300 font-bold">
              {symbol.slice(0, 2)}
            </div>
          )}
        </div>
        
        {/* Token Name and Details */}
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{name}</h3>
            <span className="ml-2 text-xs text-gray-500">{symbol}</span>
            {contractAddress && (
              <a 
                href={`https://bscscan.com/token/${contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-xs text-blue-400 hover:underline"
              >
                View
              </a>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            {isLoading ? (
              <span className="inline-block w-20 h-4 bg-gray-800 rounded animate-pulse"></span>
            ) : (
              <>{balance} {symbol}</>
            )}
          </p>
        </div>
      </div>
      
      {/* USD Value */}
      <div className="text-right">
        {isLoading ? (
          <div className="inline-block w-24 h-6 bg-gray-800 rounded animate-pulse"></div>
        ) : (
          <>
            <p className="font-semibold">${usdValue || "0.00"}</p>
            {usdValue && Number(usdValue) > 0 && (
              <p className="text-xs text-gray-500">
                {/* Could add price change % here in future */}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
