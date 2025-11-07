
import React from 'react';
import { Category, TransactionStatus, Transaction } from '../types';
import { Filters } from '../App';

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

interface HeaderProps {
    filters: Filters;
    onFilterChange: (newFilters: Partial<Filters>) => void;
    transactions: Transaction[];
}

const FilterInput: React.FC<{ children: React.ReactNode; label: string; htmlFor: string; }> = ({ children, label, htmlFor }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        {children}
    </div>
);

const Header: React.FC<HeaderProps> = ({ filters, onFilterChange, transactions }) => {

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onFilterChange({ [e.target.name]: e.target.value });
    };

    const handleResetFilters = () => {
      onFilterChange({
        category: 'All',
        vendor: '',
        status: 'All',
        startDate: '',
        endDate: '',
      });
    }

    const handleExportCSV = () => {
        if (transactions.length === 0) {
            alert("No data to export for the current filters.");
            return;
        }

        const headers = ["ID", "Date", "Category", "Subcategory", "Vendor", "Amount", "Status"];
        
        const escapeCSV = (field: string | number) => {
            const str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvRows = transactions.map(tx => 
            [
                tx.id,
                tx.date,
                tx.category,
                escapeCSV(tx.subcategory),
                escapeCSV(tx.vendor),
                tx.amount,
                tx.status
            ].join(',')
        );

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const today = new Date().toISOString().split('T')[0];

        link.setAttribute("href", url);
        link.setAttribute("download", `it_expense_export_${today}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const inputClasses = "bg-brand-medium-blue text-white text-sm rounded-md border-gray-600 focus:ring-brand-light-blue focus:border-brand-light-blue w-full px-2 py-1 h-8";

    return (
        <header className="bg-brand-dark-blue shadow-md p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-white">IT Expense Dashboard</h1>
                     <button className="bg-brand-medium-blue p-2 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark-blue focus:ring-white">
                        <UserIcon />
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                    <FilterInput label="Category" htmlFor="category">
                        <select id="category" name="category" value={filters.category} onChange={handleInputChange} className={inputClasses}>
                            <option value="All">All Categories</option>
                            {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </FilterInput>

                    <FilterInput label="Vendor" htmlFor="vendor">
                        <input type="text" id="vendor" name="vendor" value={filters.vendor} onChange={handleInputChange} placeholder="e.g., Dell" className={inputClasses} />
                    </FilterInput>

                    <FilterInput label="Status" htmlFor="status">
                        <select id="status" name="status" value={filters.status} onChange={handleInputChange} className={inputClasses}>
                            <option value="All">All Statuses</option>
                            {Object.values(TransactionStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
                        </select>
                    </FilterInput>

                    <FilterInput label="Start Date" htmlFor="startDate">
                        <input type="date" id="startDate" name="startDate" value={filters.startDate} onChange={handleInputChange} className={inputClasses} />
                    </FilterInput>

                    <FilterInput label="End Date" htmlFor="endDate">
                         <input type="date" id="endDate" name="endDate" value={filters.endDate} onChange={handleInputChange} className={inputClasses} />
                    </FilterInput>
                     <div className="flex items-center space-x-2">
                        <button
                            onClick={handleResetFilters}
                            className="flex-1 px-4 py-1 bg-brand-accent text-white text-sm font-medium rounded-md hover:bg-brand-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark-blue focus:ring-brand-accent h-8"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex-1 px-4 py-1 bg-brand-green text-white text-sm font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark-blue focus:ring-brand-green h-8"
                        >
                            Export
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
