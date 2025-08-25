import React, { useState } from 'react';
import { Shield, Upload, LogOut, Users, Database } from 'lucide-react';
import { adminApi } from '../services/api';
import { parseCSVQuestions, expectedCSVFormat } from '../utils/csvParser';
import { Admin } from '../types';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);

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

  // Check for existing token on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      // You might want to verify the token here
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-700 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gray-700 p-4">
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
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-white/80 hover:text-white bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
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
    </div>
  );
}