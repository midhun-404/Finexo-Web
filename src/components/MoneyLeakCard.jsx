import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const MoneyLeakCard = () => {
    const { leaks, formatCurrency } = useFinance();

    if (!leaks || leaks.totalLeak === 0) return null;

    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 159, 64, 0.3)',
            height: '100%'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                    background: 'rgba(255, 159, 64, 0.2)',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <AlertCircle size={20} color="#FF9F40" />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Money Leak Detector</h3>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#FF9F40' }}>
                    {formatCurrency(leaks.totalLeak)}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                    leaked this month through silent charges
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {leaks.leaks.slice(0, 3).map((leak, idx) => (
                    <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px'
                    }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: '500', fontSize: '0.9rem' }}>{leak.name}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {leak.frequency}x {leak.type}
                            </span>
                        </div>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {formatCurrency(leak.total)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoneyLeakCard;
