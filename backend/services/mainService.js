const Motivation = require("../models/Motivation");
const DEFAULT_MOTIVATIONS = require('../config/defaultMotivation');
const { title } = require("process");

async function motivation() {
    try {
        const motivations = await Motivation.find();
        if (motivations.length === 0) {
            return { success: false, message: 'No motivations found' };
        }

        const randomIndex = Math.floor(Math.random() * motivations.length);
        const randomMotivation = motivations[randomIndex];

        return { success: true, title:randomMotivation.title };
    } catch (err) {
        return { success: false, message: 'Server error' };
    }
}

async function seedMotivationsIfEmpty() {
    try {
        const count = await Motivation.countDocuments();
        if (count === 0) {
            for (const motivations of DEFAULT_MOTIVATIONS) {
                            await Motivation.create({
                                title:motivations.title
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

module.exports={
    motivation,
    seedMotivationsIfEmpty
};