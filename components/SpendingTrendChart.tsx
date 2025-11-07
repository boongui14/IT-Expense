
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { QUARTERLY_PLANNED_SPEND, QUARTER_NAMES } from '../constants';

interface SpendingTrendChartProps {
    transactions: Transaction[];
}

const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ transactions }) => {
    const chartData = React.useMemo(() => {
        const actualsByQuarter: number[] = Array(12).fill(0);
        
        transactions.forEach(tx => {
            const date = new Date(tx.date);
            // Assuming Year 1 starts in 2023 for mock data
            const yearIndex = date.getFullYear() - 2023;
            const quarterIndex = Math.floor(date.getMonth() / 3);
            const overallIndex = yearIndex * 4 + quarterIndex;

            if (overallIndex >= 0 && overallIndex < 12) {
                actualsByQuarter[overallIndex] += tx.amount;
            }
        });

        return QUARTER_NAMES.map((name, index) => ({
            name,
            "Planned Budget": QUARTERLY_PLANNED_SPEND[index],
            "Actual Spend": actualsByQuarter[index],
        }));

    }, [transactions]);

    const yAxisFormatter = (value: number) => {
        if (value === 0) return '0%';
        return `${(value / 100000).toFixed(0)}%`;
    }

    return (
        <div className="bg-brand-card-bg p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-brand-text-dark mb-4">Quarterly Spending Trend (Planned vs. Actual) - 3 Years</h3>
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
