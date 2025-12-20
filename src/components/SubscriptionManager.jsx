import React, { useEffect } from 'react';
import { RefreshCw, ExternalLink, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { detectSubscriptions } from '../services/aiService';

const SubscriptionManager = () => {
    const { transactions, subscriptions, updateSubscriptionsList } = useFinance();

    const scanSubscriptions = async () => {
        if (transactions.length < 5) return;
        try {
            const results = await detectSubscriptions(transactions);
            if (results && Array.isArray(results)) {
                updateSubscriptionsList(results);
            }
        } catch (e) {
            console.error("Sub scan failed", e);
        }
    };

    useEffect(() => {
        if (subscriptions.length === 0 && transactions.length > 0) {
            scanSubscriptions();
        }
    }, [transactions]);

    return (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: 'var(--border-glass)', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={20} color="#ff007a" />
                Subscription Auto-Killer
            </h3>

            {subscriptions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        AI is scanning your history for recurring charges...
                    </p>
                    <button onClick={scanSubscriptions} style={{ marginTop: '0.5rem', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', padding: '0.3rem 0.8rem', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        Force Scan
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {subscriptions.map((sub, idx) => (
                        <div key={idx} style={{ background: 'rgba(255, 0, 122, 0.05)', border: '1px solid rgba(255, 0, 122, 0.2)', borderRadius: '12px', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>{sub.name}</span>
                                <span style={{ color: '#ff007a', fontWeight: 'bold' }}>{sub.amount}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '10px' }}>{sub.frequency}</span>
                                <a
                                    href={`https://google.com/search?q=cancel ${sub.name} subscription`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: '0.8rem', color: '#ff007a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    Cancel <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubscriptionManager;
