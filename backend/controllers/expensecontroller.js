import Expense from '../models/expense.js';
import Budget from '../models/buget.js';
export const createExpense = async (req, res) => {
    try {
      const { title, amount, category, description, budgetName } = req.body;
  
      console.log(req.body);
      if (!title || !amount || !category || !description || !budgetName) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Find budget by name and user
      const budget = await Budget.findOne({_id: budgetName});
  
      if (!budget) {
        return res.status(404).json({ message: "Budget not found with given name" });
      }
  
      // Optional: Check if budget has enough remaining
      if (amount > budget.remaining) {
        return res.status(400).json({ message: "Insufficient remaining budget" });
      }
  
      const newExpense = new Expense({
        userId: req.user.id,
        title,
        amount,
        category,
        description,
        budgetId: budget._id,  // now using _id from found budget
      });
  
      await newExpense.save();
  
      // Deduct amount from budget's remaining
      budget.remaining -= amount;
      await budget.save();
  
      res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Failed to create expense", error: error.message });
    }
  };

export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
    }
};

export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.findByIdAndDelete(id);
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete expense', error: error.message });
    }
};

export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, amount, category, description, budgetName } = req.body;
        await Expense.findByIdAndUpdate(id, { title, amount, category, description, budgetName });
        res.status(200).json({ message: 'Expense updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update expense', error: error.message });
    }
};
