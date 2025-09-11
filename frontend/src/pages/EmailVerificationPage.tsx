import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStore } from "../store/useStore";
import Spinner from '../components/spinners/Spinner';
import NexGenLogo from "../components/ui/NexGenLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

// Desc: Email Verification Page

const EmailVerificationPage = () => {
    const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const userEmail = useStore(state => state.userEmail);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newCode = [...verificationCode];
            newCode[index] = value;
            setVerificationCode(newCode);

            // Move to the next input field
            if (value && index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const code = verificationCode.join('');
            const response = await axios.post(`${apiBaseUrl}/api/auth/verify-email`, { code, email: userEmail });
            if (response.status === 200) {
                navigate('/email-verified');
            }
        } catch (error) {
            toast('Invalid verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-red-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo Section */}
                <div className="text-center">
                    <div
                        className="inline-block cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <NexGenLogo variant="full" size="lg" />
                    </div>
                </div>

                {/* Main Verification Card */}
                <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold text-gray-100">
                            Email Verification
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Enter the 6-digit code sent to your email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-200 text-center block">
                                    Verification Code
                                </Label>
                                <div className="flex justify-center space-x-2">
                                    {verificationCode.map((code, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={code}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            className="w-12 h-12 text-center text-2xl border border-white/30 bg-white/20 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            maxLength={1}
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner />
                                        <span className="ml-2">Verifying...</span>
                                    </>
                                ) : (
                                    'Verify Email'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmailVerificationPage;