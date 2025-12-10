import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useFinance } from '../context/FinanceContext';
import { useTheme } from '../context/ThemeContext';
import { Save, Trash2, DollarSign, Bell, Moon, Download, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
    const { initialBalance, updateInitialBalance, clearTransactions, transactions } = useFinance();
    const { isDarkMode, toggleTheme } = useTheme();
    const [balanceInput, setBalanceInput] = useState(initialBalance);
    const [currency, setCurrency] = useState('INR');
    const [notifications, setNotifications] = useState(true);

    const handleSaveBalance = () => {
        updateInitialBalance(balanceInput);
        alert('Initial balance updated successfully!');
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear all transactions and data? This action cannot be undone.')) {
            clearTransactions();
            alert('All data cleared.');
        }
    };

    const handleExportData = () => {
        const dataStr = JSON.stringify(transactions, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "finexo_transactions.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const SettingSection = ({ title, children }) => (
        <div style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-glass)',
            marginBottom: '2rem'
        }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {children}
            </div>
        </div>
    );

    const ToggleItem = ({ icon, label, value, setValue }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ color: 'var(--primary-color)' }}>{icon}</div>
                <span>{label}</span>
            </div>
            <div
                onClick={() => setValue(!value)}
                style={{
                    width: '50px',
                    height: '26px',
                    background: value ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                    borderRadius: '13px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                }}
            >
                <motion.div
                    animate={{ x: value ? 24 : 2 }}
                    style={{
                        width: '22px',
                        height: '22px',
                        background: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                />
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Settings</h2>

            <div style={{ maxWidth: '800px' }}>

                <SettingSection title="Financial Preferences">
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Initial Account Balance</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="number"
                                value={balanceInput}
                                onChange={(e) => setBalanceInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'var(--border-glass)',
                                    background: 'rgba(0,0,0,0.2)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <button
                                onClick={handleSaveBalance}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Save size={18} />
                                Save
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Currency</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'var(--border-glass)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="EUR">Euro (€)</option>
                        </select>
                    </div>
                </SettingSection>

                <SettingSection title="App Settings">
                    <ToggleItem
                        icon={<Bell size={20} />}
                        label="Push Notifications"
                        value={notifications}
                        setValue={setNotifications}
                    />
                    <ToggleItem
                        icon={<Moon size={20} />}
                        label="Dark Mode"
                        value={isDarkMode}
                        setValue={toggleTheme}
                    />
                </SettingSection>

                <SettingSection title="Data Management">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={handleExportData}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: 'var(--primary-color)' }}><Download size={20} /></div>
                            <div>
                                <span style={{ display: 'block' }}>Export Data</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Download your transactions as JSON</span>
                            </div>
                        </div>
                        <ChevronRight size={16} color="var(--text-secondary)" />
                    </div>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ color: '#ff007a' }}><Trash2 size={20} /></div>
                            <div>
                                <span style={{ display: 'block', color: '#ff007a' }}>Clear All Data</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Permanently remove all data</span>
                            </div>
                        </div>
                        <button
                            onClick={handleClearData}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255, 0, 122, 0.1)',
                                color: '#ff007a',
                                border: '1px solid rgba(255, 0, 122, 0.3)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Delete All My Data
                        </button>
                    </div>
                </SettingSection>

            </div>
        </DashboardLayout>
    );
};

export default Settings;
