import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, Phone, Video, MoreVertical, Bell } from "lucide-react";
import { toast } from 'sonner';
import AdminNotificationForm from './AdminNotificationForm';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AdminChatDashboard = ({ userId, token }) => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

    // Fetch conversations
    useEffect(() => {
        axiosInstance.get('/api/conversations')
            .then(res => setConversations(res.data))
            .catch(err => toast.error('Failed to fetch conversations'));
    }, [token]);

    // Fetch online statuses
    useEffect(() => {
        axiosInstance.get('/api/users')
            .then(res => {
                const userIds = res.data.map(user => user.id);
                axiosInstance.get('/api/online-status', { params: { userIds } })
                    .then(res => setOnlineUsers(new Set(res.data.filter(s => s.isOnline).map(s => s.userId))));
            });
    }, []);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    // Filter conversations based on search
    const filteredConversations = conversations.filter(conv =>
        conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Send message
    const handleSendMessage = () => {
        if (message.trim() && selectedConversationId) {
            const messageData = {
                content: message,
                senderId: parseInt(userId, 10),
                recipientId: selectedConversation?.userId,
                conversationId: selectedConversationId
            };

            // Send message via API instead of Socket.IO
            axiosInstance.post('/conversations/send-message', messageData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    setMessages(prev => [...prev, { ...messageData, timestamp: new Date().toISOString() }]);
                })
                .catch(err => {
                    console.error('Failed to send message:', err);
                    toast.error('Failed to send message');
                });

            setMessage('');
        }
    };

    // Handle typing
    const handleTyping = (e) => {
        setMessage(e.target.value);
        // Removed real-time typing indicators - no Socket.IO
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Mark messages as read
    const markMessagesRead = () => {
        if (selectedConversation) {
            // Mark messages as read via API instead of Socket.IO
            axiosInstance.post('/conversations/mark-read', {
                conversationId: selectedConversationId,
                userId: parseInt(userId, 10)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .catch(err => {
                    console.error('Failed to mark messages as read:', err);
                });
        }
    };

    return (
        <div className="flex h-[100vh] bg-background">
            {/* Sidebar: Conversations */}
            <div className="w-1/3 border-r bg-card flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Direct Messages</h2>
                        {/* Notification Icon */}
                        <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setNotificationDialogOpen(true)}>
                                    <Bell className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Broadcast Notification</DialogTitle>
                                </DialogHeader>
                                <AdminNotificationForm />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <ScrollArea className="h-[calc(100vh-160px)]">
                    <div className="p-2">
                        {filteredConversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => {
                                    setSelectedConversationId(conv.id);
                                    setMessages(conv.messages);
                                    markMessagesRead();
                                }}
                                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${selectedConversationId === conv.id ? 'bg-muted' : ''}`}
                            >
                                <div className="relative">
                                    <Avatar>
                                        <AvatarFallback>
                                            {conv.user.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {onlineUsers.has(conv.userId) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                    )}
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium truncate">{conv.user.name}</p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-muted-foreground">
                                                {conv.lastMessageAt ? new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                            {conv.unreadCount > 0 && (
                                                <Badge variant="destructive">{conv.unreadCount}</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {conv.lastMessage || conv.user.email}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col h-[100vh]">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-card">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <Avatar>
                                        <AvatarFallback>
                                            {selectedConversation.user.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    {onlineUsers.has(selectedConversation.userId) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{selectedConversation.user.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {onlineUsers.has(selectedConversation.userId) ? 'Online' : 'Offline'} • {selectedConversation.user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="sm">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Video className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4 h-[calc(100vh-180px)]">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.senderId === parseInt(userId, 10) ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.senderId === parseInt(userId, 10)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-foreground'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <div className={`flex items-center justify-end mt-1 space-x-1 ${msg.senderId === parseInt(userId, 10) ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                                }`}>
                                                <span className="text-xs">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {msg.senderId === parseInt(userId, 10) && (
                                                    <div className="flex">
                                                        <div className={`w-1 h-1 rounded-full ${msg.isRead ? 'bg-blue-400' : 'bg-gray-400'
                                                            }`} />
                                                        <div className={`w-1 h-1 rounded-full ml-0.5 ${msg.isRead ? 'bg-blue-400' : 'bg-gray-400'
                                                            }`} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {typing && (
                                    <div className="flex justify-start">
                                        <div className="bg-muted text-foreground px-4 py-2 rounded-lg">
                                            <p className="text-sm italic">{selectedConversation.user.name} is typing...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t bg-card mt-auto">
                            <div className="flex space-x-2">
                                <Input
                                    value={message}
                                    onChange={handleTyping}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="flex-1"
                                />
                                <Button onClick={handleSendMessage} size="sm">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-muted/20">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                Select a conversation
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Choose a user from the list to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminChatDashboard;