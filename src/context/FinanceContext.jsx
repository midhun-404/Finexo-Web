import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';
import { analysisService } from '../services/analysisService';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [initialBalance, setInitialBalance] = useState(0);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [advice, setAdvice] = useState([]);
    const [currency, setCurrency] = useState({ code: 'USD', symbol: '$' }); // Default Currency
    // New Feature States
    const [warranties, setWarranties] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [emotionalInsights, setEmotionalInsights] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    // Extension States
    const [leaks, setLeaks] = useState({ totalLeak: 0, leaks: [] });
    const [healthScore, setHealthScore] = useState({ score: 50, status: 'Warning', details: [] });
    const [insights, setInsights] = useState([]);
    const [notifications, setNotifications] = useState([]); // New Notification System

    const [isLoading, setIsLoading] = useState(true);

    // Load initial data from IndexedDB
    useEffect(() => {
        const loadData = async () => {
            try {
                const txs = (await dbService.getAllTransactions()) || [];
                // Sort by date descending
                if (Array.isArray(txs)) {
                    txs.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setTransactions(txs);
                } else {
                    setTransactions([]);
                }

                const balance = await dbService.getSetting('initialBalance');
                setInitialBalance(balance || 0);

                const savedAdvice = await dbService.getSetting('advice');
                setAdvice(savedAdvice || []);

                // Load New Features Data
                const savedWarranties = (await dbService.getAllWarranties()) || [];
                setWarranties(Array.isArray(savedWarranties) ? savedWarranties : []);

                const savedSubs = (await dbService.getSubscriptions()) || [];
                setSubscriptions(Array.isArray(savedSubs) ? savedSubs : []);

                const savedProfile = await dbService.getUserProfile();
                setUserProfile(savedProfile);

                // Load Currency Preference
                const savedCurrency = await dbService.getSetting('currency');
                if (savedCurrency) {
                    setCurrency(savedCurrency);
                } else if (savedProfile && savedProfile.currency) {
                    setCurrency(savedProfile.currency);
                }

            } catch (error) {
                console.error("Failed to load data from DB:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return `${currency.symbol}0.00`;
        const val = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
        return `${currency.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Calculate summary whenever transactions or initialBalance change
    useEffect(() => {
        const newSummary = transactions.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount.replace(/[^0-9.-]+/g, ""));
            if (amount > 0) {
                acc.income += amount;
            } else {
                acc.expense += Math.abs(amount);
            }
            return acc;
        }, { income: 0, expense: 0 });

        newSummary.balance = initialBalance + newSummary.income - newSummary.expense;
        setSummary(newSummary);

        // Run Analysis Extensions
        setLeaks(analysisService.detectMoneyLeaks(transactions));
        setHealthScore(analysisService.calculateHealthScore(newSummary, transactions, subscriptions));
        setInsights(analysisService.generateInsights(transactions, formatCurrency));
        setNotifications(analysisService.checkSubscriptionExpiry(subscriptions)); // Check Expiry

    }, [transactions, initialBalance, subscriptions]);

    const addTransaction = async (transaction) => {
        await dbService.addTransaction(transaction);
        setTransactions(prev => [transaction, ...prev]);
    };

    const addTransactions = async (newTransactions) => {
        await dbService.addTransactions(newTransactions);
        setTransactions(prev => [...newTransactions, ...prev]);
    };

    // New function to replace all transactions (for Monthly View)
    const replaceTransactions = async (newTransactions) => {
        // 1. Clear existing transactions from DB
        const currentTxs = await dbService.getAllTransactions();
        if (currentTxs && currentTxs.length > 0) {
            await Promise.all(currentTxs.map(tx => dbService.deleteTransaction(tx.id)));
        }

        // 2. Add new transactions
        await dbService.addTransactions(newTransactions);

        // 3. Update State
        setTransactions(newTransactions);
    };

    const clearTransactions = async () => {
        await dbService.clearAllData();
        setTransactions([]);
        setInitialBalance(0);
        setAdvice([]);
        setSummary({ income: 0, expense: 0, balance: 0 });
    };

    const setFinancialAdvice = async (newAdvice) => {
        setAdvice(newAdvice);
        await dbService.saveSetting('advice', newAdvice);
    };

    const updateInitialBalance = async (amount) => {
        const val = parseFloat(amount);
        setInitialBalance(val);
        await dbService.saveSetting('initialBalance', val);
    };

    // --- New Feature Actions ---
    const addWarranty = async (warranty) => {
        const newItem = await dbService.addWarranty(warranty);
        setWarranties(prev => [...prev, newItem]);
    };

    const addManualTransaction = async (data) => {
        const newTx = {
            id: Date.now().toString(),
            title: data.title,
            amount: data.type === 'expense' ? `-${data.amount}` : `+${data.amount}`,
            date: new Date(data.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
            type: data.type,
            category: data.category,
            isManual: true
        };
        await addTransaction(newTx);
    };

    const updateSubscriptionsList = async (subs) => {
        await dbService.updateSubscriptions(subs);
        setSubscriptions(subs);
    };

    const loginUser = async (profileData) => {
        await dbService.saveUserProfile(profileData);
        setUserProfile(profileData);
    };

    const logoutUser = async () => {
        await dbService.saveUserProfile(null);
        setUserProfile(null);
    };

    const updateCurrency = async (newCurrency) => {
        setCurrency(newCurrency);
        await dbService.saveSetting('currency', newCurrency);

        // Also update profile if exists
        if (userProfile) {
            const updatedProfile = { ...userProfile, currency: newCurrency };
            setUserProfile(updatedProfile);
            await dbService.saveUserProfile(updatedProfile);
        }
    };

    return (
        <FinanceContext.Provider value={{
            transactions,
            summary,
            advice,
            initialBalance,
            isLoading,
            addTransaction,
            addTransactions,
            replaceTransactions,
            clearTransactions,
            setFinancialAdvice,

            updateInitialBalance,
            warranties,
            addWarranty,
            subscriptions,
            updateSubscriptionsList,
            userProfile,
            loginUser,
            logoutUser,
            predictions,
            setPredictions,
            emotionalInsights,
            setEmotionalInsights,
            leaks,
            healthScore,
            insights,
            addManualTransaction,
            notifications,
            currency,
            formatCurrency,
            updateCurrency
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
