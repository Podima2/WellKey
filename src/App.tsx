import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MainContent } from './components/layout/MainContent';
import { CommitmentsPage } from './components/pages/CommitmentsPage';
import { WellnessForm } from './components/pages/WellnessForm';
import { PassportProvider } from './contexts/ZKPassportContext';
import { Commitment, CommitmentCondition, OraclePrice } from './types';
import { hashSecret, generateZKProof, generateCommitmentId } from './utils/crypto';
import { MockOracle } from './utils/mockOracle';

type Page = 'dashboard' | 'commitments' | 'form';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [prices, setPrices] = useState<OraclePrice[]>([]);
  const [oracle] = useState(() => new MockOracle());

  // Initialize with sample commitments
  useEffect(() => {
    const initializeSampleCommitments = async () => {
      const sampleCommitments: Commitment[] = [
        {
          id: generateCommitmentId(),
          hash: await hashSecret("Bitcoin will reach $120,000 by March 2024 - I'm calling it now!"),
          description: "Bitcoin Price Prediction - March 2024",
          condition: {
            type: 'price',
            description: 'Auto-reveal when BTC reaches $120,000',
            target: 120000,
            asset: 'BTC',
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
          id: generateCommitmentId(),
          hash: await hashSecret("The next major AI breakthrough will be in multimodal reasoning, combining vision, language, and action in a single model."),
          description: "AI Technology Prediction",
          condition: {
            type: 'time',
            description: 'Auto-reveal on January 15, 2025 at 12:00 PM',
            expiry: new Date('2025-01-15T12:00:00'),
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
        {
          id: generateCommitmentId(),
          hash: await hashSecret("Ethereum will flip Bitcoin in market cap during the next bull run - the flippening is inevitable!"),
          description: "The Flippening Prediction",
          condition: {
            type: 'price',
            description: 'Auto-reveal when ETH reaches $8,000',
            target: 8000,
            asset: 'ETH',
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          id: generateCommitmentId(),
          hash: await hashSecret("I predicted that remote work would become the new normal before the pandemic hit. The future of work is distributed."),
          description: "Remote Work Revolution",
          condition: {
            type: 'manual',
            description: 'Manual reveal only',
          },
          status: 'revealed',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          revealedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          revealedSecret: "I predicted that remote work would become the new normal before the pandemic hit. The future of work is distributed.",
          zkProof: generateZKProof("I predicted that remote work would become the new normal before the pandemic hit. The future of work is distributed.", await hashSecret("I predicted that remote work would become the new normal before the pandemic hit. The future of work is distributed.")),
        },
        {
          id: generateCommitmentId(),
          hash: await hashSecret("Solana will outperform most altcoins in 2024 due to its superior technology and growing ecosystem."),
          description: "Solana Performance Prediction",
          condition: {
            type: 'price',
            description: 'Auto-reveal when SOL reaches $300',
            target: 300,
            asset: 'SOL',
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
        {
          id: generateCommitmentId(),
          hash: await hashSecret("The next major social media platform will be built on blockchain technology with true user ownership of data and content."),
          description: "Web3 Social Media Prediction",
          condition: {
            type: 'time',
            description: 'Auto-reveal on December 31, 2024 at 11:59 PM',
            expiry: new Date('2024-12-31T23:59:00'),
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        },
        {
          id: generateCommitmentId(),
          hash: await hashSecret("Tesla's stock will hit $500 per share when they announce their next-generation battery technology."),
          description: "Tesla Stock & Battery Tech",
          condition: {
            type: 'manual',
            description: 'Manual reveal only',
          },
          status: 'revealed',
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
          revealedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          revealedSecret: "Tesla's stock will hit $500 per share when they announce their next-generation battery technology.",
          zkProof: generateZKProof("Tesla's stock will hit $500 per share when they announce their next-generation battery technology.", await hashSecret("Tesla's stock will hit $500 per share when they announce their next-generation battery technology.")),
        },
        {
          id: generateCommitmentId(),
          hash: await hashSecret("The metaverse hype will die down by 2025, but AR/VR will find real utility in education and remote collaboration."),
          description: "Metaverse Reality Check",
          condition: {
            type: 'time',
            description: 'Auto-reveal on June 1, 2025 at 9:00 AM',
            expiry: new Date('2025-06-01T09:00:00'),
          },
          status: 'pending',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        }
      ];

      setCommitments(sampleCommitments);
    };

    initializeSampleCommitments();
  }, []);

  useEffect(() => {
    // Update prices every 2 seconds
    const updatePrices = () => {
      setPrices(oracle.getAllPrices());
    };

    updatePrices();
    const interval = setInterval(updatePrices, 2000);

    return () => {
      clearInterval(interval);
      oracle.cleanup();
    };
  }, [oracle]);

  useEffect(() => {
    // Check for auto-reveals based on conditions
    const checkAutoReveals = () => {
      setCommitments(prev => prev.map(commitment => {
        if (commitment.status !== 'pending') return commitment;

        let shouldAutoReveal = false;

        switch (commitment.condition.type) {
          case 'price':
            const oraclePrice = prices.find(p => p.asset === commitment.condition.asset);
            shouldAutoReveal = oraclePrice && oraclePrice.price >= (commitment.condition.target || 0);
            break;
          case 'time':
            shouldAutoReveal = commitment.condition.expiry && new Date() >= commitment.condition.expiry;
            break;
        }

        if (shouldAutoReveal) {
          return {
            ...commitment,
            status: 'revealed' as const,
            revealedAt: new Date(),
            revealedSecret: `[Auto-revealed when ${commitment.condition.description}]`,
            zkProof: generateZKProof(`[Auto-revealed when ${commitment.condition.description}]`, commitment.hash),
          };
        }

        return commitment;
      }));
    };

    if (prices.length > 0) {
      checkAutoReveals();
    }
  }, [prices]);

  const handleCreateCommitment = async (secret: string, description: string, condition: CommitmentCondition) => {
    const hash = await hashSecret(secret);
    const id = generateCommitmentId();

    const newCommitment: Commitment = {
      id,
      hash,
      description,
      condition,
      status: 'pending',
      createdAt: new Date(),
    };

    setCommitments(prev => [newCommitment, ...prev]);
  };

  const handleReveal = async (id: string, secret: string) => {
    const commitment = commitments.find(c => c.id === id);
    if (!commitment) return;

    const secretHash = await hashSecret(secret);
    
    if (secretHash === commitment.hash) {
      const zkProof = generateZKProof(secret, commitment.hash);
      
      setCommitments(prev => prev.map(c => 
        c.id === id ? {
          ...c,
          status: 'revealed' as const,
          revealedAt: new Date(),
          revealedSecret: secret,
          zkProof,
        } : c
      ));
    } else {
      alert('Invalid secret! The hash does not match the commitment.');
    }
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <PassportProvider>
      <div className="min-h-screen bg-black flex flex-col">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        
        {currentPage === 'dashboard' && (
          <MainContent
            commitments={commitments}
            prices={prices}
            onCreateCommitment={handleCreateCommitment}
            onReveal={handleReveal}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentPage === 'commitments' && (
          <CommitmentsPage
            commitments={commitments}
            prices={prices}
            onCreateCommitment={handleCreateCommitment}
            onReveal={handleReveal}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentPage === 'form' && (
          <WellnessForm />
        )}
        
        <Footer />
      </div>
    </PassportProvider>
  );
}

export default App;