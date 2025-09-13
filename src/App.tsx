import React, { useState } from 'react';
import GamePage from './pages/GamePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import StudentLogin from './components/StudentLogin';
import Footer from './components/Footer';
import { Monitor, Gamepad2, Shield } from 'lucide-react';
import { Student } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'game' | 'dashboard' | 'admin'>('game');
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [studentToken, setStudentToken] = useState<string | null>(null);

  // Check if accessing admin route
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentView('admin');
    }
    
    // Check for existing student token
    const token = localStorage.getItem('student-token');
    const studentData = localStorage.getItem('student-data');
    if (token && studentData) {
      try {
        const student = JSON.parse(studentData);
        setCurrentStudent(student);
        setStudentToken(token);
        setIsStudentLoggedIn(true);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('student-token');
        localStorage.removeItem('student-data');
      }
    }
  }, []);

  const handleStudentLogin = (student: Student, token: string) => {
    setCurrentStudent(student);
    setStudentToken(token);
    setIsStudentLoggedIn(true);
    localStorage.setItem('student-token', token);
    localStorage.setItem('student-data', JSON.stringify(student));
  };

  const handleStudentLogout = () => {
    setCurrentStudent(null);
    setStudentToken(null);
    setIsStudentLoggedIn(false);
    localStorage.removeItem('student-token');
    localStorage.removeItem('student-data');
  };

  // Show student login if not logged in and not accessing admin
  if (!isStudentLoggedIn && currentView !== 'admin') {
    return <StudentLogin onLogin={handleStudentLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {currentView === 'admin' ? (
        <>
          <AdminPage />
          <Footer />
        </>
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
          {currentView === 'game' ? (
            <GamePage 
              student={currentStudent!} 
              studentToken={studentToken!} 
              onLogout={handleStudentLogout} 
            />
          ) : (
            <DashboardPage />
          )}
          
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;