import React, { useState, useEffect } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-toastify';
import axios from 'axios';
import Spinner from '../spinners/Spinner';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

const EmailSenderComponent = () => {
  // State management
  const [recipientMode, setRecipientMode] = useState('single');
  const [users, setUsers] = useState<{ id: string; name: string; email: string; }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ id: string; name: string; email: string; }[]>([]);
  const [singleRecipient, setSingleRecipient] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users on component mount (mock data for demonstration)
  useEffect(() => {
    const fetchUsers = async () => {
      const userResponse = await axios.get(`${apiBaseUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      setUsers(userResponse.data.users);
    };

    fetchUsers();
  }, []);

  // Handle email sending
  const handleSendEmail = async () => {
    // Validate inputs
    if (!emailSubject || !emailBody) {
      toast("Please enter email subject and body");
      return;
    }

    // Determine recipients based on mode
    const recipients =
      recipientMode === 'single'
        ? [singleRecipient]
        : selectedUsers.map(user => user.email);

    if (recipients.length === 0) {
      toast('Please select at least one recipient');
      return;
    }

    setIsLoading(true);

    try {
      // email sending
      const response = await axios.post(`${apiBaseUrl}/api/email`, {
        recipients,
        subject: emailSubject,
        body: emailBody
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.status === 200) {
        toast(`Email sent to ${recipients.length} recipient(s)`);

        // Reset form
        setEmailSubject('');
        setEmailBody('');
        setSingleRecipient('');
        setSelectedUsers([]);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast('Could not send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle user selection
  interface User {
    id: string;
    name: string;
    email: string;
  }

  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-coral-black">
      <Card className="w-full max-w-2xl text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-6 w-6 text-white" />
            Send Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Recipient Mode Selection */}
          <div className="flex items-center space-x-2 mb-4">
            <Label className='text-white'>Recipient Mode</Label>
            <Switch
              checked={recipientMode === 'multiple'}
              onCheckedChange={() =>
                setRecipientMode(
                  recipientMode === 'single' ? 'multiple' : 'single'
                )
              }
            />
            <span>
              {recipientMode === 'single'
                ? 'Single Recipient'
                : 'Multiple Recipients'}
            </span>
          </div>

          {/* Recipient Input */}
          {recipientMode === 'single' ? (
            <div className="mb-4">
              <Label className='text-white'>Recipient Email</Label>
              <Input
                className='text-coral-black'
                type="email"
                placeholder="Enter recipient email"
                value={singleRecipient}
                onChange={(e) => setSingleRecipient(e.target.value)}
              />
            </div>
          ) : (
            <div className="mb-4 text-white">
              <Label>Select Recipients</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    className={`border p-2 rounded cursor-pointer flex items-center 
                      ${selectedUsers.some(u => u.id === user.id)
                        ? 'bg-blue-100 border-blue-500'
                        : 'hover:bg-gray-600'}
                    `}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.some(u => u.id === user.id)}
                      className="mr-2"
                      readOnly
                    />
                    <span>{user.name} ({user.email})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Email Subject */}
          <div className="mb-4">
            <Label className='text-white'>Subject</Label>
            <Input
              className='text-coral-black'
              placeholder="Email Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>

          {/* Email Body */}
          <div className="mb-4">
            <Label className='text-white'>Email Body</Label>
            <Textarea
              className='text-coral-black'
              placeholder="Compose your email..."
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={5}
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="w-full bg-orange-500"
          >
            {isLoading ? (<Spinner />) : 'Send Email'}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSenderComponent;