import React, { useState } from 'react';
import SlackSidebar from './SlackSidebar';
import SlackContentArea from './SlackContentArea';

interface SlackLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const SlackLayout: React.FC<SlackLayoutProps> = ({
    children,
    className = ''
}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`h-screen overflow-hidden bg-gray-50 ${className}`}>
            <div className="flex h-full relative">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <SlackSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <SlackContentArea
                    onMenuClick={() => setIsSidebarOpen(true)}
                >
                    {children}
                </SlackContentArea>
            </div>
        </div>
    );
};

export default SlackLayout;
