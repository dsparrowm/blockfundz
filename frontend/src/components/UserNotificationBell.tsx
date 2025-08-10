
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserNotifications from './UserNotifications';


const UserNotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // Fetch initial notifications
  useEffect(() => {
    axiosInstance.get('/api/notifications')
      .then(res => {
        setNotifications(res.data);
        // Count unread notifications
        const unread = res.data.filter(notification => !notification.read).length;
        setUnreadCount(unread);
      })
      .catch(() => { });
  }, []);

  // Polling for new notifications (since we removed real-time updates)
  useEffect(() => {
    const interval = setInterval(() => {
      axiosInstance.get('/api/notifications')
        .then(res => {
          setNotifications(res.data);
          const unread = res.data.filter(notification => !notification.read).length;
          setUnreadCount(unread);
        })
        .catch(() => { });
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Reset unread count when dialog is opened
  useEffect(() => {
    if (open) setUnreadCount(0);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <UserNotifications notifications={notifications} />
      </DialogContent>
    </Dialog>
  );
};

export default UserNotificationBell;
