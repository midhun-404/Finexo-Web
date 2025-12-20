import React, { useEffect, useState } from 'react';
import { Sparkles, Brain } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { predictLifeEvents } from '../services/aiService';

const PredictionsPanel = () => {
    const { transactions, predictions, setPredictions } = useFinance();
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (transactions.length === 0) return;
        setLoading(true);
        try {
            const result = await predictLifeEvents(transactions);
            if (result && Array.isArray(result)) {
                setPredictions(result);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
            border: '1px solid rgba(108, 99, 255, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Brain size={20} color="#6c63ff" />
                    AI Life Predictor
                </h3>
                <button
                    onClick={handleAnalyze}
                    disabled={loading || transactions.length < 5}
                    style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        opacity: transactions.length < 5 ? 0.5 : 1
                    }}
                >
                    {loading ? 'Thinking...' : 'Analyze My Life'}
                </button>
            </div>

            {predictions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {predictions.map((pred, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '10px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <Sparkles size={16} color="#00d4ff" />
                            <span style={{ fontSize: '0.9rem' }}>{pred}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Click analyze to let AI predict potential upcoming life events based on your spending patterns.
                </p>
            )}
        </div>
    );
};

export default PredictionsPanel;
