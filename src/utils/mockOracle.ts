import { OraclePrice } from "../types";

// Mock oracle for demonstration
export class MockOracle {
  private prices: Map<string, number> = new Map([
    ["BTC", 95000 + Math.random() * 10000],
    ["ETH", 3500 + Math.random() * 500],
    ["SOL", 180 + Math.random() * 40],
  ]);

  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.startPriceUpdates();
  }

  private startPriceUpdates() {
    ["BTC", "ETH", "SOL"].forEach((asset) => {
      const interval = setInterval(() => {
        const currentPrice = this.prices.get(asset) || 0;
        const change = (Math.random() - 0.5) * 0.02; // ±1% change
        const newPrice = currentPrice * (1 + change);
        this.prices.set(asset, Math.max(0, newPrice));
      }, 2000);
      this.intervals.set(asset, interval);
    });
  }

  getPrice(asset: string): OraclePrice | null {
    const price = this.prices.get(asset);
    if (!price) return null;

    return {
      asset,
      price: Math.round(price * 100) / 100,
      lastUpdated: new Date(),
    };
  }

  getAllPrices(): OraclePrice[] {
    return Array.from(this.prices.entries()).map(([asset, price]) => ({
      asset,
      price: Math.round(price * 100) / 100,
      lastUpdated: new Date(),
    }));
  }

  cleanup() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }
}
