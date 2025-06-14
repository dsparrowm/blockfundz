import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FaUser, FaLock, FaKey, FaBell, FaCog, FaLink, FaShieldAlt, FaCreditCard } from "react-icons/fa";

const Settings = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('New passwords do not match');
            return;
        }
        // In a real app, you would make an API call here
        console.log('Changing password...');
        alert('Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'notifications', label: 'Notifications', icon: FaBell },
        { id: 'security', label: 'Security', icon: FaShieldAlt },

    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and AI agent configuration.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 rounded-lg bg-background shadow-md">
                {/* Settings Navigation */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-4">
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${activeSection === item.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span className={activeSection === item.id ? 'font-medium' : ''}>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </CardContent>
                    </Card>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Settings */}
                    {activeSection === 'profile' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" defaultValue="John" />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" defaultValue="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue="john.doe@company.com" />
                                </div>
                                <div>
                                    <Label htmlFor="company">Company</Label>
                                    <Input id="company" defaultValue="Tech Solutions Inc." />
                                </div>
                                <div>
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timezone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                                            <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                                            <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                                            <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button>Save Changes</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Security Settings */}
                    {activeSection === 'security' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FaLock className="w-5 h-5" />
                                        Change Password
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div>
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                value={passwords.current}
                                                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            <FaKey className="w-4 h-4 mr-2" />
                                            Update Password
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Two-Factor Authentication</Label>
                                            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="border-t my-2" />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Login Notifications</Label>
                                            <p className="text-sm text-muted-foreground">Get notified of new sign-ins to your account</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="border-t my-2" />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Session Timeout</Label>
                                            <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                                        </div>
                                        <Select>
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="30 min" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15">15 min</SelectItem>
                                                <SelectItem value="30">30 min</SelectItem>
                                                <SelectItem value="60">1 hour</SelectItem>
                                                <SelectItem value="240">4 hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* AI Configuration */}
                    {activeSection === 'ai-config' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Agent Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label htmlFor="agentPersonality">Agent Personality</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select personality" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="professional">Professional</SelectItem>
                                            <SelectItem value="friendly">Friendly</SelectItem>
                                            <SelectItem value="casual">Casual</SelectItem>
                                            <SelectItem value="formal">Formal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="responseTime">Response Timing</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timing" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="immediate">Immediate (0-5 min)</SelectItem>
                                            <SelectItem value="quick">Quick (5-30 min)</SelectItem>
                                            <SelectItem value="normal">Normal (30-120 min)</SelectItem>
                                            <SelectItem value="delayed">Delayed (2-6 hours)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="customPrompt">Custom Instructions</Label>
                                    <Textarea
                                        id="customPrompt"
                                        placeholder="Add specific instructions for your AI agents..."
                                        defaultValue="Always mention our company's commitment to innovation and customer success. Focus on ROI and efficiency benefits."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Auto-qualification</Label>
                                            <p className="text-sm text-muted-foreground">Automatically qualify leads based on engagement</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Smart Follow-ups</Label>
                                            <p className="text-sm text-muted-foreground">AI determines optimal follow-up timing</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Sentiment Analysis</Label>
                                            <p className="text-sm text-muted-foreground">Analyze prospect sentiment for better targeting</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>

                                <Button>Update AI Settings</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Integrations */}
                    {activeSection === 'integrations' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Integrations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold">Li</div>
                                            <div>
                                                <h4 className="font-medium">LinkedIn</h4>
                                                <p className="text-sm text-muted-foreground">Connect your LinkedIn account for lead discovery</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="default">Connected</Badge>
                                            <Button variant="outline" size="sm">Configure</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-sky-500 rounded text-white flex items-center justify-center text-sm font-bold">Tw</div>
                                            <div>
                                                <h4 className="font-medium">Twitter</h4>
                                                <p className="text-sm text-muted-foreground">Engage with prospects on Twitter</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">Not Connected</Badge>
                                            <Button size="sm">Connect</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-800 rounded text-white flex items-center justify-center text-sm font-bold">SF</div>
                                            <div>
                                                <h4 className="font-medium">Salesforce</h4>
                                                <p className="text-sm text-muted-foreground">Sync leads to your Salesforce CRM</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="default">Connected</Badge>
                                            <Button variant="outline" size="sm">Configure</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-600 rounded text-white flex items-center justify-center text-sm font-bold">HS</div>
                                            <div>
                                                <h4 className="font-medium">HubSpot</h4>
                                                <p className="text-sm text-muted-foreground">Integrate with HubSpot for lead management</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">Not Connected</Badge>
                                            <Button size="sm">Connect</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Notifications */}
                    {activeSection === 'notifications' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>New qualified leads</Label>
                                            <p className="text-sm text-muted-foreground">Get notified when AI qualifies a new lead</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Campaign milestones</Label>
                                            <p className="text-sm text-muted-foreground">Alerts for campaign performance milestones</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Weekly reports</Label>
                                            <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>System updates</Label>
                                            <p className="text-sm text-muted-foreground">Important platform updates and maintenance</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>

                                <div className="border-t my-2" />

                                <div>
                                    <Label>Email Frequency</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="immediate">Immediate</SelectItem>
                                            <SelectItem value="daily">Daily Digest</SelectItem>
                                            <SelectItem value="weekly">Weekly Summary</SelectItem>
                                            <SelectItem value="never">Never</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button>Save Preferences</Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Billing */}
                    {activeSection === 'billing' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing & Subscription</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <h4 className="font-medium">Current Plan: Pro</h4>
                                            <p className="text-sm text-muted-foreground">$299/month • Next billing: Dec 15, 2024</p>
                                        </div>
                                        <Button variant="outline">Manage Plan</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;