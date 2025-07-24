import React, { useState, useEffect } from 'react';
import { Send, Search, Users, MessageSquare, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    email: string;
    status: 'online' | 'offline';
    lastMessage?: string;
    unreadCount?: number;
    createdAt?: string;
    isVerified?: boolean;
}

interface Message {
    id: string;
    text: string;
    sender: 'admin' | 'user';
    timestamp: Date;
}

export const AdminChatDashboard = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch users from backend
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get('/admin/users');
            
            // Transform backend user data to match our interface
            const transformedUsers: User[] = response.data.users.map((user: any) => ({
                id: user.id,
                name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
                email: user.email,
                status: 'offline' as const, // We'll implement real status later
                lastMessage: undefined, // We'll implement chat history later
                unreadCount: 0, // We'll implement unread count later
                createdAt: user.createdAt,
                isVerified: user.isVerified
            }));
            
            setUsers(transformedUsers);
            toast.success(`Loaded ${transformedUsers.length} users`);
        } catch (error: any) {
            console.error('Failed to fetch users:', error);
            setError('Failed to load users. Please try again.');
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello, I need help with my account',
            sender: 'user',
            timestamp: new Date(Date.now() - 300000)
        },
        {
            id: '2',
            text: 'Hi! I\'d be happy to help you with your account. What specific issue are you experiencing?',
            sender: 'admin',
            timestamp: new Date(Date.now() - 240000)
        },
        {
            id: '3',
            text: 'I can\'t seem to access my investment portfolio',
            sender: 'user',
            timestamp: new Date(Date.now() - 180000)
        }
    ]);

    const handleSendMessage = () => {
        if (!message.trim() || !selectedUser) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: message,
            sender: 'admin',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Users List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Direct Messages</h2>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchUsers}
                            disabled={loading}
                            className="h-8 w-8 p-0"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Users */}
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                <span className="ml-2 text-sm text-gray-500">Loading users...</span>
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center">
                                <p className="text-sm text-red-600 mb-2">{error}</p>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={fetchUsers}
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-4 text-center">
                                <p className="text-sm text-gray-500">
                                    {searchQuery ? 'No users found matching your search' : 'No users available'}
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`w-full p-3 rounded-lg text-left hover:bg-gray-50 transition-colors mb-1 ${selectedUser?.id === user.id ? 'bg-blue-50 border border-blue-200' : ''
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-gray-100 text-gray-600">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                                                }`} />
                                            {user.isVerified && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {user.name}
                                                </p>
                                                {user.unreadCount > 0 && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        {user.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                            {user.lastMessage ? (
                                                <p className="text-xs text-gray-400 truncate mt-1">
                                                    {user.lastMessage}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-400 truncate mt-1">
                                                    No messages yet
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {selectedUser.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${selectedUser.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedUser.status === 'online' ? 'Online' : 'Offline'} • {selectedUser.email}
                                        {selectedUser.isVerified && (
                                            <span className="ml-1 text-blue-500">✓ Verified</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4 bg-gray-50">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className="flex items-end space-x-2 max-w-xs">
                                            {msg.sender === 'user' && (
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                                        {selectedUser.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}

                                            <div
                                                className={`px-4 py-2 rounded-2xl shadow-sm ${msg.sender === 'admin'
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-900 border border-gray-200'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.text}</p>
                                                <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                                                    }`}>
                                                    {msg.timestamp.toLocaleTimeString()}
                                                </p>
                                            </div>

                                            {msg.sender === 'admin' && (
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                                        A
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!message.trim()}
                                    size="sm"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                        <div className="text-center">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium text-gray-600">Select a user to start messaging</p>
                            <p className="text-sm text-gray-500">Choose a user from the list to begin a conversation</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatDashboard;
