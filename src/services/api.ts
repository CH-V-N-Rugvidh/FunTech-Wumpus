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
  },

  createGame: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  startGame: async (gameId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/games/${gameId}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  endGame: async (gameId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/games/${gameId}/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  downloadGameData: async (gameId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/games/${gameId}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  getAllGames: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/games`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  downloadAllGameSessions: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/game-sessions/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  downloadGameLeaderboard: async (gameId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/games/${gameId}/leaderboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

  getPlayersByGame: async (gameId: string) => {
    const response = await fetch(`${API_BASE_URL}/players/game/${gameId}`);
    return response.json();
  },

  getCurrentGame: async () => {
    const response = await fetch(`${API_BASE_URL}/games/current`);
    return response.json();
  },

  joinWaitingRoom: async (playerName: string) => {
    const response = await fetch(`${API_BASE_URL}/waiting-room/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName })
    });
    return response.json();
  },

  leaveWaitingRoom: async (playerId: string) => {
    const response = await fetch(`${API_BASE_URL}/waiting-room/${playerId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  getWaitingRoomPlayers: async () => {
    const response = await fetch(`${API_BASE_URL}/waiting-room`);
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