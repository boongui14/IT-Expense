import React from 'react';
import { Transaction, TransactionStatus } from '../types';

interface PlannedExpensesProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
    onMarkAsPaid: (id: string) => void;
}

const PlannedExpenses: React.FC<PlannedExpensesProps> = ({ transactions, onEdit, onDelete, onMarkAsPaid }) => {
    const plannedTransactions = [...transactions]
        .filter(tx => tx.status === TransactionStatus.Planned)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(num);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this planned expense?")) {
            onDelete(id);
        }
    };

    return (
        <div className="bg-brand-card-bg p-6 rounded-lg shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-brand-text-dark">Upcoming Planned Expenses</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Sub-category</th>
                            <th scope="col" className="px-6 py-3">Vendor</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plannedTransactions.length > 0 ? plannedTransactions.map((tx) => (
                            <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{formatDate(tx.date)}</td>
                                <td className="px-6 py-4">{tx.category}</td>
                                <td className="px-6 py-4">{tx.subcategory}</td>
                                <td className="px-6 py-4">{tx.vendor}</td>
                                <td className="px-6 py-4 text-right">{formatCurrency(tx.amount)}</td>
                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                    <button
                                        onClick={() => onMarkAsPaid(tx.id)}
                                        className="font-medium text-brand-green hover:underline focus:outline-none"
                                        aria-label={`Mark transaction ${tx.id} as paid`}
                                    >
                                        Mark as Paid
                                    </button>
                                    <button
                                        onClick={() => onEdit(tx)}
                                        className="font-medium text-brand-accent hover:underline ml-4 focus:outline-none"
                                        aria-label={`Edit transaction ${tx.id}`}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tx.id)}
                                        className="font-medium text-red-600 hover:underline ml-4 focus:outline-none"
                                        aria-label={`Delete transaction ${tx.id}`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">No planned expenses.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlannedExpenses;
