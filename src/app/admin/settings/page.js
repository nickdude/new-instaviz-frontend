'use client';

import { useState } from 'react';
import {
  Bell,
  Lock,
  Eye,
  Save,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Instaviz',
    siteUrl: 'https://instaviz.com',
    email: 'admin@instaviz.com',
    phone: '+1 (555) 123-4567',
    supportEmail: 'support@instaviz.com',
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    newUsers: true,
    failedPayments: true,
    lowStock: false,
    weeklyReport: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system preferences and configuration</p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-600" />
            <p className="text-sm text-green-800">Settings saved successfully!</p>
            <button onClick={() => setSaved(false)} className="ml-auto">
              <X className="h-4 w-4 text-green-600 hover:text-green-800" />
            </button>
          </div>
        )}

        {/* General Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="Site name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                  <Input
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Phone</label>
                  <Input
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                  <Input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    placeholder="support@example.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="text-sm font-medium text-gray-700 cursor-pointer capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                      className="w-5 h-5 rounded cursor-pointer accent-blue-600"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <label className="text-sm font-medium text-gray-700 cursor-pointer">
                    Two-Factor Authentication
                  </label>
                  <input
                    type="checkbox"
                    checked={security.twoFactor}
                    onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                    className="w-5 h-5 rounded cursor-pointer accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                  <Input
                    type="number"
                    value={security.passwordExpiry}
                    onChange={(e) => setSecurity({ ...security, passwordExpiry: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                    min="5"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button onClick={handleSave} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* System Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Version</p>
                  <p className="text-sm font-medium text-gray-900">1.0.0</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-600">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">Feb 25, 2024</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-600">Database</p>
                  <p className="text-sm font-medium text-gray-900">MongoDB</p>
                </div>
                <div className="h-px bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <Badge className="mt-1">Healthy</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Help & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <button className="text-sm text-blue-600 hover:underline">Documentation</button>
                  </li>
                  <li>
                    <button className="text-sm text-blue-600 hover:underline">Report a Bug</button>
                  </li>
                  <li>
                    <button className="text-sm text-blue-600 hover:underline">Contact Support</button>
                  </li>
                  <li>
                    <button className="text-sm text-blue-600 hover:underline">API Reference</button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
