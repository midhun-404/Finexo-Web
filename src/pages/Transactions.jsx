import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowDownUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const Transactions = () => {
    const { transactions } = useFinance();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || tx.type.toLowerCase() === filterType.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    // Sort by date (newest first) - assuming date string format or just order
    // If date is "MMM DD, YYYY", we might need better parsing, but for now let's trust the order or simple string compare if needed.
    // Ideally, we should parse dates.
    const sortedTransactions = [...filteredTransactions].sort((a, b) => b.id - a.id);

    return (
        <DashboardLayout>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Transactions</h2>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.8rem 1rem 0.8rem 3rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'var(--border-glass)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                width: '300px'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{
                                padding: '0.8rem 2rem 0.8rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'var(--border-glass)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                appearance: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="All">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <Filter size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: 'var(--border-glass)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Transaction</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Category</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>Date</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Amount</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTransactions.map((tx, index) => (
                            <motion.tr
                                key={tx.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                            >
                                <td style={{ padding: '1.5rem', fontWeight: '600' }}>{tx.title}</td>
                                <td style={{ padding: '1.5rem' }}>
                                    <span style={{
                                        padding: '0.3rem 0.8rem',
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,0.1)',
                                        fontSize: '0.8rem'
                                    }}>
                                        {tx.category || 'Uncategorized'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.5rem', color: 'var(--text-secondary)' }}>{tx.date}</td>
                                <td style={{
                                    padding: '1.5rem',
                                    textAlign: 'right',
                                    fontWeight: 'bold',
                                    color: tx.type === 'income' ? 'var(--text-accent)' : 'var(--text-primary)'
                                }}>
                                    {tx.amount}
                                </td>
                                <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                                    <span style={{ color: '#00ff7a', fontSize: '0.9rem' }}>Completed</span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {sortedTransactions.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No transactions found. Upload a statement or add manually.
                    </div>
                )}

                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: 'var(--border-glass)' }}>
                    <button style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }}><ChevronLeft /></button>
                    <button style={{ padding: '0.5rem', background: 'var(--primary-color)', borderRadius: '8px', color: 'white' }}>1</button>
                    <button style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }}>2</button>
                    <button style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }}>3</button>
                    <button style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-secondary)' }}><ChevronRight /></button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Transactions;
