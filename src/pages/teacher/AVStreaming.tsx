import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Plus,
  List,
  Calendar,
  Clock,
  Monitor,
  Users,
  Settings
} from 'lucide-react';

const AVStreaming: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentItem, setCurrentItem] = useState(0);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  // Mock data
  const playlists = [
    {
      id: '1',
      title: 'Math Week 3 - Fractions',
      description: 'Complete fraction operations unit',
      class: 'Math 101 - Period 1',
      scheduledFor: '2024-01-15 10:30 AM',
      duration: 45,
      itemCount: 4,
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Algebra Basics Review',
      description: 'Review session before test',
      class: 'Algebra II - Period 5',
      scheduledFor: '2024-01-15 1:15 PM',
      duration: 30,
      itemCount: 3,
      status: 'active',
    },
  ];

  const currentPlaylist = [
    {
      id: '1',
      title: 'Introduction to Fractions',
      type: 'video',
      duration: 12,
      source: 'Khan Academy',
      url: 'https://youtube.com/watch?v=example1',
    },
    {
      id: '2',
      title: 'Adding Fractions with Same Denominator',
      type: 'interactive',
      duration: 15,
      source: 'IXL',
      url: 'https://ixl.com/fractions-add',
    },
    {
      id: '3',
      title: 'Practice Problems',
      type: 'assessment',
      duration: 10,
      source: 'Custom',
      url: '/custom/fraction-practice',
    },
    {
      id: '4',
      title: 'Fraction Games',
      type: 'game',
      duration: 8,
      source: 'Desmos',
      url: 'https://desmos.com/fraction-games',
    },
  ];

  const connectedClasses = [
    { id: '1', name: 'Math 101 - Period 1', room: 'Room 204', students: 28, status: 'connected' },
    { id: '2', name: 'Math 101 - Period 3', room: 'Room 204', students: 25, status: 'disconnected' },
    { id: '3', name: 'Algebra II - Period 5', room: 'Room 206', students: 24, status: 'connected' },
  ];

  const CreatePlaylistModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-white max-h-[80vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Create AV Playlist</h3>
            <button
              onClick={() => setShowCreatePlaylist(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="space-y-6">
            {/* Playlist Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Playlist Information</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Playlist Title</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Math Week 4 - Decimals"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Class</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select a class</option>
                      <option value="1">Math 101 - Period 1</option>
                      <option value="2">Math 101 - Period 3</option>
                      <option value="3">Algebra II - Period 5</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of the playlist content"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration (min)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="45"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-900">Playlist Content</h4>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Add Content Item
                </button>
              </div>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Introduction Video"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="video">Video</option>
                        <option value="interactive">Interactive</option>
                        <option value="assessment">Assessment</option>
                        <option value="game">Game/Activity</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="youtube">YouTube</option>
                        <option value="khan">Khan Academy</option>
                        <option value="ixl">IXL</option>
                        <option value="desmos">Desmos</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content URL</label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowCreatePlaylist(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Create Playlist
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">AV Streaming Control</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and stream educational content to your classrooms in real-time.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowCreatePlaylist(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Streaming Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Content Display */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Now Playing</h3>
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Room 204</span>
              </div>
            </div>
            
            {/* Content Preview */}
            <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">{currentPlaylist[currentItem]?.title}</p>
                <p className="text-sm text-gray-500">{currentPlaylist[currentItem]?.source}</p>
              </div>
            </div>

            {/* Media Controls */}
            <div className="flex items-center justify-center space-x-6 mb-4">
              <button 
                onClick={() => setCurrentItem(Math.max(0, currentItem - 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors theme-transition"
                disabled={currentItem === 0}
              >
                <SkipBack className="w-6 h-6 text-gray-600" />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors theme-transition"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white" />
                )}
              </button>
              
              <button 
                onClick={() => setCurrentItem(Math.min(currentPlaylist.length - 1, currentItem + 1))}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors theme-transition"
                disabled={currentItem === currentPlaylist.length - 1}
              >
                <SkipForward className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <button onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <span className="text-sm text-gray-500 w-8">{isMuted ? 0 : volume}</span>
            </div>
          </div>

          {/* Current Playlist */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Current Playlist</h3>
              <div className="flex items-center space-x-2">
                <List className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{currentPlaylist.length} items</span>
              </div>
            </div>
            
            <div className="space-y-2">
              {currentPlaylist.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors theme-transition ${
                    index === currentItem 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentItem(index)}
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === currentItem ? 'bg-blue-600' : 'bg-gray-200'
                    }`}>
                      <span className={`text-sm font-medium ${
                        index === currentItem ? 'text-white' : 'text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">
                      {item.source} • {item.duration} min • {item.type}
                    </div>
                  </div>
                  {index === currentItem && isPlaying && (
                    <div className="flex-shrink-0">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connected Classes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Classes</h3>
            <div className="space-y-3">
              {connectedClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                    <div className="text-xs text-gray-500">{cls.room} • {cls.students} students</div>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      cls.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className={`text-xs font-medium ${
                      cls.status === 'connected' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {cls.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Playlists */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scheduled Playlists</h3>
            <div className="space-y-3">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-900">{playlist.title}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      playlist.status === 'active' ? 'bg-green-100 text-green-800' :
                      playlist.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {playlist.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{playlist.class}</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="mr-3">{playlist.scheduledFor}</span>
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{playlist.duration} min</span>
                  </div>
                  {playlist.status === 'scheduled' && (
                    <button className="mt-2 w-full px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100">
                      Start Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCreatePlaylist && <CreatePlaylistModal />}
    </div>
  );
};

export default AVStreaming;