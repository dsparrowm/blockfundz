import React from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
    Search,
    MoreVertical,
    Star,
    Hash,
    AtSign,
    MessageSquare,
    Mail,
    Info,
    Settings,
    Circle,
    Menu
} from 'lucide-react';
import UserNotificationBell from '../components/UserNotificationBell';

interface SlackContentAreaProps {
    children: React.ReactNode;
    className?: string;
    onMenuClick?: () => void;
}

export const SlackContentArea: React.FC<SlackContentAreaProps> = ({
    children,
    className = '',
    onMenuClick
}) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const userData = useStore(state => state.user);
    const activeComponent = isAdmin
        ? useStore((state) => state.activeAdminComponent)
        : useStore((state) => state.activeComponent);

    // Detect chat components like Support and Direct Message
    const isChatComponent = activeComponent === 'Support' || activeComponent === 'Direct Message';

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
                case 'Direct Message': return MessageSquare;
                case 'Communication': return MessageSquare;
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

    return (
        <div className={`flex-1 flex flex-col dark:bg-[#1a1d29] ${className}`}>
            {/* Header */}
            <div className="h-12 bg-white dark:bg-[#1a1d29] border-b border-gray-200 dark:border-[#2c2d33] flex items-center justify-between px-4">
                <div className="flex items-center space-x-3">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#2c2d33] rounded"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <ChannelIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-sm lg:text-base truncate">{activeComponent}</h1>
                    <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer hidden sm:block" />

                    {/* Search - hidden on mobile, shown on larger screens */}
                    <div className="relative ml-6 hidden md:block">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search in ${activeComponent}`}
                            className="w-48 lg:w-64 bg-gray-100 dark:bg-[#2c2d33] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md pl-10 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-[#3c3f4c] border-0 dark:border dark:border-[#3c3f4c]"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-1 lg:space-x-2">
                    {/* Action buttons - some hidden on mobile */}
                    <div className="p-1.5 text-gray-400 rounded hidden sm:block">
                        <Mail className="w-4 h-4" />
                    </div>
                    {/* Show notification bell only for users, not admin */}
                    {!isAdmin && <UserNotificationBell />}
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2c2d33] rounded hidden sm:block">
                        <Info className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2c2d33] rounded">
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={`flex-1 bg-gray-50 dark:bg-[#1a1d29] ${isChatComponent ? 'overflow-hidden h-full' : 'overflow-y-auto p-3 lg:p-6'}`}>
                {/* Mobile Search - shown only on mobile when main search is hidden */}
                <div className="md:hidden mb-4 px-1">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search in ${activeComponent}`}
                            className="w-full bg-gray-100 dark:bg-[#2c2d33] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-[#3c3f4c] border-0 dark:border dark:border-[#3c3f4c]"
                        />
                    </div>
                </div>

                {/* Main Content */}
                {children}
            </div>
        </div>
    );
};

export default SlackContentArea;
