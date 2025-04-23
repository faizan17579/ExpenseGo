import { getToken } from '../utils/auth';
import { hashPassword } from '../utils/crypto';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface LoginData {
  email: string;
  password: string;
}

interface SignupData extends LoginData {
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
};

export const login = async (credentials: LoginData): Promise<ApiResponse<{ token: string }>> => {
  // Hash password before sending
  const hashedPassword = await hashPassword(credentials.password);
  
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...credentials,
      password: hashedPassword
    }),
  });

  return handleResponse(response);
};

export const signup = async (userData: SignupData): Promise<ApiResponse<{ token: string }>> => {
  // Hash password before sending
  const hashedPassword = await hashPassword(userData.password);
  
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...userData,
      password: hashedPassword
    }),
  });

  return handleResponse(response);
};

// Protected API calls
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // Handle token expiration
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  return response;
};

// Example of a protected API call
export const addExpense = async (expenseData: FormData): Promise<ApiResponse<any>> => {
  const response = await authFetch(`${API_URL}/expenses`, {
    method: 'POST',
    body: expenseData,
  });

  return handleResponse(response);
};

export const getExpenses = async (): Promise<ApiResponse<any[]>> => {
  const response = await authFetch(`${API_URL}/expenses`);
  return handleResponse(response);
};

export const getBudgetSummary = async (): Promise<ApiResponse<any>> => {
  const response = await authFetch(`${API_URL}/budget/summary`);
  return handleResponse(response);
}; 