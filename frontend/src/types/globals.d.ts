export interface DailyData {
  date: string;
  totalConsumption: null | number;
  totalProduction: null | number;
  avgPrice: null | number;
  hourWithBiggestConsAndProdDiff: null | number;
  cheapestPrice: null | number;
  cheapestHours: Array<number>;
}

export interface OverviewData {
  date: string;
  totalConsumption: null | number;
  totalProduction: null | number;
  avgPrice: null | number;
  longestNegStreak: number;
}