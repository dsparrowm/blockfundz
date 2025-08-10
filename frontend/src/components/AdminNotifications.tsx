import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash, Plus, Save } from "lucide-react";
import { toast } from 'sonner';

interface Notification {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

const AdminNotifications = ({ userId, token }: { userId: number; token: string }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [newNotification, setNewNotification] = useState({ title: '', content: '' });
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Format date safely
    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) {
            console.warn('Date string is undefined or null');
            return 'No date available';
        }

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn(`Invalid date string: ${dateString}`);
            return 'Invalid date';
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    // Fetch notifications with pagination
    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get(`/api/admin/notifications?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Fetched notifications:', res.data.notifications); // Debug log
            // Check if response has expected structure
            if (!res.data.notifications || !Array.isArray(res.data.notifications)) {
                console.error('Invalid response structure:', res.data);
                toast.error('Invalid response from server');
                return;
            }
            // Deduplicate notifications by id
            const uniqueNotifications = Array.from(
                new Map(res.data.notifications.map((notif: Notification) => [notif.id, notif])).values()
            ) as Notification[];
            setNotifications(uniqueNotifications);
            setTotal(res.data.total || 0);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            toast.error('Failed to fetch notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [token, page, limit]);

    // Handle create notification
    const handleCreateNotification = async () => {
        if (!newNotification.title.trim() || !newNotification.content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        try {
            const res = await axiosInstance.post(
                '/api/admin/notifications',
                { title: newNotification.title, content: newNotification.content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Created notification:', res.data); // Debug log
            setNewNotification({ title: '', content: '' });
            setIsCreating(false);
            // Refetch notifications instead of resetting page
            await fetchNotifications();
            toast.success('Notification created');
        } catch (err) {
            console.error('Failed to create notification:', err);
            toast.error('Failed to create notification');
        }
    };

    // Handle edit notification
    const handleEditNotification = async () => {
        if (!editingNotification || !editingNotification.title.trim() || !editingNotification.content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        try {
            const res = await axiosInstance.put(
                `/api/admin/notifications/${editingNotification.id}`,
                { title: editingNotification.title, content: editingNotification.content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Updated notification:', res.data); // Debug log
            setNotifications((prev) =>
                prev.map((notif) => (notif.id === res.data.id ? res.data : notif))
            );
            setEditingNotification(null);
            toast.success('Notification updated');
        } catch (err) {
            console.error('Failed to update notification:', err);
            toast.error('Failed to update notification');
        }
    };

    // Handle delete notification
    const handleDeleteNotification = async (id: number) => {
        try {
            await axiosInstance.delete(`/api/admin/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications((prev) => prev.filter((notif) => notif.id !== id));
            toast.success('Notification deleted');
            // Check if current page is empty after deletion
            if (notifications.length === 1 && page > 1) {
                setPage((p) => p - 1);
            } else {
                await fetchNotifications();
            }
        } catch (err) {
            console.error('Failed to delete notification:', err);
            toast.error('Failed to delete notification');
        }
    };

    return (
        <div className="flex h-[100vh] bg-background">
            {/* Notifications List */}
            <div className="w-1/3 border-r bg-card">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold mb-4">Notifications</h2>
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="w-full"
                        variant="outline"
                        disabled={isLoading}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create New Notification
                    </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-170px)]">
                    <div className="p-2">
                        {isLoading ? (
                            <p className="text-center text-muted-foreground">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <p className="text-center text-muted-foreground">No notifications found</p>
                        ) : (
                            notifications.map((notif) => (
                                <Card
                                    key={notif.id}
                                    className={`p-3 mb-2 cursor-pointer hover:bg-muted/50 transition-colors ${editingNotification?.id === notif.id ? 'bg-muted' : ''
                                        }`}
                                    onClick={() => setEditingNotification(notif)}
                                >
                                    <CardHeader className="p-0">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-sm font-medium truncate">
                                                {notif.title}
                                            </CardTitle>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingNotification(notif);
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNotification(notif.id);
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <p className="text-sm text-muted-foreground truncate">{notif.content}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{formatDate(notif.createdAt)}</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>
                {/* Pagination Controls */}
                <div className="flex justify-between items-center p-4 border-t bg-card">
                    <Button
                        variant="outline"
                        disabled={page === 1 || isLoading}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Prev
                    </Button>
                    <span className="text-sm">Page {page} of {Math.ceil(total / limit)}</span>
                    <Button
                        variant="outline"
                        disabled={page >= Math.ceil(total / limit) || isLoading}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Create/Edit Notification Form */}
            <div className="flex-1 flex flex-col h-[100vh]">
                {isCreating || editingNotification ? (
                    <div className="p-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{isCreating ? 'Create Notification' : 'Edit Notification'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                            value={isCreating ? newNotification.title : editingNotification?.title || ''}
                                            onChange={(e) =>
                                                isCreating
                                                    ? setNewNotification({ ...newNotification, title: e.target.value })
                                                    : setEditingNotification({
                                                        ...editingNotification!,
                                                        title: e.target.value,
                                                    })
                                            }
                                            placeholder="Enter notification title"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Content</label>
                                        <Textarea
                                            value={
                                                isCreating ? newNotification.content : editingNotification?.content || ''
                                            }
                                            onChange={(e) =>
                                                isCreating
                                                    ? setNewNotification({ ...newNotification, content: e.target.value })
                                                    : setEditingNotification({
                                                        ...editingNotification!,
                                                        content: e.target.value,
                                                    })
                                            }
                                            placeholder="Enter notification content"
                                            rows={5}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={isCreating ? handleCreateNotification : handleEditNotification}
                                            disabled={isLoading}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {isCreating ? 'Create' : 'Save'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsCreating(false);
                                                setEditingNotification(null);
                                                setNewNotification({ title: '', content: '' });
                                            }}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-muted/20">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                Select or create a notification
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Choose a notification to edit or create a new one
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;