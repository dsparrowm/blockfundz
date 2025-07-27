
import { useState, useEffect } from 'react';
import useNotificationSocket from '../hooks/useNotificationSocket';
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
    axiosInstance.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(() => { });
  }, []);

  // Real-time notification update
  useNotificationSocket((newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((count) => count + 1);
  });

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
