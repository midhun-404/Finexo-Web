import React from 'react';
import { Bell, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBanner = () => {
    const { notifications } = useFinance();

    if (!notifications || notifications.length === 0) return null;

    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AnimatePresence>
                {notifications.map((notif, index) => (
                    <motion.div
                        key={notif.id || index}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        style={{
                            background: notif.type === 'warning' ? '#FFCE56' : '#36A2EB',
                            color: '#1a1a1a',
                            padding: '1rem',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            minWidth: '300px'
                        }}
                    >
                        <Bell size={20} />
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem' }}>Alert</p>
                            <p style={{ margin: 0, fontSize: '0.85rem' }}>{notif.message}</p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBanner;
