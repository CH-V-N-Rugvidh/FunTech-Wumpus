import React, { useState } from 'react';
import { User, Lock, LogIn, GraduationCap, Sparkles } from 'lucide-react';
import { studentApi } from '../services/api';
import { Student } from '../types';
import Footer from './Footer';

interface StudentLoginProps {
  onLogin: (student: Student, token: string) => void;
}

export default function StudentLogin({ onLogin }: StudentLoginProps) {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      const result = await studentApi.login(loginForm.username, loginForm.password);
      if (result.error) {
        setLoginError(result.error);
      } else {
        onLogin(result.student, result.token);
      }
    } catch (error) {
      setLoginError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="glass-dark rounded-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="relative">
              <GraduationCap className="w-16 h-16 text-blue-400 mx-auto mb-4 pulse-glow" />
              <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 gradient-text">Student Login</h1>
            <p className="text-white/80">FunTech Wumpus Quiz Game</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {loginError && (
              <div className="bg-red-400/20 border border-red-400/50 rounded-xl p-3 text-red-300 text-sm">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 btn-glow flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account? Contact your administrator.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}