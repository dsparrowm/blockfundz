
import { ScrollArea } from '@/components/ui/scroll-area';

const UserNotifications = ({ notifications }) => {
  return (
    <div className="p-4 border rounded bg-card">
      <h2 className="text-lg font-semibold mb-2">Notifications</h2>
      <ScrollArea className="h-64">
        <ul className="space-y-3">
          {notifications.length === 0 ? (
            <li className="text-muted-foreground">No notifications</li>
          ) : (
            notifications.map(n => (
              <li key={n.id} className="border-b pb-2">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm">{n.content}</div>
                <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
              </li>
            ))
          )}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default UserNotifications;
