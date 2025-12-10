import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
    const { transactions } = useFinance();

    // Calculate category totals dynamically
    const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const amount = parseFloat(curr.amount.replace(/[^0-9.-]+/g, ""));
            const category = curr.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + Math.abs(amount);
            return acc;
        }, {});

    const categories = Object.keys(categoryTotals).map((cat, index) => ({
        name: cat,
        value: categoryTotals[cat],
        color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'][index % 6]
    }));

    const totalExpense = categories.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <DashboardLayout>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Financial Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Spending Breakdown (Bar Type) */}
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-glass)'
                }}>
                    <h3 style={{ marginBottom: '2rem' }}>Spending Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {categories.map((cat, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>{cat.name}</span>
                                    <span style={{ fontWeight: 'bold' }}>₹{cat.value}</span>
                                </div>
                                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.value / totalExpense) * 100}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                        style={{ height: '100%', background: cat.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Trend (Mock Bar Chart - keeping for now as requested to just add circular graph) */}
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3 style={{ marginBottom: '2rem' }}>Monthly Trend</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1rem' }}>
                        {[65, 40, 75, 50, 85, 60].map((height, index) => (
                            <div key={index} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    style={{
                                        width: '100%',
                                        background: index % 2 === 0 ? 'var(--primary-color)' : 'var(--secondary-color)',
                                        borderRadius: '4px 4px 0 0',
                                        opacity: 0.8
                                    }}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][index]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
