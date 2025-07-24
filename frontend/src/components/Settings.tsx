import React, { useState, useEffect } from "react";
import { SlackDashboardCard } from "./SlackDashboardCard";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import axiosInstance from "../api/axiosInstance";
import { useStore } from "../store/useStore";
import { useDarkMode } from "../contexts/DarkModeContext";
import {
    User,
    Bell,
    Shield,
    CreditCard,
    Settings as SettingsIcon,
    Lock,
    Key,
    Mail,
    Phone,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Info,
    Smartphone,
    Clock,
    DollarSign,
    TrendingUp,
    BarChart3
} from "lucide-react";

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [notificationSettings, setNotificationSettings] = useState({
        investmentUpdates: true,
        transactionAlerts: true,
        weeklyReports: true,
        systemUpdates: true,
        emailFrequency: 'daily'
    });
    const [preferences, setPreferences] = useState({
        currency: 'USD',
        language: 'en',
        darkMode: false,
        autoRefresh: true
    });
    const [pinData, setPinData] = useState({
        currentPin: '',
        newPin: '',
        confirmPin: ''
    });
    const [hasPinSet, setHasPinSet] = useState(false);
    const [showCurrentPin, setShowCurrentPin] = useState(false);
    const [showNewPin, setShowNewPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);

    const userData = useStore((state) => state.user);
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    // Update preferences when dark mode changes
    useEffect(() => {
        setPreferences(prev => ({ ...prev, darkMode: isDarkMode }));
    }, [isDarkMode]);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    // Load user data on component mount
    useEffect(() => {
        if (userData) {
            setProfileData({
                firstName: userData.name?.split(' ')[0] || '',
                lastName: userData.name?.split(' ')[1] || '',
                email: userData.email || '',
                phone: userData.phone || ''
            });
        }
        checkPinStatus();
    }, [userData]);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setError('New passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axiosInstance.post('/api/auth/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });

            setSuccess('Password changed successfully!');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axiosInstance.put('/api/users/profile', {
                name: `${profileData.firstName} ${profileData.lastName}`,
                email: profileData.email,
                phone: profileData.phone
            });

            setSuccess('Profile updated successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axiosInstance.put('/api/users/notifications', notificationSettings);
            setSuccess('Notification preferences saved!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save notification preferences');
        } finally {
            setLoading(false);
        }
    };

    const handlePreferencesSave = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axiosInstance.put('/api/users/preferences', preferences);
            setSuccess('Preferences saved!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save preferences');
        } finally {
            setLoading(false);
        }
    };

    const checkPinStatus = async () => {
        try {
            const response = await axiosInstance.get('/api/auth/user/withdrawal-pin-status');
            setHasPinSet(response.data.hasPin);
        } catch (err: any) {
            console.error('Failed to check PIN status:', err);
        }
    };

    const handlePinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (hasPinSet) {
            // Changing existing PIN
            if (!pinData.currentPin) {
                setError('Current PIN is required');
                return;
            }
            if (pinData.currentPin.length !== 4) {
                setError('Current PIN must be exactly 4 digits');
                return;
            }
            if (pinData.newPin !== pinData.confirmPin) {
                setError('New PINs do not match');
                return;
            }
            if (pinData.newPin.length !== 4) {
                setError('New PIN must be exactly 4 digits');
                return;
            }
            if (!/^\d{4}$/.test(pinData.currentPin) || !/^\d{4}$/.test(pinData.newPin)) {
                setError('PIN must contain only numbers');
                return;
            }
        } else {
            // Creating new PIN
            if (pinData.newPin !== pinData.confirmPin) {
                setError('PINs do not match');
                return;
            }
            if (pinData.newPin.length !== 4) {
                setError('PIN must be exactly 4 digits');
                return;
            }
            if (!/^\d{4}$/.test(pinData.newPin)) {
                setError('PIN must contain only numbers');
                return;
            }
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (hasPinSet) {
                // Use change PIN endpoint
                await axiosInstance.post('/api/auth/user/change-withdrawal-pin', {
                    currentPin: pinData.currentPin,
                    newPin: pinData.newPin
                });
            } else {
                // Use set PIN endpoint
                await axiosInstance.post('/api/auth/user/set-withdrawal-pin', {
                    pin: pinData.newPin
                });
            }

            setSuccess(hasPinSet ? 'PIN changed successfully!' : 'PIN created successfully!');
            setPinData({ currentPin: '', newPin: '', confirmPin: '' });
            setHasPinSet(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update PIN');
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: User, color: 'blue' },
        { id: 'security', label: 'Security', icon: Shield, color: 'green' },
        { id: 'pin', label: 'PIN', icon: Key, color: 'red' },
        { id: 'notifications', label: 'Notifications', icon: Bell, color: 'yellow' },
        { id: 'preferences', label: 'Preferences', icon: SettingsIcon, color: 'purple' },
        { id: 'billing', label: 'Billing', icon: CreditCard, color: 'indigo' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <SettingsIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                                Settings
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage your NexGen account and preferences</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Settings Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Settings Menu</h2>

                            {/* Success/Error Messages */}
                            {success && (
                                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                                        <span className="text-sm text-green-700 dark:text-green-300">{success}</span>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                                    <div className="flex items-center">
                                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
                                        <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                                    </div>
                                </div>
                            )}                            <nav className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeSection === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${isActive
                                                ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-md border border-blue-200 dark:border-blue-700'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                }`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className={`font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Settings Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Profile Settings */}
                        {activeSection === 'profile' && (
                            <div className="space-y-6">
                                <SlackDashboardCard
                                    title="Personal Information"
                                    value=""
                                    subtitle="Update your personal details and contact information"
                                    icon={User}
                                    color="blue"
                                    showActions={false}
                                >
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                                    First Name
                                                </Label>
                                                <div className="mt-1 relative">
                                                    <Input
                                                        id="firstName"
                                                        value={profileData.firstName}
                                                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                                                        className="pl-10"
                                                    />
                                                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                                    Last Name
                                                </Label>
                                                <div className="mt-1 relative">
                                                    <Input
                                                        id="lastName"
                                                        value={profileData.lastName}
                                                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                                                        className="pl-10"
                                                    />
                                                    <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                                Email Address
                                            </Label>
                                            <div className="mt-1 relative">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                                                    className="pl-10"
                                                />
                                                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                                Phone Number
                                            </Label>
                                            <div className="mt-1 relative">
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                                                    className="pl-10"
                                                />
                                                <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                onClick={handleProfileSave}
                                                disabled={loading}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Saving...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <User className="w-4 h-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </SlackDashboardCard>
                            </div>
                        )}
                        {/* Security Settings */}
                        {activeSection === 'security' && (
                            <div className="space-y-6">
                                <SlackDashboardCard
                                    title="Change Password"
                                    value=""
                                    subtitle="Update your account password for better security"
                                    icon={Lock}
                                    color="green"
                                    showActions={false}
                                >
                                    <form onSubmit={handlePasswordChange} className="space-y-6">
                                        <div>
                                            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Current Password
                                            </Label>
                                            <div className="mt-1 relative">
                                                <Input
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={passwords.current}
                                                    onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                                    className="pl-10 pr-10"
                                                    required
                                                />
                                                <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                                >
                                                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                New Password
                                            </Label>
                                            <div className="mt-1 relative">
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwords.new}
                                                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                                    className="pl-10 pr-10"
                                                    required
                                                    minLength={8}
                                                />
                                                <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                                >
                                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Confirm New Password
                                            </Label>
                                            <div className="mt-1 relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwords.confirm}
                                                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                                                    className="pl-10 pr-10"
                                                    required
                                                    minLength={8}
                                                />
                                                <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <Button
                                                type="submit"
                                                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                <Key className="w-4 h-4 mr-2" />
                                                Update Password
                                            </Button>
                                        </div>
                                    </form>
                                </SlackDashboardCard>

                                <SlackDashboardCard
                                    title="Security Settings"
                                    value=""
                                    subtitle="Manage your account security preferences"
                                    icon={Shield}
                                    color="green"
                                    showActions={false}
                                >
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl border border-green-200 dark:border-green-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                                                    <Smartphone className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Two-Factor Authentication</Label>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                                                </div>
                                            </div>
                                            <Switch />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <Bell className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Login Notifications</Label>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of new sign-ins to your account</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Session Timeout</Label>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically log out after inactivity</p>
                                                </div>
                                            </div>
                                            <Select defaultValue="30">
                                                <SelectTrigger className="w-24">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="15">15 min</SelectItem>
                                                    <SelectItem value="30">30 min</SelectItem>
                                                    <SelectItem value="60">1 hour</SelectItem>
                                                    <SelectItem value="240">4 hours</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </SlackDashboardCard>
                            </div>
                        )}

                        {/* PIN Settings */}
                        {activeSection === 'pin' && (
                            <div className="space-y-6">
                                <SlackDashboardCard
                                    title={hasPinSet ? "Change Withdrawal PIN" : "Create Withdrawal PIN"}
                                    value=""
                                    subtitle={hasPinSet ? "Update your withdrawal PIN for security" : "Set up a 4-digit PIN to secure your withdrawals"}
                                    icon={Key}
                                    color="red"
                                    showActions={false}
                                >
                                    <form onSubmit={handlePinSubmit} className="space-y-6">
                                        {hasPinSet && (
                                            <div>
                                                <Label htmlFor="currentPin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Current PIN
                                                </Label>
                                                <div className="mt-1 relative">
                                                    <Input
                                                        id="currentPin"
                                                        type={showCurrentPin ? "text" : "password"}
                                                        value={pinData.currentPin}
                                                        onChange={(e) => setPinData(prev => ({ ...prev, currentPin: e.target.value }))}
                                                        className="pl-10 pr-10"
                                                        maxLength={4}
                                                        pattern="[0-9]{4}"
                                                        placeholder="Enter current PIN"
                                                        required
                                                    />
                                                    <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPin(!showCurrentPin)}
                                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                                    >
                                                        {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="newPin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {hasPinSet ? "New PIN" : "Create PIN"}
                                            </Label>
                                            <div className="mt-1 relative">
                                                <Input
                                                    id="newPin"
                                                    type={showNewPin ? "text" : "password"}
                                                    value={pinData.newPin}
                                                    onChange={(e) => setPinData(prev => ({ ...prev, newPin: e.target.value }))}
                                                    className="pl-10 pr-10"
                                                    maxLength={4}
                                                    pattern="[0-9]{4}"
                                                    placeholder="Enter 4-digit PIN"
                                                    required
                                                />
                                                <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPin(!showNewPin)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                                >
                                                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="confirmPin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Confirm PIN
                                            </Label>
                                            <div className="mt-1 relative">
                                                <Input
                                                    id="confirmPin"
                                                    type={showConfirmPin ? "text" : "password"}
                                                    value={pinData.confirmPin}
                                                    onChange={(e) => setPinData(prev => ({ ...prev, confirmPin: e.target.value }))}
                                                    className="pl-10 pr-10"
                                                    maxLength={4}
                                                    pattern="[0-9]{4}"
                                                    placeholder="Confirm your PIN"
                                                    required
                                                />
                                                <Key className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                                >
                                                    {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        {hasPinSet ? 'Changing...' : 'Creating...'}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Key className="w-4 h-4 mr-2" />
                                                        {hasPinSet ? 'Change PIN' : 'Create PIN'}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </SlackDashboardCard>

                                {/* PIN Information Card */}
                                <SlackDashboardCard
                                    title="PIN Security Information"
                                    value=""
                                    subtitle="Important information about your withdrawal PIN"
                                    icon={Info}
                                    color="blue"
                                    showActions={false}
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">PIN Security</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Your PIN is required for all withdrawal requests to ensure account security.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
                                            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Keep Your PIN Safe</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Never share your PIN with anyone. NexGen support will never ask for your PIN.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-800">
                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    PIN Status: {hasPinSet ? (
                                                        <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Set</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="ml-2 border-red-200 text-red-800 dark:border-red-700 dark:text-red-200">Not Set</Badge>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {hasPinSet ? 'Your withdrawal PIN is configured and active.' : 'You need to set up a PIN to make withdrawals.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </SlackDashboardCard>
                            </div>
                        )}

                        {/* Notifications */}
                        {activeSection === 'notifications' && (
                            <SlackDashboardCard
                                title="Notification Preferences"
                                value=""
                                subtitle="Choose how you want to receive notifications"
                                icon={Bell}
                                color="yellow"
                                showActions={false}
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                                                    <TrendingUp className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Investment Updates</Label>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Portfolio performance notifications</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={notificationSettings.investmentUpdates}
                                                onCheckedChange={(checked) =>
                                                    setNotificationSettings(prev => ({ ...prev, investmentUpdates: checked }))
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl border border-green-200 dark:border-green-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                                                    <DollarSign className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Transaction Alerts</Label>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Deposits and withdrawals</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <BarChart3 className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekly Reports</Label>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Performance summaries</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                                    <Info className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">System Updates</Label>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Platform updates and news</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Label className="text-sm font-medium text-gray-700">Email Frequency</Label>
                                                <Select defaultValue="daily">
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="immediate">Immediate</SelectItem>
                                                        <SelectItem value="daily">Daily Digest</SelectItem>
                                                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                                                        <SelectItem value="never">Never</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button
                                                onClick={handleNotificationSave}
                                                disabled={loading}
                                                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                                            >
                                                {loading ? (
                                                    <div className="flex items-center">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Saving...
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Bell className="w-4 h-4 mr-2" />
                                                        Save Preferences
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SlackDashboardCard>
                        )}

                        {/* Preferences */}
                        {activeSection === 'preferences' && (
                            <SlackDashboardCard
                                title="App Preferences"
                                value=""
                                subtitle="Customize your NexGen experience"
                                icon={SettingsIcon}
                                color="purple"
                                showActions={false}
                            >
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                                                Default Currency
                                            </Label>
                                            <Select
                                                value={preferences.currency}
                                                onValueChange={(value) => setPreferences(prev => ({ ...prev, currency: value }))}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="USD">USD ($)</SelectItem>
                                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                                    <SelectItem value="GBP">GBP (£)</SelectItem>
                                                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                                                    <SelectItem value="BTC">BTC (₿)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="language" className="text-sm font-medium text-gray-700">
                                                Language
                                            </Label>
                                            <Select defaultValue="en">
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="en">English</SelectItem>
                                                    <SelectItem value="es">Spanish</SelectItem>
                                                    <SelectItem value="fr">French</SelectItem>
                                                    <SelectItem value="de">German</SelectItem>
                                                    <SelectItem value="ja">Japanese</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark Mode</Label>
                                            <p className="text-sm text-gray-600">Use dark theme for better viewing</p>
                                        </div>
                                        <Switch
                                            checked={isDarkMode}
                                            onCheckedChange={toggleDarkMode}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-900">Auto-refresh Data</Label>
                                            <p className="text-sm text-gray-600">Automatically refresh prices and balances</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <Button
                                            onClick={handlePreferencesSave}
                                            disabled={loading}
                                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Saving...
                                                </div>
                                            ) : (
                                                <>
                                                    <SettingsIcon className="w-4 h-4 mr-2" />
                                                    Save Preferences
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </SlackDashboardCard>
                        )}

                        {/* Billing */}
                        {activeSection === 'billing' && (
                            <SlackDashboardCard
                                title="Billing & Subscription"
                                value=""
                                subtitle="Manage your subscription and payment methods"
                                icon={CreditCard}
                                color="indigo"
                                showActions={false}
                            >
                                <div className="space-y-6">
                                    <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
                                                <p className="text-sm text-gray-600">Advanced trading features and analytics</p>
                                            </div>
                                            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                                Active
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-bold text-gray-900">$99</span>
                                                <span className="text-gray-600">/month</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Next billing: Dec 15, 2024
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button variant="outline" className="h-12 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                            Change Plan
                                        </Button>
                                        <Button variant="outline" className="h-12 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                            Billing History
                                        </Button>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span>Your subscription renews automatically</span>
                                        </div>
                                    </div>
                                </div>
                            </SlackDashboardCard>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;