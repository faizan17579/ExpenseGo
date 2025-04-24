import Person from '../models/person.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const person = await Person.create({ name, email, password });
    res.status(201).json({ message: 'User created successfully', person });
};

export const login = async (req, res) => {
    // ✅ Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // or 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // ✅ Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Respond OK to preflight
    }

    try {
        const { email, password } = req.body;
        const person = await Person.findOne({ email });
        if (!person) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await person.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: person._id, name: person.name, email: person.email },
            process.env.JWT_SECRET
        );

        res.status(200).json({ message: 'Login successful', person, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


