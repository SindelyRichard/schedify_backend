const Task = require('../models/Task');
const User = require('../models/User');

async function dailyTasks(username){
    try {
        const user = await User.findOne({ username });
        if (!user) return { success: false, message: 'User not found' };
        const tasks = await Task.find({ userId:user._id, daily: true });
        return { success: true, tasks };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

async function addTask(username, title) {
    try {
        const daily = false;
        const user = await User.findOne({ username });
        if (!user) return { success: false, message: 'User not found' };
        const taskCount = await Task.countDocuments({ userId:user._id,daily:false });

        if (taskCount >= 5) {
            return { success: false, message: 'Reached maximum task!' };
        }
        const task = new Task({ userId:user._id, title, daily });
        await task.save();
        return { success: true, task };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

async function setTaskCompleted(id){
    try {
        const task = await Task.findByIdAndUpdate(
            id,
            { completed: true },
            { new: true },
            { lastCompletedDate:  new Date() }
        );
        if (!task) return { success: false, message: 'Task not found' };
        return { success: true, task };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

async function yourTasks(username){
    try {
        const user = await User.findOne({ username });
        if (!user) return { success: false, message: 'User not found' };
        const tasks = await Task.find({ userId:user._id, daily: false });
        return { success: true, tasks };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }

}

module.exports = {
    dailyTasks,
    addTask,
    setTaskCompleted,
    yourTasks

};

