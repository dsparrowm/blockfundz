import axiosInstance from '../api/axiosInstance';
import { ChatMessage, ChatUser } from './websocket';

export interface Conversation {
    id: string;
    participants: ChatUser[];
    lastMessage?: ChatMessage;
    unreadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateConversationRequest {
    participantIds: string[];
    type: 'direct' | 'group';
    title?: string;
}

export interface GetMessagesRequest {
    conversationId: string;
    page?: number;
    limit?: number;
    before?: string; // message ID for pagination
}

export interface GetMessagesResponse {
    messages: ChatMessage[];
    hasMore: boolean;
    totalCount: number;
}

export interface GetConversationsResponse {
    conversations: Conversation[];
    totalCount: number;
}

class ChatApiService {
    private baseUrl = '/api/chat';

    // Conversations
    async getConversations(page = 1, limit = 20): Promise<GetConversationsResponse> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/conversations`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    async getConversation(conversationId: string): Promise<Conversation> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/conversations/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }

    async createConversation(data: CreateConversationRequest): Promise<Conversation> {
        try {
            const response = await axiosInstance.post(`${this.baseUrl}/conversations`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    // Messages
    async getMessages(params: GetMessagesRequest): Promise<GetMessagesResponse> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/messages`, {
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    async sendMessage(conversationId: string, text: string, messageType: 'text' | 'image' | 'file' = 'text', metadata?: any): Promise<ChatMessage> {
        try {
            const response = await axiosInstance.post(`${this.baseUrl}/messages`, {
                conversationId,
                text,
                messageType,
                metadata
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async markMessagesAsRead(messageIds: string[]): Promise<void> {
        try {
            await axiosInstance.put(`${this.baseUrl}/messages/read`, {
                messageIds
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    }

    async deleteMessage(messageId: string): Promise<void> {
        try {
            await axiosInstance.delete(`${this.baseUrl}/messages/${messageId}`);
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    // Users
    async getUsers(search?: string, role?: 'user' | 'admin'): Promise<ChatUser[]> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/users`, {
                params: { search, role }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async getUserStatus(userId: string): Promise<{ isOnline: boolean; lastSeen: Date }> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/users/${userId}/status`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user status:', error);
            throw error;
        }
    }

    // Admin specific endpoints
    async getAdminStats(): Promise<{
        totalConversations: number;
        activeConversations: number;
        totalMessages: number;
        averageResponseTime: number;
    }> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/admin/stats`);
            return response.data;
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            throw error;
        }
    }

    async assignConversation(conversationId: string, adminId: string): Promise<void> {
        try {
            await axiosInstance.put(`${this.baseUrl}/admin/conversations/${conversationId}/assign`, {
                adminId
            });
        } catch (error) {
            console.error('Error assigning conversation:', error);
            throw error;
        }
    }

    async closeConversation(conversationId: string): Promise<void> {
        try {
            await axiosInstance.put(`${this.baseUrl}/admin/conversations/${conversationId}/close`);
        } catch (error) {
            console.error('Error closing conversation:', error);
            throw error;
        }
    }

    // File operations
    async uploadFile(file: File, conversationId: string): Promise<{ fileUrl: string; fileName: string; fileSize: number }> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('conversationId', conversationId);

            const response = await axiosInstance.post(`${this.baseUrl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    async downloadFile(fileUrl: string): Promise<Blob> {
        try {
            const response = await axiosInstance.get(fileUrl, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }

    // Search
    async searchMessages(query: string, conversationId?: string): Promise<ChatMessage[]> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/search`, {
                params: { query, conversationId }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching messages:', error);
            throw error;
        }
    }

    // Export conversation
    async exportConversation(conversationId: string, format: 'json' | 'csv' = 'json'): Promise<Blob> {
        try {
            const response = await axiosInstance.get(`${this.baseUrl}/conversations/${conversationId}/export`, {
                params: { format },
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            console.error('Error exporting conversation:', error);
            throw error;
        }
    }
}

export const chatApiService = new ChatApiService();
export default chatApiService;
