import React from 'react';
import { logo } from '../assets/icons';

const LogoTest = () => {
    console.log('Direct logo import test:', logo);

    return (
        <div style={{ padding: '20px', border: '2px solid red' }}>
            <h3>Logo Test Component</h3>
            <p>Logo value: {String(logo)}</p>
            <p>Logo type: {typeof logo}</p>
            <img src={logo} alt="Test logo" style={{ width: '100px', height: '100px', border: '1px solid blue' }} />
        </div>
    );
};

export default LogoTest;
