import { useState } from 'react';

const UserMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userInitials = 'DA';
    const userEmail = 'daviesaniefok32@gmail.com';

    const menuItems = [
        { label: 'View Profile', action: () => console.log('View Profile clicked') },
        { label: 'Security Setting', action: () => console.log('Security Setting clicked') },
        { label: 'Sign out', action: () => console.log('Sign Out clicked') },
    ];

    return (
        <div className="relative inline-block text-left">
            {/* User Icon and Status */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => {
                        setIsMenuOpen(!isMenuOpen);
                        console.log('User Menu state: ', isMenuOpen);
                    }}
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                    <span className="text-white font-medium">{userInitials}</span>
                </button>
                <div className='flex flex-col'>
                    <span className="text-red-500 text-sm font-medium font-bold">Unverified</span>
                    <span className="text-slate-800 text-sm font-medium">Davies Aniefiok</span>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-5000">
                    {/* User Info Section */}
                    <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">Davies Aniefok</p>
                        <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.action();
                                    setIsMenuOpen(false);
                                }}
                                className="block w-full px-4 py-2 text-sm text-slate-800 hover:bg-gray-100 hover:text-gray-900 text-left transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;