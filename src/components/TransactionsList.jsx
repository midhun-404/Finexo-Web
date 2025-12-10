import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Coffee, Home, Zap, Edit } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const iconMap = {
    ShoppingBag: <ShoppingBag size={20} />,
    Coffee: <Coffee size={20} />,
    Home: <Home size={20} />,
    Zap: <Zap size={20} />,
    Edit: <Edit size={20} />
};

const TransactionsList = () => {
    const { transactions } = useFinance();

    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-glass)',
            flex: 2,
            minHeight: '400px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Recent Transactions</h3>
                <button style={{ color: 'var(--secondary-color)', fontSize: '0.9rem' }}>View All</button>
            </div>

            {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    <p>No transactions found.</p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Upload a statement or add manually to see data.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transactions.slice(0, 5).map((tx, index) => (
                        <motion.div
                            key={tx.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-glass)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    padding: '0.8rem',
                                    borderRadius: '50%',
                                    background: `${tx.color || '#6c63ff'}20`,
                                    color: tx.color || '#6c63ff'
                                }}>
                                    {iconMap[tx.icon] || <ShoppingBag size={20} />}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600' }}>{tx.title}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tx.date}</p>
                                </div>
                            </div>
                            <span style={{
                                fontWeight: 'bold',
                                color: (tx.amount && tx.amount.toString().startsWith('+')) ? 'var(--text-accent)' : 'var(--text-primary)'
                            }}>
                                {tx.amount}
                            </span>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionsList;
