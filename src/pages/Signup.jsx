import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { countries } from '../data/countries';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to first country
    const { signup } = useAuth();
    const { updateCurrency, loginUser } = useFinance();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (signup(name, email, password)) {
            // Set Currency based on Country
            const newCurrency = {
                code: selectedCountry.currencyCode,
                symbol: selectedCountry.currencySymbol
            };
            await updateCurrency(newCurrency);

            // Create Profile
            await loginUser({
                name,
                email,
                country: selectedCountry.name,
                currency: newCurrency
            });

            navigate('/dashboard');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-10%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, var(--secondary-color) 0%, transparent 70%)',
                opacity: 0.2,
                filter: 'blur(100px)'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(10px)',
                    padding: '3rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-glass)',
                    width: '100%',
                    maxWidth: '400px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 1
                }}
            >
                <h2 style={{
                    fontSize: '2rem',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    background: 'var(--gradient-main)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>Create Account</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'var(--border-glass)',
                                background: 'var(--bg-glass)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'var(--border-glass)',
                                background: 'var(--bg-glass)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Country</label>
                        <select
                            value={selectedCountry.code}
                            onChange={(e) => {
                                const country = countries.find(c => c.code === e.target.value);
                                setSelectedCountry(country);
                            }}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'var(--border-glass)',
                                background: 'var(--bg-glass)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            {countries.map(country => (
                                <option key={country.code} value={country.code} style={{ color: 'black' }}>
                                    {country.name} ({country.currencySymbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'var(--border-glass)',
                                background: 'var(--bg-glass)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--gradient-main)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            marginTop: '1rem',
                            boxShadow: 'var(--shadow-glow)'
                        }}
                    >
                        Sign Up
                    </motion.button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--secondary-color)' }}>Log In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
