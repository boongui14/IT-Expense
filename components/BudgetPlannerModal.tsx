import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { YearlyBudget, Category } from '../types';

interface BudgetPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newBudget: YearlyBudget) => void;
    currentBudget: YearlyBudget;
}

const BudgetPlannerModal: React.FC<BudgetPlannerModalProps> = ({ isOpen, onClose, onSave, currentBudget }) => {
    const [budgetData, setBudgetData] = useState<YearlyBudget>(currentBudget);

    const budgetYears = useMemo(() => {
        const years = new Set<number>();
        Object.values(budgetData).forEach(catBudget => {
            if (catBudget) {
                Object.keys(catBudget).forEach(year => years.add(Number(year)));
            }
        });
        return Array.from(years).sort((a, b) => a - b);
    }, [budgetData]);

    useEffect(() => {
        if (isOpen) {
            setBudgetData(JSON.parse(JSON.stringify(currentBudget))); // Deep copy
        }
    }, [isOpen, currentBudget]);

    const handleChange = (category: Category, year: number, value: string) => {
        const newBudgetData = { ...budgetData };
        newBudgetData[category] = { ...newBudgetData[category] };
        newBudgetData[category][year] = parseFloat(value) || 0;
        setBudgetData(newBudgetData);
    };

    const handleAddYear = () => {
        const latestYear = budgetYears.length > 0 ? budgetYears[budgetYears.length - 1] : new Date().getFullYear();
        const nextYear = latestYear + 1;

        if (budgetYears.includes(nextYear)) return; // Avoid duplicates

        const newBudgetData = JSON.parse(JSON.stringify(budgetData));
        Object.values(Category).forEach(cat => {
            if (!newBudgetData[cat]) newBudgetData[cat] = {};
            newBudgetData[cat][nextYear] = 0;
        });
        setBudgetData(newBudgetData);
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(budgetData);
        onClose();
    };

    if (!isOpen) return null;

    const categories = Object.values(Category);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-text-dark">Manage Annual Budgets</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={handleAddYear}
                            className="px-4 py-2 bg-brand-green text-white text-sm font-medium rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                        >
                           + Add Year
                        </button>
                    </div>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-left">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 sticky left-0 bg-gray-50 z-10">Category</th>
                                    {budgetYears.map(year => <th key={year} className="px-4 py-3 text-right min-w-[150px]">{year}</th>)}
                                </tr>
                             </thead>
                             <tbody className="bg-white">
                                {categories.map(category => (
                                    <tr key={category} className="border-b last:border-b-0">
                                        <td className="px-4 py-2 font-medium sticky left-0 bg-white z-10">{category}</td>
                                        {budgetYears.map((year) => (
                                            <td key={year} className="px-4 py-2">
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                                    <input
                                                        type="number"
                                                        value={budgetData[category]?.[year] ?? 0}
                                                        onChange={(e) => handleChange(category, year, e.target.value)}
                                                        className="w-full text-right pl-7 pr-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                                                        min="0"
                                                        step="1000"
                                                        aria-label={`${category} budget for year ${year}`}
                                                    />
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </div>
                     <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-brand-light-blue">Save Budgets</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BudgetPlannerModal;
