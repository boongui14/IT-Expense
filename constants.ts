import { Transaction, Category, TransactionStatus, YearlyBudget } from './types';

const currentYear = new Date().getFullYear();

export const INITIAL_YEARLY_BUDGET: YearlyBudget = {
  [Category.Computers]: {
    [currentYear]: 140000,
    [currentYear + 1]: 140000,
    [currentYear + 2]: 140000,
  },
  [Category.Printers]: {
    [currentYear]: 70000,
    [currentYear + 1]: 70000,
    [currentYear + 2]: 60000,
  },
  [Category.Software]: {
    [currentYear]: 45000,
    [currentYear + 1]: 45000,
    [currentYear + 2]: 40000,
  },
};

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', date: `${currentYear - 1}-01-15`, category: Category.Computers, subcategory: 'Laptop Upgrade', vendor: 'Dell', amount: 25000, status: TransactionStatus.Paid },
    { id: '2', date: `${currentYear - 1}-01-20`, category: Category.Software, subcategory: 'Adobe Creative Cloud', vendor: 'Adobe', amount: 6000, status: TransactionStatus.Paid },
    { id: '3', date: `${currentYear - 1}-02-10`, category: Category.Printers, subcategory: 'Toner Replacement', vendor: 'HP', amount: 5000, status: TransactionStatus.Paid },
    { id: '4', date: `${currentYear - 1}-03-05`, category: Category.Computers, subcategory: 'RAM Upgrade', vendor: 'Crucial', amount: 8000, status: TransactionStatus.Paid },
    { id: '5', date: `${currentYear - 1}-04-12`, category: Category.Software, subcategory: 'Microsoft 365', vendor: 'Microsoft', amount: 12000, status: TransactionStatus.Paid },
    { id: '6', date: `${currentYear - 1}-05-18`, category: Category.Printers, subcategory: 'Lease Payment', vendor: 'Xerox', amount: 15000, status: TransactionStatus.Paid },
    { id: '7', date: `${currentYear - 1}-06-22`, category: Category.Computers, subcategory: 'New Monitors', vendor: 'LG', amount: 10550, status: TransactionStatus.Paid },
    { id: '8', date: `${currentYear - 1}-07-30`, category: Category.Software, subcategory: 'Zoom Subscription', vendor: 'Zoom', amount: 4500, status: TransactionStatus.Paid },
    { id: '9', date: `${currentYear}-08-15`, category: Category.Printers, subcategory: 'Maintenance Kit', vendor: 'Brother', amount: 3000, status: TransactionStatus.Paid },
    { id: '10', date: `${currentYear}-09-01`, category: Category.Computers, subcategory: 'Server Maintenance', vendor: 'IBM', amount: 11501, status: TransactionStatus.Planned },
    { id: '11', date: `${currentYear}-10-10`, category: Category.Software, subcategory: 'Jira License', vendor: 'Atlassian', amount: 7500, status: TransactionStatus.Planned },
    { id: '12', date: `${currentYear}-11-20`, category: Category.Printers, subcategory: 'Paper Supplies', vendor: 'Staples', amount: 2500, status: TransactionStatus.Planned },
];
