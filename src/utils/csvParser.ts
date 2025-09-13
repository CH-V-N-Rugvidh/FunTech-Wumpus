import { Question, CSVQuestion } from '../types';
import { CSVStudent } from '../types';

export function parseCSVQuestions(csvContent: string): Question[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const questions: Question[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    
    const options = [
      row.option1 || row['option 1'],
      row.option2 || row['option 2'], 
      row.option3 || row['option 3'],
      row.option4 || row['option 4']
    ].filter(Boolean);
    
    if (options.length < 2) continue;
    
    const correctAnswer = row.correct_answer || row['correct answer'];
    const correctIndex = options.findIndex(option => 
      option.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
    );
    
    if (correctIndex === -1) continue;
    
    questions.push({
      id: i,
      question: row.question || '',
      options,
      correctAnswer: correctIndex,
      category: (row.category || 'general-tech').toLowerCase().includes('emerging') ? 'emerging-tech' : 'general-tech',
      difficulty: ['easy', 'medium', 'hard'].includes(row.difficulty?.toLowerCase()) ? row.difficulty.toLowerCase() : 'medium',
      explanation: row.explanation || ''
    });
  }
  
  return questions;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

export function parseCSVStudents(csvContent: string): CSVStudent[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const students: CSVStudent[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() || '';
    });
    
    // Required fields
    if (!row.username || !row.password || !row.full_name) continue;
    
    students.push({
      username: row.username,
      password: row.password,
      full_name: row.full_name || row['full name'],
      email: row.email,
      student_id: row.student_id || row['student id'] || row['student_id']
    });
  }
  
  return students;
}

// Expected CSV format:
export const expectedCSVFormat = `
Expected CSV columns (case-insensitive):
- question: The question text
- option1: First answer option
- option2: Second answer option  
- option3: Third answer option
- option4: Fourth answer option
- correct_answer: The exact text of the correct option (must match one of option1-4)
- category: "emerging-tech" or "general-tech" (optional, defaults to general-tech)
- difficulty: "easy", "medium", or "hard" (optional, defaults to medium)
- explanation: Optional explanation for the answer

Example CSV:
question,option1,option2,option3,option4,correct_answer,category,difficulty,explanation
"What does AI stand for?","Artificial Intelligence","Automated Intelligence","Advanced Intelligence","Augmented Intelligence","Artificial Intelligence","emerging-tech","easy","AI stands for Artificial Intelligence"
`;

// Expected CSV format for students:
export const expectedStudentCSVFormat = `
Expected CSV columns for students (case-insensitive):
- username: Student's login username (required)
- password: Student's login password (required)
- full_name: Student's full name (required)
- email: Student's email address (optional)
- student_id: Student ID number (optional)

Example CSV:
username,password,full_name,email,student_id
"john_doe","password123","John Doe","john.doe@university.edu","ST001"
"jane_smith","mypassword","Jane Smith","jane.smith@university.edu","ST002"
`;