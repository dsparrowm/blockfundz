interface ChatConfig {
    // WebSocket Configuration
    websocket: {
        url: string;
        reconnectAttempts: number;
        reconnectDelay: number;
        heartbeatInterval: number;
        connectionTimeout: number;
    };

    // API Configuration
    api: {
        baseUrl: string;
        timeout: number;
        retryAttempts: number;
        retryDelay: number;
    };

    // Message Configuration
    messages: {
        maxLength: number;
        typingTimeout: number;
        markAsReadDelay: number;
        loadMoreCount: number;
        maxFileSize: number; // in bytes
        allowedFileTypes: string[];
    };

    // UI Configuration
    ui: {
        maxConversations: number;
        messagePageSize: number;
        searchDebounceDelay: number;
        autoScrollThreshold: number;
        enableAnimations: boolean;
        theme: 'light' | 'dark' | 'system';
    };

    // Notification Configuration
    notifications: {
        enabled: boolean;
        sound: boolean;
        browser: boolean;
        inApp: boolean;
        maxActiveNotifications: number;
        notificationDuration: number;
    };

    // Feature Flags
    features: {
        typing: boolean;
        fileUpload: boolean;
        messageSearch: boolean;
        conversationExport: boolean;
        userPresence: boolean;
        messageReactions: boolean;
        messageEditing: boolean;
        messageThreads: boolean;
    };

    // Security Configuration
    security: {
        enableEncryption: boolean;
        maxLoginAttempts: number;
        sessionTimeout: number;
        requireEmailVerification: boolean;
    };
}

// Environment-based configuration
const getEnvironmentConfig = (): Partial<ChatConfig> => {
    const env = (import.meta as any).env?.MODE || 'development';

    switch (env) {
        case 'production':
            return {
                websocket: {
                    url: (import.meta as any).env?.VITE_WS_URL || 'wss://api.blockfundz.com/ws',
                    reconnectAttempts: 5,
                    reconnectDelay: 3000,
                    heartbeatInterval: 30000,
                    connectionTimeout: 10000,
                },
                api: {
                    baseUrl: (import.meta as any).env?.VITE_API_URL || 'https://api.blockfundz.com',
                    timeout: 10000,
                    retryAttempts: 3,
                    retryDelay: 1000,
                },
                notifications: {
                    enabled: true,
                    sound: true,
                    browser: true,
                    inApp: true,
                    maxActiveNotifications: 5,
                    notificationDuration: 5000,
                }
            };

        case 'staging':
            return {
                websocket: {
                    url: (import.meta as any).env?.VITE_WS_URL || 'wss://staging-api.blockfundz.com/ws',
                    reconnectAttempts: 3,
                    reconnectDelay: 2000,
                    heartbeatInterval: 25000,
                    connectionTimeout: 8000,
                },
                api: {
                    baseUrl: (import.meta as any).env?.VITE_API_URL || 'https://staging-api.blockfundz.com',
                    timeout: 8000,
                    retryAttempts: 2,
                    retryDelay: 800,
                },
                notifications: {
                    enabled: true,
                    sound: false, // Disable sound in staging
                    browser: true,
                    inApp: true,
                    maxActiveNotifications: 3,
                    notificationDuration: 4000,
                }
            };

        default: // development
            return {
                websocket: {
                    url: (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:3001/ws',
                    reconnectAttempts: 10,
                    reconnectDelay: 1000,
                    heartbeatInterval: 20000,
                    connectionTimeout: 5000,
                },
                api: {
                    baseUrl: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001',
                    timeout: 5000,
                    retryAttempts: 1,
                    retryDelay: 500,
                },
                notifications: {
                    enabled: true,
                    sound: false, // Disable sound in development
                    browser: false, // Disable browser notifications in development
                    inApp: true,
                    maxActiveNotifications: 2,
                    notificationDuration: 3000,
                }
            };
    }
};

// Default configuration
const defaultConfig: ChatConfig = {
    websocket: {
        url: 'ws://localhost:3001/ws',
        reconnectAttempts: 5,
        reconnectDelay: 2000,
        heartbeatInterval: 30000,
        connectionTimeout: 10000,
    },

    api: {
        baseUrl: 'http://localhost:3001',
        timeout: 10000,
        retryAttempts: 3,
        retryDelay: 1000,
    },

    messages: {
        maxLength: 1000,
        typingTimeout: 3000,
        markAsReadDelay: 1000,
        loadMoreCount: 20,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/csv'
        ],
    },

    ui: {
        maxConversations: 100,
        messagePageSize: 50,
        searchDebounceDelay: 300,
        autoScrollThreshold: 100,
        enableAnimations: true,
        theme: 'system',
    },

    notifications: {
        enabled: true,
        sound: true,
        browser: true,
        inApp: true,
        maxActiveNotifications: 5,
        notificationDuration: 5000,
    },

    features: {
        typing: true,
        fileUpload: true,
        messageSearch: true,
        conversationExport: true,
        userPresence: true,
        messageReactions: false, // Future feature
        messageEditing: false, // Future feature
        messageThreads: false, // Future feature
    },

    security: {
        enableEncryption: false, // Future feature
        maxLoginAttempts: 5,
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        requireEmailVerification: true,
    },
};

// Merge default config with environment-specific config
const envConfig = getEnvironmentConfig();
export const chatConfig: ChatConfig = {
    ...defaultConfig,
    websocket: { ...defaultConfig.websocket, ...(envConfig.websocket || {}) },
    api: { ...defaultConfig.api, ...(envConfig.api || {}) },
    messages: { ...defaultConfig.messages, ...(envConfig.messages || {}) },
    ui: { ...defaultConfig.ui, ...(envConfig.ui || {}) },
    notifications: { ...defaultConfig.notifications, ...(envConfig.notifications || {}) },
    features: { ...defaultConfig.features, ...(envConfig.features || {}) },
    security: { ...defaultConfig.security, ...(envConfig.security || {}) },
};// Configuration getters for convenience
export const getChatConfig = () => chatConfig;

export const getWebSocketUrl = () => chatConfig.websocket.url;

export const getApiBaseUrl = () => chatConfig.api.baseUrl;

export const isFeatureEnabled = (feature: keyof ChatConfig['features']) =>
    chatConfig.features[feature];

export const getMaxFileSize = () => chatConfig.messages.maxFileSize;

export const getAllowedFileTypes = () => chatConfig.messages.allowedFileTypes;

export const getNotificationConfig = () => chatConfig.notifications;

// Runtime configuration updates (for admin settings, user preferences, etc.)
export const updateChatConfig = (updates: Partial<ChatConfig>) => {
    Object.assign(chatConfig, {
        ...chatConfig,
        ...updates,
        websocket: { ...chatConfig.websocket, ...updates.websocket },
        api: { ...chatConfig.api, ...updates.api },
        messages: { ...chatConfig.messages, ...updates.messages },
        ui: { ...chatConfig.ui, ...updates.ui },
        notifications: { ...chatConfig.notifications, ...updates.notifications },
        features: { ...chatConfig.features, ...updates.features },
        security: { ...chatConfig.security, ...updates.security },
    });
};

// Validation helpers
export const validateFileType = (fileType: string): boolean => {
    return chatConfig.messages.allowedFileTypes.includes(fileType);
};

export const validateFileSize = (fileSize: number): boolean => {
    return fileSize <= chatConfig.messages.maxFileSize;
};

export const validateMessageLength = (message: string): boolean => {
    return message.length <= chatConfig.messages.maxLength;
};

// Export types
export type { ChatConfig };
