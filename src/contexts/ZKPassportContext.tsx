"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ZKPassport } from "@zkpassport/sdk";
import { useMetaMask } from "../hooks/useMetaMask";
import { createPublicClient, createWalletClient, custom, BaseError, ContractFunctionRevertedError } from 'viem';
import { sepolia } from 'viem/chains';

interface ZKPassportContextType {
  zkPassport: ZKPassport | null;
  connect: (ipfsCid: string) => Promise<void>;
  isConnected: boolean;
  passport: any;
  isLoading: boolean;
  showQRCode: boolean;
  qrCodeUrl: string;
  setShowQRCode: (show: boolean) => void;
  status: 'scanning' | 'generating' | 'verifying' | 'complete' | 'error';
  transactionHash: string | null;
}

const ZKPassportContext = createContext<ZKPassportContextType | undefined>(undefined);

async function verifyOnChain(verifierParams: any, walletClient: any, publicClient: any, account: string, isIDCard: boolean) {
  if (!walletClient || !publicClient || !account) {
    console.error("Viem clients or account not initialized for on-chain verification.");
    throw new Error("Wallet not properly initialized");
  }
  
  // Replace with your contract address and ABI
  const YOUR_CONTRACT_ADDRESS = "0xBED4db246f831E986EC1060d90fC51BD29005494";
  const YOUR_CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_verifierAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "allVerifiedHashes",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVerifiedHashes",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "vkeyHash",
              "type": "bytes32"
            },
            {
              "internalType": "bytes",
              "name": "proof",
              "type": "bytes"
            },
            {
              "internalType": "bytes32[]",
              "name": "publicInputs",
              "type": "bytes32[]"
            },
            {
              "internalType": "bytes",
              "name": "committedInputs",
              "type": "bytes"
            },
            {
              "internalType": "uint256[]",
              "name": "committedInputCounts",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256",
              "name": "validityPeriodInDays",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "domain",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "scope",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "devMode",
              "type": "bool"
            }
          ],
          "internalType": "struct ProofVerificationParams",
          "name": "params",
          "type": "tuple"
        },
        {
          "internalType": "bool",
          "name": "isIDCard",
          "type": "bool"
        }
      ],
      "name": "register",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "restrictedFunction",
      "outputs": [],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userDataHashes",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "userIdentifiers",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "zkPassportVerifier",
      "outputs": [
        {
          "internalType": "contract IZKPassportVerifier",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  try {
    const hash = await walletClient.writeContract({
      address: YOUR_CONTRACT_ADDRESS,
      abi: YOUR_CONTRACT_ABI,
      functionName: 'register',
      args: [verifierParams, true],
      account
    });
    console.log("Transaction sent with hash:", hash);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Verification completed on-chain!", receipt);
    return hash;
  } catch (error) {
    console.error(
      "On-chain verification failed. This can happen if the proof has already been used for this scope or has expired."
    );
    if (error instanceof BaseError) {
      const revertError = error.walk(err => err instanceof ContractFunctionRevertedError);
      if (revertError instanceof ContractFunctionRevertedError) {
        const errorName = revertError.reason || revertError.shortMessage;
        console.error("Transaction reverted with error:", errorName);
      } else {
        console.error("Full viem error:", error.shortMessage);
      }
    } else {
      console.error("Full error:", error);
    }
    throw error;
  }
}

interface PassportProviderProps {
  children: ReactNode;
}

export function PassportProvider({ children }: PassportProviderProps) {
  const { account } = useMetaMask();
  const [zkPassport, setZkPassport] = useState<ZKPassport | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [passport, setPassport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [status, setStatus] = useState<'scanning' | 'generating' | 'verifying' | 'complete' | 'error'>('scanning');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [publicClient, setPublicClient] = useState<any>(null);
  const [walletClient, setWalletClient] = useState<any>(null);

  useEffect(() => {
    // Initialize ZKPassport (domain will be inferred automatically in browser)
    const passport = new ZKPassport();
    setZkPassport(passport);

    // Initialize Viem clients
    if (typeof window !== 'undefined' && window.ethereum) {
      setPublicClient(createPublicClient({
        chain: sepolia,
        transport: custom(window.ethereum)
      }));
      setWalletClient(createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum)
      }));
    }
  }, []);

  const connect = async (ipfsCid: string) => {
    if (!zkPassport) return;
    
    setIsLoading(true);
    setStatus('scanning');
    
    try {
      let proof = null;
      // Create a request with app details following the documentation pattern
      const queryBuilder = await zkPassport.request({
        name: "WellKey Age Verification",
        logo: "https://wellkey.com/logo.png",
        purpose: "To verify your age for accessing wellness content",
        scope: "wellkey age verification",
        devMode: true,
        mode: "compressed-evm",
        evmChain: "ethereum_sepolia"
      });

      // Build the query with age requirement and destructure the result
      const {
        url,
        requestId,
        onRequestReceived,
        onGeneratingProof,
        onProofGenerated,
        onResult,
        onReject,
        onError,
      } = queryBuilder
        .disclose("nationality")
        .disclose("document_type")
        .bind("custom_data", ipfsCid)
        .gte("age", 5)
        .done();

      // Set up event handlers following the documentation pattern
      onRequestReceived(() => {
        console.log("Request received by user");
        setStatus('scanning');
      });

      onGeneratingProof(() => {
        console.log("User is generating proof");
        setStatus('generating');
      });

      onProofGenerated((proofResult) => {
        proof = proofResult;
        console.log("Proof generated:", proofResult);
        setStatus('verifying');
        const { address, functionName, abi } = zkPassport.getSolidityVerifierDetails("ethereum_sepolia");
        console.log("address", address);
        console.log("functionName", functionName);
        console.log("abi", abi);
      });

      onResult(async ({ uniqueIdentifier, verified, result }) => {
        console.log("Query result:", { uniqueIdentifier, verified, result });
        
        if (!verified) {
          console.log("Proof is not verified");
          setStatus('error');
          setIsLoading(false);
          return;
        }

        if (!proof) {
          console.error("Proof is not available to verify on-chain.");
          setStatus('error');
          setIsLoading(false);
          return;
        }
        
        // Get the verification parameters
        const verifierParams = zkPassport.getSolidityVerifierParameters({
          proof: proof,
          scope: "wellkey age verification",
          devMode: true,
        });
        console.log("verifierParams", verifierParams);

        // Verify the proof on-chain
        try {
          const txHash = await verifyOnChain(
            verifierParams,
            walletClient,
            publicClient,
            account,
            result.document_type.disclose.result !== "passport"
          );
          
          setTransactionHash(txHash);
          setStatus('complete');
          setIsConnected(true);
          setPassport({ 
            id: uniqueIdentifier || "verified-user",
            verified: true,
            result: result
          });
          
          // Log the verification results as shown in documentation
          console.log("age over 5", result.age.gte.result);
          console.log("age over", result.age.gte.expected);
          console.log("proofs are valid", verified);
          console.log("unique identifier", uniqueIdentifier);
          
        } catch (e) {
          console.log("error: ", e);
          setStatus('error');
        }
        
        setIsLoading(false);
      });

      onReject(() => {
        console.log("User rejected the request");
        setStatus('error');
        setIsLoading(false);
        setShowQRCode(false);
      });

      onError((error) => {
        console.error("ZK Passport error:", error);
        setStatus('error');
        setIsLoading(false);
        setShowQRCode(false);
      });

      // For mobile users, try to open the app directly
      // For desktop users, show QR code
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Mobile device - try to open app directly
        window.location.href = url;
      } else {
        // Desktop - show QR code
        setQrCodeUrl(url);
        setShowQRCode(true);
      }
      
    } catch (error) {
      console.error("Failed to create request:", error);
      setStatus('error');
      setIsLoading(false);
    }
  };

  const value: ZKPassportContextType = {
    zkPassport,
    connect,
    isConnected,
    passport,
    isLoading,
    showQRCode,
    qrCodeUrl,
    setShowQRCode,
    status,
    transactionHash
  };

  return (
    <ZKPassportContext.Provider value={value}>
      {children}
    </ZKPassportContext.Provider>
  );
}

export function useZKPassport() {
  const context = useContext(ZKPassportContext);
  if (!context) {
    throw new Error("useZKPassport must be used within a PassportProvider");
  }
  return context;
}