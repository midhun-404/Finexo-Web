import React, { useState } from 'react';
import { PlusCircle, Banknote, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';

const ManualTransactionForm = () => {
    const { addManualTransaction } = useFinance();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Food',
        type: 'expense'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addManualTransaction(formData);
        setFormData({
            amount: '',
            title: '',
            date: new Date().toISOString().split('T')[0],
            category: 'Food',
            type: 'expense'
        });
        setIsOpen(false);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div
                        key="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setIsOpen(true)}
                        style={{
                            flex: 1,
                            background: 'var(--bg-card)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            border: 'var(--border-glass)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            cursor: 'pointer',
                            minHeight: '200px'
                        }}
                    >
                        <div style={{ padding: '1rem', background: 'rgba(255, 159, 64, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Banknote size={24} color="#FF9F40" />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Manual Entry</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Log cash spending or unlisted transactions manually.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            flex: 1,
                            background: 'var(--bg-card)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-lg)',
                            border: 'var(--border-glass)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <PlusCircle size={18} color="#FF9F40" />
                                Add Transaction
                            </h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Description (e.g. Street Food)"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', width: '100%' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', width: '100%' }}
                                />
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', width: '100%' }}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', width: '100%' }}
                                />
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', width: '100%' }}
                                >
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Entertainment">Fun</option>
                                    <option value="Health">Health</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    padding: '0.8rem',
                                    background: 'var(--primary-color)',
                                    border: 'none',
                                    color: 'white',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginTop: '0.5rem'
                                }}
                            >
                                <Check size={18} />
                                Save Transaction
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManualTransactionForm;
