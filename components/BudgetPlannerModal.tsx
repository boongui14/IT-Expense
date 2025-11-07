import React, { useState, useEffect, FormEvent, useMemo } from 'react';
import { YearlyBudget, Category } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface BudgetPlannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (newBudget: YearlyBudget) => void;
    currentBudget: YearlyBudget;
    categories: Category[];
    onUpdateCategory: (category: Category) => void;
    onAddCategory: (categoryName: string) => void;
}

const TrashIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const BudgetPlannerModal: React.FC<BudgetPlannerModalProps> = ({ isOpen, onClose, onSave, currentBudget, categories, onUpdateCategory, onAddCategory }) => {
    const [budgetData, setBudgetData] = useState<YearlyBudget>(currentBudget);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [yearToDelete, setYearToDelete] = useState<number | null>(null);
    const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

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
            // Deep copy to avoid mutating parent state directly
            setBudgetData(JSON.parse(JSON.stringify(currentBudget)));
            setEditingCategory(null);
            setNewCategoryName('');
        }
    }, [isOpen, currentBudget]);

    const handleChange = (categoryId: string, year: number, value: string) => {
        const newBudgetData = { ...budgetData };
        newBudgetData[categoryId] = { ...newBudgetData[categoryId] };
        newBudgetData[categoryId][year] = parseFloat(value) || 0;
        setBudgetData(newBudgetData);
    };

    const handleAddYear = () => {
        const latestYear = budgetYears.length > 0 ? budgetYears[budgetYears.length - 1] : new Date().getFullYear();
        const nextYear = latestYear + 1;

        if (budgetYears.includes(nextYear)) return; // Avoid duplicates

        const newBudgetData = JSON.parse(JSON.stringify(budgetData));
        categories.forEach(cat => {
            if (!newBudgetData[cat.id]) newBudgetData[cat.id] = {};
            newBudgetData[cat.id][nextYear] = 0;
        });
        setBudgetData(newBudgetData);
    }

    const handleDeleteYear = (yearToDelete: number) => {
       setYearToDelete(yearToDelete);
       setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (yearToDelete === null) return;
        setBudgetData(current => {
            const newBudget = { ...current };
            for (const category of categories) {
                if (newBudget[category.id]?.[yearToDelete] !== undefined) {
                    const { [yearToDelete]: _, ...remainingYears } = newBudget[category.id];
                    newBudget[category.id] = remainingYears;
                }
            }
            return newBudget;
        });
        setIsConfirmModalOpen(false);
        setYearToDelete(null);
    }

    const handleCategoryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editingCategory) {
            setEditingCategory({ ...editingCategory, name: e.target.value });
        }
    };
    
    const handleSaveCategoryName = () => {
        if (editingCategory && editingCategory.name.trim()) {
            onUpdateCategory(editingCategory);
        }
        setEditingCategory(null);
    };
    
    const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveCategoryName();
        } else if (e.key === 'Escape') {
            setEditingCategory(null);
        }
    };

    const handleAddNewCategory = () => {
        const trimmedName = newCategoryName.trim();
        if (trimmedName) {
            if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
                alert('A category with this name already exists.');
                return;
            }
            onAddCategory(trimmedName);
            setNewCategoryName(''); // Clear input after adding
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(budgetData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Budget Year"
                message={`Are you sure you want to delete all budget data for ${yearToDelete}? This action cannot be undone.`}
                confirmButtonText="Delete"
            />
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl m-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-brand-text-dark">Manage Annual Budgets</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none" aria-label="Close modal">&times;</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                            <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="New Category Name"
                                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
                                    aria-label="New category name"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddNewCategory}
                                    className="px-4 py-2 bg-brand-accent text-white text-sm font-medium rounded-md hover:bg-brand-light-blue disabled:bg-gray-400"
                                    disabled={!newCategoryName.trim()}
                                >
                                    Add Category
                                </button>
                            </div>
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
                                        {budgetYears.map(year => (
                                            <th key={year} className="px-4 py-3 text-right min-w-[150px]">
                                                <div className="flex justify-end items-center gap-2">
                                                    <span>{year}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteYear(year)}
                                                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        aria-label={`Delete year ${year}`}
                                                        disabled={budgetYears.length <= 1}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {categories.map(category => (
                                        <tr key={category.id} className="border-b last:border-b-0">
                                            <td className="px-4 py-2 font-medium sticky left-0 bg-white z-10">
                                                {editingCategory?.id === category.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingCategory.name}
                                                        onChange={handleCategoryNameChange}
                                                        onBlur={handleSaveCategoryName}
                                                        onKeyDown={handleCategoryKeyDown}
                                                        className="w-full px-2 py-1 border border-brand-accent rounded-md shadow-sm focus:outline-none focus:ring-brand-accent sm:text-sm"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span
                                                        onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                                                        className="cursor-pointer hover:bg-gray-100 p-1 rounded-md"
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingCategory({ id: category.id, name: category.name })}}
                                                    >
                                                        {category.name}
                                                    </span>
                                                )}
                                            </td>
                                            {budgetYears.map((year) => (
                                                <td key={year} className="px-4 py-2">
                                                    <div className="relative">
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                                        <input
                                                            type="number"
                                                            value={budgetData[category.id]?.[year] ?? 0}
                                                            onChange={(e) => handleChange(category.id, year, e.target.value)}
                                                            className="w-full text-right pl-7 pr-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent"
                                                            min="0"
                                                            step="1000"
                                                            aria-label={`${category.name} budget for year ${year}`}
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
        </>
    );
};

export default BudgetPlannerModal;