const User = require('../models/User');
const jwtService = require('../services/jwtService');
const Task = require('../models/Task');
const DEFAULT_DAILY_TASKS = require('../config/defaultTasks');

async function registerUser(username, password) {
    if (!username || !password) {
        return { success: false, message: 'Username and password are required' };
    } else {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        } else {
            const user = await User.create({ username, password });
            for (const task of DEFAULT_DAILY_TASKS) {
                await Task.create({
                    userId: user._id,
                    title: task.title,
                    daily: task.daily,
                    lastCompletedDate: null
                });
            }
            return { success: true };
        }
    }
}

async function loginUser(username, password) {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid username or password' };
    }
    const token = jwtService.generateToken({ id: user._id, username: user.username });
    return { success: true, token };
}

module.exports = {
    registerUser,
    loginUser

};
