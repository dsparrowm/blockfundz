import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import NexGenLogo from "../components/ui/NexGenLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

const VerifiedEmailSuccessPage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
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

                {/* Main Success Card */}
                <Card className="shadow-lg border-0 bg-gray-800 border-gray-700">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-green-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-100">
                            Email Verified Successfully!
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Your email has been verified. You can now log in to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleLoginRedirect}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                        >
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VerifiedEmailSuccessPage;