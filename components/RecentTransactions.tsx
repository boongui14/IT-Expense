import React from 'react';
import { Transaction, TransactionStatus, Category } from '../types';

interface RecentTransactionsProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
    categories: Category[];
}

const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    const statusClasses = status === TransactionStatus.Paid
        ? "bg-green-100 text-brand-green"
        : "bg-yellow-100 text-yellow-800";
    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};


const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, onEdit, onDelete, onAdd, categories }) => {
    const sortedTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
        
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
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            onDelete(id);
        }
    };

    return (
        <div className="bg-brand-card-bg p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-brand-text-dark">Recent Transactions</h3>
                <button
                    onClick={onAdd}
                    className="px-4 py-2 bg-brand-accent text-white text-sm font-medium rounded-md hover:bg-brand-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
                >
                    Add Transaction
                </button>
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
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTransactions.map((tx) => {
                            const categoryName = categories.find(c => c.id === tx.categoryId)?.name || tx.categoryId;
                            return (
                                <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{formatDate(tx.date)}</td>
                                    <td className="px-6 py-4">{categoryName}</td>
                                    <td className="px-6 py-4">{tx.subcategory}</td>
                                    <td className="px-6 py-4">{tx.vendor}</td>
                                    <td className="px-6 py-4 text-right">{formatCurrency(tx.amount)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => onEdit(tx)}
                                            className="font-medium text-brand-accent hover:underline focus:outline-none"
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
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;