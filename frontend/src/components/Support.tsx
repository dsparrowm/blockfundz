import React, { useState, useEffect } from 'react';
import { Send, Paperclip, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { useSocket } from '../context/SocketContext';
import axiosInstance from '../api/axiosInstance';
import Cookies from 'js-cookie';
import { useStore } from '../store/useStore';

const Support = () => {
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const { user } = useStore();
    const token = Cookies.get('token') || localStorage.getItem('adminToken');

    // Fetch conversation and messages
    useEffect(() => {
        if (!user?.id || !token) {
            toast.error('Please log in to use support chat');
            return;
        }

        axiosInstance.get('/api/user-conversation')
            .then(res => {
                setConversationId(res.data.id);
                setMessages(res.data.messages);
            })
            .catch(err => {
                console.error('Failed to load conversation:', err);
                toast.error('Failed to load conversation');
            });
    }, [user?.id, token]);    // Handle Socket.IO events
    useEffect(() => {
        if (!socket || !conversationId) return;

        const handlePrivateMessage = (msg) => {
            if (msg.conversationId === conversationId) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        const handleTyping = ({ isTyping, conversationId: incomingConversationId }) => {
            if (incomingConversationId === conversationId) {
                setTyping(isTyping);
            }
        };

        const handleMessagesRead = ({ conversationId: incomingConversationId }) => {
            if (incomingConversationId === conversationId) {
                setMessages((prev) => prev.map(msg => ({ ...msg, isRead: true })));
            }
        };

        socket.on('private-message', handlePrivateMessage);
        socket.on('typing', handleTyping);
        socket.on('messages-read', handleMessagesRead);

        return () => {
            socket.off('private-message', handlePrivateMessage);
            socket.off('typing', handleTyping);
            socket.off('messages-read', handleMessagesRead);
        };
    }, [socket, conversationId]);

    const handleSendMessage = () => {
        if (!message.trim() || !socket || !conversationId) return;

        const messageData = {
            content: message,
            senderId: user?.id,
            recipientId: 3, // Admin ID (assumed from ADMIN_EMAIL)
            conversationId
        };
        socket.emit('private-message', messageData);
        setMessage('');
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (socket && conversationId) {
            socket.emit('typing', {
                recipientId: 1,
                conversationId,
                isTyping: e.target.value.length > 0
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const markMessagesRead = () => {
        if (socket && conversationId) {
            socket.emit('mark-messages-read', {
                conversationId,
                userId: user?.id,
                senderId: 1
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Customer Support</h2>
                            <p className="text-sm text-gray-600">Get help from our support team</p>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="h-96 flex flex-col">
                    <ScrollArea className="flex-1 p-4" onClick={markMessagesRead}>
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="flex items-start space-x-2 max-w-xs">
                                        {msg.senderId !== user?.id && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                                    S
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div
                                            className={`px-3 py-2 rounded-lg ${msg.senderId === user?.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <div className={`flex items-center justify-end mt-1 space-x-1 ${msg.senderId === user?.id ? 'text-white/70' : 'text-gray-600'}`}>
                                                <span className="text-xs">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {msg.senderId === user?.id && (
                                                    <div className="flex">
                                                        <div className={`w-1 h-1 rounded-full ${msg.isRead ? 'bg-blue-400' : 'bg-gray-400'}`} />
                                                        <div className={`w-1 h-1 rounded-full ml-0.5 ${msg.isRead ? 'bg-blue-400' : 'bg-gray-400'}`} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {msg.senderId === user?.id && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                                    U
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {typing && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg">
                                        <p className="text-sm italic">Support is typing...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <Paperclip className="h-4 w-4" />
                            </Button>
                            <Input
                                value={message}
                                onChange={handleTyping}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1"
                                disabled={!conversationId}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || !conversationId}
                                size="sm"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Email Support</h3>
                    <p className="text-sm text-gray-600">support@nexgen.com</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Response Time</h3>
                    <p className="text-sm text-gray-600">Usually within 1 hour</p>
                </div>
            </div>
        </div>
    );
};

export default Support;