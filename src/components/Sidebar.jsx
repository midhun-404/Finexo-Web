import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, PieChart, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/dashboard' },
        { icon: <CreditCard size={20} />, label: 'Transactions', path: '/dashboard/transactions' },
        { icon: <PieChart size={20} />, label: 'Analytics', path: '/dashboard/analytics' },
        { icon: <User size={20} />, label: 'Profile', path: '/dashboard/profile' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <div style={{
            width: '250px',
            background: 'var(--bg-secondary)',
            borderRight: 'var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1rem',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <div style={{ marginBottom: '3rem', paddingLeft: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Finexo</h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                color: isActive ? 'white' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary-color)' : 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {item.icon}
                            <span style={{ fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <button
                onClick={logout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    marginTop: 'auto',
                    transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--accent-color)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
