import Mainpage from './components/Mainpage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import AddBudget from './components/AddBudget';
import Budgets from './components/Budgets';
import Expenses from './components/Expenses';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route path="/budgets/add" element={<AddBudget />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;