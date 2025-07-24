import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChatMessage, ChatUser } from '../services/websocket';
import { Conversation } from '../services/chatApi';

interface TypingUser {
    userId: string;
    username: string;
    conversationId: string;
    timestamp: number;
}

interface ChatState {
    // Connection state
    isConnected: boolean;
    connectionError: string | null;

    // Current user
    currentUser: ChatUser | null;

    // Conversations
    conversations: Conversation[];
    activeConversationId: string | null;

    // Messages
    messages: { [conversationId: string]: ChatMessage[] };
    isLoadingMessages: boolean;

    // Users
    users: ChatUser[];
    onlineUsers: Set<string>;

    // Typing indicators
    typingUsers: TypingUser[];

    // UI state
    isSidebarOpen: boolean;
    searchQuery: string;
    selectedUserId: string | null;

    // Notifications
    unreadCounts: { [conversationId: string]: number };
    totalUnreadCount: number;

    // Actions - Connection
    setConnected: (connected: boolean) => void;
    setConnectionError: (error: string | null) => void;

    // Actions - User
    setCurrentUser: (user: ChatUser | null) => void;
    setUsers: (users: ChatUser[]) => void;
    addUser: (user: ChatUser) => void;
    updateUser: (userId: string, updates: Partial<ChatUser>) => void;
    removeUser: (userId: string) => void;

    // Actions - Online status
    setUserOnline: (userId: string) => void;
    setUserOffline: (userId: string) => void;
    setOnlineUsers: (userIds: string[]) => void;

    // Actions - Conversations
    setConversations: (conversations: Conversation[]) => void;
    addConversation: (conversation: Conversation) => void;
    updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
    removeConversation: (conversationId: string) => void;
    setActiveConversation: (conversationId: string | null) => void;

    // Actions - Messages
    setMessages: (conversationId: string, messages: ChatMessage[]) => void;
    addMessage: (message: ChatMessage) => void;
    updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
    removeMessage: (messageId: string) => void;
    prependMessages: (conversationId: string, messages: ChatMessage[]) => void;
    markMessagesAsRead: (conversationId: string, messageIds: string[]) => void;
    setLoadingMessages: (loading: boolean) => void;

    // Actions - Typing
    addTypingUser: (user: TypingUser) => void;
    removeTypingUser: (userId: string, conversationId: string) => void;
    clearTypingUsers: (conversationId: string) => void;

    // Actions - UI
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setSearchQuery: (query: string) => void;
    setSelectedUser: (userId: string | null) => void;

    // Actions - Notifications
    setUnreadCount: (conversationId: string, count: number) => void;
    incrementUnreadCount: (conversationId: string) => void;
    clearUnreadCount: (conversationId: string) => void;
    updateTotalUnreadCount: () => void;

    // Getters
    getActiveConversation: () => Conversation | null;
    getConversationMessages: (conversationId: string) => ChatMessage[];
    getTypingUsers: (conversationId: string) => TypingUser[];
    getFilteredUsers: () => ChatUser[];
    getFilteredConversations: () => Conversation[];

    // Utility actions
    reset: () => void;
    cleanup: () => void;
}

