import Person from '../models/person.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    const person = await Person.create({ name, email, password });
    res.status(201).json({ message: 'User created successfully', person });
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const person = await Person.findOne({ email });
    if (!person) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isMatch = await person.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: person._id, name: person.name, email: person.email }, process.env.JWT_SECRET);
    res.status(200).json({ message: 'Login successful', person, token });
};

