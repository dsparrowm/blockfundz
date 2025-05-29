import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { logo } from "../assets/icons";
import Toast from "../utils/Toast";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();

    // Auto-close Toast after 3 seconds
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setToastMessage({ type: 'error', message: 'Passwords do not match.' });
            setShowToast(true);
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/api/auth/reset-password`, {
                token,
                password,
            });
            setToastMessage({ type: 'success', message: 'Password reset successful! You can now log in.' });
            setShowToast(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setToastMessage({ type: 'error', message: 'Failed to reset password. The link may have expired.' });
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            {/* Toast */}
            {showToast && toastMessage && (
                <Toast
                    type={toastMessage.type}
                    message={toastMessage.message}
                    onClose={() => setShowToast(false)}
                />
            )}
            {/* Logo */}
            <div className="mb-6 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <span className='text-3xl text-orange-500 mr-1 pt-2'>
                    <img src={logo} alt="logo" width={50} height={10} />
                </span>
                <p className='text-[30px] text-gray-900 leading-8 font-bold'>Nex<span className="text-orange-500">Gen</span></p>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
                <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full mb-4 p-2 border rounded"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full mb-4 p-2 border rounded"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
