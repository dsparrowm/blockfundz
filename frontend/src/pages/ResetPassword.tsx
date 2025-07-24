import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NexGenLogo from "../components/ui/NexGenLogo";
import { toast } from "sonner";

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:3001"}/api/auth/reset-password`, {
                token,
                password,
            });
            toast.success('Password reset successful! You can now log in.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error('Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
            {/* Logo */}
            <div className="mb-6 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <NexGenLogo variant="full" size="md" />
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
