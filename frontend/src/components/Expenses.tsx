import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard, Edit2, Trash2, Calendar, DollarSign, BarChart3, PieChart, TrendingUp, Menu, X } from 'lucide-react';

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

const Expenses: React.FC = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/expenses/fetch', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError('Failed to load expenses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/expenses/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError('Failed to delete expense. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 h-full w-64 bg-slate-800/95 dark:bg-slate-900/95 text-white p-4 z-20 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-2 mb-8">
          <CreditCard className="h-8 w-8 text-emerald-500" />
          <span className="text-xl font-bold">ExpenseGo</span>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => {
              navigate('/dashboard');
              setIsSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
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
      <div className={`p-4 sm:p-6 lg:ml-64 ${isSidebarOpen ? 'opacity-50 lg:opacity-100' : ''} transition-opacity duration-300 relative z-10`}>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-200" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">My Expenses</h1>
            </div>
            <Link
              to="/expenses/add"
              className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              Add Expense
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-slate-900 dark:text-white">No expenses yet</h3>
              <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                Add your first expense to start tracking your spending.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                        {expense.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{formatDate(expense.createdAt)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>Budget: {expense.budgetName || 'Uncategorized'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/expenses/edit/${expense._id}`)}
                        className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="p-1.5 sm:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
                      -₹{expense.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;