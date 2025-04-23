import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {    
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    //   receipt: {
    //     data: Buffer,
    //     contentType: String,
    //   },
    
});


const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
    
