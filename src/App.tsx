import React, { useState } from 'react';
import GamePage from './pages/GamePage';
import DashboardPage from './pages/DashboardPage';
import { Monitor, Gamepad2 } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'game' | 'dashboard'>('game');

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentView('game')}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2 ${
                currentView === 'game'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Game</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2 ${
                currentView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'game' ? <GamePage /> : <DashboardPage />}
    </div>
  );
}

export default App;