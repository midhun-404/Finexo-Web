import React from 'react';
import { Lock } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const DisciplineLock = ({ children }) => {
    const { transactions } = useFinance();

    // Logic: If today is 1st of month AND no transactions for PREVIOUS month, show lock.
    const today = new Date();
    // const isFirstOfMonth = today.getDate() === 1; // Strict rule
    // For demo/dev purposes, we might want to relax this or ensure it only locks if really necessary.
    // The prompt says "On the 1st of every month: Check if previous month data exists".

    // Let's implement strict logic but comment out Date check for easier testing if needed,
    // or rely on the user to test by changing system date which is hard.
    // We'll implement the logic: If today.getDate() === 1, check previous month.

    const isFirstOfMonth = today.getDate() === 1;

    // Check previous month
    const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevMonth = previousMonthDate.toLocaleString('default', { month: 'short' });
    const prevYear = previousMonthDate.getFullYear();

    const hasPrevMonthData = transactions.some(t => {
        const d = new Date(t.date);
        return d.getMonth() === previousMonthDate.getMonth() && d.getFullYear() === prevYear;
    });

    const isLocked = isFirstOfMonth && !hasPrevMonthData;

    if (isLocked) {
        return (
            <div style={{ position: 'relative', minHeight: '200px' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white',
                    textAlign: 'center',
                    padding: '2rem'
                }}>
                    <Lock size={48} color="#FF6384" style={{ marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Monthly Discipline Lock</h2>
                    <p style={{ maxWidth: '400px', margin: '0 0 1.5rem 0', color: 'var(--text-secondary)' }}>
                        It's the 1st of the month! To ensure accurate analytics, please upload your statement for <b>{prevMonth} {prevYear}</b>.
                    </p>
                    {/* The StatementUpload component is usually elsewhere, so we just inform user */}
                    <p style={{ fontSize: '0.9rem', color: '#4BC0C0' }}>
                        Use the "Upload Statement" section above to unlock.
                    </p>
                </div>
                <div style={{ filter: 'blur(10px)', pointerEvents: 'none' }}>
                    {children}
                </div>
            </div>
        );
    }

    return children;
};

export default DisciplineLock;
