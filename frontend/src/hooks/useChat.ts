import { useEffect, useRef, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useChatStore } from '../store/chatStore';
import { webSocketService, ChatMessage, ChatUser } from '../services/websocket';
import { chatApiService, Conversation } from '../services/chatApi';
import { chatConfig } from '../config/chatConfig';

export interface UseChatOptions {
    autoConnect?: boolean;
    enableTypingIndicators?: boolean;
    markAsReadOnView?: boolean;
    loadInitialData?: boolean;
}

export interface UseChatReturn {
    // Connection state
    isConnected: boolean;
    connectionError: string | null;
    reconnect: () => void;
    disconnect: () => void;

    // Current conversation
    activeConversation: Conversation | null;
    messages: ChatMessage[];
    isLoadingMessages: boolean;

    // Message operations
    sendMessage: (text: string, type?: 'text' | 'image' | 'file', metadata?: any) => Promise<void>;
    loadMoreMessages: () => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;

    // Conversation operations
    setActiveConversation: (conversationId: string | null) => void;
    createConversation: (participantIds: string[], type?: 'direct' | 'group', title?: string) => Promise<Conversation>;

    // Users
    users: ChatUser[];
    onlineUsers: Set<string>;
    currentUser: ChatUser | null;

    // Typing indicators
    typingUsers: ChatUser[];
    startTyping: () => void;
    stopTyping: () => void;

    // Utility
    searchUsers: (query: string, role?: 'user' | 'admin') => Promise<ChatUser[]>;
    uploadFile: (file: File) => Promise<{ fileUrl: string; fileName: string; fileSize: number }>;
    markAsRead: (messageIds: string[]) => Promise<void>;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
    const {
        autoConnect = true,
        enableTypingIndicators = true,
        markAsReadOnView = true,
        loadInitialData = true
    } = options;

    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();
    const lastMessageCountRef = useRef(0);

    // Store selectors
    const {
        isConnected,
        connectionError,
        currentUser,
        conversations,
        activeConversationId,
        messages,
        isLoadingMessages,
        users,
        onlineUsers,
        typingUsers,

        // Actions
        setConnected,
        setConnectionError,
        setCurrentUser,
        setUsers,
        setConversations,
        addConversation,
        updateConversation,
        setActiveConversation: setActiveConversationStore,
        setMessages,
        addMessage,
        updateMessage,
        removeMessage,
        prependMessages,
        markMessagesAsRead,
        setLoadingMessages,
        addTypingUser,
        removeTypingUser,
        clearTypingUsers,
        setUserOnline,
        setUserOffline,
        incrementUnreadCount,
        clearUnreadCount,

        // Getters
        getActiveConversation,
        getConversationMessages,
        getTypingUsers
    } = useChatStore();

    // Get active conversation and its messages
    const activeConversation = getActiveConversation();
    const conversationMessages = activeConversationId ? getConversationMessages(activeConversationId) : [];
    const conversationTypingUsers = activeConversationId ? getTypingUsers(activeConversationId) : [];

    // Convert typing users to ChatUser objects
    const typingChatUsers = conversationTypingUsers
        .map(typingUser => users.find(user => user.id === typingUser.userId))
        .filter(Boolean) as ChatUser[];

    // Initialize connection and event listeners
    useEffect(() => {
        if (!autoConnect) return;

        const initializeConnection = async () => {
            try {
                // Get current user info (you might want to get this from your auth context)
                const user = currentUser || await getCurrentUser(); // Implement getCurrentUser based on your auth system
                if (user) {
                    setCurrentUser(user);
                }

                // Connect to WebSocket with user info
                if (user) {
                    await webSocketService.connect(user.id, user.role);
                    setConnected(true);
                    setConnectionError(null);
                }

                // Load initial data
                if (loadInitialData) {
                    await loadConversations();
                    await loadUsers();
                }

            } catch (error) {
                console.error('Failed to initialize chat:', error);
                setConnectionError(error instanceof Error ? error.message : 'Connection failed');
                toast.error('Failed to connect to chat');
            }
        };

        initializeConnection();

        return () => {
            webSocketService.disconnect();
            setConnected(false);
        };
    }, [autoConnect, loadInitialData]);

