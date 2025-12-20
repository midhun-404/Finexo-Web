import React, { useMemo } from 'react';
import { Activity } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const SpendHeatmap = () => {
    const { transactions } = useFinance();

    const heatmapData = useMemo(() => {
        // 7 days x 4 time blocks (Morning, Afternoon, Evening, Night)
        const grid = Array(7).fill(0).map(() => Array(4).fill(0));
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const times = ['Morning', 'Afternoon', 'Evening', 'Night'];

        transactions.forEach(tx => {
            const date = new Date(tx.date);
            const day = date.getDay();
            const hour = date.getHours();

            let timeBlock = 3; // Night
            if (hour >= 6 && hour < 12) timeBlock = 0; // Morning
            else if (hour >= 12 && hour < 17) timeBlock = 1; // Afternoon
            else if (hour >= 17 && hour < 22) timeBlock = 2; // Evening

            grid[day][timeBlock] += 1;
        });
        return { grid, days, times };
    }, [transactions]);

    const getMaxIntensity = () => {
        let max = 0;
        heatmapData.grid.forEach(row => row.forEach(val => { if (val > max) max = val; }));
        return max || 1;
    };

    const getOpacity = (val) => {
        return (val / getMaxIntensity()).toFixed(2);
    };

    return (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: 'var(--border-glass)', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} color="#ffae00" />
                Spending Intensity Heatmap
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(4, 1fr)', gap: '4px' }}>
                {/* Header Row */}
                <div></div>
                {heatmapData.times.map(t => (
                    <div key={t} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        {t}
                    </div>
                ))}

                {/* Data Rows */}
                {heatmapData.days.map((day, dIdx) => (
                    <React.Fragment key={day}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>{day}</div>
                        {heatmapData.grid[dIdx].map((val, tIdx) => (
                            <div
                                key={`${dIdx}-${tIdx}`}
                                style={{
                                    height: '30px',
                                    borderRadius: '4px',
                                    background: `rgba(108, 99, 255, ${Math.max(0.1, getOpacity(val))})`,
                                    border: val > 0 ? '1px solid rgba(108, 99, 255, 0.5)' : '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    color: 'white'
                                }}
                                title={`${val} transactions`}
                            >
                                {val > 0 ? val : ''}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default SpendHeatmap;
