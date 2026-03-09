import React from 'react';

export default function Loader({ fullPage = false }) {
    if (fullPage) {
        return (
            <div style={{
                position: 'fixed', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--clr-bg)', zIndex: 9999, flexDirection: 'column', gap: '16px',
            }}>
                <div className="spinner" />
                <span style={{ color: 'var(--clr-text-secondary)', fontSize: '0.9rem' }}>Loading…</span>
            </div>
        );
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner" />
        </div>
    );
}
