
import { Transaction, Category, TransactionStatus } from './types';

export const PLANNED_BUDGET = {
  [Category.Computers]: 420000,
  [Category.Printers]: 200000,
  [Category.Software]: 130000,
};

export const TOTAL_BUDGET = Object.values(PLANNED_BUDGET).reduce((sum, val) => sum + val, 0);

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-01-15', category: Category.Computers, subcategory: 'Laptop Upgrade', vendor: 'Dell', amount: 25000, status: TransactionStatus.Paid },
  { id: '2', date: '2023-01-20', category: Category.Software, subcategory: 'Adobe Creative Cloud', vendor: 'Adobe', amount: 6000, status: TransactionStatus.Paid },
  { id: '3', date: '2023-02-10', category: Category.Printers, subcategory: 'Toner Replacement', vendor: 'HP', amount: 5000, status: TransactionStatus.Paid },
  { id: '4', date: '2023-03-05', category: Category.Computers, subcategory: 'RAM Upgrade', vendor: 'Crucial', amount: 8000, status: TransactionStatus.Paid },
  { id: '5', date: '2023-04-12', category: Category.Software, subcategory: 'Microsoft 365', vendor: 'Microsoft', amount: 12000, status: TransactionStatus.Paid },
  { id: '6', date: '2023-05-18', category: Category.Printers, subcategory: 'Lease Payment', vendor: 'Xerox', amount: 15000, status: TransactionStatus.Paid },
  { id: '7', date: '2023-06-22', category: Category.Computers, subcategory: 'New Monitors', vendor: 'LG', amount: 10550, status: TransactionStatus.Paid },
  { id: '8', date: '2023-07-30', category: Category.Software, subcategory: 'Zoom Subscription', vendor: 'Zoom', amount: 4500, status: TransactionStatus.Paid },
  { id: '9', date: '2024-08-15', category: Category.Printers, subcategory: 'Maintenance Kit', vendor: 'Brother', amount: 3000, status: TransactionStatus.Paid },
  { id: '10', date: '2024-09-01', category: Category.Computers, subcategory: 'Server Maintenance', vendor: 'IBM', amount: 11501, status: TransactionStatus.Planned },
  { id: '11', date: '2024-10-10', category: Category.Software, subcategory: 'Jira License', vendor: 'Atlassian', amount: 7500, status: TransactionStatus.Planned },
  { id: '12', date: '2024-11-20', category: Category.Printers, subcategory: 'Paper Supplies', vendor: 'Staples', amount: 2500, status: TransactionStatus.Planned },
];

export const QUARTERLY_PLANNED_SPEND = [
  // Year 1
  5, 4.8, 4.7, 5.2,
  // Year 2
  4.5, 4.3, 4.4, 4.8,
  // Year 3
  4, 3.8, 3.5, 2
].map(v => v * 10000);

export const QUARTER_NAMES = [
  'Year 1 Q1', 'Q2', 'Q3', 'Q4',
  'Year 2 Q1', 'Q2', 'Q3', 'Q4',
  'Year 3 Q1', 'Q2', 'Q3', 'Q4',
];
