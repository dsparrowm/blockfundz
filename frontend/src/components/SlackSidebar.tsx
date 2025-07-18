import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useDarkMode } from '../contexts/DarkModeContext';
import Cookies from 'js-cookie';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    TrendingUp,
    FileText,
    Settings,
    Mail,
    DollarSign,
    BarChart3,
    Wallet,
    ArrowUpDown,
    PiggyBank,
    LogOut,
    User,
    Bell,
    Search,
    Hash,
    Plus,
    ChevronDown,
    Circle
} from 'lucide-react';

interface SlackSidebarProps {
    className?: string;
}

export const SlackSidebar: React.FC<SlackSidebarProps> = ({ className = '' }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAdmin = location.pathname.startsWith('/admin');
    const userData = useStore((state) => state.user);
    const setActiveComponent = useStore((state) => state.setActiveComponent);
    const setActiveAdminComponent = useStore((state) => state.setActiveAdminComponent);
    const { isDarkMode } = useDarkMode();
    const activeComponent = isAdmin
        ? useStore((state) => state.activeAdminComponent)
        : useStore((state) => state.activeComponent);

    const handleLogout = () => {
        if (isAdmin) {
            Cookies.remove('adminToken');
            navigate('/admin/login');
        } else {
            Cookies.remove('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            localStorage.setItem('isLoggedIn', 'no');
            navigate('/login');
        }
    };

    const userNavItems = [
        { name: 'Overview', icon: LayoutDashboard, section: 'general' },
        { name: 'Invest', icon: PiggyBank, section: 'finance' },
        { name: 'Investments', icon: TrendingUp, section: 'finance' },
        { name: 'Deposits', icon: CreditCard, section: 'finance' },
        { name: 'DepositHistory', icon: FileText, section: 'finance' },
        { name: 'Withdrawals', icon: Wallet, section: 'finance' },
        { name: 'WithdrawalHistory', icon: ArrowUpDown, section: 'finance' },
        { name: 'Settings', icon: Settings, section: 'settings' },
        { name: 'Profile', icon: User, section: 'account' },
        { name: 'AccountSettings', icon: Settings, section: 'account' },
        { name: 'verify', icon: FileText, section: 'account' },
        { name: 'Analytics', icon: BarChart3, section: 'analytics' },
    ];

    const adminNavItems = [
        { name: 'Dashboard', icon: LayoutDashboard, section: 'general' },
        { name: 'Users Management', icon: Users, section: 'management' },
        { name: 'Manage Transactions', icon: ArrowUpDown, section: 'finance' },
        { name: 'Withdrawal Requests', icon: DollarSign, section: 'finance' },
        { name: 'Manage Investments', icon: TrendingUp, section: 'finance' },
        { name: 'Manage Plans', icon: PiggyBank, section: 'management' },
        { name: 'Send Mail', icon: Mail, section: 'communication' },
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;

    const handleItemClick = (itemName: string) => {
        if (isAdmin) {
            setActiveAdminComponent(itemName);
        } else {
            setActiveComponent(itemName);
        }
    };

    const groupedItems = navItems.reduce((acc, item) => {
        if (!acc[item.section]) {
            acc[item.section] = [];
        }
        acc[item.section].push(item);
        return acc;
    }, {} as Record<string, typeof navItems>);

    const sectionTitles = {
        general: 'General',
        finance: 'Finance',
        management: 'Management',
        account: 'Account',
        communication: 'Communication'
    };

    return (
        <div className={`flex h-screen ${isDarkMode ? 'bg-[#1a1d29]' : 'bg-[#3f0f40]'} text-white ${className}`}>
            {/* Main Sidebar */}
            <div className="w-64 flex flex-col">
                {/* Header */}
                <div className={`p-4 border-b ${isDarkMode ? 'border-[#2c2d33]' : 'border-[#5a1f5a]'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 ${isDarkMode ? 'bg-[#4a154b]' : 'bg-white'} rounded-lg flex items-center justify-center`}>
                                <span className={`${isDarkMode ? 'text-white' : 'text-[#3f0f40]'} font-bold text-sm`}>BF</span>
                            </div>
                            <span className="font-semibold text-lg">BlockFundz</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-300'}`} />
                    </div>
                    <div className="mt-3 flex items-center space-x-2">
                        <Circle className="w-3 h-3 text-green-400 fill-current" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>
                            {userData?.name || 'Admin'}
                        </span>
                    </div>
                </div>

                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search BlockFundz"
                            className={`w-full ${isDarkMode ? 'bg-[#2c2d33] text-white border border-[#3c3f4c]' : 'bg-[#5a1f5a] text-white'} placeholder-gray-400 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-[#4a154b] focus:border-[#4a154b]' : 'focus:ring-white/20'}`}
                        />
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-2">
                    {Object.entries(groupedItems).map(([section, items]) => (
                        <div key={section} className="mb-6">
                            <div className="flex items-center justify-between px-3 py-1 mb-2">
                                <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-300'} uppercase tracking-wider`}>
                                    {sectionTitles[section as keyof typeof sectionTitles]}
                                </span>
                                <Plus className={`w-4 h-4 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-white'} cursor-pointer`} />
                            </div>
                            <div className="space-y-1">
                                {items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeComponent === item.name;
                                    return (
                                        <button
                                            key={item.name}
                                            onClick={() => handleItemClick(item.name)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${isActive
                                                ? (isDarkMode ? 'bg-[#4a154b] text-white' : 'bg-[#1264a3] text-white')
                                                : (isDarkMode ? 'text-gray-300 hover:bg-[#2c2d33] hover:text-white' : 'text-gray-300 hover:bg-[#5a1f5a] hover:text-white')
                                                }`}
                                        >
                                            <Hash className="w-4 h-4" />
                                            <Icon className="w-4 h-4" />
                                            <span className="truncate">{item.name}</span>
                                            {isActive && (
                                                <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className={`p-4 border-t ${isDarkMode ? 'border-[#2c2d33]' : 'border-[#5a1f5a]'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 ${isDarkMode ? 'bg-[#2c2d33]' : 'bg-[#5a1f5a]'} rounded-full flex items-center justify-center`}>
                                <User className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {userData?.name || 'Admin'}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-300'} truncate`}>
                                    {isAdmin ? 'Administrator' : 'Investor'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Bell className={`w-4 h-4 ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-white'} cursor-pointer`} />
                            <button
                                onClick={handleLogout}
                                className={`${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-white'} transition-colors`}
                                title="Sign out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlackSidebar;