    // Set up WebSocket event listeners
    useEffect(() => {
        // Message events
        webSocketService.onMessage((message: ChatMessage) => {
            addMessage(message);

            // Increment unread count if not in active conversation
            if (message.conversationId !== activeConversationId && message.senderId !== currentUser?.id) {
                incrementUnreadCount(message.conversationId);

                // Show notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    const sender = users.find(u => u.id === message.senderId);
                    new Notification(`New message from ${sender?.username || 'Unknown'}`, {
                        body: message.text,
                        icon: sender?.avatar
                    });
                }
            }
        });

        webSocketService.onMessageUpdate((message: ChatMessage) => {
            updateMessage(message.id, message);
        });

        webSocketService.onMessageDelete((messageId: string) => {
            removeMessage(messageId);
        });

        // Typing events
        if (enableTypingIndicators) {
            webSocketService.onTypingStart((data: { userId: string; username: string; conversationId: string }) => {
                if (data.userId !== currentUser?.id) {
                    addTypingUser({
                        userId: data.userId,
                        username: data.username,
                        conversationId: data.conversationId,
                        timestamp: Date.now()
                    });
                }
            });

            webSocketService.onTypingStop((data: { userId: string; conversationId: string }) => {
                removeTypingUser(data.userId, data.conversationId);
            });
        }

        // User events
        webSocketService.onUserOnline((userId: string) => {
            setUserOnline(userId);
        });

        webSocketService.onUserOffline((userId: string) => {
            setUserOffline(userId);
        });

        // Connection events
        webSocketService.onConnect(() => {
            setConnected(true);
            setConnectionError(null);
            toast.success('Connected to chat');
        });

        webSocketService.onDisconnect(() => {
            setConnected(false);
            toast.error('Disconnected from chat');
        });

        webSocketService.onError((error: string) => {
            setConnectionError(error);
            toast.error(`Chat error: ${error}`);
        });

        // Cleanup on unmount
        return () => {
            webSocketService.removeAllListeners();
        };
    }, [activeConversationId, currentUser?.id, users, enableTypingIndicators]);

    // Mark messages as read when viewing conversation
    useEffect(() => {
        if (!markAsReadOnView || !activeConversationId || !currentUser) return;

        const unreadMessages = conversationMessages.filter(
            msg => !msg.isRead && msg.senderId !== currentUser.id
        );

        if (unreadMessages.length > 0) {
            const messageIds = unreadMessages.map(msg => msg.id);
            markAsRead(messageIds);
            clearUnreadCount(activeConversationId);
        }
    }, [activeConversationId, conversationMessages, markAsReadOnView, currentUser]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (conversationMessages.length > lastMessageCountRef.current) {
            lastMessageCountRef.current = conversationMessages.length;
            // You can implement auto-scroll logic here if needed
        }
    }, [conversationMessages.length]);

    // Helper functions
    const getCurrentUser = async (): Promise<ChatUser | null> => {
        // Implement this based on your auth system
        // This is a placeholder - you should get the user from your auth context
        try {
            // Example: const response = await authService.getCurrentUser();
            // return response.data;
            return null;
        } catch (error) {
            console.error('Failed to get current user:', error);
            return null;
        }
    };

    const loadConversations = async () => {
        try {
            const response = await chatApiService.getConversations();
            setConversations(response.conversations);
        } catch (error) {
            console.error('Failed to load conversations:', error);
            toast.error('Failed to load conversations');
        }
    };

    const loadUsers = async () => {
        try {
            const fetchedUsers = await chatApiService.getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Failed to load users:', error);
            toast.error('Failed to load users');
        }
    };

    // Public API
    const reconnect = useCallback(async () => {
        try {
            if (currentUser) {
                await webSocketService.connect(currentUser.id, currentUser.role);
                setConnected(true);
                setConnectionError(null);
                toast.success('Reconnected to chat');
            }
        } catch (error) {
            console.error('Reconnection failed:', error);
            setConnectionError(error instanceof Error ? error.message : 'Reconnection failed');
            toast.error('Failed to reconnect');
        }
    }, []);

    const disconnect = useCallback(() => {
        webSocketService.disconnect();
        setConnected(false);
    }, []);

    const sendMessage = useCallback(async (text: string, type: 'text' | 'image' | 'file' = 'text', metadata?: any) => {
        if (!activeConversationId || !currentUser) {
            toast.error('No active conversation or user not authenticated');
            return;
        }

        // Validate message length
        if (!chatConfig.messages || text.length > chatConfig.messages.maxLength) {
            toast.error(`Message too long. Maximum ${chatConfig.messages?.maxLength || 1000} characters.`);
            return;
        }

        try {
            const message = await chatApiService.sendMessage(activeConversationId, text, type, metadata);
            webSocketService.sendMessage(message);
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
        }
    }, [activeConversationId, currentUser]);

    const loadMoreMessages = useCallback(async () => {
        if (!activeConversationId || isLoadingMessages) return;

        try {
            setLoadingMessages(true);
            const oldestMessage = conversationMessages[0];
            const response = await chatApiService.getMessages({
                conversationId: activeConversationId,
                before: oldestMessage?.id,
                limit: chatConfig.messages?.loadMoreCount || 20
            });

            if (response.messages.length > 0) {
                prependMessages(activeConversationId, response.messages);
            }
        } catch (error) {
            console.error('Failed to load more messages:', error);
            toast.error('Failed to load more messages');
        } finally {
            setLoadingMessages(false);
        }
    }, [activeConversationId, conversationMessages, isLoadingMessages]);

    const deleteMessage = useCallback(async (messageId: string) => {
        try {
            await chatApiService.deleteMessage(messageId);
            webSocketService.deleteMessage(messageId);
        } catch (error) {
            console.error('Failed to delete message:', error);
            toast.error('Failed to delete message');
        }
    }, []);

    const setActiveConversation = useCallback((conversationId: string | null) => {
        setActiveConversationStore(conversationId);

        if (conversationId) {
            // Load messages for this conversation if not already loaded
            if (!messages[conversationId]) {
                loadConversationMessages(conversationId);
            }
        }
    }, [messages]);

    const loadConversationMessages = useCallback(async (conversationId: string) => {
        try {
            setLoadingMessages(true);
            const response = await chatApiService.getMessages({
                conversationId,
                limit: chatConfig.ui?.messagePageSize || 50
            });
            setMessages(conversationId, response.messages);
        } catch (error) {
            console.error('Failed to load conversation messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setLoadingMessages(false);
        }
    }, []);

    const createConversation = useCallback(async (participantIds: string[], type: 'direct' | 'group' = 'direct', title?: string): Promise<Conversation> => {
        try {
            const conversation = await chatApiService.createConversation({
                participantIds,
                type,
                title
            });

            addConversation(conversation);
            setActiveConversation(conversation.id);

            return conversation;
        } catch (error) {
            console.error('Failed to create conversation:', error);
            toast.error('Failed to create conversation');
            throw error;
        }
    }, []);

    const startTyping = useCallback(() => {
        if (!enableTypingIndicators || !activeConversationId || !currentUser || isTyping) return;

        setIsTyping(true);
        webSocketService.startTyping(activeConversationId);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Auto-stop typing after configured timeout
        const timeout = chatConfig.messages?.typingTimeout || 3000;
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping();
        }, timeout);
    }, [enableTypingIndicators, activeConversationId, currentUser, isTyping]);

    const stopTyping = useCallback(() => {
        if (!enableTypingIndicators || !activeConversationId || !currentUser || !isTyping) return;

        setIsTyping(false);
        webSocketService.stopTyping(activeConversationId);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = undefined;
        }
    }, [enableTypingIndicators, activeConversationId, currentUser, isTyping]);

    const searchUsers = useCallback(async (query: string, role?: 'user' | 'admin'): Promise<ChatUser[]> => {
        try {
            return await chatApiService.getUsers(query, role);
        } catch (error) {
            console.error('Failed to search users:', error);
            toast.error('Failed to search users');
            return [];
        }
    }, []);

    const uploadFile = useCallback(async (file: File) => {
        if (!activeConversationId) {
            throw new Error('No active conversation');
        }

        // Validate file size and type
        const maxSize = chatConfig.messages?.maxFileSize || 10 * 1024 * 1024;
        const allowedTypes = chatConfig.messages?.allowedFileTypes || [];

        if (file.size > maxSize) {
            throw new Error(`File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
        }

        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            throw new Error('File type not allowed');
        }

        try {
            return await chatApiService.uploadFile(file, activeConversationId);
        } catch (error) {
            console.error('Failed to upload file:', error);
            toast.error('Failed to upload file');
            throw error;
        }
    }, [activeConversationId]);

    const markAsRead = useCallback(async (messageIds: string[]) => {
        try {
            await chatApiService.markMessagesAsRead(messageIds);

            if (activeConversationId) {
                markMessagesAsRead(activeConversationId, messageIds);
            }
        } catch (error) {
            console.error('Failed to mark messages as read:', error);
        }
    }, [activeConversationId]);

    // Cleanup typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return {
        // Connection state
        isConnected,
        connectionError,
        reconnect,
        disconnect,

        // Current conversation
        activeConversation,
        messages: conversationMessages,
        isLoadingMessages,

        // Message operations
        sendMessage,
        loadMoreMessages,
        deleteMessage,

        // Conversation operations
        setActiveConversation,
        createConversation,

        // Users
        users,
        onlineUsers,
        currentUser,

        // Typing indicators
        typingUsers: typingChatUsers,
        startTyping,
        stopTyping,

        // Utility
        searchUsers,
        uploadFile,
        markAsRead
    };
}