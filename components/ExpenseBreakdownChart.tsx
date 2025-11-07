
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, Category } from '../types';

interface ExpenseBreakdownChartProps {
    transactions: Transaction[];
}

const COLORS = {
    [Category.Computers]: '#0F172A',
    [Category.Software]: '#3B82F6',
    [Category.Printers]: '#60A5FA',
};

const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ transactions }) => {
    const data = React.useMemo(() => {
        const categoryTotals = transactions.reduce((acc, transaction) => {
            if (!acc[transaction.category]) {
                acc[transaction.category] = 0;
            }
            acc[transaction.category] += transaction.amount;
            return acc;
        }, {} as Record<Category, number>);

        return Object.entries(categoryTotals).map(([name, value]) => ({
            name: name as Category,
            value
        }));
    }, [transactions]);

    if (data.length === 0) {
      return <div>No data available</div>;
    }

    return (
        <div className="bg-brand-card-bg p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-brand-text-dark mb-4">Expense Category Breakdown (3 Years)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                            labelLine={false}
                        >
                            {data.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ExpenseBreakdownChart;
