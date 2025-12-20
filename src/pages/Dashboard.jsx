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

import PredictionsPanel from '../components/PredictionsPanel';
import EmotionalInsightCard from '../components/EmotionalInsightCard';
import WarrantyDashboard from '../components/WarrantyDashboard';
import SubscriptionManager from '../components/SubscriptionManager';
import SpendHeatmap from '../components/SpendHeatmap';
import FraudAlerts from '../components/FraudAlerts';

const Dashboard = () => {
    const { summary, transactions, advice, isLoading } = useFinance();
    const navigate = useNavigate();
    return (
        <DashboardLayout>
            <PrivacyBanner />
            <OverviewCards />
            <div style={{ marginBottom: '2rem' }}>
                <StatementUpload />
            </div>
            <AnalyticsPreview />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <PredictionsPanel />
                <EmotionalInsightCard />
                <WarrantyDashboard />
                <SubscriptionManager />
                <SpendHeatmap />
                <FraudAlerts />
            </div>
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
