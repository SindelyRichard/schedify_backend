const User = require('../models/User');
const Progress = require('../models/TaskProgress');
const DailyTasks = require('../models/DailyTasks');
const jwtService = require('../services/jwtService');
const Task = require('../models/Task');
const DEFAULT_DAILY_TASKS = require('../config/defaultTasks');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

async function registerUser(username, email, password) {
    if (!username || !password) {
        return { success: false, message: 'Username and password are required' };
    } else {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        } else {
            const salt = 10;
            const hashedPasswd = await bcrypt.hash(password, salt);
            const user = await User.create({ username, hashedPasswd, email });
            const dailyTasks = await DailyTasks.find({});
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
    const isPasswdCorrect = await bcrypt.commpare(password, user.password);
    if (isPasswdCorrect) {
        return { success: false, message: 'Invalid username or password' };
    }
    const token = jwtService.generateToken({ id: user._id, username: user.username });
    return { success: true, token };
}

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWD
    }
});

async function sendEmail(email, code) {
    await transport.sendMail({
        to: email,
        subject: 'Password reset',
        text: `Your code is ${code}`
    });
}

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function generateAndSendCode(email) {
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: 'User not found' };
    }

    const code = generateCode();

    user.resetCode = code;
    user.codeExpire = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendEmail(email, code);

    return { success: true };

}

async function resetPassword(email, code, newPassword) {
    const user = await User.findOne({ email });

    if (!user || user.resetCode !== code || user.codeExpire < Date.now()) {
        return { success: false, message: 'Invalid or expired code.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetCode = null;
    user.codeExpire = null

    await user.save();

    return { success: true };
}

module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    generateAndSendCode
};
