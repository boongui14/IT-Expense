
import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { Transaction, Category, TransactionStatus } from './types';
import { MOCK_TRANSACTIONS } from './constants';

export interface Filters {
  category: Category | 'All';
  vendor: string;
  status: TransactionStatus | 'All';
  startDate: string;
  endDate: string;
}

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    vendor: '',
    status: 'All',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      if (startDate) {
        // set hours to 0 to include the start date
        startDate.setHours(0, 0, 0, 0);
      }
      
      if (endDate) {
        // set hours to end of day to include the end date
        endDate.setHours(23, 59, 59, 999);
      }

      const categoryMatch = filters.category === 'All' || tx.category === filters.category;
      const vendorMatch = !filters.vendor || tx.vendor.toLowerCase().includes(filters.vendor.toLowerCase());
      const statusMatch = filters.status === 'All' || tx.status === filters.status;
      const startDateMatch = !startDate || txDate >= startDate;
      const endDateMatch = !endDate || txDate <= endDate;
      
      return categoryMatch && vendorMatch && statusMatch && startDateMatch && endDateMatch;
    });
  }, [transactions, filters]);

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(currentTransactions =>
        currentTransactions.filter(tx => tx.id !== transactionId)
    );
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
      setTransactions(currentTransactions =>
          currentTransactions.map(tx =>
              tx.id === updatedTransaction.id ? updatedTransaction : tx
          )
      );
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
      const transactionWithId: Transaction = {
          ...newTransaction,
          id: new Date().getTime().toString(), // Simple unique ID
      };
      setTransactions(currentTransactions => [transactionWithId, ...currentTransactions]);
  };
  
  const handleMarkAsPaid = (transactionId: string) => {
    setTransactions(currentTransactions =>
        currentTransactions.map(tx =>
            tx.id === transactionId ? { ...tx, status: TransactionStatus.Paid } : tx
        )
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Header filters={filters} onFilterChange={handleFilterChange} />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard 
          transactions={filteredTransactions}
          onAdd={handleAddTransaction}
          onUpdate={handleUpdateTransaction}
          onDelete={handleDeleteTransaction}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </main>
    </div>
  );
};

export default App;
