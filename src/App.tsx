import React, { useState } from 'react';
import GamePage from './pages/GamePage';
import DashboardPage from './pages/DashboardPage';
import { Monitor, Gamepad2, Upload } from 'lucide-react';
import CSVUploader from './components/CSVUploader';

function App() {
  const [currentView, setCurrentView] = useState<'game' | 'dashboard'>('game');
  const [showCSVUploader, setShowCSVUploader] = useState(false);

  return (
    <div className="min-h-screen animated-gradient">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-50">
        <div className="glass rounded-xl p-3 shadow-2xl">
          <div className="flex space-x-2 flex-wrap">
            <button
              onClick={() => setCurrentView('game')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 btn-glow ${
                currentView === 'game'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Game</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 btn-glow ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setShowCSVUploader(true)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-white hover:bg-white/20 btn-glow"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'game' ? <GamePage /> : <DashboardPage />}
      
      {/* CSV Uploader Modal */}
      {showCSVUploader && (
        <CSVUploader onClose={() => setShowCSVUploader(false)} />
      )}
    </div>
  );
}

export default App;