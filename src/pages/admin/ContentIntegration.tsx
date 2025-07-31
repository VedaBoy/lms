import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Search,
  Youtube,
  ExternalLink,
  Settings,
  Link,
  Video,
  Layers,
  Edit3,
  Trash2
} from 'lucide-react';

const ContentIntegration: React.FC = () => {
  const [showAddIntegration, setShowAddIntegration] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const contentIntegrations = [
    {
      id: '1',
      concept: 'Integer Operations',
      provider: 'youtube',
      title: 'Introduction to Integers',
      url: 'https://youtube.com/watch?v=example1',
      fallbackUrl: 'https://khanacademy.org/integers',
      duration: 15,
      status: 'active',
    },
    {
      id: '2',
      concept: 'Fraction Addition',
      provider: 'lti',
      title: 'Interactive Fraction Builder',
      url: 'https://ixl.com/lti/launch',
      ltiSettings: {
        consumerKey: 'school_key_123',
        launchUrl: 'https://ixl.com/lti/launch/fractions'
      },
      status: 'active',
    },
    {
      id: '3',
      concept: 'Geometry Basics',
      provider: 'vimeo',
      title: 'Understanding Shapes',
      url: 'https://vimeo.com/example',
      duration: 12,
      status: 'draft',
    },
  ];

  const providerSettings = [
    {
      id: '1',
      name: 'Khan Academy',
      type: 'REST API',
      status: 'connected',
      apiKey: 'ka_***_ending',
      baseUrl: 'https://api.khanacademy.org',
    },
    {
      id: '2',
      name: 'IXL Learning',
      type: 'LTI 1.3',
      status: 'connected',
      consumerKey: 'school_key_123',
      sharedSecret: '***hidden***',
    },
    {
      id: '3',
      name: 'Desmos',
      type: 'LTI 1.3',
      status: 'pending',
      consumerKey: 'pending_setup',
      sharedSecret: 'pending_setup',
    },
  ];

  const AddIntegrationForm = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-white/20 w-11/12 md:w-3/4 lg:w-2/3 backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-lg max-h-[80vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Content Integration</h3>
            <button
              onClick={() => setShowAddIntegration(false)}
              className="btn-glass btn-glass-secondary text-gray-400 hover:text-gray-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="space-y-6">
            {/* Concept Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Concept</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Choose a concept to add content for</option>
                <option value="1">Integer Operations</option>
                <option value="2">Fraction Addition</option>
                <option value="3">Geometry Basics</option>
                <option value="4">Algebraic Expressions</option>
              </select>
            </div>

            {/* Content Provider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content Provider</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="relative">
                  <input type="radio" name="provider" value="youtube" className="sr-only" />
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50">
                    <div className="flex items-center justify-center">
                      <Youtube className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-2 text-center">YouTube</p>
                  </div>
                </label>
                <label className="relative">
                  <input type="radio" name="provider" value="vimeo" className="sr-only" />
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50">
                    <div className="flex items-center justify-center">
                      <Video className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-2 text-center">Vimeo</p>
                  </div>
                </label>
                <label className="relative">
                  <input type="radio" name="provider" value="lti" className="sr-only" />
                  <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50">
                    <div className="flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-2 text-center">LTI 1.3</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Content Details */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Content Details</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Introduction to Fractions"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="15"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fallback URL (Optional)</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://khanacademy.org/alternative-content"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the content and learning objectives"
                  />
                </div>
              </div>
            </div>

            {/* LTI Configuration (shown when LTI is selected) */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">LTI 1.3 Configuration</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consumer Key</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="school_consumer_key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shared Secret</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="shared_secret_key"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Launch URL</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://provider.com/lti/launch"
                  />
                </div>
              </div>
            </div>

            {/* Provider Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider Preferences</label>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Set the priority order for this concept</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Primary Provider</label>
                    <select className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-1 focus:ring-blue-500">
                      <option value="current">This Integration</option>
                      <option value="youtube">YouTube</option>
                      <option value="khanacademy">Khan Academy</option>
                      <option value="ixl">IXL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Secondary Provider</label>
                    <select className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-1 focus:ring-blue-500">
                      <option value="khanacademy">Khan Academy</option>
                      <option value="youtube">YouTube</option>
                      <option value="ixl">IXL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tertiary Provider</label>
                    <select className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-1 focus:ring-blue-500">
                      <option value="fallback">Fallback URL</option>
                      <option value="custom">Custom Content</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowAddIntegration(false)}
                className="btn-glass btn-glass-secondary px-4 py-2 text-sm font-medium text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-glass btn-glass-primary px-4 py-2 text-sm font-medium text-white rounded-lg"
              >
                Add Integration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Concept
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                  {contentIntegrations.map((integration) => (
                    <tr key={integration.id} className="hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {integration.provider === 'youtube' && (
                              <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <Youtube className="h-6 w-6 text-red-600" />
                              </div>
                            )}
                            {integration.provider === 'vimeo' && (
                              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Video className="h-6 w-6 text-blue-600" />
                              </div>
                            )}
                            {integration.provider === 'lti' && (
                              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <ExternalLink className="h-6 w-6 text-green-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{integration.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Link className="w-3 h-3 mr-1" />
                              <span className="truncate max-w-xs">{integration.url}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {integration.concept}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          integration.provider === 'youtube' ? 'bg-red-100 text-red-800' :
                          integration.provider === 'vimeo' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {integration.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {integration.duration ? `${integration.duration} min` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          integration.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {integration.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="btn-glass btn-glass-primary text-blue-600 hover:text-blue-900 p-2 rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="btn-glass btn-glass-danger text-red-600 hover:text-red-900 p-2 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'providers':
        return (
          <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg border border-gray-200/50 dark:border-white/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Configuration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
                  {providerSettings.map((provider) => (
                    <tr key={provider.id} className="hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{provider.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          provider.type === 'LTI 1.3' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {provider.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {provider.type === 'LTI 1.3' ? (
                          <div>
                            <div>Key: {provider.consumerKey}</div>
                            <div>Secret: {provider.sharedSecret}</div>
                          </div>
                        ) : (
                          <div>
                            <div>API Key: {provider.apiKey}</div>
                            <div>URL: {provider.baseUrl}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          provider.status === 'connected' ? 'bg-green-100 text-green-800' :
                          provider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {provider.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="btn-glass btn-glass-secondary text-blue-600 hover:text-blue-900 p-2 rounded">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button className="btn-glass btn-glass-success text-green-600 hover:text-green-900 px-3 py-1 rounded text-sm">
                            Test
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 theme-transition">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Integration</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage content integrations with external providers like YouTube, Vimeo, and LTI 1.3 tools.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddIntegration(true)}
            className="btn-glass btn-glass-primary inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'content', name: 'Content Integrations', icon: Play },
            { id: 'providers', name: 'Provider Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn-glass flex items-center py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'btn-glass-primary text-blue-600'
                  : 'btn-glass-secondary text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'content' ? 'integrations' : 'providers'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-8">
        {renderTabContent()}
      </div>

      {showAddIntegration && <AddIntegrationForm />}
    </div>
  );
};

export default ContentIntegration;