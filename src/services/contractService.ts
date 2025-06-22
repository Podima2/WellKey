import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

const CONTRACT_ADDRESS = "0xBED4db246f831E986EC1060d90fC51BD29005494";

const CONTRACT_ABI = [
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
  }
];

export interface VerifiedSubmission {
  id: string;
  ipfsHash: string;
  submissionData?: any;
  verifiedAt: Date;
  status: 'verified';
  description: string;
}

class ContractService {
  private publicClient;

  constructor() {
    this.publicClient = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
  }

  async getAllVerifiedHashes(): Promise<string[]> {
    try {
      console.log('🔍 Fetching all verified hashes from contract...');
      
      const result = await this.publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAllVerifiedHashes',
      });

      console.log('✅ Successfully fetched verified hashes:', result);
      return result as string[];
    } catch (error) {
      console.error('❌ Failed to fetch verified hashes:', error);
      throw new Error(`Failed to fetch verified hashes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserDataHash(userAddress: string): Promise<string> {
    try {
      console.log('🔍 Fetching user data hash for address:', userAddress);
      
      const result = await this.publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'userDataHashes',
        args: [userAddress],
      });

      console.log('✅ Successfully fetched user data hash:', result);
      return result as string;
    } catch (error) {
      console.error('❌ Failed to fetch user data hash:', error);
      throw new Error(`Failed to fetch user data hash: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchIPFSData(ipfsHash: string): Promise<any> {
    try {
      console.log('📥 Fetching IPFS data for hash:', ipfsHash);
      
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Successfully fetched IPFS data:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch IPFS data:', error);
      // Return null instead of throwing to handle gracefully
      return null;
    }
  }

  async getVerifiedSubmissions(): Promise<VerifiedSubmission[]> {
    try {
      console.log('🔄 Loading all verified submissions...');
      
      const hashes = await this.getAllVerifiedHashes();
      
      if (hashes.length === 0) {
        console.log('📭 No verified submissions found');
        return [];
      }

      console.log(`📊 Found ${hashes.length} verified submissions, fetching details...`);

      const submissions: VerifiedSubmission[] = [];

      for (const hash of hashes) {
        if (!hash || hash.trim() === '') continue;

        try {
          const ipfsData = await this.fetchIPFSData(hash);
          
          const submission: VerifiedSubmission = {
            id: `verified_${hash.substring(0, 8)}`,
            ipfsHash: hash,
            submissionData: ipfsData,
            verifiedAt: ipfsData?.metadata?.timestamp ? new Date(ipfsData.metadata.timestamp) : new Date(),
            status: 'verified',
            description: this.generateDescription(ipfsData)
          };

          submissions.push(submission);
        } catch (error) {
          console.warn(`⚠️ Failed to fetch data for hash ${hash}:`, error);
          
          // Still add the submission with basic info
          submissions.push({
            id: `verified_${hash.substring(0, 8)}`,
            ipfsHash: hash,
            verifiedAt: new Date(),
            status: 'verified',
            description: 'Verified Wellness Assessment'
          });
        }
      }

      console.log(`✅ Successfully loaded ${submissions.length} verified submissions`);
      return submissions.sort((a, b) => b.verifiedAt.getTime() - a.verifiedAt.getTime());
      
    } catch (error) {
      console.error('❌ Failed to get verified submissions:', error);
      return [];
    }
  }

  private generateDescription(ipfsData: any): string {
    if (!ipfsData?.formData) {
      return 'Verified Wellness Assessment';
    }

    const { formData } = ipfsData;
    const parts = [];

    if (formData.age) {
      parts.push(`Age: ${formData.age}`);
    }

    if (formData.currentMood) {
      parts.push(`Mood: ${formData.currentMood}`);
    }

    if (formData.stressLevel) {
      parts.push(`Stress: ${formData.stressLevel}`);
    }

    return parts.length > 0 
      ? `Wellness Assessment - ${parts.join(', ')}`
      : 'Verified Wellness Assessment';
  }
}

export const contractService = new ContractService();