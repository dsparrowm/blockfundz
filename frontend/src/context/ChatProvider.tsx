import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useChat, UseChatReturn } from '../hooks/useChat';
import { chatNotificationService } from '../services/chatNotifications';
import { ChatMessage, ChatUser } from '../services/websocket';

interface ChatContextType extends UseChatReturn {
    // Additional context-specific methods can be added here
}

const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
    children: React.ReactNode;
    enableNotifications?: boolean;
    autoConnect?: boolean;
    currentUserId?: string; // For identifying current user
}

export const ChatProvider: React.FC<ChatProviderProps> = ({
    children,
    enableNotifications = true,
    autoConnect = true,
    currentUserId
}) => {
    const chatData = useChat({
        autoConnect,
        enableTypingIndicators: true,
        markAsReadOnView: true,
        loadInitialData: true
    });

    const {
        isConnected,
        connectionError,
        messages,
        activeConversation,
        currentUser,
        users,
        onlineUsers
    } = chatData;

    // Refs to track previous values for comparison
    const prevMessagesRef = useRef<ChatMessage[]>([]);
    const prevConnectionStatusRef = useRef<boolean>(isConnected);
    const prevOnlineUsersRef = useRef<Set<string>>(new Set());

    // Handle notifications
    useEffect(() => {
        if (!enableNotifications) return;

        // Check for new messages
        const newMessages = messages.filter(
            msg => !prevMessagesRef.current.some(prevMsg => prevMsg.id === msg.id)
        );

        newMessages.forEach(message => {
            const sender = users.find(user => user.id === message.senderId);
            if (sender && message.senderId !== currentUser?.id) {
                const isActiveConversation = activeConversation?.id === message.conversationId;
                chatNotificationService.onNewMessage(message, sender, isActiveConversation);
            }
        });

        prevMessagesRef.current = [...messages];
    }, [messages, users, currentUser?.id, activeConversation?.id, enableNotifications]);

    // Handle connection status changes
    useEffect(() => {
        if (!enableNotifications) return;

        if (prevConnectionStatusRef.current && !isConnected) {
            chatNotificationService.onConnectionLost();
        } else if (!prevConnectionStatusRef.current && isConnected) {
            chatNotificationService.onConnectionRestored();
        }

        prevConnectionStatusRef.current = isConnected;
    }, [isConnected, enableNotifications]);

    // Handle online status changes
    useEffect(() => {
        if (!enableNotifications) return;

        const prevOnlineUsers = prevOnlineUsersRef.current;

        // Check for users who came online
        onlineUsers.forEach(userId => {
            if (!prevOnlineUsers.has(userId)) {
                const user = users.find(u => u.id === userId);
                if (user && user.id !== currentUser?.id) {
                    chatNotificationService.onUserOnline(user);
                }
            }
        });

        // Check for users who went offline
        prevOnlineUsers.forEach(userId => {
            if (!onlineUsers.has(userId)) {
                const user = users.find(u => u.id === userId);
                if (user && user.id !== currentUser?.id) {
                    chatNotificationService.onUserOffline(user);
                }
            }
        });

        prevOnlineUsersRef.current = new Set(onlineUsers);
    }, [onlineUsers, users, currentUser?.id, enableNotifications]);

    // Listen for notification clicks
    useEffect(() => {
        const handleNotificationClick = (event: CustomEvent) => {
            const { conversationId } = event.detail;
            if (conversationId && conversationId !== activeConversation?.id) {
                chatData.setActiveConversation(conversationId);
            }
        };

        const handleNotificationView = () => {
            // Focus the window when user clicks "View" on notification
            window.focus();
        };

        window.addEventListener('chatNotificationClick', handleNotificationClick as EventListener);
        window.addEventListener('chatNotificationView', handleNotificationView);

        return () => {
            window.removeEventListener('chatNotificationClick', handleNotificationClick as EventListener);
            window.removeEventListener('chatNotificationView', handleNotificationView);
        };
    }, [activeConversation?.id, chatData]);

    // Request notification permission on mount
    useEffect(() => {
        if (enableNotifications) {
            chatNotificationService.requestPermission();
        }
    }, [enableNotifications]);

    // Clear notifications when component unmounts
    useEffect(() => {
        return () => {
            if (enableNotifications) {
                chatNotificationService.clearAllNotifications();
            }
        };
    }, [enableNotifications]);

    // Provide additional context-specific functionality
    const contextValue: ChatContextType = {
        ...chatData,
        // You can add additional methods here that are specific to the context
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};

// Hook to use the chat context
export const useChatContext = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

// Higher-order component for components that need chat
export const withChat = <P extends object>(
    Component: React.ComponentType<P>
): React.FC<P & { enableNotifications?: boolean }> => {
    return ({ enableNotifications = true, ...props }) => (
        <ChatProvider enableNotifications={enableNotifications}>
            <Component {...(props as P)} />
        </ChatProvider>
    );
};

export default ChatProvider;
