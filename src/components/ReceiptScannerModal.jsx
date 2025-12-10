import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Check, Loader, RefreshCw } from 'lucide-react';
import { ocrService } from '../services/ocrService';
import { parseReceiptText } from '../services/receiptParser';
import { dbService } from '../services/db';
import { useFinance } from '../context/FinanceContext';

const ReceiptScannerModal = ({ isOpen, onClose }) => {
    const [image, setImage] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [scannedData, setScannedData] = useState(null);
    const fileInputRef = useRef(null);
    const { addTransaction } = useFinance();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            scanReceipt(file);
        }
    };

    const scanReceipt = async (file) => {
        setIsScanning(true);
        setProgress(0);
        try {
            const { text } = await ocrService.scanImage(file, (p) => setProgress(Math.round(p)));
            const parsed = parseReceiptText(text);
            setScannedData(parsed);
        } catch (error) {
            console.error(error);
            alert("Failed to scan receipt.");
        } finally {
            setIsScanning(false);
        }
    };

    const handleSave = async () => {
        if (!scannedData) return;

        const amountVal = parseFloat(scannedData.amount);
        const transaction = {
            id: Date.now(),
            title: scannedData.vendor,
            amount: `-${amountVal}`, // Expense by default
            date: scannedData.date,
            type: 'expense',
            category: 'Receipt', // Default
            receiptId: Date.now().toString(),
            rawText: scannedData.rawText
        };

        // Save Receipt to DB
        await dbService.addReceipt({
            id: transaction.receiptId,
            rawText: scannedData.rawText,
            parsedFields: scannedData,
            createdAt: new Date().toISOString()
        });

        // Add Transaction
        await addTransaction(transaction);

        onClose();
        setImage(null);
        setScannedData(null);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    width: '90%',
                    maxWidth: '500px',
                    border: 'var(--border-glass)',
                    position: 'relative'
                }}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--text-secondary)' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '1.5rem' }}>Scan Receipt</h2>

                {!image ? (
                    <div
                        onClick={() => fileInputRef.current.click()}
                        style={{
                            border: '2px dashed var(--border-glass)',
                            borderRadius: 'var(--radius-md)',
                            padding: '3rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)'
                        }}
                    >
                        <Camera size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                        <p>Click to upload or capture receipt</p>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                ) : (
                    <div>
                        {isScanning ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <Loader className="animate-spin" size={40} color="var(--primary-color)" />
                                <p style={{ marginTop: '1rem' }}>Scanning... {progress}%</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vendor</label>
                                    <input
                                        type="text"
                                        value={scannedData?.vendor || ''}
                                        onChange={(e) => setScannedData({ ...scannedData, vendor: e.target.value })}
                                        style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: 'var(--border-glass)', color: 'var(--text-primary)', borderRadius: '8px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Amount</label>
                                        <input
                                            type="number"
                                            value={scannedData?.amount || ''}
                                            onChange={(e) => setScannedData({ ...scannedData, amount: e.target.value })}
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: 'var(--border-glass)', color: 'var(--text-primary)', borderRadius: '8px' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date</label>
                                        <input
                                            type="text"
                                            value={scannedData?.date ? new Date(scannedData.date).toLocaleDateString() : ''}
                                            readOnly
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: 'var(--border-glass)', color: 'var(--text-primary)', borderRadius: '8px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={() => setImage(null)}
                                        style={{ flex: 1, padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    >
                                        Retake
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        style={{ flex: 1, padding: '0.8rem', background: 'var(--primary-color)', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}
                                    >
                                        Save Receipt
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ReceiptScannerModal;
