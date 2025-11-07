
import React, { useState } from 'react';
import SummaryCard from './SummaryCard';
import BudgetCard from './BudgetCard';
import ExpenseBreakdownChart from './ExpenseBreakdownChart';
import SpendingTrendChart from './SpendingTrendChart';
import RecentTransactions from './RecentTransactions';
import AddTransactionModal from './AddTransactionModal';
import PlannedExpenses from './PlannedExpenses';
import { PLANNED_BUDGET, TOTAL_BUDGET } from '../constants';
import { Category, Transaction } from '../types';

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
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAdd, onUpdate, onDelete, onMarkAsPaid }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleOpenEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'> & { id?: string }) => {
        if (transactionData.id) {
            onUpdate(transactionData as Transaction);
        } else {
            onAdd(transactionData);
        }
    };
    
    const totalSpentForFiltered = transactions
        .filter(tx => tx.status === 'Paid')
        .reduce((sum, tx) => sum + tx.amount, 0);
    
    const computerSpend = transactions
        .filter(tx => tx.category === Category.Computers)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const printerSpend = transactions
        .filter(tx => tx.category === Category.Printers)
        .reduce((sum, tx) => sum + tx.amount, 0);

    const softwareSpend = transactions
        .filter(tx => tx.category === Category.Software)
        .reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <div>
            <h1 className="text-2xl font-bold text-brand-text-dark mb-6">Financial Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <SummaryCard 
                    title="Computers" 
                    value={computerSpend} 
                    icon={<ComputerIcon className="w-8 h-8 text-brand-light-blue" />}
                    totalPlanned={PLANNED_BUDGET[Category.Computers]}
                />
                <SummaryCard 
                    title="Printers" 
                    value={printerSpend}
                    icon={<PrinterIcon className="w-8 h-8 text-brand-light-blue" />}
                    totalPlanned={PLANNED_BUDGET[Category.Printers]}
                />
                <SummaryCard 
                    title="Software" 
                    value={softwareSpend}
                    icon={<SoftwareIcon className="w-8 h-8 text-brand-light-blue" />}
                    totalPlanned={PLANNED_BUDGET[Category.Software]}
                />
                <BudgetCard 
                    totalBudget={TOTAL_BUDGET} 
                    totalSpent={totalSpentForFiltered} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ExpenseBreakdownChart transactions={transactions} />
                <SpendingTrendChart transactions={transactions} />
            </div>

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
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTransaction}
                transactionToEdit={editingTransaction}
            />
        </div>
    );
};

export default Dashboard;
