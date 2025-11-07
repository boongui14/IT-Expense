import React, { useState, useMemo, useEffect } from 'react';
import SummaryCard from './SummaryCard';
import BudgetCard from './BudgetCard';
import SpendingTrendChart from './SpendingTrendChart';
import RecentTransactions from './RecentTransactions';
import AddTransactionModal from './AddTransactionModal';
import PlannedExpenses from './PlannedExpenses';
import BudgetPlanner from './BudgetPlanner';
import BudgetPlannerModal from './BudgetPlannerModal';
import { Category, Transaction, YearlyBudget, TransactionStatus } from '../types';

// SVG Icons for cards
const ComputerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PrinterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const SoftwareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

interface DashboardProps {
    transactions: Transaction[];
    onAdd: (newTransaction: Omit<Transaction, 'id'>) => void;
    onUpdate: (updatedTransaction: Transaction) => void;
    onDelete: (transactionId: string) => void;
    onMarkAsPaid: (transactionId: string) => void;
    yearlyBudget: YearlyBudget;
    onUpdateYearlyBudget: (newBudget: YearlyBudget) => void;
    onDeleteBudgetYear: (year: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAdd, onUpdate, onDelete, onMarkAsPaid, yearlyBudget, onUpdateYearlyBudget, onDeleteBudgetYear }) => {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const budgetYears = useMemo(() => {
        const years = new Set<number>();
        Object.values(yearlyBudget).forEach(catBudget => {
            Object.keys(catBudget).forEach(year => years.add(Number(year)));
        });
        return Array.from(years).sort((a, b) => a - b);
    }, [yearlyBudget]);

    const [selectedYear, setSelectedYear] = useState<number>(budgetYears[budgetYears.length-1] || new Date().getFullYear());

    useEffect(() => {
        if (budgetYears.length > 0 && !budgetYears.includes(selectedYear)) {
            setSelectedYear(budgetYears[budgetYears.length-1]);
        }
    }, [budgetYears, selectedYear]);

    const handleOpenEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsTransactionModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingTransaction(null);
        setIsTransactionModalOpen(true);
    };

    const handleCloseTransactionModal = () => {
        setIsTransactionModalOpen(false);
        setEditingTransaction(null);
    };

    const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'> & { id?: string }) => {
        if (transactionData.id) {
            onUpdate(transactionData as Transaction);
        } else {
            onAdd(transactionData);
        }
    };

    const transactionsForSelectedYear = useMemo(() => {
        return transactions.filter(tx => new Date(tx.date).getFullYear() === selectedYear);
    }, [transactions, selectedYear]);
    
    const totalSpentForSelectedYear = transactionsForSelectedYear
        .filter(tx => tx.status === TransactionStatus.Paid)
        .reduce((sum, tx) => sum + tx.amount, 0);
    
    const computerSpend = transactionsForSelectedYear
        .filter(tx => tx.category === Category.Computers && tx.status === TransactionStatus.Paid)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const printerSpend = transactionsForSelectedYear
        .filter(tx => tx.category === Category.Printers && tx.status === TransactionStatus.Paid)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const softwareSpend = transactionsForSelectedYear
        .filter(tx => tx.category === Category.Software && tx.status === TransactionStatus.Paid)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const computerTotalPlanned = yearlyBudget[Category.Computers][selectedYear] || 0;
    const printerTotalPlanned = yearlyBudget[Category.Printers][selectedYear] || 0;
    const softwareTotalPlanned = yearlyBudget[Category.Software][selectedYear] || 0;
    const totalBudgetForSelectedYear = computerTotalPlanned + printerTotalPlanned + softwareTotalPlanned;

    const { quarterlyPlannedSpend, trendChartLabels, startYear } = useMemo(() => {
        const allYears = new Set<number>();
        Object.values(yearlyBudget).forEach(catBudget => {
            Object.keys(catBudget).forEach(year => allYears.add(Number(year)));
        });
        transactions.forEach(tx => {
            allYears.add(new Date(tx.date).getFullYear());
        });

        if (allYears.size === 0) {
            return { quarterlyPlannedSpend: [], trendChartLabels: [], startYear: new Date().getFullYear() };
        }

        const sortedYears = Array.from(allYears).sort((a, b) => a - b);
        const firstYear = sortedYears[0];
        const lastYear = sortedYears[sortedYears.length - 1];
        
        const numYears = lastYear - firstYear + 1;
        const quarterlySpend: number[] = Array(numYears * 4).fill(0);
        const labels: string[] = [];

        for (let year = firstYear; year <= lastYear; year++) {
            const yearlyComputer = yearlyBudget[Category.Computers][year] || 0;
            const yearlyPrinter = yearlyBudget[Category.Printers][year] || 0;
            const yearlySoftware = yearlyBudget[Category.Software][year] || 0;
            const quarterlyTotal = (yearlyComputer + yearlyPrinter + yearlySoftware) / 4;
            
            for (let quarter = 0; quarter < 4; quarter++) {
                const overallIndex = (year - firstYear) * 4 + quarter;
                quarterlySpend[overallIndex] = quarterlyTotal;
                if (quarter === 0) {
                    labels.push(`${year} Q1`);
                } else {
                    labels.push(`Q${quarter + 1}`);
                }
            }
        }
        return { quarterlyPlannedSpend: quarterlySpend, trendChartLabels: labels, startYear: firstYear };
    }, [yearlyBudget, transactions]);


    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-brand-text-dark">Financial Overview</h1>
                {budgetYears.length > 0 && (
                    <div className="flex items-center space-x-2">
                        <label htmlFor="year-filter" className="text-sm font-medium text-gray-700">View Year:</label>
                        <select
                            id="year-filter"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-white text-sm rounded-md border-gray-300 shadow-sm focus:ring-brand-light-blue focus:border-brand-light-blue px-3 py-1.5"
                            aria-label="Select year to view"
                        >
                            {budgetYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <SummaryCard 
                    title="Computers" 
                    value={computerSpend} 
                    icon={<ComputerIcon className="w-8 h-8 text-brand-light-blue" />}
                    totalPlanned={computerTotalPlanned}
                />
                <SummaryCard 
                    title="Printers" 
                    value={printerSpend}
                    icon={<PrinterIcon className="w-8 h-8 text-brand-light-blue" />}
                    totalPlanned={printerTotalPlanned}
                />
                <SummaryCard 
                    title="Software" 
                    value={softwareSpend}
                    icon={<SoftwareIcon className="w-8 h-8 text-brand-light-blue" />}
                    totalPlanned={softwareTotalPlanned}
                />
                <BudgetCard 
                    totalBudget={totalBudgetForSelectedYear} 
                    totalSpent={totalSpentForSelectedYear} 
                    selectedYear={selectedYear}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 mb-6">
                <SpendingTrendChart 
                    transactions={transactions} 
                    quarterlyPlannedSpend={quarterlyPlannedSpend} 
                    labels={trendChartLabels}
                    startYear={startYear}
                />
            </div>

            <BudgetPlanner 
              yearlyBudget={yearlyBudget} 
              onOpenModal={() => setIsBudgetModalOpen(true)}
              onDeleteYear={onDeleteBudgetYear}
            />

            <RecentTransactions 
                transactions={transactions} 
                onEdit={handleOpenEditModal}
                onDelete={onDelete}
                onAdd={handleOpenAddModal}
            />

            <PlannedExpenses
                transactions={transactions}
                onEdit={handleOpenEditModal}
                onDelete={onDelete}
                onMarkAsPaid={onMarkAsPaid}
            />

            <AddTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={handleCloseTransactionModal}
                onSave={handleSaveTransaction}
                transactionToEdit={editingTransaction}
            />
            <BudgetPlannerModal 
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                onSave={onUpdateYearlyBudget}
                currentBudget={yearlyBudget}
            />
        </div>
    );
};

export default Dashboard;