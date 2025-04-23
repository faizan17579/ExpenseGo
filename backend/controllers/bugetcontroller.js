import Budget from '../models/buget.js';

export const createBudget = async (req, res) => {
    try {
        const { amount, category, createdAt, expiryDate } = req.body;
        
        // Validate required fields
        if (!amount || !category || !createdAt || !expiryDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }
       
        // Create new budget with user ID
        const newBudget = new Budget({
            userId: req.user.id,
            amount,
            category,
            createdAt,
            expiryDate,
            remaining: amount
        });
        
        await newBudget.save();
       
        res.status(201).json(newBudget);

    } catch (error) {
        console.error("Error creating budget:", error);
        res.status(500).json({ message: 'Failed to create budget', error: error.message });
    }   
};

export const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.id });
        res.status(200).json(budgets);
    } catch (error) {
        console.error("Error fetching budgets:", error);
        res.status(500).json({ message: 'Failed to get budgets', error: error.message });
    }
};

export const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { amount, category, expiryDate } = req.body;
    
    try {
        // Validate required fields
        if (!amount || !category || !expiryDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedBudget = await Budget.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { amount, category, expiryDate },
            { new: true }
        );

        if (!updatedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json(updatedBudget);
    } catch (error) {
        console.error("Error updating budget:", error);
        res.status(500).json({ message: 'Failed to update budget', error: error.message });
    }
};

export const deleteBudget = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedBudget = await Budget.findOneAndDelete({ _id: id, userId: req.user._id });
        
        if (!deletedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (error) {
        console.error("Error deleting budget:", error);
        res.status(500).json({ message: 'Failed to delete budget', error: error.message });
    }
};
