import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, FileText, Loader, ShieldAlert, CheckCircle, Camera } from 'lucide-react';
import { analyzeStatement } from '../services/aiService';
import { validateImage } from '../services/privacyService';
import { useFinance } from '../context/FinanceContext';
import ReceiptScannerModal from './ReceiptScannerModal';

const StatementUpload = () => {
    const { addTransactions, addTransaction, setFinancialAdvice } = useFinance();
    const [status, setStatus] = useState('idle'); // idle, validating, analyzing, success, error
    const [errorMsg, setErrorMsg] = useState('');
    const [privacyIssues, setPrivacyIssues] = useState([]);
    const [manualEntry, setManualEntry] = useState({ title: '', amount: '', date: '', type: 'expense' });
    const [showManualForm, setShowManualForm] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setStatus('validating');
        setErrorMsg('');
        setPrivacyIssues([]);

        try {
            // 1. Privacy Validation (Client-side)
            const validation = await validateImage(file);

            if (!validation.isValid) {
                setStatus('error');
                setPrivacyIssues(validation.detectedIssues);
                setErrorMsg("Privacy Check Failed: Sensitive data detected.");
                return;
            }

            // 2. AI Analysis
            setStatus('analyzing');
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64 = reader.result;
                    const result = await analyzeStatement(base64);

                    if (result.transactions) {
                        const enhancedTransactions = result.transactions.map((tx, index) => ({
                            ...tx,
                            id: Date.now() + index,
                            icon: 'ShoppingBag',
                            color: tx.type === 'income' ? '#00ff7a' : '#ff007a'
                        }));
                        await addTransactions(enhancedTransactions);
                    }

                    if (result.advice) {
                        setFinancialAdvice([{ tip: result.advice, type: 'ai' }]);
                    }

                    setStatus('success');
                    setTimeout(() => setStatus('idle'), 3000);
                } catch (error) {
                    console.error(error);
                    setStatus('error');
                    setErrorMsg('Failed to analyze statement. Please try again.');
                }
            };
            reader.readAsDataURL(file);

        } catch (error) {
            console.error(error);
            setStatus('error');
            setErrorMsg('Validation failed. Please try a clearer image.');
        }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!manualEntry.title || !manualEntry.amount) return;

        const amountValue = parseFloat(manualEntry.amount);
        const formattedAmount = manualEntry.type === 'expense'
            ? `-₹${Math.abs(amountValue).toFixed(2)}`
            : `+₹${Math.abs(amountValue).toFixed(2)}`;

        await addTransaction({
            id: Date.now(),
            title: manualEntry.title,
            date: manualEntry.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            amount: formattedAmount,
            type: manualEntry.type,
            color: manualEntry.type === 'income' ? '#00ff7a' : '#ff007a',
            icon: 'Edit',
            category: 'Manual'
        });

        setManualEntry({ title: '', amount: '', date: '', type: 'expense' });
        setShowManualForm(false);
    };

    return (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Upload Section */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                style={{
                    flex: 1,
                    minWidth: '300px',
                    background: status === 'error' ? 'rgba(255, 0, 122, 0.1)' : 'var(--bg-card)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: status === 'error' ? '1px solid #ff007a' : 'var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={status === 'validating' || status === 'analyzing'}
                    style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                />

                <AnimatePresence mode="wait">
                    {status === 'validating' && (
                        <motion.div key="validating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <Loader className="animate-spin" size={32} color="#6c63ff" />
                            <p>Scanning for sensitive data...</p>
                        </motion.div>
                    )}
                    {status === 'analyzing' && (
                        <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <Loader className="animate-spin" size={32} color="#00ff7a" />
                            <p>AI Extracting transactions...</p>
                        </motion.div>
                    )}
                    {status === 'success' && (
                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <CheckCircle size={40} color="#00ff7a" />
                            <p>Statement processed successfully!</p>
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <ShieldAlert size={40} color="#ff007a" />
                            <h4 style={{ color: '#ff007a', margin: 0 }}>Upload Rejected</h4>
                            <p style={{ fontSize: '0.9rem' }}>{errorMsg}</p>
                            {privacyIssues.length > 0 && (
                                <ul style={{ fontSize: '0.8rem', textAlign: 'left', color: 'var(--text-secondary)' }}>
                                    {privacyIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                                </ul>
                            )}
                        </motion.div>
                    )}
                    {status === 'idle' && (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', marginBottom: '1rem', display: 'inline-block' }}>
                                <Upload size={24} color="var(--primary-color)" />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Upload Bank Statement</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                Crop your statement to show only the transaction table.
                                <br />
                                <span style={{ color: '#00ff7a', fontSize: '0.75rem' }}>
                                    <ShieldAlert size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                    Privacy Protected: Sensitive data is rejected.
                                </span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Receipt Scanner Button */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsScannerOpen(true)}
                style={{
                    flex: 1,
                    minWidth: '300px',
                    background: 'var(--bg-card)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer'
                }}
            >
                <div style={{ padding: '1rem', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
                    <Camera size={24} color="var(--secondary-color)" />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Scan Receipt</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Take a photo of a bill or receipt to extract details instantly.
                </p>
            </motion.div>

            {/* Manual Entry Section */}
            <div style={{
                flex: 1,
                minWidth: '300px',
                background: 'var(--bg-card)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--border-glass)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Quick Add</h3>
                    <button
                        onClick={() => setShowManualForm(!showManualForm)}
                        style={{
                            background: 'var(--primary-color)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={18} color="white" />
                    </button>
                </div>

                {showManualForm ? (
                    <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Expense Name (e.g. Lunch)"
                            value={manualEntry.title}
                            onChange={(e) => setManualEntry({ ...manualEntry, title: e.target.value })}
                            style={{ padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                placeholder="Amount"
                                value={manualEntry.amount}
                                onChange={(e) => setManualEntry({ ...manualEntry, amount: e.target.value })}
                                style={{ flex: 1, padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            />
                            <select
                                value={manualEntry.type}
                                onChange={(e) => setManualEntry({ ...manualEntry, type: e.target.value })}
                                style={{ padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <button type="submit" style={{ padding: '0.8rem', borderRadius: 'var(--radius-md)', background: 'var(--gradient-main)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                            Add Transaction
                        </button>
                    </form>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Click + to add a manual transaction
                    </div>
                )}
            </div>

            <ReceiptScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
        </div>
    );
};

export default StatementUpload;
