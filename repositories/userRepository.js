import User from "../models/user.js";

export const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.create({ username, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        return res.status(200).json({ message: "User found", success: true, user });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                message: "User not found",
                success: false 
            });
        }

        return res.status(200).json({
            message: "User found",
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message,
            success: false 
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { userData } = req.body;
        const user = await User.findByIdAndUpdate(id, userData, { new: true });
        return res.status(200).json({ message: "User updated successfully", success: true, user });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "User deleted successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude password from response
        
        return res.status(200).json({
            message: "Users retrieved successfully",
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({ 
            message: error.message,
            success: false 
        });
    }
}

export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        return res.status(200).json({ message: "User found", success: true, user });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

const validateLoginInput = (username, password) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }
};

const authenticateUser = async (username, password) => {
    const user = await getUserByUsername(username);
    if (!user) {
        throw new Error('Invalid username or password');
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }
    
    return user;
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        validateLoginInput(username, password);
        const user = await authenticateUser(username, password);
        
        return res.status(200).json({
            message: 'Login successful',
            success: true,
            user
        });
    } catch (error) {
        const statusCode = error.message.includes('Invalid') ? 401 : 500;
        return res.status(statusCode).json({
            message: error.message,
            success: false
        });
    }
};

export const deleteAllUsers = async (req, res) => {
    try {
        await User.deleteMany();
        return res.status(200).json({ message: "All users deleted successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

