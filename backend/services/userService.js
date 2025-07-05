const User = require('../models/User');

async function getLevelAndXp(username) {
    const user = await User.findOne({username});
    if(!user){
        return {success: false, message: 'User not found!'};
    }
    
    return { success: true, xp:user.xp,level:user.level };
}

async function updateLvlXp(username,level,xp){
    const user = await User.findOneAndUpdate(
        {username},
        {level,xp},
        {new:true}
    );
    if (!user) {
        return { success: false, message: 'User not found!' };
    }
    return { success: true, user };

}

async function topUsers(){
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

module.exports = {
    getLevelAndXp,
    updateLvlXp,
    topUsers
};