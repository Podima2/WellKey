import { PinataSDK } from "pinata-web3";

// Initialize Pinata SDK with your JWT
const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYTJjNzZhNi0wNTZkLTQ1ZmMtOGE0My1kYjRhYjBhNDhmYWYiLCJlbWFpbCI6Im14YmVyMjAyMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTE2MDg0ZTdjNzViMjA0NDMwMTQiLCJzY29wZWRLZXlTZWNyZXQiOiJmMTA0ODk3NTg4YzhjZDQxNDUwYzMxMGI1MTM2MTEyNTJmN2E5OWFjMzZlMDE1Yjc1OWM2MDM3ZTFiNDkxYzhjIiwiZXhwIjoxNzgxMzc3MjIzfQ.ky1qACH3cpAngylZkFPaGiNNlOqhV3xgma56_iH43i8",
});

export interface WellnessFormData {
  // Personal Info
  age: string;
  
  // Lifestyle
  currentMood: string;
  sleepQuality: string;
  stressLevel: string;
  exerciseFrequency: string;
  dietPreference: string;
  
  // Sensitive Questions
  selfHarm: string;
  selfHarmRecent: string;
  masturbation: string;
  masturbationFeelings: string;
  drugUse: string[];
  sexualPartners: string;
  sexualPartnersFeelings: string;
  abuseHistory: string;
  crimeHistory: string;
  crimeCaught: string;
}

export interface WellnessSubmission {
  formData: WellnessFormData;
  metadata: {
    submissionId: string;
    timestamp: string;
    walletAddress: string;
    version: string;
    anonymous: boolean;
  };
}

export async function uploadJSONToIPFS(formData: WellnessFormData, walletAddress: string): Promise<string> {
  try {
    console.log('🚀 Starting IPFS upload process...');
    
    // Create submission object with metadata
    const submission: WellnessSubmission = {
      formData,
      metadata: {
        submissionId: generateSubmissionId(),
        timestamp: new Date().toISOString(),
        walletAddress,
        version: '1.0.0',
        anonymous: true
      }
    };

    console.log('📦 Preparing submission data:', {
      submissionId: submission.metadata.submissionId,
      timestamp: submission.metadata.timestamp,
      fieldsCount: Object.keys(formData).length
    });

    // Upload to IPFS via Pinata
    console.log('📤 Uploading to Pinata IPFS...');
    const uploadResult = await pinata.upload.json(submission, {
      metadata: {
        name: `Wellness Assessment - ${submission.metadata.submissionId}`,
        keyvalues: {
          type: 'wellness-assessment',
          version: '1.0.0',
          anonymous: 'true',
          timestamp: submission.metadata.timestamp
        }
      }
    });

    console.log('✅ Successfully uploaded to IPFS!', {
      ipfsHash: uploadResult.IpfsHash,
      size: uploadResult.PinSize,
      timestamp: uploadResult.Timestamp
    });

    return uploadResult.IpfsHash;
  } catch (error) {
    console.error('❌ Failed to upload to IPFS:', error);
    throw new Error(`IPFS upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `wellness_${timestamp}_${random}`;
}

export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

export function validateFormData(formData: WellnessFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields validation
  if (!formData.age) errors.push('Age range is required');
  if (!formData.currentMood) errors.push('Current mood is required');
  if (!formData.sleepQuality) errors.push('Sleep quality is required');
  if (!formData.stressLevel) errors.push('Stress level is required');
  if (!formData.exerciseFrequency) errors.push('Exercise frequency is required');
  if (!formData.dietPreference) errors.push('Diet preference is required');
  
  return {
    isValid: errors.length === 0,
    errors
  };
}