import React, { useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { analysisService } from '../services/analysisService';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, DollarSign, Target, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const Analytics = () => {
    const { transactions, subscriptions, formatCurrency } = useFinance();

    // --- Functional Logic Calculation ---
    const {
        verdict,
        leaks,
        concentration,
        momChange: momChanges,
        subImpact,
        actionRec,
        categories,
        totalExpense,
        monthlyTrend
    } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        // 1. Filter Transactions
        const currentMonthTxs = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const prevMonthTxs = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
        });

        // 2. Calculate Totals
        const calcTotals = (txs) => txs.reduce((acc, t) => {
            const val = parseFloat(t.amount.replace(/[^0-9.-]+/g, ""));
            if (t.type === 'income') acc.income += val;
            else if (t.type === 'expense') acc.expense += Math.abs(val);
            return acc;
        }, { income: 0, expense: 0 });

        const currentTotals = calcTotals(currentMonthTxs);
        const prevTotals = calcTotals(prevMonthTxs);

        // --- Metric 1: Financial Verdict ---
        let verdictStatus = 'SAFE';
        let verdictLabel = 'Healthy Financial Status';
        let verdictDesc = 'Your spending is well within your income.';

        if (currentTotals.income > 0) {
            const ratio = (currentTotals.expense / currentTotals.income) * 100;
            if (ratio > 80) {
                verdictStatus = 'CRITICAL';
                verdictLabel = 'Critical Spending Alert';
                verdictDesc = 'Expenses exceed 80% of income. Immediate correction needed.';
            } else if (ratio > 60) {
                verdictStatus = 'WARNING';
                verdictLabel = 'Spending Caution';
                verdictDesc = 'Expenses are becoming high relative to income.';
            }
        }

        const verdict = { status: verdictStatus, label: verdictLabel, desc: verdictDesc };

        // --- Metric 2: Money Leaks ---
        const detectedLeaks = analysisService.detectMoneyLeaks(currentMonthTxs);

        // --- Metric 3: Expense Concentration ---
        // Reuse existing category logic for current month
        const catTotals = currentMonthTxs
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => {
                const amount = parseFloat(curr.amount.replace(/[^0-9.-]+/g, ""));
                const cat = curr.category || 'Uncategorized';
                acc[cat] = (acc[cat] || 0) + Math.abs(amount);
                return acc;
            }, {});

        // Prepare existing 'categories' prop for UI (using ALL time or Month? 
        // Request implies "Monthly Financial Verdict" context, but existing UI was generic. 
        // I will keep existing UI using ALL transactions for "Spending Breakdown" to avoid breaking it, 
        // OR switch it to monthly to match the page theme. 
        // User said "This is the Analytics page... UI layout... MUST NOT be modified". 
        // existing code used 'transactions' (all time). I will preserve 'categories' derived from ALL transactions for the existing chart 
        // but use 'catTotals' (current month) for the NEW "Concentration" card to be accurate to the request.

        // Re-implementing existing categories logic for the UI chart (All Time)
        const allTimeCatTotals = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => {
                const amount = parseFloat(curr.amount.replace(/[^0-9.-]+/g, ""));
                const category = curr.category || 'Uncategorized';
                acc[category] = (acc[category] || 0) + Math.abs(amount);
                return acc;
            }, {});

        const categoriesDisplay = Object.keys(allTimeCatTotals).map((cat, index) => ({
            name: cat,
            value: allTimeCatTotals[cat],
            color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'][index % 6]
        }));
        const totalExpAllTime = categoriesDisplay.reduce((acc, curr) => acc + curr.value, 0);


        // Concentration Logic (Current Month)
        let maxCat = { name: '', percent: 0 };
        const totalMonthExp = currentTotals.expense;
        Object.keys(catTotals).forEach(cat => {
            const pct = (catTotals[cat] / totalMonthExp) * 100;
            if (pct > maxCat.percent) maxCat = { name: cat, percent: pct };
        });
        const concentration = maxCat.percent > 40 ? maxCat : null;

        // --- Metric 4: MoM Change ---
        const momChanges = [];
        // Compare top categories from current month
        Object.keys(catTotals).forEach(cat => {
            const currVal = catTotals[cat];
            // Find prev val (need to re-calc prev breakdown)
            const prevCatVal = prevMonthTxs.filter(t => t.type === 'expense' && (t.category || 'Uncategorized') === cat)
                .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.replace(/[^0-9.-]+/g, ""))), 0);

            if (prevCatVal > 0) {
                const diff = ((currVal - prevCatVal) / prevCatVal) * 100;
                if (Math.abs(diff) >= 10) {
                    momChanges.push({ category: cat, pct: diff });
                }
            }
        });

        // --- Metric 5: Subscription Impact ---
        const subTotal = subscriptions.reduce((sum, s) => sum + parseFloat(s.amount), 0);
        const subPct = totalMonthExp > 0 ? (subTotal / totalMonthExp) * 100 : 0;
        const subImpact = { total: subTotal, pct: subPct };

        // --- Metric 6: Action Recommendation ---
        let action = null;
        if (concentration && concentration.name) {
            const saveAmount = (catTotals[concentration.name] * 0.10).toFixed(0);
            action = {
                text: `Reduce ${concentration.name} spending by ${formatCurrency(saveAmount)} (10%) to optimize budget.`
            };
        } else if (totalMonthExp > 0) {
            // Fallback if no single category dominates
            action = { text: "Review recurring small expenses to find 5% savings." };
        }

        return {
            verdict,
            leaks: detectedLeaks,
            concentration,
            momChange: momChanges,
            subImpact,
            actionRec: action,
            categories: categoriesDisplay,
            totalExpense: totalExpAllTime
        };

    }, [transactions, subscriptions, formatCurrency]);

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Financial Analytics</h2>

                {/* 1. Verdict Badge */}
                <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    background: verdict.status === 'SAFE' ? 'rgba(75, 192, 192, 0.2)' : verdict.status === 'WARNING' ? 'rgba(255, 206, 86, 0.2)' : 'rgba(255, 99, 132, 0.2)',
                    color: verdict.status === 'SAFE' ? '#4BC0C0' : verdict.status === 'WARNING' ? '#FFCE56' : '#FF6384',
                    border: `1px solid ${verdict.status === 'SAFE' ? '#4BC0C0' : verdict.status === 'WARNING' ? '#FFCE56' : '#FF6384'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 'bold'
                }}>
                    {verdict.status === 'SAFE' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {verdict.label}
                </div>
            </div>

            {/* Verdict Description */}
            <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-card)', borderRadius: '8px', borderLeft: `4px solid ${verdict.status === 'SAFE' ? '#4BC0C0' : verdict.status === 'WARNING' ? '#FFCE56' : '#FF6384'}` }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{verdict.desc}</p>
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* EXISTING: Spending Breakdown */}
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-glass)'
                }}>
                    <h3 style={{ marginBottom: '2rem' }}>Spending Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {categories.map((cat, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>{cat.name}</span>
                                    <span style={{ fontWeight: 'bold' }}>{formatCurrency(cat.value)}</span>
                                </div>
                                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.value / totalExpense) * 100}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                        style={{ height: '100%', background: cat.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EXISTING: Monthly Trend */}
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <h3 style={{ marginBottom: '2rem' }}>Monthly Trend</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1rem' }}>
                        {monthlyTrend && monthlyTrend.map((item, index) => (
                            <div key={index} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'relative', group: 'bar' }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${item.height}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    style={{
                                        width: '100%',
                                        background: index % 2 === 0 ? 'var(--primary-color)' : 'var(--secondary-color)',
                                        borderRadius: '4px 4px 0 0',
                                        opacity: 0.8,
                                        minHeight: '4px' // Ensure visibility even if 0
                                    }}
                                    title={`${formatCurrency(item.amount)}`}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {item.month}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Money Leak Summary */}
                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: 'var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255, 99, 132, 0.1)', borderRadius: '50%', color: '#FF6384' }}>
                            <AlertTriangle size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Money Leaks</h3>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Potential Leaks</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(leaks.totalLeak)}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                        {leaks.leaks.length > 0 ? leaks.leaks.map((leak, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                                <span>{leak.name} ({leak.frequency}x)</span>
                                <span style={{ color: '#FF6384' }}>{formatCurrency(leak.total)}</span>
                            </div>
                        )) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No leaks detected.</p>}
                    </div>
                </div>

                {/* 3. Expense Concentration */}
                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: 'var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255, 206, 86, 0.1)', borderRadius: '50%', color: '#FFCE56' }}>
                            <Activity size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Expense Focus</h3>
                    </div>
                    {concentration ? (
                        <>
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Dominant Category</p>
                                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', color: '#FFCE56' }}>{concentration.name}</p>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                Consumes <span style={{ fontWeight: 'bold' }}>{concentration.percent.toFixed(0)}%</span> of your monthly budget.
                            </p>
                        </>
                    ) : (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your spending is well-distributed across categories.</p>
                    )}
                </div>

                {/* 4. MoM Change */}
                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: 'var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(54, 162, 235, 0.1)', borderRadius: '50%', color: '#36A2EB' }}>
                            <TrendingUp size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>MoM Shifts</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {momChanges.length > 0 ? momChanges.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span>{item.category}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: item.pct > 0 ? '#FF6384' : '#4BC0C0' }}>
                                    {item.pct > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span>{Math.abs(item.pct).toFixed(1)}%</span>
                                </div>
                            </div>
                        )) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No significant (&gt;10%) changes observed.</p>}
                    </div>
                </div>

                {/* 5. Subscription Impact */}
                <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: 'var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(153, 102, 255, 0.1)', borderRadius: '50%', color: '#9966FF' }}>
                            <Shield size={20} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Fixed Costs</h3>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subscription Load</p>
                        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{formatCurrency(subImpact.total)}</p>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Fixed subscriptions take up <span style={{ fontWeight: 'bold', color: '#9966FF' }}>{subImpact.pct.toFixed(0)}%</span> of your monthly expenses.
                    </p>
                </div>

                {/* 6. Action Recommendation */}
                <div style={{ background: 'linear-gradient(135deg, rgba(75, 192, 192, 0.1) 0%, rgba(75, 192, 192, 0.05) 100%)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(75, 192, 192, 0.2)', gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Target size={20} color="#4BC0C0" />
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#4BC0C0' }}>Actionable Action</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>
                        {actionRec ? actionRec.text : "Keep tracking your expenses to generate insights."}
                    </p>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Analytics;
