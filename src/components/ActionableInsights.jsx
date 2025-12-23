import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const ActionableInsights = () => {
    const { insights } = useFinance();

    if (!insights || insights.length === 0) return null;

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(54, 162, 235, 0.1), rgba(153, 102, 255, 0.1))',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-glass)',
            marginBottom: '2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Lightbulb size={20} color="#36A2EB" />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Actionable Insights</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {insights.map((insight, idx) => (
                    <div key={idx} style={{
                        background: 'var(--bg-card)',
                        padding: '1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        borderLeft: '4px solid #36A2EB',
                        fontSize: '0.95rem'
                    }}>
                        {insight}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActionableInsights;
