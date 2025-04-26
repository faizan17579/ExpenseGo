import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  PieChart,
  BarChart3,
  Settings,
  CreditCard,
  ArrowLeft,
  Plus,
  DollarSign,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';

interface Budget {
  _id: string;
  category: string;
  amount: number;
  remaining: number;
}

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Other'
  ];

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/budgets/fetch', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setBudgets(data);
        if (data.length > 0) {
          setSelectedBudget(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    fetchBudgets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !amount || !date || !selectedBudget) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          date,
          category,
          description,
          budgetName: selectedBudget,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add expense');
      }

      setSuccess(true);
      // Dispatch event to notify dashboard of new expense
      window.dispatchEvent(new Event('expenseUpdated'));
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating expense:', error);
      setError(error instanceof Error ? error.message : 'Failed to add expense. Please try again.');
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
          <Wallet className="h-8 w-8 text-emerald-500" />
          <Link to="/" className="text-xl font-bold">ExpenseGo</Link>
        </div>

        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <PieChart className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/expenses"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <CreditCard className="h-5 w-5" />
            Expenses
          </Link>
          <Link
            to="/budgets"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Wallet className="h-5 w-5" />
            Budget
          </Link>
          <Link
            to="/analytics"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <BarChart3 className="h-5 w-5" />
            Analytics
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
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
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-200" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">Add New Expense</h1>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 rounded-md text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p>Expense added successfully! Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title and Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Expense Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 dark:text-slate-400 text-sm">Rs </span>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 block w-full pl-7 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Date and Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Select Budget
                  </label>
                  <select
                    id="budget"
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                    required
                  >
                    {budgets.length === 0 ? (
                      <option value="">No budgets available</option>
                    ) : (
                      budgets.map((budget) => (
                        <option key={budget._id} value={budget._id}>
                          {budget.category} (Rs {budget.remaining.toFixed(2)} remaining)
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Category and Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    success
                      ? 'bg-emerald-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                  }`}
                  disabled={success}
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;