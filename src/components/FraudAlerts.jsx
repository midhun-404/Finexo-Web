import React, { useMemo } from 'react';
import { AlertOctagon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const FraudAlerts = () => {
    const { transactions } = useFinance();

    const alerts = useMemo(() => {
        const found = [];
        // Check for duplicates (Same amount & title within same day)
        const seen = new Set();

        transactions.forEach(tx => {
            const key = `${tx.date}-${tx.amount}-${tx.title}`;
            if (seen.has(key)) {
                found.push({ type: 'duplicate', message: `Potential Duplicate: ${tx.title} (${tx.amount})` });
            }
            seen.add(key);

            // Check for odd amounts > 5000 (simple heuristic)
            const amt = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
            if (Math.abs(amt) > 5000 && tx.type === 'expense') {
                found.push({ type: 'high_value', message: `Unusually High Expense: ${tx.title} (${tx.amount})` });
            }
        });
        return found;
    }, [transactions]);

    if (alerts.length === 0) return null;

    return (
        <div style={{ background: 'rgba(255, 0, 50, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 0, 50, 0.3)', marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ff4d4d' }}>
                <AlertOctagon size={18} />
                Security Alerts
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#ffaaaa' }}>
                {alerts.map((alert, i) => (
                    <li key={i}>{alert.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default FraudAlerts;
