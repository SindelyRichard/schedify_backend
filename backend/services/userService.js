const User = require('../models/User');
const Task = require('../models/Task');
const TaskProgress = require('../models/Task');

async function getLevelAndXp(username) {
    const user = await User.findOne({ username });
    if (!user) {
        return { success: false, message: 'User not found!' };
    }

    return { success: true, xp: user.xp, level: user.level };
}

async function updateLvlXp(username, level, xp) {
    const user = await User.findOneAndUpdate(
        { username },
        { level, xp },
        { new: true }
    );
    if (!user) {
        return { success: false, message: 'User not found!' };
    }
    return { success: true, user };

}

async function topUsers() {
    try {
        const topPlayers = await User.find()
            .sort({ level: -1 })
            .limit(3);

        return { success: true, players: topPlayers };
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Server error' };
    }
}

async function deleteUser(id) {
    try {
        await TaskProgress.deleteMany({ userId: id });
        await Task.deleteMany({ userId: id });
        await User.findByIdAndDelete(id);

        return { success: true };
    } catch (err) {
        return { success: false, message: 'Server error' }
    }
}

async function editUsername(id, newName) {
    try {
        const existingUser = await User.findOne({ username: newName });
        if (existingUser) {
            return { success: false, message: 'Username already taken' };
        }
        const user = await User.findOneAndUpdate(
            { _id: id },
            { username: newName },
            { new: true }
        );
        if (!user) {
            return { success: false, message: 'User not found' };
        } else {
            return { success: true, message: 'Username changed' }
        }
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

module.exports = {
    getLevelAndXp,
    updateLvlXp,
    topUsers,
    deleteUser,
    editUsername
};