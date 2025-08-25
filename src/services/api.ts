const API_BASE_URL = 'http://localhost:3001/api';

// Admin API
export const adminApi = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },

  uploadQuestions: async (questions: any[], token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ questions })
    });
    return response.json();
  }
};

// Game API
export const gameApi = {
  getQuestions: async () => {
    const response = await fetch(`${API_BASE_URL}/questions`);
    return response.json();
  },

  savePlayer: async (player: any) => {
    const response = await fetch(`${API_BASE_URL}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player)
    });
    return response.json();
  },

  getPlayer: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/players/${id}`);
    return response.json();
  },

  getAllPlayers: async () => {
    const response = await fetch(`${API_BASE_URL}/players`);
    return response.json();
  },

  saveGameSession: async (session: any) => {
    const response = await fetch(`${API_BASE_URL}/game-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    return response.json();
  },

  getGameSession: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/game-sessions/${id}`);
    return response.json();
  },

  saveQuestionAttempt: async (attempt: any) => {
    const response = await fetch(`${API_BASE_URL}/question-attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attempt)
    });
    return response.json();
  }
};