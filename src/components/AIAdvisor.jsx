import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertTriangle, PiggyBank } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const AIAdvisor = () => {
    const { advice } = useFinance();

    if (!advice || advice.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'saving': return <PiggyBank size={24} color="#00ff7a" />;
            case 'alert': return <AlertTriangle size={24} color="#ff007a" />;
            default: return <TrendingUp size={24} color="#6c63ff" />;
        }
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', background: 'rgba(108, 99, 255, 0.2)', borderRadius: '50%' }}>
                    <Lightbulb size={20} color="#6c63ff" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>AI Financial Insights</h3>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {advice.map((tip, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'var(--bg-card)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            border: 'var(--border-glass)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '4px',
                            height: '100%',
                            background: index % 2 === 0 ? 'var(--primary-color)' : '#00ff7a'
                        }} />

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{
                                padding: '0.8rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px'
                            }}>
                                {getIcon(tip.type || 'general')}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    {tip.title || 'Smart Tip'}
                                </h4>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                                    {typeof tip === 'string' ? tip : tip.tip}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AIAdvisor;
