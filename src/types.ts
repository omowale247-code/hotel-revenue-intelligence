export type AnalysisRecord = {
  id: string;
  roomType: string;
  stayDate: string;
  occupancy: number;
  competitorAvg: number;
  revPAR: number;
  opportunity: number;
  recommendedRate: number;
  severity: string;
  createdAt: string;
};

export type CreditTransaction = {
  id: string;
  type: "analysis" | "purchase";
  amount: number;
  description: string;
  createdAt: string;
};