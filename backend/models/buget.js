import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        unique: true,
    },
   
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    remaining: {
        type: Number,
        required: true,
    },
    
});

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
