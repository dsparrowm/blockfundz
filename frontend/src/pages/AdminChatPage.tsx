import React from 'react';
import AdminChatDashboard from '../components/AdminChatDashboard';
import { useStore } from '../store/useStore';

const AdminChatPage = () => {
    const { user } = useStore();
    const token = localStorage.getItem('adminToken') || '';
    const userId = user?.id?.toString() || '1'; // Fallback admin ID

    return <AdminChatDashboard userId={userId} token={token} />;
};

export default AdminChatPage;