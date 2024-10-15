const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('../model/user.model');
const UserRouter = express.Router();
require('dotenv').config();
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cart = require('../model/cart.model');
const Secret_Key=process.env.Secret_Key;

require('dotenv').config();

UserRouter.use(express.json());

// Fetch all users (for admin purposes)
UserRouter.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({ data: users });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(400).json({ error: err.message });
    }
});

// Register a new user
UserRouter.post('/register', async (req, res) => {
    const userData = req.body; 
    const { password, email, name } = userData;

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists" }); // Changed status code to 409 (Conflict)
        }

        // Hash the password
        const hashedPassword = await Bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = new UserModel({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" }); // Changed status code to 201 (Created)
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message });
    }
});

// User login
UserRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({ error: "User is not registered. Please register first!" });
        }

        const isPasswordMatch = await Bcrypt.compare(password, existingUser.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Password didn't match! Please try again." });
        }

        // Create a new cart for the user if it doesn't already exist
        const cartExists = await Cart.findOne({ userId: existingUser._id });
        if (!cartExists) {
            const newCart = new Cart({ userId: existingUser._id, items: [] });
            await newCart.save();
        }

        // Generate JWT token
        const token = jwt.sign({ email, userId: existingUser._id }, Secret_Key, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ error: err.message });
    }
});

module.exports = UserRouter;
