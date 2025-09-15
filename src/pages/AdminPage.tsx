import React, { useState } from 'react';
import { Shield, Upload, LogOut, Users, Database, Play, Square, Download, Clock, History, FileDown, GraduationCap, UserPlus, AlertCircle } from 'lucide-react';
import { adminApi } from '../services/api';
import { parseCSVQuestions, expectedCSVFormat } from '../utils/csvParser';
import { Admin } from '../types';
import StudentCSVUploader from '../components/StudentCSVUploader';
import Footer from '../components/Footer';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [waitingPlayers, setWaitingPlayers] = useState<any[]>([]);
  const [gameTimeLeft, setGameTimeLeft] = useState<number>(0);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [showGameHistory, setShowGameHistory] = useState(false);
  const [showStudentUploader, setShowStudentUploader] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [showStudentList, setShowStudentList] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const result = await adminApi.login(loginForm.username, loginForm.password);
      if (result.error) {
        setLoginError(result.error);
      } else {
        localStorage.setItem('admin-token', result.token);
        setAdmin(result.admin);
        setIsLoggedIn(true);
      }
    } catch (error) {
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setIsLoggedIn(false);
    setAdmin(null);
    setLoginForm({ username: '', password: '' });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus('error');
      setUploadMessage('Please upload a CSV file.');
      return;
    }

    setUploadStatus('processing');
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const csvContent = e.target?.result as string;
        const questions = parseCSVQuestions(csvContent);
        
        if (questions.length === 0) {
          setUploadStatus('error');
          setUploadMessage('No valid questions found in the CSV file.');
          return;
        }

        const token = localStorage.getItem('admin-token');
        if (!token) {
          setUploadStatus('error');
          setUploadMessage('Authentication token not found. Please login again.');
          return;
        }

        const result = await adminApi.uploadQuestions(questions, token);
        if (result.error) {
          setUploadStatus('error');
          setUploadMessage(result.error);
        } else {
          setUploadStatus('success');
          setUploadMessage(`Successfully uploaded ${questions.length} questions to the database.`);
        }
      } catch (error) {
        setUploadStatus('error');
        setUploadMessage('Error processing CSV file. Please check the format.');
      }
    };
    
    reader.readAsText(file);
  };

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const studentList = await adminApi.getAllStudents(token!);
      setStudents(studentList);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Check for existing token on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      setIsLoggedIn(true);
      loadGameStatus();
      loadWaitingPlayers();
      loadAllGames();
      loadStudents();
    }
  }, []);

  // Load current game status and waiting players
  const loadGameStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/games/current');
      const { game } = await response.json();
      setCurrentGame(game);
      
      if (game && game.status === 'active') {
        const startTime = new Date(game.started_at).getTime();
        const duration = game.duration_minutes * 60 * 1000;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        setGameTimeLeft(Math.floor(remaining / 1000));
      }
    } catch (error) {
      console.error('Error loading game status:', error);
    }
  };

  const loadWaitingPlayers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/waiting-room');
      const players = await response.json();
      setWaitingPlayers(players);
    } catch (error) {
      console.error('Error loading waiting players:', error);
      setWaitingPlayers([]);
    }
  };

  const loadAllGames = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const games = await adminApi.getAllGames(token!);
      setAllGames(games);
    } catch (error) {
      console.error('Error loading all games:', error);
    }
  };

  // Set up real-time updates
  React.useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        loadGameStatus();
        loadWaitingPlayers();
        loadAllGames();
        loadStudents();
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Game timer
  React.useEffect(() => {
    if (gameTimeLeft > 0) {
      const timer = setTimeout(() => {
        setGameTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameTimeLeft]);

  const handleCreateGame = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      await adminApi.createGame(token!);
      loadGameStatus();
      loadAllGames();
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handleStartGame = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      await adminApi.startGame(currentGame.id, token!);
      loadGameStatus();
      loadWaitingPlayers();
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const handleEndGame = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      await adminApi.endGame(currentGame.id, token!);
      loadGameStatus();
      loadAllGames();
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  const handleDownloadData = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const data = await adminApi.downloadGameData(currentGame.id, token!);
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `game-data-${currentGame.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading data:', error);
    }
  };

  const handleDownloadAllSessions = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const data = await adminApi.downloadAllGameSessions(token!);
      
      // Convert to CSV
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all-game-sessions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading all sessions:', error);
    }
  };

  const handleDownloadGameLeaderboard = async (gameId: string) => {
    try {
      const token = localStorage.getItem('admin-token');
      const data = await adminApi.downloadGameLeaderboard(gameId, token!);
      
      // Convert to CSV
      const csvContent = convertToCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `game-${gameId.slice(-8)}-leaderboard.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading leaderboard:', error);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-dark rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4 pulse-glow" />
            <h1 className="text-3xl font-bold text-white mb-2 gradient-text">Admin Portal</h1>
            <p className="text-white/80">FunTech Wumpus Administration</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-400/20 border border-red-400/50 rounded-xl p-3 text-red-300 text-sm">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 btn-glow"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="glass-dark border-b border-white/10 p-6 mb-8 rounded-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Shield className="w-10 h-10 text-blue-400 pulse-glow" />
            <div>
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-blue-200">Welcome, {admin?.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowGameHistory(!showGameHistory)}
              className="flex items-center space-x-2 text-white/80 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-lg transition-all duration-300"
            >
              <History className="w-4 h-4" />
              <span>Game History</span>
            </button>
            <button
              onClick={() => setShowStudentList(!showStudentList)}
              className="flex items-center space-x-2 text-white/80 hover:text-white bg-green-500/20 hover:bg-green-500/30 px-4 py-2 rounded-lg transition-all duration-300"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Students ({students.length})</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/80 hover:text-white bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Student Management Section */}
        {showStudentList && (
          <div className="glass-dark rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <GraduationCap className="w-8 h-8 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Student Management</h2>
              </div>
              <button
                onClick={() => setShowStudentUploader(true)}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Upload Students CSV</span>
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {students.length > 0 ? (
                students.map((student) => (
                  <div key={student.id} className="glass rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-semibold">{student.full_name}</span>
                          <span className="text-blue-400 text-sm">@{student.username}</span>
                          {student.student_id && (
                            <span className="text-white/70 text-sm">ID: {student.student_id}</span>
                          )}
                        </div>
                        {student.email && (
                          <p className="text-white/60 text-sm mt-1">{student.email}</p>
                        )}
                        <p className="text-white/60 text-sm">
                          Created: {new Date(student.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70">No students found. Upload a CSV file to add students.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game History Section */}
        {showGameHistory && (
          <div className="glass-dark rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <History className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Game History</h2>
              </div>
              <button
                onClick={handleDownloadAllSessions}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow flex items-center space-x-2"
              >
                <FileDown className="w-4 h-4" />
                <span>Download All Sessions CSV</span>
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {allGames.map((game) => (
                <div key={game.id} className="glass rounded-xl p-4 border border-white/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-white font-semibold">Game {game.id.slice(-8)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          game.status === 'active' ? 'bg-green-400/20 text-green-300' :
                          game.status === 'waiting' ? 'bg-yellow-400/20 text-yellow-300' :
                          'bg-gray-400/20 text-gray-300'
                        }`}>
                          {game.status}
                        </span>
                        <span className="text-white/70 text-sm">{game.player_count} players</span>
                      </div>
                      <p className="text-white/60 text-sm mt-1">
                        Created: {new Date(game.created_at).toLocaleString()}
                      </p>
                    </div>
                    <button disabled={true}
                      onClick={() => handleDownloadGameLeaderboard(game.id)}
                      className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 btn-glow flex items-center space-x-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Control Section */}
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Play className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Game Control</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game Status */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Current Game Status</h3>
              {currentGame ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Status:</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                      currentGame.status === 'active' ? 'bg-green-400/20 text-green-300' :
                      currentGame.status === 'waiting' ? 'bg-yellow-400/20 text-yellow-300' :
                      'bg-red-400/20 text-red-300'
                    }`}>
                      {currentGame.status.charAt(0).toUpperCase() + currentGame.status.slice(1)}
                    </span>
                  </div>
                  {currentGame.status === 'active' && gameTimeLeft > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Time Left:</span>
                      <span className="font-mono text-blue-400 text-lg">{formatTime(gameTimeLeft)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Game ID:</span>
                    <span className="text-white/90 font-mono text-sm">{currentGame.id.slice(-8)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-white/70">No active game</p>
              )}
            </div>

            {/* Waiting Players */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Waiting Players ({waitingPlayers.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {waitingPlayers.length > 0 ? (
                  waitingPlayers.map((player) => (
                    <div key={player.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-white text-sm">{player.player_name}</span>
                      <span className="text-white/60 text-xs">
                        {new Date(player.joined_at).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/70 text-sm">No players waiting</p>
                )}
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            {!currentGame && (
              <button
                onClick={handleCreateGame}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Create New Game</span>
              </button>
            )}
            
            {currentGame?.status === 'waiting' && waitingPlayers.length > 0 && (
              <button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Start Game</span>
              </button>
            )}
            
            {currentGame?.status === 'active' && (
              <button
                onClick={handleEndGame}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow flex items-center space-x-2"
              >
                <Square className="w-5 h-5" />
                <span>End Game</span>
              </button>
            )}
            
            {currentGame && (
              <button
                onClick={handleDownloadData}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div className="glass-dark rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Upload className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Upload Questions</h2>
          </div>

          {uploadStatus === 'idle' && (
            <>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-400 bg-blue-400/10'
                    : 'border-white/30 hover:border-white/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Database className="w-16 h-16 text-white/70 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <p className="text-white/70 text-sm mb-4">
                  Questions will be uploaded to the database
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:shadow-lg transition-all duration-300 btn-glow"
                >
                  Choose CSV File
                </label>
              </div>

              <div className="mt-8 glass rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">CSV Format Requirements</h3>
                <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono bg-black/20 p-4 rounded-lg overflow-x-auto">
                  {expectedCSVFormat}
                </pre>
              </div>
            </>
          )}

          {uploadStatus === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white text-lg">Uploading questions to database...</p>
            </div>
          )}

          {(uploadStatus === 'success' || uploadStatus === 'error') && (
            <div className="text-center py-12">
              <div className={`w-16 h-16 mx-auto mb-4 ${uploadStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {uploadStatus === 'success' ? (
                  <Database className="w-full h-full" />
                ) : (
                  <Users className="w-full h-full" />
                )}
              </div>
              <p className={`text-lg mb-4 ${uploadStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {uploadStatus === 'success' ? 'Upload Successful!' : 'Upload Failed'}
              </p>
              <p className="text-white/70 mb-6">{uploadMessage}</p>
              <button
                onClick={() => {
                  setUploadStatus('idle');
                  setUploadMessage('');
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow"
              >
                Upload Another File
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Student CSV Uploader Modal */}
      {showStudentUploader && (
        <StudentCSVUploader
          onClose={() => setShowStudentUploader(false)}
          onSuccess={loadStudents}
        />
      )}
    </div>
  );
}