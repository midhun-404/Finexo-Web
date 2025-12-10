import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacyBanner = () => {
    return (
        <div style={{
            background: 'rgba(0, 255, 122, 0.1)',
            border: '1px solid rgba(0, 255, 122, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.8rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            color: '#e0e0e0'
        }}>
            <ShieldCheck size={24} color="#00ff7a" />
            <p style={{ margin: 0 }}>
                <strong>Privacy First:</strong> Finexo processes only cropped statements. Personal identifiers are never uploaded, stored, or sent to AI. All analysis happens locally on your device.
            </p>
        </div>
    );
};

export default PrivacyBanner;
