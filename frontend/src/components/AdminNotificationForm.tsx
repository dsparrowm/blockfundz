import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminNotificationForm = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/api/admin/notifications/broadcast', { message });
      toast('Notification broadcasted!');
      setMessage('');
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-card">
      <h2 className="text-lg font-semibold mb-2">Broadcast Notification</h2>
      <Input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Notification message..."
        required
        className="w-full"
      />
      <Button type="submit" disabled={loading || !message.trim()}>
        {loading ? 'Sending...' : 'Send Notification'}
      </Button>
    </form>
  );
};

export default AdminNotificationForm;
