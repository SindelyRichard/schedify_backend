const Motivation = require("../models/Motivation");
const DailyTasks = require("../models/DailyTasks");
const User = require("../models/User");
const DEFAULT_MOTIVATIONS = require('../config/defaultMotivation');
const DEFAULT_DAILYTASKS = require("../config/defaultTasks");

async function motivation() {
    try {
        const motivations = await Motivation.find();
        if (motivations.length === 0) {
            return { success: false, message: 'No motivations found' };
        }

        const randomIndex = Math.floor(Math.random() * motivations.length);
        const randomMotivation = motivations[randomIndex];

        return { success: true, title: randomMotivation.title };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

function getDays(created, now) {
    const diff = Math.abs(now - created);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

async function stat(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const days = Math.max(1, Math.ceil(getDays(user.createdAt, new Date())));
        
        const avg = Math.min(100,(user.tasksCompleted / (days * 10)) * 100)
        return { success: true, avg: avg, completed: user.tasksCompleted };
    } catch (e) {
        return { success: false, message: 'Server error' };
    }
}

async function seedMotivationsIfEmpty() {
    try {
        const count = await Motivation.countDocuments();
        if (count === 0) {
            for (const motivations of DEFAULT_MOTIVATIONS) {
                await Motivation.create({
                    title: motivations.title
                });
            }
            console.log("Default motivations seeded successfully.");
        } else {
            console.log("Motivations already exist in the database, skipping seed.");
        }
    } catch (err) {
        console.error("Error seeding motivations:", err);
    }
}

async function seedDailyTasksIfEmpty() {
    try {
        const count = await DailyTasks.countDocuments();
        if (count === 0) {
            let i = 0;
            for (const tasks of DEFAULT_DAILYTASKS) {
                await DailyTasks.create({
                    title: tasks.title,
                    idNum: i
                });
                i++;
            }
            console.log("DailyTasks seeded successfully.");
        } else {
            console.log("DailyTasks already exist in the database, skipping seed.");
        }
    } catch (err) {
        console.error("Error seeding DailyTasks:", err);
    }
}

module.exports = {
    motivation,
    seedMotivationsIfEmpty,
    seedDailyTasksIfEmpty,
    stat
};