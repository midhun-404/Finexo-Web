import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Edit2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const OverviewCards = () => {
    const { summary, addTransaction, formatCurrency } = useFinance();
    // Edit functionality removed for Monthly View consistency


    const cards = [
        {
            title: 'Monthly Income',
            amount: formatCurrency(summary.income),
            icon: <TrendingUp size={24} color="white" />,
            bg: 'var(--gradient-main)',
            textColor: 'white',
            isEditable: false
        },
        {
            title: 'Net Savings',
            amount: formatCurrency(summary.balance),
            icon: <Wallet size={24} color="#00ff7a" />,
            bg: 'var(--bg-card)',
            textColor: 'var(--text-primary)',
            iconBg: 'rgba(0, 255, 122, 0.1)'
        },
        {
            title: 'Total Expense',
            amount: formatCurrency(summary.expense),
            icon: <TrendingDown size={24} color="#ff007a" />,
            bg: 'var(--bg-card)',
            textColor: 'var(--text-primary)',
            iconBg: 'rgba(255, 0, 122, 0.1)'
        },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                        background: card.bg,
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        color: card.textColor,
                        border: 'var(--border-glass)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div style={{
                            padding: '0.8rem',
                            borderRadius: '12px',
                            background: card.iconBg || 'rgba(255,255,255,0.2)'
                        }}>
                            {card.icon}
                        </div>

                        {card.isEditable ? (
                            <button
                                onClick={() => setIsEditingBalance(true)}
                                style={{
                                    fontSize: '0.8rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '20px',
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(5px)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                }}
                            >
                                <Edit2 size={12} /> Adjust
                            </button>
                        ) : null}
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>{card.title}</p>
                        {card.isEditable && isEditingBalance ? (
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input
                                    type="number"
                                    value={newBalance}
                                    onChange={(e) => setNewBalance(e.target.value)}
                                    placeholder="Enter actual balance"
                                    autoFocus
                                    onBlur={() => {
                                        // Small delay to allow button click to register if they clicked save
                                        setTimeout(() => {
                                            if (!newBalance) setIsEditingBalance(false);
                                        }, 200);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleBalanceUpdate();
                                        if (e.key === 'Escape') setIsEditingBalance(false);
                                    }}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '0.2rem 0.5rem',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        width: '100%'
                                    }}
                                />
                                <button
                                    onClick={handleBalanceUpdate}
                                    style={{
                                        background: 'white',
                                        color: 'var(--primary-color)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '0.2rem 0.5rem',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    OK
                                </button>
                            </div>
                        ) : (
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{card.amount}</h3>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default OverviewCards;
