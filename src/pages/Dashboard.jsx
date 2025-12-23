import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import DashboardLayout from '../components/DashboardLayout';
import OverviewCards from '../components/OverviewCards';
import TransactionsList from '../components/TransactionsList';
import PendingPayments from '../components/PendingPayments';
import StatementUpload from '../components/StatementUpload';
import AIAdvisor from '../components/AIAdvisor';
import AnalyticsPreview from '../components/AnalyticsPreview';
import PrivacyBanner from '../components/PrivacyBanner';
import ChatPanel from '../components/ChatPanel';


import FraudAlerts from '../components/FraudAlerts';

// Extensions
import MoneyLeakCard from '../components/MoneyLeakCard';
import HealthScoreCard from '../components/HealthScoreCard';
import SubscriptionWatch from '../components/SubscriptionWatch';
import ActionableInsights from '../components/ActionableInsights';

import DisciplineLock from '../components/DisciplineLock';
import NotificationBanner from '../components/NotificationBanner';

const Dashboard = () => {
    const { summary, transactions, advice, isLoading } = useFinance();
    const navigate = useNavigate();
    return (
        <DashboardLayout>
            <NotificationBanner />
            <PrivacyBanner />
            <OverviewCards />
            <div style={{ marginBottom: '2rem' }}>
                <StatementUpload />
            </div>

            <ActionableInsights />

            <DisciplineLock>
                <AnalyticsPreview />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    <HealthScoreCard />
                    <MoneyLeakCard />
                    <SubscriptionWatch />
                    <FraudAlerts />
                </div>
            </DisciplineLock>
            <AIAdvisor />
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <TransactionsList />
                <PendingPayments />
            </div>
            <ChatPanel />
        </DashboardLayout>
    );
};

export default Dashboard;
