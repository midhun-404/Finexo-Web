import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Calendar, Activity, CreditCard } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const { transactions } = useFinance();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const stats = [
        { label: 'Total Transactions', value: transactions.length, icon: <Activity size={20} color="#6c63ff" /> },
        { label: 'Member Since', value: 'Dec 2024', icon: <Calendar size={20} color="#00ff7a" /> },
        { label: 'Account Status', value: 'Premium', icon: <CreditCard size={20} color="#ffce56" /> },
    ];

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--border-glass)',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {/* Cover Image */}
                    <div style={{ height: '200px', background: 'var(--gradient-main)' }} />

                    <div style={{ padding: '0 2rem 2rem' }}>
                        {/* Header Section with Avatar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem' }}>
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-secondary)',
                                    border: '4px solid var(--bg-card)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '3rem',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    position: 'relative',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                }}>
                                    {formData.name.charAt(0).toUpperCase()}
                                    <button style={{
                                        position: 'absolute',
                                        bottom: '5px',
                                        right: '5px',
                                        background: 'var(--primary-color)',
                                        borderRadius: '50%',
                                        padding: '0.6rem',
                                        border: '2px solid var(--bg-card)',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}>
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formData.name}</h2>
                                    <p style={{ color: 'var(--text-secondary)' }}>{formData.location}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                style={{
                                    padding: '0.8rem 2rem',
                                    background: isEditing ? 'transparent' : 'var(--primary-color)',
                                    border: isEditing ? '1px solid var(--text-secondary)' : 'none',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    marginBottom: '10px'
                                }}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            {stats.map((stat, index) => (
                                <div key={index} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: 'var(--border-glass)',
                                            background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: 'var(--border-glass)',
                                            background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: 'var(--border-glass)',
                                            background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Location</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1rem 1rem 3rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: 'var(--border-glass)',
                                            background: isEditing ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    style={{
                                        gridColumn: '1 / -1',
                                        padding: '1rem',
                                        background: 'var(--gradient-main)',
                                        color: 'white',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: 'bold',
                                        marginTop: '1rem',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Save Changes
                                </motion.button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
