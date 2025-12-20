import React, { useState } from 'react';
import { ShieldCheck, Plus, AlertTriangle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const WarrantyDashboard = () => {
    const { warranties, addWarranty } = useFinance();
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({ productName: '', expiryDate: '', serialNo: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newItem.productName || !newItem.expiryDate) return;

        await addWarranty({
            id: Date.now(),
            ...newItem,
            createdAt: new Date().toISOString()
        });

        setNewItem({ productName: '', expiryDate: '', serialNo: '' });
        setShowForm(false);
    };

    const getDaysRemaining = (expiry) => {
        const diff = new Date(expiry) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: 'var(--border-glass)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={20} color="#00ff7a" />
                    Warranty Tracker
                </h3>
                <button onClick={() => setShowForm(!showForm)} style={{ background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Plus size={16} />
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input type="text" placeholder="Product Name" value={newItem.productName} onChange={e => setNewItem({ ...newItem, productName: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: 'none' }} />
                    <input type="date" value={newItem.expiryDate} onChange={e => setNewItem({ ...newItem, expiryDate: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: 'none' }} />
                    <input type="text" placeholder="Serial No (Optional)" value={newItem.serialNo} onChange={e => setNewItem({ ...newItem, serialNo: e.target.value })} style={{ padding: '0.5rem', borderRadius: '4px', border: 'none' }} />
                    <button type="submit" style={{ padding: '0.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Track Warranty</button>
                </form>
            )}

            {warranties.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No active warranties tracked yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {warranties.map(w => {
                        const days = getDaysRemaining(w.expiryDate);
                        const isExpiring = days < 30 && days > 0;
                        const isExpired = days <= 0;

                        return (
                            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: isExpired ? '3px solid #666' : (isExpiring ? '3px solid #ffae00' : '3px solid #00ff7a') }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{w.productName}</h4>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SN: {w.serialNo || 'N/A'}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.85rem', color: isExpired ? '#666' : (isExpiring ? '#ffae00' : '#fff') }}>
                                        {isExpired ? 'Expired' : `${days} days left`}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default WarrantyDashboard;
