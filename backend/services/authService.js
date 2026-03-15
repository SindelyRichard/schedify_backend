const User = require('../models/User');
const Progress = require('../models/TaskProgress');
const DailyTasks = require('../models/DailyTasks');
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
            const dailyTasks = await DailyTasks.findAll();
            for (const task of dailyTasks) {
                await Progress.create({
                    userId: user._id,
                    lastCompletedDate: null,
                    dtId: task.idNum
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
