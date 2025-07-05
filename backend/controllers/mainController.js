const { verifyToken } = require('../services/jwtService');
const { motivation } = require('../services/mainService');

async function getMotivations(req,res){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:'No token provided'});
    }

    const decoded = verifyToken(token);
    if(!decoded){
        return res.status(403).json({ message: 'Invalid token' });
    }
    const result = await motivation();
    if (result.success) {
        res.json({title:result.title});
    } else {
        res.status(500).json({ message: result.message });
    }
}

module.exports = {
    getMotivations
};