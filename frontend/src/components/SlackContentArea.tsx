import React from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useDarkMode } from '../contexts/DarkModeContext';
import {
    Search,
    Filter,
    MoreVertical,
    Star,
    Hash,
    AtSign,
    MessageSquare,
    Phone,
    Video,
    Info,
    Settings,
    ChevronDown,
    Circle
} from 'lucide-react';

interface SlackContentAreaProps {
    children: React.ReactNode;
    className?: string;
}

export const SlackContentArea: React.FC<SlackContentAreaProps> = ({
    children,
    className = ''
}) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const userData = useStore(state => state.user);
    const activeComponent = isAdmin
        ? useStore((state) => state.activeAdminComponent)
        : useStore((state) => state.activeComponent);

    const getChannelIcon = () => {
        if (isAdmin) {
            switch (activeComponent) {
                case 'Dashboard': return Hash;
                case 'Users Management': return AtSign;
                case 'Manage Transactions': return Hash;
                case 'Withdrawal Requests': return Hash;
                case 'Manage Investments': return Hash;
                case 'Manage Plans': return Hash;
                case 'Send Mail': return Hash;
                default: return Hash;
            }
        } else {
            switch (activeComponent) {
                case 'Overview': return Hash;
                case 'Investments': return Hash;
                case 'Deposits': return Hash;
                case 'Profile': return AtSign;
                case 'Account Settings': return Hash;
                default: return Hash;
            }
        }
    };

    const ChannelIcon = getChannelIcon();
    const { isDarkMode } = useDarkMode();

    return (
        <div className={`flex-1 flex flex-col bg-white dark:bg-[#1a1d29] ${className}`}>
            {/* Header */}
            <div className="h-12 bg-white dark:bg-[#1a1d29] border-b border-gray-200 dark:border-[#2c2d33] flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                    <ChannelIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <h1 className="font-semibold text-gray-900 dark:text-gray-100">{activeComponent}</h1>
                    <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer" />
                </div>

                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search in ${activeComponent}`}
                            className="w-64 bg-gray-100 dark:bg-[#2c2d33] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md pl-10 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-[#3c3f4c] border-0 dark:border dark:border-[#3c3f4c]"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2c2d33] rounded">
                            <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2c2d33] rounded">
                            <Video className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2c2d33] rounded">
                            <Info className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2c2d33] rounded">
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#1a1d29]">
                <div className="p-6">
                    {/* Channel/Page info banner */}
                    <div className="mb-6 p-4 bg-white dark:bg-[#2c2d33] rounded-lg shadow-sm border border-gray-200 dark:border-[#3c3f4c]">
                        <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-[#4a154b] rounded-lg flex items-center justify-center">
                                <ChannelIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {activeComponent}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {isAdmin
                                        ? `Manage your ${activeComponent.toLowerCase()} with ease. All tools and data at your fingertips.`
                                        : `Your ${activeComponent.toLowerCase()} dashboard with real-time updates and insights.`
                                    }
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center">
                                        <Circle className="w-2 h-2 text-green-500 fill-current mr-1" />
                                        Active
                                    </span>
                                    <span>{userData?.name || 'Admin'}</span>
                                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                    Actions
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3c3f4c] rounded">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlackContentArea;
