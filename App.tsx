import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { Transaction, Category, TransactionStatus, YearlyBudget } from './types';
import { MOCK_TRANSACTIONS, INITIAL_YEARLY_BUDGET, INITIAL_CATEGORIES } from './constants';

export interface Filters {
  category: string | 'All';
  vendor: string;
  status: TransactionStatus | 'All';
  startDate: string;
  endDate: string;
}

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [yearlyBudget, setYearlyBudget] = useState<YearlyBudget>(INITIAL_YEARLY_BUDGET);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
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

      const categoryMatch = filters.category === 'All' || tx.categoryId === filters.category;
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

  const handleUpdateYearlyBudget = (newBudget: YearlyBudget) => {
    setYearlyBudget(newBudget);
  };

  const handleDeleteBudgetYear = (yearToDelete: number) => {
    setYearlyBudget(currentBudget => {
        const newBudget: YearlyBudget = JSON.parse(JSON.stringify(currentBudget)); // Deep copy

        for (const category of categories) {
            if (newBudget[category.id] && newBudget[category.id][yearToDelete] !== undefined) {
                delete newBudget[category.id][yearToDelete];
            }
        }
        return newBudget;
    });
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(currentCategories =>
        currentCategories.map(c =>
            c.id === updatedCategory.id ? updatedCategory : c
        )
    );
  };

  const handleAddCategory = (categoryName: string) => {
    const newCategoryId = categoryName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const newCategory: Category = {
        id: newCategoryId,
        name: categoryName,
    };

    setCategories(currentCategories => [...currentCategories, newCategory]);

    setYearlyBudget(currentBudget => {
        const newBudget = { ...currentBudget };
        const years = new Set<number>();
        // Get all unique years from the existing budget
        Object.values(currentBudget).forEach(catBudget => {
            if (catBudget) {
              Object.keys(catBudget).forEach(year => years.add(Number(year)));
            }
        });

        const budgetForNewCategory: { [year: number]: number } = {};
        Array.from(years).forEach(year => {
            budgetForNewCategory[year] = 0; // Initialize budget to 0 for all existing years
        });
        
        newBudget[newCategoryId] = budgetForNewCategory;
        return newBudget;
    });
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      <Header 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        transactions={filteredTransactions}
        categories={categories}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard 
          transactions={filteredTransactions}
          onAdd={handleAddTransaction}
          onUpdate={handleUpdateTransaction}
          onDelete={handleDeleteTransaction}
          onMarkAsPaid={handleMarkAsPaid}
          yearlyBudget={yearlyBudget}
          onUpdateYearlyBudget={handleUpdateYearlyBudget}
          onDeleteBudgetYear={handleDeleteBudgetYear}
          categories={categories}
          onUpdateCategory={handleUpdateCategory}
          onAddCategory={handleAddCategory}
        />
      </main>
    </div>
  );
};

export default App;