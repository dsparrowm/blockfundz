import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

const UserMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Split store selectors
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);

    // Memoize derived values
    const isAdmin = useMemo(() => location.pathname.startsWith('/admin'), [location.pathname]);
    const userInitials = useMemo(() => {
        if (isAdmin) return 'CN';
        return user?.name?.split(' ').map(n => n[0]).join('') || 'UA';
    }, [user?.name, isAdmin]);

    const menuItems = useMemo(() => [
        { label: 'View Profile', action: () => console.log('View Profile clicked') },
        { label: 'Security Setting', action: () => console.log('Security Setting clicked') },
        {
            label: 'Sign out', action: () => {
                console.log('Sign Out clicked');
                setUser(null);
            }
        },
    ], [setUser]);

    return (
        <div className="relative inline-block text-left">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                    <span className="text-white font-medium">{userInitials}</span>
                </button>
                <div className='flex flex-col'>
                    <span className={`text-sm font-bold ${isAdmin ? 'text-red-500' : user?.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                        {isAdmin ? 'Admin' : user?.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className="text-slate-800 text-sm font-medium">
                        {isAdmin ? "Chief Mayor" : user?.name || 'Unknown User'}
                    </span>
                </div>
            </div>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3">
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-sm text-gray-300 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.action();
                                    setIsMenuOpen(false);
                                }}
                                className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white text-left transition-colors"
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