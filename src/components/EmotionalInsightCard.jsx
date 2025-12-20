import React, { useState } from 'react';
import { HeartPulse, Zap } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { analyzeEmotionalSpending } from '../services/aiService';

const EmotionalInsightCard = () => {
    const { transactions, emotionalInsights, setEmotionalInsights } = useFinance();
    const [loading, setLoading] = useState(false);

    const checkEmotions = async () => {
        if (transactions.length === 0) return;
        setLoading(true);
        try {
            const result = await analyzeEmotionalSpending(transactions);
            if (result) setEmotionalInsights(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!emotionalInsights && !loading && transactions.length > 0) {
        return (
            <div
                onClick={checkEmotions}
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: '0.2s'
                }}
            >
                <HeartPulse size={24} color="#ff007a" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ margin: 0 }}>Check Emotional Spending</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Are you stress spending?</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px' }}>
                <p>Analyzing timestamps & habits...</p>
            </div>
        );
    }

    if (!emotionalInsights) return null;

    const getMoodColor = (mood) => {
        switch (mood?.toLowerCase()) {
            case 'stressed': return '#ff007a';
            case 'impulsive': return '#ffae00';
            case 'happy': return '#00ff7a';
            default: return '#6c63ff';
        }
    };

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: `1px solid ${getMoodColor(emotionalInsights.mood)}`,
            borderRadius: '16px',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: getMoodColor(emotionalInsights.mood) }} />

            <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
                Spending Mood
            </h4>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ margin: 0, color: getMoodColor(emotionalInsights.mood) }}>{emotionalInsights.mood}</h2>
                <div style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}>
                    Score: {emotionalInsights.score}/10
                </div>
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                {emotionalInsights.insight}
            </p>
        </div>
    );
};

export default EmotionalInsightCard;
