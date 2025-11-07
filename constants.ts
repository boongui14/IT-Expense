import { Transaction, Category, TransactionStatus, YearlyBudget } from './types';

const currentYear = new Date().getFullYear();

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'computers', name: 'Computers' },
  { id: 'printers', name: 'Printers' },
  { id: 'software', name: 'Software' },
];

export const INITIAL_YEARLY_BUDGET: YearlyBudget = {
  [INITIAL_CATEGORIES[0].id]: {
    [currentYear]: 140000,
    [currentYear + 1]: 140000,
    [currentYear + 2]: 140000,
  },
  [INITIAL_CATEGORIES[1].id]: {
    [currentYear]: 70000,
    [currentYear + 1]: 70000,
    [currentYear + 2]: 60000,
  },
  [INITIAL_CATEGORIES[2].id]: {
    [currentYear]: 45000,
    [currentYear + 1]: 45000,
    [currentYear + 2]: 40000,
  },
};

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', date: `${currentYear - 1}-01-15`, categoryId: 'computers', subcategory: 'Laptop Upgrade', vendor: 'Dell', amount: 25000, status: TransactionStatus.Paid },
    { id: '2', date: `${currentYear - 1}-01-20`, categoryId: 'software', subcategory: 'Adobe Creative Cloud', vendor: 'Adobe', amount: 6000, status: TransactionStatus.Paid },
    { id: '3', date: `${currentYear - 1}-02-10`, categoryId: 'printers', subcategory: 'Toner Replacement', vendor: 'HP', amount: 5000, status: TransactionStatus.Paid },
    { id: '4', date: `${currentYear - 1}-03-05`, categoryId: 'computers', subcategory: 'RAM Upgrade', vendor: 'Crucial', amount: 8000, status: TransactionStatus.Paid },
    { id: '5', date: `${currentYear - 1}-04-12`, categoryId: 'software', subcategory: 'Microsoft 365', vendor: 'Microsoft', amount: 12000, status: TransactionStatus.Paid },
    { id: '6', date: `${currentYear - 1}-05-18`, categoryId: 'printers', subcategory: 'Lease Payment', vendor: 'Xerox', amount: 15000, status: TransactionStatus.Paid },
    { id: '7', date: `${currentYear - 1}-06-22`, categoryId: 'computers', subcategory: 'New Monitors', vendor: 'LG', amount: 10550, status: TransactionStatus.Paid },
    { id: '8', date: `${currentYear - 1}-07-30`, categoryId: 'software', subcategory: 'Zoom Subscription', vendor: 'Zoom', amount: 4500, status: TransactionStatus.Paid },
    { id: '9', date: `${currentYear}-08-15`, categoryId: 'printers', subcategory: 'Maintenance Kit', vendor: 'Brother', amount: 3000, status: TransactionStatus.Paid },
    { id: '10', date: `${currentYear}-09-01`, categoryId: 'computers', subcategory: 'Server Maintenance', vendor: 'IBM', amount: 11501, status: TransactionStatus.Planned },
    { id: '11', date: `${currentYear}-10-10`, categoryId: 'software', subcategory: 'Jira License', vendor: 'Atlassian', amount: 7500, status: TransactionStatus.Planned },
    { id: '12', date: `${currentYear}-11-20`, categoryId: 'printers', subcategory: 'Paper Supplies', vendor: 'Staples', amount: 2500, status: TransactionStatus.Planned },
];