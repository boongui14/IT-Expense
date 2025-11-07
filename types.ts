export interface Category {
  id: string;
  name: string;
}

export enum TransactionStatus {
  Planned = 'Planned',
  Paid = 'Paid',
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  categoryId: string;
  subcategory: string;
  vendor: string;
  amount: number;
  status: TransactionStatus;
}

export type YearlyBudget = Record<string, { [year: number]: number }>;
