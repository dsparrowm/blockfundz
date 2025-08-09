import React, { useState } from 'react';
import { Send, MessageCircle, Mail, Phone, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import axiosInstance from '../api/axiosInstance';
import Cookies from 'js-cookie';
import { useStore } from '../store/useStore';

const Support = () => {
    const [ticketForm, setTicketForm] = useState({
        subject: '',
        message: '',
        priority: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useStore();
    const token = Cookies.get('token') || localStorage.getItem('adminToken');

    const handleSubmitTicket = async (e) => {
        e.preventDefault();

        if (!user?.id || !token) {
            toast.error('Please log in to submit a support ticket');
            return;
        }

        if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            await axiosInstance.post('/api/support-ticket', {
                subject: ticketForm.subject,
                message: ticketForm.message,
                priority: ticketForm.priority,
                userId: user.id
            });

            toast.success('Support ticket submitted successfully! We will get back to you soon.');
            setTicketForm({ subject: '', message: '', priority: 'medium' });
        } catch (error) {
            toast.error('Failed to submit ticket. Please try again.');
            console.error('Error submitting ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setTicketForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                <div className="flex items-center gap-3 mb-4">
                    <MessageCircle className="w-8 h-8" />
                    <div>
                        <h1 className="text-2xl font-bold">Support Center</h1>
                        <p className="text-purple-100">We're here to help you</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Contact Methods */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                            <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">support@nexgen.com</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Response within 24 hours</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                            <Phone className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">+1 (555) 123-4567</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Mon-Fri 9AM-6PM EST</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Business Hours</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Monday - Friday</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">9:00 AM - 6:00 PM EST</p>
                        </div>
                    </div>

                    {/* Support Ticket Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Submit a Support Ticket</h2>

                        <form onSubmit={handleSubmitTicket} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subject *
                                </label>
                                <Input
                                    type="text"
                                    value={ticketForm.subject}
                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                    placeholder="Brief description of your issue"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Priority
                                </label>
                                <select
                                    value={ticketForm.priority}
                                    onChange={(e) => handleInputChange('priority', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message *
                                </label>
                                <Textarea
                                    value={ticketForm.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    placeholder="Please describe your issue in detail..."
                                    rows={6}
                                    className="w-full resize-none"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Send className="w-4 h-4" />
                                        Submit Ticket
                                    </div>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">How do I reset my password?</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">You can reset your password by clicking the "Forgot Password" link on the login page.</p>
                            </div>

                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">How long do withdrawals take?</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Withdrawals typically process within 24-48 hours during business days.</p>
                            </div>

                            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Is my data secure?</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Yes, we use bank-level encryption and security measures to protect your data.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;