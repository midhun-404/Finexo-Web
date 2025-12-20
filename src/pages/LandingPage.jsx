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
                            Finexo — Your <br />
                            <span style={{ color: 'var(--primary-color)', WebkitTextFillColor: 'var(--primary-color)' }}>AI-Powered Finance Brain</span>
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                            Predict life events, track warranties, stop bad subscriptions, detect fraud, and understand your emotions behind spending — all directly in your browser.
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
                                    Start Smarter Money Management <ArrowRight size={20} />
                                </motion.button>
                            </Link>
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
                                <h3 style={{ marginTop: '2rem', fontSize: '1.5rem' }}>AI Insights</h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 2rem', position: 'relative' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Next-Gen AI Finance Features</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { icon: <TrendingUp size={30} color="#6c63ff" />, title: "AI Life-Event Predictor", desc: "Predicts travel, moving, or stress based on spending patterns." },
                            { icon: <Shield size={30} color="#00ff7a" />, title: "Warranty Tracker", desc: "Auto-extracts warranty info from receipts using OCR." },
                            { icon: <Wallet size={30} color="#ff007a" />, title: "Subscription Auto-Killer", desc: "Finds hidden recurring charges and helps you cancel them." },
                            { icon: <PieChart size={30} color="#ffae00" />, title: "Emotional Intelligence", desc: "Detects stress-spending and impulse buying habits." },
                            { icon: <Shield size={30} color="#ff4d4d" />, title: "Fraud & Custom Alerts", desc: "Instant warnings for duplicate or unusual charges." },
                            { icon: <TrendingUp size={30} color="#00d4ff" />, title: "Future Projection", desc: "AI forecasts your financial health 6-12 months ahead." },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: 'var(--border-glass)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                <div style={{ marginBottom: '1rem' }}>{feature.icon}</div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { q: "Does Finexo store my data online?", a: "No. Everything is stored safely in your browser using LocalStorage." },
                            { q: "What makes Finexo different?", a: "It uses AI to predict life events, detect emotions, track warranties, and prevent fraud." },
                            { q: "How does the AI Life-Event Predictor work?", a: "It analyzes your expense patterns and predicts future trends like travel or stress phases." },
                            { q: "Will the AI see or store my data?", a: "The AI processes only the text you send; no data is stored anywhere." }
                        ].map((faq, i) => (
                            <div key={i} style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '12px', border: 'var(--border-glass)' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{faq.q}</h4>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{faq.a}</p>
                            </div>
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
