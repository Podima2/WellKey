export interface Commitment {
  id: string;
  hash: string;
  description: string;
  condition: CommitmentCondition;
  status: 'pending' | 'revealed' | 'expired';
  createdAt: Date;
  revealedAt?: Date;
  revealedSecret?: string;
  zkProof?: string;
}

export interface CommitmentCondition {
  type: 'manual' | 'price' | 'time';
  description: string;
  target?: number; // For price conditions
  expiry?: Date; // For time conditions
  asset?: string; // For price conditions (e.g., 'BTC', 'ETH')
}

export interface OraclePrice {
  asset: string;
  price: number;
  lastUpdated: Date;
}