export const useChatStore = create<ChatState>()(
    devtools(
        (set, get) => ({
            // Initial state
            isConnected: false,
            connectionError: null,
            currentUser: null,
            conversations: [],
            activeConversationId: null,
            messages: {},
            isLoadingMessages: false,
            users: [],
            onlineUsers: new Set(),
            typingUsers: [],
            isSidebarOpen: true,
            searchQuery: '',
            selectedUserId: null,
            unreadCounts: {},
            totalUnreadCount: 0,

            // Connection actions
            setConnected: (connected) =>
                set({ isConnected: connected, connectionError: connected ? null : get().connectionError }),

            setConnectionError: (error) =>
                set({ connectionError: error }),

            // User actions
            setCurrentUser: (user) =>
                set({ currentUser: user }),

            setUsers: (users) =>
                set({ users }),

            addUser: (user) =>
                set((state) => ({
                    users: [...state.users.filter(u => u.id !== user.id), user]
                })),

            updateUser: (userId, updates) =>
                set((state) => ({
                    users: state.users.map(user =>
                        user.id === userId ? { ...user, ...updates } : user
                    )
                })),

            removeUser: (userId) =>
                set((state) => ({
                    users: state.users.filter(user => user.id !== userId)
                })),

            // Online status actions
            setUserOnline: (userId) =>
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId])
                })),

            setUserOffline: (userId) =>
                set((state) => {
                    const newOnlineUsers = new Set(state.onlineUsers);
                    newOnlineUsers.delete(userId);
                    return { onlineUsers: newOnlineUsers };
                }),

            setOnlineUsers: (userIds) =>
                set({ onlineUsers: new Set(userIds) }),

            // Conversation actions
            setConversations: (conversations) =>
                set({ conversations }),

            addConversation: (conversation) =>
                set((state) => ({
                    conversations: [conversation, ...state.conversations.filter(c => c.id !== conversation.id)]
                })),

            updateConversation: (conversationId, updates) =>
                set((state) => ({
                    conversations: state.conversations.map(conv =>
                        conv.id === conversationId ? { ...conv, ...updates } : conv
                    )
                })),

            removeConversation: (conversationId) =>
                set((state) => ({
                    conversations: state.conversations.filter(conv => conv.id !== conversationId),
                    activeConversationId: state.activeConversationId === conversationId ? null : state.activeConversationId
                })),

            setActiveConversation: (conversationId) =>
                set({ activeConversationId: conversationId }),

            // Message actions
            setMessages: (conversationId, messages) =>
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [conversationId]: messages
                    }
                })),

            addMessage: (message) =>
                set((state) => {
                    const conversationMessages = state.messages[message.conversationId] || [];
                    return {
                        messages: {
                            ...state.messages,
                            [message.conversationId]: [...conversationMessages, message]
                        }
                    };
                }),

            updateMessage: (messageId, updates) =>
                set((state) => {
                    const newMessages = { ...state.messages };
                    Object.keys(newMessages).forEach(conversationId => {
                        newMessages[conversationId] = newMessages[conversationId].map(msg =>
                            msg.id === messageId ? { ...msg, ...updates } : msg
                        );
                    });
                    return { messages: newMessages };
                }),

            removeMessage: (messageId) =>
                set((state) => {
                    const newMessages = { ...state.messages };
                    Object.keys(newMessages).forEach(conversationId => {
                        newMessages[conversationId] = newMessages[conversationId].filter(msg => msg.id !== messageId);
                    });
                    return { messages: newMessages };
                }),

            prependMessages: (conversationId, messages) =>
                set((state) => ({
                    messages: {
                        ...state.messages,
                        [conversationId]: [...messages, ...(state.messages[conversationId] || [])]
                    }
                })),

            markMessagesAsRead: (conversationId, messageIds) =>
                set((state) => {
                    const conversationMessages = state.messages[conversationId] || [];
                    return {
                        messages: {
                            ...state.messages,
                            [conversationId]: conversationMessages.map(msg =>
                                messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
                            )
                        }
                    };
                }),

            setLoadingMessages: (loading) =>
                set({ isLoadingMessages: loading }),

            // Typing actions
            addTypingUser: (user) =>
                set((state) => ({
                    typingUsers: [
                        ...state.typingUsers.filter(u => !(u.userId === user.userId && u.conversationId === user.conversationId)),
                        user
                    ]
                })),

            removeTypingUser: (userId, conversationId) =>
                set((state) => ({
                    typingUsers: state.typingUsers.filter(u => !(u.userId === userId && u.conversationId === conversationId))
                })),

            clearTypingUsers: (conversationId) =>
                set((state) => ({
                    typingUsers: state.typingUsers.filter(u => u.conversationId !== conversationId)
                })),

            // UI actions
            toggleSidebar: () =>
                set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

            setSidebarOpen: (open) =>
                set({ isSidebarOpen: open }),

            setSearchQuery: (query) =>
                set({ searchQuery: query }),

            setSelectedUser: (userId) =>
                set({ selectedUserId: userId }),

            // Notification actions
            setUnreadCount: (conversationId, count) =>
                set((state) => {
                    const newUnreadCounts = { ...state.unreadCounts, [conversationId]: count };
                    const totalUnreadCount = Object.values(newUnreadCounts).reduce((sum, count) => sum + count, 0);
                    return { unreadCounts: newUnreadCounts, totalUnreadCount };
                }),

            incrementUnreadCount: (conversationId) =>
                set((state) => {
                    const currentCount = state.unreadCounts[conversationId] || 0;
                    const newUnreadCounts = { ...state.unreadCounts, [conversationId]: currentCount + 1 };
                    const totalUnreadCount = Object.values(newUnreadCounts).reduce((sum, count) => sum + count, 0);
                    return { unreadCounts: newUnreadCounts, totalUnreadCount };
                }),

            clearUnreadCount: (conversationId) =>
                set((state) => {
                    const newUnreadCounts = { ...state.unreadCounts };
                    delete newUnreadCounts[conversationId];
                    const totalUnreadCount = Object.values(newUnreadCounts).reduce((sum, count) => sum + count, 0);
                    return { unreadCounts: newUnreadCounts, totalUnreadCount };
                }),

            updateTotalUnreadCount: () =>
                set((state) => ({
                    totalUnreadCount: Object.values(state.unreadCounts).reduce((sum, count) => sum + count, 0)
                })),

            // Getters
            getActiveConversation: () => {
                const state = get();
                return state.conversations.find(conv => conv.id === state.activeConversationId) || null;
            },

            getConversationMessages: (conversationId) => {
                const state = get();
                return state.messages[conversationId] || [];
            },

            getTypingUsers: (conversationId) => {
                const state = get();
                return state.typingUsers.filter(user => user.conversationId === conversationId);
            },

            getFilteredUsers: () => {
                const state = get();
                if (!state.searchQuery) return state.users;
                const query = state.searchQuery.toLowerCase();
                return state.users.filter(user =>
                    user.username.toLowerCase().includes(query) ||
                    user.email?.toLowerCase().includes(query)
                );
            },

            getFilteredConversations: () => {
                const state = get();
                if (!state.searchQuery) return state.conversations;
                const query = state.searchQuery.toLowerCase();
                return state.conversations.filter(conv =>
                    conv.participants.some(participant =>
                        participant.username.toLowerCase().includes(query) ||
                        participant.email?.toLowerCase().includes(query)
                    ) ||
                    conv.lastMessage?.text.toLowerCase().includes(query)
                );
            },

            // Utility actions
            reset: () =>
                set({
                    isConnected: false,
                    connectionError: null,
                    conversations: [],
                    activeConversationId: null,
                    messages: {},
                    users: [],
                    onlineUsers: new Set(),
                    typingUsers: [],
                    searchQuery: '',
                    selectedUserId: null,
                    unreadCounts: {},
                    totalUnreadCount: 0
                }),

            cleanup: () => {
                const state = get();
                // Clean up old typing indicators (older than 10 seconds)
                const now = Date.now();
                const validTypingUsers = state.typingUsers.filter(user => now - user.timestamp < 10000);
                if (validTypingUsers.length !== state.typingUsers.length) {
                    set({ typingUsers: validTypingUsers });
                }
            }
        }),
        { name: 'chat-store' }
    )
);

export default useChatStore;
