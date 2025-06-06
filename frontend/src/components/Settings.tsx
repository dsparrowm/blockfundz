import React from "react";
import { FaUser, FaLock, FaKey, FaBell, FaCog } from "react-icons/fa";

const Settings = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <FaUser className="text-orange-500" />
                    <span className="font-semibold">Profile</span>
                    <span className="text-gray-500 text-sm ml-2">Update your personal information</span>
                </div>
                <div className="flex items-center space-x-3">
                    <FaLock className="text-orange-500" />
                    <span className="font-semibold">Security</span>
                    <span className="text-gray-500 text-sm ml-2">Change password, enable 2FA</span>
                </div>
                <div className="flex items-center space-x-3">
                    <FaKey className="text-orange-500" />
                    <span className="font-semibold">Withdrawal Pin</span>
                    <span className="text-gray-500 text-sm ml-2">Set or update your 4-digit withdrawal pin</span>
                </div>
                <div className="flex items-center space-x-3">
                    <FaBell className="text-orange-500" />
                    <span className="font-semibold">Notifications</span>
                    <span className="text-gray-500 text-sm ml-2">Manage notification preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                    <FaCog className="text-orange-500" />
                    <span className="font-semibold">Preferences</span>
                    <span className="text-gray-500 text-sm ml-2">Theme, language, and more</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;