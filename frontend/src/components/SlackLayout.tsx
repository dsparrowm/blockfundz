import React from 'react';
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
    return (
        <div className={`h-screen overflow-hidden bg-gray-50 ${className}`}>
            <div className="flex h-full">
                <SlackSidebar />
                <SlackContentArea>
                    {children}
                </SlackContentArea>
            </div>
        </div>
    );
};

export default SlackLayout;
