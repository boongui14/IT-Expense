import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

interface SpendingTrendChartProps {
    transactions: Transaction[];
    quarterlyPlannedSpend: number[];
    labels: string[];
    startYear: number;
}

const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ transactions, quarterlyPlannedSpend, labels, startYear }) => {
    const chartData = React.useMemo(() => {
        const numQuarters = labels.length;
        const actualsByQuarter: number[] = Array(numQuarters).fill(0);
        
        transactions.forEach(tx => {
            if(tx.status !== 'Paid') return;
            const date = new Date(tx.date);
            const yearIndex = date.getFullYear() - startYear;
            const quarterIndex = Math.floor(date.getMonth() / 3);
            const overallIndex = yearIndex * 4 + quarterIndex;

            if (overallIndex >= 0 && overallIndex < numQuarters) {
                actualsByQuarter[overallIndex] += tx.amount;
            }
        });

        return labels.map((name, index) => ({
            name,
            "Planned Budget": quarterlyPlannedSpend[index],
            "Actual Spend": actualsByQuarter[index],
        }));

    }, [transactions, quarterlyPlannedSpend, labels, startYear]);

    const yAxisFormatter = (value: number) => {
        if (value === 0) return '$0';
        return `$${(value / 1000).toFixed(0)}k`;
    }

    return (
        <div className="bg-brand-card-bg p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-brand-text-dark mb-4">Quarterly Spending Trend (Planned vs. Actual)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={yAxisFormatter} tick={{ fontSize: 12 }} />
                        <Tooltip 
                            formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="Planned Budget" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="Actual Spend" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpendingTrendChart;
