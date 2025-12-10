import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const Navbar = () => {
    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem 2rem',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp color="var(--primary-color)" size={32} />
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>Finexo</span>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <Link to="/login" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Login</Link>
                <Link to="/signup" style={{
                    padding: '0.5rem 1.5rem',
                    background: 'var(--gradient-main)',
                    borderRadius: 'var(--radius-md)',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: 'var(--shadow-glow)'
                }}>
                    Get Started
                </Link>
            </div>
        </motion.nav>
    );
};

export default Navbar;
