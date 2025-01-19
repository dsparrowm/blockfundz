import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const VerifiedEmailSuccessPage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="flex justify-center items-center h-screen bg-coral-black">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Email Verified Successfully!</h1>
                <p className="mb-6">Your email has been verified. You can now log in to your account.</p>
                <button
                    onClick={handleLoginRedirect}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default VerifiedEmailSuccessPage;