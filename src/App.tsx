import React, { useState } from 'react';
import GamePage from './pages/GamePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { Monitor, Gamepad2, Shield } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'game' | 'dashboard' | 'admin'>('game');

  // Check if accessing admin route
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentView('admin');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-700">
      {currentView === 'admin' ? (
        <AdminPage />
      ) : (
        <>
          {/* Navigation */}
          <div className="fixed top-4 right-4 z-40">
            <div className="glass rounded-xl p-2 sm:p-3 shadow-2xl">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setCurrentView('game')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 btn-glow text-sm sm:text-base ${
                currentView === 'game'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
                  <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Game</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 btn-glow text-sm sm:text-base ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
                  <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </div>

          {/* Main Content */}
          {currentView === 'game' ? <GamePage /> : <DashboardPage />}
        </>
      )}
    </div>
  );
}

export default App;