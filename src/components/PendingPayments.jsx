import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const PendingPayments = () => {
    const payments = [
        { id: 1, title: 'Netflix Subscription', due: 'Due Tomorrow', amount: '₹15.99' },
        { id: 2, title: 'Car Insurance', due: 'Due in 3 days', amount: '₹145.00' },
    ];

    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-glass)',
            flex: 1,
            height: 'fit-content'
        }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Pending Payments</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {payments.map((payment, index) => (
                    <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(145deg, rgba(255,0,122,0.1) 0%, rgba(255,0,122,0.05) 100%)',
                            border: '1px solid rgba(255,0,122,0.2)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '600' }}>{payment.title}</span>
                            <span style={{ fontWeight: 'bold' }}>{payment.amount}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                            <Clock size={14} />
                            <span>{payment.due}</span>
                        </div>
                        <button style={{
                            width: '100%',
                            marginTop: '1rem',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--accent-color)',
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            Pay Now
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PendingPayments;
