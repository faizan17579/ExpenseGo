import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  PieChart,
  BarChart3,
  TrendingUp,
  Plus,
  Settings,
  CreditCard,
  Calendar,
  ArrowDownRight,
  LogOut,
  DollarSign,
  Menu,
  X,
} from 'lucide-react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
const backendUrl = "https://expense-go-ten.vercel.app";
// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface User {
  id: string;
  name: string;
  email: string;
}

interface Expense {
  _id: string;
  title: string;
  amount: number;
  createdAt: string;
  budgetId: string;
  budgetName: string;
  category: string;
  description: string;
}

interface Budget {
  _id: string;
  amount: number;
  category: string;
  createdAt: string;
  expiryDate: string;
  remaining: number;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }
        setUser(JSON.parse(userData));

        const expensesResponse = await fetch(`${backendUrl}/api/expenses/fetch`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!expensesResponse.ok) {
          throw new Error('Failed to fetch expenses');
        }
        const expensesData = await expensesResponse.json();
        setExpenses(expensesData);

        const budgetsResponse = await fetch(`${backendUrl}/api/budgets/fetch`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!budgetsResponse.ok) {
          throw new Error('Failed to fetch budgets');
        }
        const budgetsData = await budgetsResponse.json();
        setBudgets(budgetsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const remainingBudget = budgets.reduce((sum, budget) => sum + budget.remaining, 0);
  const totalExpenses = totalBudget - remainingBudget;

  const formatDate = (dateString: string) => {
    try {
      const parsedDate = new Date(dateString);
      if (isNaN(parsedDate.getTime())) {
        const fallbackDate = new Date(Date.parse(dateString.replace(/[-]/g, '/')));
        if (isNaN(fallbackDate.getTime())) {
          return 'Date Unavailable';
        }
        return fallbackDate.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
      return parsedDate.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date Unavailable';
    }
  };

  const categoryColors = {
    'Food & Dining': '#10B981',    // emerald
    'Transportation': '#3B82F6',    // blue
    'Shopping': '#F59E0B',         // amber
    'Entertainment': '#8B5CF6',     // violet
    'Bills & Utilities': '#EF4444', // red
    'Healthcare': '#EC4899',        // pink
    'Travel': '#06B6D4',           // cyan
    'Education': '#8B5CF6',        // violet
    'Other': '#6B7280',            // gray
  };

  const getExpenseByCategory = () => {
    const categoryData = expenses.reduce((acc, expense) => {
      const category = expense.category || expense.budgetName || 'Other';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.keys(categoryData);
    const colors = categories.map(category => categoryColors[category as keyof typeof categoryColors] || '#6B7280');

    return {
      labels: categories,
      datasets: [
        {
          data: Object.values(categoryData),
          backgroundColor: colors,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 2,
        },
      ],
    };
  };

  const getExpenseTrends = () => {
    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return {
      labels: sortedExpenses.map(expense => formatDate(expense.createdAt)),
      datasets: [
        {
          label: 'Expense Amount',
          data: sortedExpenses.map(expense => expense.amount),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-red-600 dark:text-red-400 text-sm sm:text-base">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 relative">
      {/* Floating financial elements background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-emerald-300/10 dark:text-emerald-500/10">
          <DollarSign size={80} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-emerald-300/10 dark:text-emerald-500/10">
          <BarChart3 size={60} />
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-emerald-300/10 dark:text-emerald-500/10">
          <PieChart size={50} />
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-emerald-300/10 dark:text-emerald-500/10">
          <TrendingUp size={60} />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-emerald-600 text-white"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 h-full w-64 bg-slate-800/95 dark:bg-slate-900/95 text-white p-4 pt-12 lg:pt-4 z-20 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500" />
          <Link to="/" className="text-lg sm:text-xl font-bold">ExpenseGo</Link>
        </div>

        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-slate-700/50 rounded-lg backdrop-blur">
          <p className="text-xs sm:text-sm text-slate-300">Welcome back,</p>
          <p className="font-semibold text-sm sm:text-base">{user?.name || 'User'}</p>
          <p className="text-xs sm:text-sm text-slate-400">{user?.email || 'email@example.com'}</p>
        </div>

        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <PieChart className="h-4 w-4 sm:h-5 sm:w-5" />
            Dashboard
          </Link>
          <Link
            to="/expenses"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            Expenses
          </Link>
          <Link
            to="/budgets"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
            Budget
          </Link>
          <Link
            to="/analytics"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Analytics
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-red-400"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            Logout
          </button>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className={`pt-12 sm:pt-6 lg:pt-6 p-4 sm:p-6 lg:ml-64 ${isSidebarOpen ? 'opacity-50 lg:opacity-100' : ''} transition-opacity duration-300 relative z-10`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              to="/expenses/add"
              className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              Add Expense
            </Link>
            <Link
              to="/budgets/add"
              className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              Add Budget
            </Link>
          </div>
        </div>

        {/* Budget Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-3 sm:p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-1.5 sm:p-2 rounded-full">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Budget</p>
                <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-white">₹{totalBudget.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-3 sm:p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-1.5 sm:p-2 rounded-full">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Remaining Budget</p>
                <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-white">₹{remainingBudget.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-3 sm:p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-1.5 sm:p-2 rounded-full">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Expenses</p>
                <p className="text-base sm:text-xl font-bold text-slate-800 dark:text-white">₹{totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-3 sm:p-4 shadow-sm backdrop-blur">
            <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3">Expense by Category</h2>
            <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
              <Pie
                data={getExpenseByCategory()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        color: '#1E293B',
                        font: {
                          size: 10,
                          weight: 'normal',
                        },
                        padding: 8,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 6,
                        boxHeight: 6,
                        generateLabels: (chart) => {
                          const data = chart.data;
                          if (data.labels && data.datasets) {
                            return data.labels.map((label, index) => {
                              const value = data.datasets[0].data[index] as number;
                              const bgColor = data.datasets[0].backgroundColor[index];
                              return {
                                text: `${label} - ₹${value.toFixed(2)}`,
                                fillStyle: bgColor,
                                strokeStyle: bgColor,
                                lineWidth: 0,
                                hidden: false,
                                index,
                              };
                            });
                          }
                          return [];
                        },
                      },
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: '#1E293B',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      titleFont: { size: 11 },
                      bodyFont: { size: 11 },
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number;
                          const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return ` ₹${value.toFixed(2)} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-3 sm:p-4 shadow-sm backdrop-blur">
            <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3">Expense Trends</h2>
            <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
              <Line
                data={getExpenseTrends()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      enabled: true,
                      backgroundColor: '#1E293B',
                      titleColor: '#ffffff',
                      bodyColor: '#ffffff',
                      titleFont: { size: 11 },
                      bodyFont: { size: 11 },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                      },
                      ticks: {
                        color: '#64748B',
                        callback: (value) => typeof value === 'number' ? `₹${value}` : value,
                        font: { size: 9 },
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: '#64748B',
                        font: { size: 9 },
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 6,
                      },
                    },
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index',
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg p-3 sm:p-4 shadow-sm backdrop-blur">
          <h2 className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3">Recent Expenses</h2>
          <div className="space-y-2 sm:space-y-3">
            {expenses.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                No recent expenses. Add an expense to get started.
              </p>
            ) : (
              expenses.slice(0, 5).map((expense) => (
                <div
                  key={expense._id}
                  className="flex flex-col p-2 sm:p-3 bg-slate-50/50 dark:bg-slate-700/50 rounded-lg backdrop-blur gap-1 sm:gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-red-100 dark:bg-red-900 p-1 sm:p-2 rounded-full">
                      <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-xs sm:text-sm text-slate-800 dark:text-white">{expense.title}</p>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(expense.createdAt)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{expense.budgetName || expense.category || 'Uncategorized'}</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold text-red-600 dark:text-red-400 text-xs sm:text-sm text-right">
                    -₹{expense.amount.toFixed(2)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;