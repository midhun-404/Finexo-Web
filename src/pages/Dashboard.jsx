import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import OverviewCards from '../components/OverviewCards';
import TransactionsList from '../components/TransactionsList';
import PendingPayments from '../components/PendingPayments';
import StatementUpload from '../components/StatementUpload';
import AIAdvisor from '../components/AIAdvisor';
import AnalyticsPreview from '../components/AnalyticsPreview';
import PrivacyBanner from '../components/PrivacyBanner';
import ChatPanel from '../components/ChatPanel';

const Dashboard = () => {
    return (
        <DashboardLayout>
            <PrivacyBanner />
            <OverviewCards />
            <div style={{ marginBottom: '2rem' }}>
                <StatementUpload />
            </div>
            <AnalyticsPreview />
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
