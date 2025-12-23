import React, { useState } from 'react';
import { Calendar, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const SubscriptionWatch = () => {
    const { subscriptions, updateSubscriptionsList, formatCurrency } = useFinance();
    const [isAdding, setIsAdding] = useState(false);
    const [newSub, setNewSub] = useState({ name: '', amount: '', frequency: '1 Month', nextDate: '' });

    const handleAdd = (e) => {
        e.preventDefault();
        const updated = [...subscriptions, newSub];
        updateSubscriptionsList(updated);
        setIsAdding(false);
        setNewSub({ name: '', amount: '', frequency: '1 Month', nextDate: '' });
    };

    const handleDelete = (indexToDelete) => {
        const updated = subscriptions.filter((_, index) => index !== indexToDelete);
        updateSubscriptionsList(updated);
    };



    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-glass)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: 'rgba(153, 102, 255, 0.2)',
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <RefreshCw size={20} color="#9966FF" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Subscription Watch</h3>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        background: isAdding ? 'var(--bg-secondary)' : 'transparent',
                        border: '1px solid var(--border-color)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        transition: 'all 0.2s'
                    }}
                >
                    <Plus size={16} style={{ transform: isAdding ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input
                            placeholder="Name (e.g. Netflix)"
                            value={newSub.name}
                            onChange={e => setNewSub({ ...newSub, name: e.target.value })}
                            style={{
                                padding: '0.75rem',
                                background: 'var(--bg-secondary)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                width: '100%'
                            }}
                            required
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={newSub.amount}
                                onChange={e => setNewSub({ ...newSub, amount: e.target.value })}
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    width: '100%'
                                }}
                                required
                            />
                            <select
                                value={newSub.frequency}
                                onChange={e => setNewSub({ ...newSub, frequency: e.target.value })}
                                style={{
                                    padding: '0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    width: '100%'
                                }}
                            >
                                <option value="1 Month">1 Month Plan</option>
                                <option value="3 Months">3 Months Plan</option>
                                <option value="6 Months">6 Months Plan</option>
                                <option value="12 Months">12 Months Plan</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <button type="submit" style={{ flex: 1, background: '#9966FF', border: 'none', padding: '0.6rem', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>Add Subscription</button>
                        </div>
                    </div>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto', maxHeight: '300px' }}>
                {subscriptions.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                        <RefreshCw size={32} style={{ marginBottom: '0.5rem' }} />
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>No subscriptions tracked</p>
                    </div>
                ) : (
                    subscriptions.map((sub, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'background 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: 'rgba(153, 102, 255, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#9966FF'
                                }}>
                                    {sub.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>{sub.name}</p>
                                    <span style={{ fontSize: '0.75rem', color: '#9966FF', background: 'rgba(153, 102, 255, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                                        {sub.frequency}
                                    </span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{formatCurrency(sub.amount)}</p>
                                    <button
                                        onClick={() => handleDelete(idx)}
                                        style={{
                                            background: 'rgba(255, 99, 132, 0.1)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '28px',
                                            height: '28px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: '#ff6384',
                                            transition: 'background 0.2s'
                                        }}
                                        title="Remove Subscription"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                {sub.nextDate && (
                                    <span style={{ fontSize: '0.75rem', color: '#FFCE56', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Due: {sub.nextDate}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SubscriptionWatch;
