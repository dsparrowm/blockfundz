import { toast } from 'sonner';
import { ChatMessage, ChatUser } from '../services/websocket';

interface NotificationOptions {
    enableSound?: boolean;
    enableBrowserNotifications?: boolean;
    enableInAppNotifications?: boolean;
    maxNotifications?: number;
}

class ChatNotificationService {
    private options: NotificationOptions;
    private notificationSound?: HTMLAudioElement;
    private activeNotifications: Set<string> = new Set();

    constructor(options: NotificationOptions = {}) {
        this.options = {
            enableSound: true,
            enableBrowserNotifications: true,
            enableInAppNotifications: true,
            maxNotifications: 5,
            ...options
        };

        this.initializeSound();
        this.requestNotificationPermission();
    }

    private initializeSound() {
        if (this.options.enableSound) {
            // You can replace this with your own notification sound
            const soundData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAlGn+H20nAjBT2L0/DKdCAEJHfJ8N8=';
            this.notificationSound = new Audio(soundData);
            this.notificationSound.volume = 0.5;
        }
    }

    private async requestNotificationPermission() {
        if ('Notification' in window && this.options.enableBrowserNotifications) {
            if (Notification.permission === 'default') {
                await Notification.requestPermission();
            }
        }
    }

    private playSound() {
        if (this.options.enableSound && this.notificationSound) {
            this.notificationSound.play().catch(console.error);
        }
    }

    private showBrowserNotification(title: string, body: string, icon?: string, data?: any) {
        if (!this.options.enableBrowserNotifications ||
            !('Notification' in window) ||
            Notification.permission !== 'granted') {
            return;
        }

        // Limit the number of active notifications
        if (this.activeNotifications.size >= (this.options.maxNotifications || 5)) {
            return;
        }

        const notificationId = Date.now().toString();
        this.activeNotifications.add(notificationId);

        const notification = new Notification(title, {
            body,
            icon: icon || '/favicon.ico',
            badge: '/favicon.ico',
            tag: notificationId,
            data,
            requireInteraction: false,
            silent: false
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            notification.close();
            this.activeNotifications.delete(notificationId);
        }, 5000);

        notification.onclick = () => {
            window.focus();
            notification.close();
            this.activeNotifications.delete(notificationId);

            // Handle notification click if needed
            if (data?.conversationId) {
                // You can emit an event or call a callback here
                window.dispatchEvent(new CustomEvent('chatNotificationClick', {
                    detail: { conversationId: data.conversationId }
                }));
            }
        };

        notification.onerror = () => {
            this.activeNotifications.delete(notificationId);
        };

        notification.onclose = () => {
            this.activeNotifications.delete(notificationId);
        };
    }

    private showInAppNotification(title: string, description: string, variant: 'default' | 'destructive' | 'success' = 'default') {
        if (!this.options.enableInAppNotifications) return;

        toast(title, {
            description,
            duration: 4000,
            action: variant === 'destructive' ? undefined : {
                label: 'View',
                onClick: () => {
                    // Handle view action
                    window.dispatchEvent(new CustomEvent('chatNotificationView'));
                }
            }
        });
    }

    // Public methods
    onNewMessage(message: ChatMessage, sender: ChatUser, isActiveConversation: boolean = false) {
        // Don't show notification for active conversation or own messages
        if (isActiveConversation || message.senderId === sender.id) return;

        const title = `New message from ${sender.username}`;
        const body = message.text.length > 50 ?
            message.text.substring(0, 50) + '...' :
            message.text;

        this.playSound();

        this.showBrowserNotification(
            title,
            body,
            sender.avatar,
            {
                conversationId: message.conversationId,
                senderId: message.senderId
            }
        );

        this.showInAppNotification(title, body);
    }

    onUserOnline(user: ChatUser) {
        this.showInAppNotification(
            'User Online',
            `${user.username} is now online`,
            'success'
        );
    }

    onUserOffline(user: ChatUser) {
        this.showInAppNotification(
            'User Offline',
            `${user.username} went offline`
        );
    }

    onConnectionLost() {
        this.showInAppNotification(
            'Connection Lost',
            'Trying to reconnect to chat server...',
            'destructive'
        );
    }

    onConnectionRestored() {
        this.showInAppNotification(
            'Connected',
            'Connection to chat server restored',
            'success'
        );
    }

    onTypingStart(user: ChatUser) {
        // Only show typing for important conversations or if explicitly enabled
        // You might want to make this configurable
    }

    onFileUpload(fileName: string, success: boolean = true) {
        if (success) {
            this.showInAppNotification(
                'File Uploaded',
                `${fileName} has been uploaded successfully`,
                'success'
            );
        } else {
            this.showInAppNotification(
                'Upload Failed',
                `Failed to upload ${fileName}`,
                'destructive'
            );
        }
    }

    onConversationCreated(participants: ChatUser[]) {
        const participantNames = participants.map(p => p.username).join(', ');
        this.showInAppNotification(
            'New Conversation',
            `Started conversation with ${participantNames}`,
            'success'
        );
    }

    onMessageDeleted(messageId: string) {
        this.showInAppNotification(
            'Message Deleted',
            'A message has been deleted'
        );
    }

    onMessageUpdated(message: ChatMessage) {
        this.showInAppNotification(
            'Message Updated',
            'A message has been edited'
        );
    }

    // Utility methods
    updateOptions(newOptions: Partial<NotificationOptions>) {
        this.options = { ...this.options, ...newOptions };
    }

    clearAllNotifications() {
        this.activeNotifications.forEach(id => {
            // Close browser notifications
            if ('Notification' in window) {
                // Note: There's no direct way to close all notifications by tag
                // This is a limitation of the Notification API
            }
        });
        this.activeNotifications.clear();
    }

    getActiveNotificationCount(): number {
        return this.activeNotifications.size;
    }

    isNotificationSupported(): boolean {
        return 'Notification' in window;
    }

    getNotificationPermission(): NotificationPermission | 'unsupported' {
        if (!('Notification' in window)) return 'unsupported';
        return Notification.permission;
    }

    async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
        if (!('Notification' in window)) return 'unsupported';

        if (Notification.permission === 'default') {
            return await Notification.requestPermission();
        }

        return Notification.permission;
    }
}

// Create a singleton instance
export const chatNotificationService = new ChatNotificationService();

// Export for custom configurations
export { ChatNotificationService };
export type { NotificationOptions };
