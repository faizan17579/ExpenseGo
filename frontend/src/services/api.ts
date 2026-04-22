export const API_URL ="http://13.234.38.210:5000/api";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData extends LoginData {
  name: string;
}

export interface AuthUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
}

export interface Budget {
  _id: string;
  amount: number;
  category: string;
  createdAt: string;
  expiryDate: string;
  remaining: number;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  createdAt: string;
  budgetId: string;
  budgetName?: string;
  category: string;
  description: string;
}

interface LoginResponse {
  message: string;
  person: AuthUser;
  token: string;
}

interface SignupResponse {
  message: string;
  person: AuthUser;
}

const decodeHtmlEntities = (value: string): string => {
  return value
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
};

const extractHtmlError = (html: string): string => {
  const preMatch = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  const source = preMatch ? preMatch[1] : html;

  return decodeHtmlEntities(source)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  let parsedData: any = null;
  if (rawText) {
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      parsedData = null;
    }
  }

  if (!response.ok) {
    const messageFromJson = parsedData?.message || parsedData?.error;
    const messageFromText = rawText && !contentType.includes('application/json')
      ? extractHtmlError(rawText).slice(0, 220)
      : '';

    throw new Error(
      messageFromJson ||
      messageFromText ||
      `Request failed with status ${response.status}`
    );
  }

  if (parsedData !== null) {
    return parsedData as T;
  }

  // Some endpoints may return empty bodies for success.
  return {} as T;
};

export const login = async (credentials: LoginData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...credentials,
    }),
  });

  return handleResponse<LoginResponse>(response);
};

export const signup = async (userData: SignupData): Promise<SignupResponse> => {
  const response = await fetch(`${API_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...userData,
    }),
  });

  return handleResponse<SignupResponse>(response);
};

// Protected API calls
const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    // Handle token expiration
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  return response;
};

export const fetchExpenses = async (): Promise<Expense[]> => {
  const response = await authFetch(`${API_URL}/expenses/fetch`);
  return handleResponse<Expense[]>(response);
};

export const fetchBudgets = async (): Promise<Budget[]> => {
  const response = await authFetch(`${API_URL}/budgets/fetch`);
  return handleResponse<Budget[]>(response);
};

export const addExpense = async (expenseData: {
  title: string;
  amount: number;
  category: string;
  description: string;
  budgetName: string;
}): Promise<Expense> => {
  const response = await authFetch(`${API_URL}/expenses/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });

  return handleResponse<Expense>(response);
};

export const deleteExpense = async (id: string): Promise<{ message: string }> => {
  const response = await authFetch(`${API_URL}/expenses/delete/${id}`, {
    method: 'DELETE',
  });

  return handleResponse<{ message: string }>(response);
};

export const addBudget = async (budgetData: {
  amount: number;
  category: string;
  createdAt: string;
  expiryDate: string;
}): Promise<Budget> => {
  const response = await authFetch(`${API_URL}/budgets/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(budgetData),
  });

  return handleResponse<Budget>(response);
}; 

export const deleteBudget = async (id: string): Promise<{ message: string }> => {
  const response = await authFetch(`${API_URL}/budgets/delete/${id}`, {
    method: 'DELETE',
  });

  return handleResponse<{ message: string }>(response);
};

export const getBudgetSummary = async () => {
  const response = await authFetch(`${API_URL}/budget/summary`);
  return handleResponse(response);
};