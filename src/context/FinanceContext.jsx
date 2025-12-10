import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/db';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [initialBalance, setInitialBalance] = useState(0);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [advice, setAdvice] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial data from IndexedDB
    useEffect(() => {
        const loadData = async () => {
            try {
                const txs = await dbService.getAllTransactions();
                // Sort by date descending
                txs.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactions(txs);

                const balance = await dbService.getSetting('initialBalance');
                setInitialBalance(balance || 0);

                const savedAdvice = await dbService.getSetting('advice');
                setAdvice(savedAdvice || []);
            } catch (error) {
                console.error("Failed to load data from DB:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

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
    }, [transactions, initialBalance]);

    const addTransaction = async (transaction) => {
        await dbService.addTransaction(transaction);
        setTransactions(prev => [transaction, ...prev]);
    };

    const addTransactions = async (newTransactions) => {
        await dbService.addTransactions(newTransactions);
        setTransactions(prev => [...newTransactions, ...prev]);
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

    return (
        <FinanceContext.Provider value={{
            transactions,
            summary,
            advice,
            initialBalance,
            isLoading,
            addTransaction,
            addTransactions,
            clearTransactions,
            setFinancialAdvice,
            updateInitialBalance
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
