import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Database, 
  Globe, 
  Bell, 
  Users,
  Activity,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    schoolName: 'Lincoln Elementary School',
    adminEmail: 'admin@lincoln.edu',
    timezone: 'America/New_York',
    academicYear: '2024-2025',
    allowBulkUpload: true,
    requireEmailVerification: true,
    enableProgressReports: true,
    enableParentPortal: false,
    enableAVStreaming: true,
    maxStudentsPerClass: 30,
    sessionTimeout: 60,
    backupFrequency: 'daily',
    dataRetention: 365,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleInputChange = (key: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                  <input
                    type="text"
                    value={settings.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                  <input
                    type="text"
                    value={settings.academicYear}
                    onChange={(e) => handleInputChange('academicYear', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Limits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Students per Class</label>
                  <input
                    type="number"
                    value={settings.maxStudentsPerClass}
                    onChange={(e) => handleInputChange('maxStudentsPerClass', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Feature Toggles</h3>
              <div className="space-y-4">
                {[
                  { key: 'allowBulkUpload', label: 'Allow Bulk User Upload', description: 'Enable CSV/Excel bulk upload functionality' },
                  { key: 'requireEmailVerification', label: 'Require Email Verification', description: 'New users must verify their email before accessing the system' },
                  { key: 'enableProgressReports', label: 'Enable Progress Reports', description: 'Generate and distribute student progress reports' },
                  { key: 'enableParentPortal', label: 'Enable Parent Portal', description: 'Allow parents to view their children\'s progress' },
                  { key: 'enableAVStreaming', label: 'Enable AV Streaming', description: 'Allow teachers to stream content to classrooms' },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{feature.label}</h4>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feature.description}</p>
                    </div>
                    <button
                      onClick={() => handleToggle(feature.key)}
                      className="ml-4 flex-shrink-0"
                    >
                      {settings[feature.key as keyof typeof settings] ? (
                        <ToggleRight className="h-6 w-6 text-blue-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Authentication Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Minimum 8 characters</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Require uppercase and lowercase letters</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Require at least one number</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Require special characters</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Two-Factor Authentication</label>
                  <select className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="optional">Optional</option>
                    <option value="required">Required for all users</option>
                    <option value="admin_only">Required for admins only</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention Period (days)</label>
                  <input
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleInputChange('dataRetention', parseInt(e.target.value))}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">How long to keep inactive user data</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cookie Policy</label>
                  <select className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="essential">Essential cookies only</option>
                    <option value="functional">Essential + Functional</option>
                    <option value="all">All cookies (including analytics)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">External Integrations</h3>
              <div className="space-y-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Google Workspace</h4>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Connected
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Sync users and classes with Google Classroom</p>
                  <div className="flex space-x-2">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Configure</button>
                    <button className="text-sm text-red-600 hover:text-red-700 font-medium">Disconnect</button>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Microsoft Teams</h4>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Not Connected
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Enable single sign-on and class synchronization</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Connect</button>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">Student Information System</h4>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Not Connected
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Import student data from your SIS</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Configure</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Backup Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Retention</label>
                  <select className="w-full md:w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Backups</h3>
              <div className="space-y-3">
                {[
                  { date: '2024-01-15 02:00 AM', size: '2.4 GB', status: 'Success' },
                  { date: '2024-01-14 02:00 AM', size: '2.3 GB', status: 'Success' },
                  { date: '2024-01-13 02:00 AM', size: '2.3 GB', status: 'Success' },
                  { date: '2024-01-12 02:00 AM', size: '2.2 GB', status: 'Failed' },
                ].map((backup, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{backup.date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{backup.size}</div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      backup.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {backup.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Create Backup Now
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure system-wide settings, security policies, and integrations.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', name: 'General', icon: Settings },
            { id: 'features', name: 'Features', icon: Activity },
            { id: 'security', name: 'Security', icon: Shield },
            { id: 'integrations', name: 'Integrations', icon: Globe },
            { id: 'backup', name: 'Backup', icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:border-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SystemSettings;