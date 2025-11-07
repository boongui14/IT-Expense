import React, { useState, FormEvent, useEffect } from 'react';
import { Transaction, Category, TransactionStatus } from '../types';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Omit<Transaction, 'id'> & { id?: string }) => void;
    transactionToEdit?: Transaction | null;
}

const initialFormState: Omit<Transaction, 'id'> = {
    date: new Date().toISOString().split('T')[0],
    category: Category.Computers,
    subcategory: '',
    vendor: '',
    amount: 0,
    status: TransactionStatus.Planned,
};

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave, transactionToEdit }) => {
    const [formData, setFormData] = useState<Omit<Transaction, 'id'> & { id?: string }>(initialFormState);
    const isEditMode = !!transactionToEdit;

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && transactionToEdit) {
                setFormData(transactionToEdit);
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, transactionToEdit, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.subcategory.trim() || !formData.vendor.trim() || formData.amount <= 0) {
            alert('Please fill out all fields correctly. Amount must be greater than zero.');
            return;
        }
        onSave({ ...formData, id: transactionToEdit?.id });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-text-dark">{isEditMode ? 'Edit Transaction' : 'Add New Transaction'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md">
                                {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Sub-category</label>
                            <input type="text" name="subcategory" id="subcategory" value={formData.subcategory} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm" placeholder="e.g., Laptop Upgrade" />
                        </div>
                        <div>
                            <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">Vendor</label>
                            <input type="text" name="vendor" id="vendor" value={formData.vendor} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm" placeholder="e.g., Dell" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm rounded-md">
                                {Object.values(TransactionStatus).map(stat => <option key={stat} value={stat}>{stat}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-accent text-white rounded-md hover:bg-brand-light-blue">{isEditMode ? 'Save Changes' : 'Save Transaction'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;