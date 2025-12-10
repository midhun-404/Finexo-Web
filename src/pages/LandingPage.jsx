import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, PieChart, Wallet, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
            <Navbar />

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '2rem'
            }}>
                {/* Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)',
                    opacity: 0.15,
                    filter: 'blur(100px)',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, var(--secondary-color) 0%, transparent 70%)',
                    opacity: 0.15,
                    filter: 'blur(80px)',
                    zIndex: 0
                }} />

                <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', zIndex: 1, alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 style={{
                            fontSize: '4rem',
                            fontWeight: '800',
                            lineHeight: '1.1',
                            marginBottom: '1.5rem',
                            background: 'linear-gradient(to right, #fff, #a0aec0)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Master Your <br />
                            <span style={{ color: 'var(--primary-color)', WebkitTextFillColor: 'var(--primary-color)' }}>Financial Future</span>
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Track expenses, manage budgets, and grow your savings with Finexo's intelligent financial dashboard.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        padding: '1rem 2rem',
                                        background: 'var(--gradient-main)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        boxShadow: 'var(--shadow-glow)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    Start Free <ArrowRight size={20} />
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '1rem 2rem',
                                    background: 'transparent',
                                    border: '1px solid var(--text-secondary)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                Learn More
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ position: 'relative' }}
                    >
                        {/* Abstract 3D-like Visual */}
                        <div style={{
                            width: '100%',
                            height: '500px',
                            background: 'var(--bg-glass)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 'var(--radius-lg)',
                            border: 'var(--border-glass)',
                            position: 'relative',
                            boxShadow: 'var(--shadow-lg)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* Mock Charts/UI Elements */}
                            <div style={{ textAlign: 'center' }}>
                                <PieChart size={120} color="var(--secondary-color)" style={{ filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.4))' }} />
                                <h3 style={{ marginTop: '2rem', fontSize: '1.5rem' }}>Smart Analytics</h3>
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    position: 'absolute',
                                    top: '10%',
                                    right: '-5%',
                                    background: 'var(--bg-secondary)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'var(--border-glass)',
                                    boxShadow: 'var(--shadow-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{ background: 'rgba(0,255,122,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                                    <TrendingUp color="#00ff7a" size={24} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Income</p>
                                    <p style={{ fontWeight: 'bold' }}>+₹4,250.00</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '15%',
                                    left: '-5%',
                                    background: 'var(--bg-secondary)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'var(--border-glass)',
                                    boxShadow: 'var(--shadow-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{ background: 'rgba(255,0,122,0.1)', padding: '0.5rem', borderRadius: '50%' }}>
                                    <Wallet color="#ff007a" size={24} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Savings</p>
                                    <p style={{ fontWeight: 'bold' }}>₹12,800.00</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 2rem', position: 'relative' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Why Choose Finexo?</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { icon: <Shield size={40} color="var(--primary-color)" />, title: "Bank-Grade Security", desc: "Your financial data is encrypted and secure with us." },
                            { icon: <PieChart size={40} color="var(--secondary-color)" />, title: "Visual Analytics", desc: "Understand your spending habits with intuitive charts." },
                            { icon: <Wallet size={40} color="var(--accent-color)" />, title: "Smart Budgeting", desc: "Set limits and save more with AI-powered suggestions." }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    padding: '2rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: 'var(--border-glass)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <div style={{ marginBottom: '1.5rem' }}>{feature.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', borderTop: 'var(--border-glass)', color: 'var(--text-secondary)' }}>
                <p>&copy; 2024 Finexo. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
