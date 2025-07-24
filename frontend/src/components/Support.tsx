import React, { useState } from 'react';
import { Send, Paperclip, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'support';
    timestamp: Date;
}

export const Support = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! How can we help you today?',
            sender: 'support',
            timestamp: new Date()
        }
    ]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        // Simulate support response
        setTimeout(() => {
            const supportResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Thank you for your message. Our team will get back to you shortly.',
                sender: 'support',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, supportResponse]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
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
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="flex items-start space-x-2 max-w-xs">
                                        {msg.sender === 'support' && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                                    S
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div
                                            className={`px-3 py-2 rounded-lg ${msg.sender === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                            <p className="text-xs mt-1 opacity-70">
                                                {msg.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>

                                        {msg.sender === 'user' && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                                    U
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            ))}
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
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1"
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
                    <p className="text-sm text-gray-600">support@blockfundz.com</p>
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