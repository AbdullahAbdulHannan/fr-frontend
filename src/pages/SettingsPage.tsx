import React, { useState } from 'react';
import { User, Mail, Lock, Building2, Clock, Globe, Edit2, Save, X } from 'lucide-react';
import { Layout } from 'antd';
import Sidebar from '../components/Sidebar';
import HeaderBar from '../components/HeaderBar';

const { Content } = Layout;

interface SettingsData {
  userEmail: string;
  password: string;
  organizationName: string;
  subscription: string;
  timeOfDay: string;
  timezone: string;
}

function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    userEmail: 'admin@1423interests.com',
    password: '******',
    organizationName: 'Trinity Classical School of Houston',
    subscription: '',
    timeOfDay: '8:00 AM',
    timezone: 'GMT -5'
  });

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleEdit = (field: string, currentValue: string) => {
    setIsEditing(field);
    setTempValue(currentValue);
  };

  const handleSave = (field: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setIsEditing(null);
    setTempValue('');
  };

  const handleCancel = () => {
    setIsEditing(null);
    setTempValue('');
  };

  const SettingRow = ({ 
    label, 
    value, 
    field, 
    icon: Icon, 
    type = 'text',
    isPassword = false,
    options = undefined as string[] | undefined
  }: {
    label: string;
    value: string;
    field: string;
    icon: React.ElementType;
    type?: string;
    isPassword?: boolean;
    options?: string[];
  }) => {
    const isCurrentlyEditing = isEditing === field;

    return (
      <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700 min-w-[140px]">{label}</span>
        </div>
        
        <div className="flex items-center space-x-3 flex-1 justify-end">
          {isCurrentlyEditing ? (
            <div className="flex items-center space-x-2">
              {options ? (
                <select
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                  autoFocus
                />
              )}
              <button
                onClick={() => handleSave(field)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-gray-900 min-w-[200px] text-right">
                {isPassword && !showPasswordChange ? '••••••' : value || '—'}
              </span>
              <button
                onClick={() => handleEdit(field, value)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const timeOptions = [
    '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
  ];

  const timezoneOptions = [
    'GMT -12', 'GMT -11', 'GMT -10', 'GMT -9', 'GMT -8', 'GMT -7',
    'GMT -6', 'GMT -5', 'GMT -4', 'GMT -3', 'GMT -2', 'GMT -1',
    'GMT +0', 'GMT +1', 'GMT +2', 'GMT +3', 'GMT +4', 'GMT +5',
    'GMT +6', 'GMT +7', 'GMT +8', 'GMT +9', 'GMT +10', 'GMT +11', 'GMT +12'
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar selectedKey="settings" />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: "24px 16px 0", minHeight: 280 }}>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-4xl mx-auto px-4 py-12">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account and organization preferences</p>
              </div>

              {/* Settings Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Account Section */}
                <div className="border-b border-gray-200">
                  <div className="px-6 py-4 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Account Settings
                    </h2>
                  </div>
                  
                  <SettingRow
                    label="User Email"
                    value={settings.userEmail}
                    field="userEmail"
                    icon={Mail}
                    type="email"
                  />
                  
                  <div className="flex items-center justify-between py-4 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-700 min-w-[140px]">Password</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-900 min-w-[200px] text-right">••••••</span>
                      <button
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Password Change Form */}
                  {showPasswordChange && (
                    <div className="px-6 py-4 bg-blue-50 border-b border-gray-100">
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="New password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="flex space-x-2 pt-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Update Password
                          </button>
                          <button
                            onClick={() => setShowPasswordChange(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Organization Section */}
                <div className="border-b border-gray-200">
                  <div className="px-6 py-4 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      Organization Settings
                    </h2>
                  </div>
                  
                  <SettingRow
                    label="Organization Name"
                    value={settings.organizationName}
                    field="organizationName"
                    icon={Building2}
                  />
                  
                  <SettingRow
                    label="Subscription"
                    value={settings.subscription}
                    field="subscription"
                    icon={User}
                  />
                </div>

                {/* Preferences Section */}
                <div>
                  <div className="px-6 py-4 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Preferences
                    </h2>
                  </div>
                  
                  <SettingRow
                    label="Preferred Time"
                    value={settings.timeOfDay}
                    field="timeOfDay"
                    icon={Clock}
                    options={timeOptions}
                  />
                  
                  <SettingRow
                    label="Timezone"
                    value={settings.timezone}
                    field="timezone"
                    icon={Globe}
                    options={timezoneOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default SettingsPage;