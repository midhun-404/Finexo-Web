import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const AnalyticsPreview = () => {
    const { transactions, formatCurrency } = useFinance();

    // 1. Calculate Category Data for Progress Bars
    const categoryTotals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const amount = parseFloat(curr.amount.replace(/[^0-9.-]+/g, ""));
            const category = curr.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + Math.abs(amount);
            return acc;
        }, {});

    const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

    const topCategories = Object.keys(categoryTotals)
        .map(cat => ({
            name: cat,
            amount: categoryTotals[cat],
            percentage: totalExpense > 0 ? (categoryTotals[cat] / totalExpense) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3); // Top 3

    // 2. Prepare Data for Simplified Graph (Last 7 transactions for trend)
    // In a real app, you'd aggregate by day. Here we just take the last 7 amounts reversed.
    const graphData = transactions
        .slice(0, 7)
        .reverse()
        .map((t, i) => ({
            name: i,
            amount: Math.abs(parseFloat(t.amount.replace(/[^0-9.-]+/g, "")))
        }));

    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-glass)',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={20} color="var(--primary-color)" />
                    Analytics Overview
                </h3>
                <Link to="/dashboard/analytics" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', fontSize: '0.9rem', textDecoration: 'none' }}>
                    See Detailed <ArrowRight size={16} />
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Loading Type Bars (Top Categories) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Top Spending Categories</h4>
                    {topCategories.length > 0 ? (
                        topCategories.map((cat, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                                    <span>{cat.name}</span>
                                    <span>{Math.round(cat.percentage)}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${cat.percentage}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                        style={{
                                            height: '100%',
                                            background: index === 0 ? 'var(--primary-color)' : index === 1 ? '#36A2EB' : '#FFCE56',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No expense data to display.</p>
                    )}
                </div>

                {/* Simplified Graph */}
                <div style={{ height: '150px', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Recent Activity Trend</h4>
                    {graphData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData}>
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="var(--primary-color)"
                                    strokeWidth={3}
                                    dot={false}
                                />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.8rem' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value) => [`${formatCurrency(value)}`, 'Amount']}
                                    labelStyle={{ display: 'none' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No recent activity.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPreview;
