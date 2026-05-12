const User = require('../models/User');
const Progress = require('../models/TaskProgress');
const DailyTasks = require('../models/DailyTasks');
const jwtService = require('../services/jwtService');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

async function registerUser(username, password, email) {
    const trimmedPassword = password.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    if (trimmedPassword.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
    }
    if (!trimmedUsername || !trimmedPassword || !trimmedEmail) {
        return { success: false, message: 'Username, password and email are required' };
    } else {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return { success: false, message: 'Username already exists' };
        } else {
            const salt = 10;
            const hashedPasswd = await bcrypt.hash(password, salt);
            const user = await User.create({ username, password: hashedPasswd, email });
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
    const isPasswdCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswdCorrect) {
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
    try{
        await sendEmail(email, code);
    }catch(e){
        console.log(error,e);
        return {success: false,message:"Email sending failed"};
    }

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
