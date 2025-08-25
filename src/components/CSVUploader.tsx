import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseCSVQuestions, expectedCSVFormat } from '../utils/csvParser';
import { Question } from '../types';

interface CSVUploaderProps {
  onClose: () => void;
}

export default function CSVUploader({ onClose }: CSVUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus('error');
      setErrorMessage('Please upload a CSV file.');
      return;
    }

    setUploadStatus('processing');
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const questions = parseCSVQuestions(csvContent);
        
        if (questions.length === 0) {
          setUploadStatus('error');
          setErrorMessage('No valid questions found in the CSV file. Please check the format.');
          return;
        }

        setParsedQuestions(questions);
        setUploadStatus('success');
        
        // Save to localStorage for the game to use
        localStorage.setItem('custom-questions', JSON.stringify(questions));
        
      } catch (error) {
        setUploadStatus('error');
        setErrorMessage('Error parsing CSV file. Please check the format.');
      }
    };
    
    reader.onerror = () => {
      setUploadStatus('error');
      setErrorMessage('Error reading file.');
    };
    
    reader.readAsText(file);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-dark rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Upload Custom Questions</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
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
              <Upload className="w-16 h-16 text-white/70 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">
                Drag and drop your CSV file here, or click to browse
              </p>
              <p className="text-white/70 text-sm mb-4">
                Only CSV files are supported
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
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:shadow-lg transition-all duration-300 btn-glow"
              >
                Choose File
              </label>
            </div>

            <div className="mt-8 glass rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">CSV Format Requirements</h3>
              </div>
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono bg-black/20 p-4 rounded-lg overflow-x-auto">
                {expectedCSVFormat}
              </pre>
            </div>
          </>
        )}

        {uploadStatus === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">Processing CSV file...</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-lg mb-4">Upload Failed</p>
            <p className="text-white/70 mb-6">{errorMessage}</p>
            <button
              onClick={() => {
                setUploadStatus('idle');
                setErrorMessage('');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow"
            >
              Try Again
            </button>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 text-lg mb-2">Upload Successful!</p>
            <p className="text-white/70 mb-6">
              {parsedQuestions.length} questions loaded successfully
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => {
                  setUploadStatus('idle');
                  setParsedQuestions([]);
                }}
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-all duration-300"
              >
                Upload Another
              </button>
              <button
                onClick={onClose}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 btn-glow"
              >
                Start Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}