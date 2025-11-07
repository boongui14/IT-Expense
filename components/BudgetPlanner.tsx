import React from 'react';
import { YearlyBudget, Category } from '../types';

interface BudgetPlannerProps {
    yearlyBudget: YearlyBudget;
    onOpenModal: () => void;
}

const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(num);
};

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ yearlyBudget, onOpenModal }) => {
    
    const budgetYears = React.useMemo(() => {
        const years = new Set<number>();
        Object.values(yearlyBudget).forEach(catBudget => {
            if (catBudget) {
                Object.keys(catBudget).forEach(year => years.add(Number(year)));
            }
        });
        return Array.from(years).sort((a, b) => a - b);
    }, [yearlyBudget]);

    const categories = Object.values(Category);

    const yearlyTotals = React.useMemo(() => {
        const totals: { [year: number]: number } = {};
        budgetYears.forEach(year => {
            totals[year] = categories.reduce((sum, category) => {
                return sum + (yearlyBudget[category]?.[year] || 0);
            }, 0);
        });
        return totals;
    }, [yearlyBudget, budgetYears, categories]);

    return (
        <div className="bg-brand-card-bg p-6 rounded-lg shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-brand-text-dark">Annual Budget Plan</h3>
                     <p className="text-sm text-gray-500 mt-1">
                        This is the planned budget for all IT categories over the coming years. You can adjust these figures at any time.
                    </p>
                </div>
                <button
                    onClick={onOpenModal}
                    className="px-4 py-2 bg-brand-accent text-white text-sm font-medium rounded-md hover:bg-brand-light-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent flex-shrink-0"
                >
                    Manage Budgets
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Category</th>
                            {budgetYears.map(year => (
                                <th key={year} scope="col" className="px-6 py-3 text-right">{year}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                             <tr key={category} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{category}</td>
                                {budgetYears.map(year => (
                                    <td key={year} className="px-6 py-4 text-right">
                                        {formatCurrency(yearlyBudget[category]?.[year] || 0)}
                                    </td>
                                ))}
                             </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr className="font-semibold text-gray-900">
                             <th scope="row" className="px-6 py-3 text-base">Total</th>
                             {budgetYears.map(year => (
                                <td key={year} className="px-6 py-3 text-right">
                                    {formatCurrency(yearlyTotals[year] || 0)}
                                </td>
                            ))}
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default BudgetPlanner;