"use client"

import { useState } from "react"
import { User, Lock, Shield } from "lucide-react"
import { useStore } from "../store/useStore"

export function ProfileComponent() {
    const [activeTab, setActiveTab] = useState<"profile" | "security">("profile")
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
    })
    const user = useStore((state) => state.user)

    const [securityData, setSecurityData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFAEnabled: false,
    })

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Add profile update logic here
    }

    const handleSecuritySubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Add security update logic here
        if (securityData.newPassword !== securityData.confirmPassword) {
            alert("Passwords don't match!")
            return
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-[20px] p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User size={24} />
                My Profile
            </h1>

            <div className="flex gap-4 mb-8 border-b">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-2 flex items-center gap-2 ${activeTab === "profile"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500"
                        }`}
                >
                    <User size={18} />
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`px-4 py-2 flex items-center gap-2 ${activeTab === "security"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500"
                        }`}
                >
                    <Shield size={18} />
                    Security
                </button>
            </div>

            {activeTab === "profile" ? (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                value={user.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                value={user.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <input
                                type="tel"
                                value={user.phone}
                                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                    >
                        Update Profile
                    </button>
                </form>
            ) : (
                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Current Password</label>
                            <input
                                type="password"
                                value={securityData.currentPassword}
                                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Lock size={18} />
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={securityData.twoFAEnabled}
                                    onChange={(e) => setSecurityData({ ...securityData, twoFAEnabled: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                Enable Two-Factor Authentication (2FA)
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                    >
                        Update Security Settings
                    </button>
                </form>
            )}
        </div>
    )
}

export default ProfileComponent