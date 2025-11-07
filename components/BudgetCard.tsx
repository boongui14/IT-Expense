import React from 'react';

interface BudgetCardProps {
  totalBudget: number;
  totalSpent: number;
  selectedYear: number;
}

const TrendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const BudgetCard: React.FC<BudgetCardProps> = ({ totalBudget, totalSpent, selectedYear }) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-brand-card-bg p-6 rounded-lg shadow-sm border-2 border-brand-light-blue md:col-span-2 lg:col-span-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-md font-semibold text-brand-text-dark">Total Budget for {selectedYear}:</h3>
          <p className="text-3xl font-bold text-brand-text-dark my-1">{formatCurrency(totalBudget)}</p>
          <p className="text-sm text-gray-500">Total Spent in {selectedYear}: <span className="font-semibold">{formatCurrency(totalSpent)}</span></p>
        </div>
        <div className="bg-blue-100 p-3 rounded-full">
            <TrendIcon className="w-6 h-6 text-brand-light-blue" />
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
