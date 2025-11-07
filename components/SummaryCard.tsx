
import React from 'react';

interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  value: number; // This will be the filtered/actual spend
  totalPlanned: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, totalPlanned }) => {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="bg-brand-card-bg p-6 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="bg-blue-100 p-3 rounded-full">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-brand-text-dark">{title}</h3>
        <p className="text-gray-900 font-semibold text-2xl">{formatCurrency(value)}</p>
        <p className="text-gray-500 text-sm">Planned: {formatCurrency(totalPlanned)}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
