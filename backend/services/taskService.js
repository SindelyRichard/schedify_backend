const Task = require('../models/Task');
const User = require('../models/User');
const Progress = require('../models/TaskProgress');
const DailyTask = require('../models/DailyTasks');

function calculateDate(today, lastCompletedDate, taskId, isDaily) {
    if (lastCompletedDate) {
        const completedToday = (lastCompletedDate.getFullYear()) == (today.getFullYear()) &&
            ((lastCompletedDate.getMonth()) == (today.getMonth())) &&
            ((lastCompletedDate.getDate()) == (today.getDate()));

        if (completedToday) {
            return true;

        } else if (!completedToday && !isDaily) {
            deleteTask(taskId);
        } else return false;
    } else return false;
}

async function deleteTask(taskId) {
    try {
        await Task.deleteMany({ _id: taskId });
    } catch (e) {
        console.log("Error, failed to delete the task.");
    }
}

async function dailyTasks(username) {
    try {
        const result = [];
        const today = new Date();
        const user = await User.findOne({ username });
        if (!user) return { success: false, message: 'User not found' };
        const tasks = await DailyTask.find({});
        for (const task of tasks) {
            const progress = await Progress.findOne({ userId: user._id, dtId: task.idNum });
            result.push({ ...progress._doc, title: task.title });

        }

        const formattedTasks = result.map(task => {
            const isCompletedToday = calculateDate(today, task.lastCompletedDate, task._id, true);


            return {
                ...task,
                completed: isCompletedToday
            };
        });

        return { success: true, tasks: formattedTasks };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

async function yourTasks(username) {
    try {
        const today = new Date();
        const user = await User.findOne({ username });
        if (!user) return { success: false, message: 'User not found' };
        const tasks = await Task.find({ userId: user._id });

        const formattedTasks = tasks.map(task => {
            const isCompletedToday = calculateDate(today, task.lastCompletedDate, task._id, false);

            const obj = task.toObject();


            return {
                ...obj,
                completed: isCompletedToday
            };
        });
        return { success: true, tasks: formattedTasks };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }

}

async function addTask(username, title) {
    try {
        const user = await User.findOne({ username });
        if (!user) return { success: false, message: 'User not found' };
        const taskCount = await Task.countDocuments({ userId: user._id });

        if (taskCount >= 5) {
            return { success: false, message: 'Reached maximum task!' };
        }
        const task = new Task({ userId: user._id, title: title });
        await task.save();
        return { success: true, task };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

async function setDailyTaskCompleted(id) {
    try {
        const task = await Progress.findByIdAndUpdate(
            id,
            { lastCompletedDate: new Date() },
            { new: true }
        );
        if (!task) return { success: false, message: 'DailyTask not found' };
        return { success: true, task };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

async function setTaskCompleted(id) {
    try {
        const task = await Task.findByIdAndUpdate(
            id,
            { lastCompletedDate: new Date() },
            { new: true }
        );
        if (!task) return { success: false, message: 'Task not found' };
        return { success: true, task };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

module.exports = {
    dailyTasks,
    addTask,
    setDailyTaskCompleted,
    setTaskCompleted,
    yourTasks
};





