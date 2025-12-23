import React from 'react';
import { Activity, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const HealthScoreCard = () => {
    const { healthScore } = useFinance();
    const { score, status, details } = healthScore;

    let color = '#4BC0C0'; // Safe
    let Icon = CheckCircle;
    if (status === 'Warning') {
        color = '#FFCE56';
        Icon = AlertTriangle;
    } else if (status === 'Critical') {
        color = '#FF6384';
        Icon = AlertOctagon;
    }

    return (
        <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-glass)',
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        background: `${color}20`,
                        padding: '8px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Activity size={20} color={color} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Financial Health</h3>
                </div>
                <span style={{
                    background: `${color}20`,
                    color: color,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                }}>
                    {status}
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.5rem 0' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Simple SVG Ring */}
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="var(--bg-secondary)"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={color}
                            strokeWidth="3"
                            strokeDasharray={`${score}, 100`}
                        />
                    </svg>
                    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{Math.round(score)}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>/100</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {details.map((detail, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: detail.startsWith('+') ? '#4BC0C0' : '#FF6384' }}></div>
                        {detail.substring(2)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HealthScoreCard;
