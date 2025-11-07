
export enum Category {
  Computers = 'Computers',
  Printers = 'Printers',
  Software = 'Software',
}

export enum TransactionStatus {
  Planned = 'Planned',
  Paid = 'Paid',
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  category: Category;
  subcategory: string;
  vendor: string;
  amount: number;
  status: TransactionStatus;
}
