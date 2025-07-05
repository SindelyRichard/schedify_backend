const { registerUser,loginUser } = require('../services/authService');

async function register(req, res) {
  const { username, password } = req.body;
  const result = await registerUser(username, password);
  if (result.success) {
    res.json({ message: 'User registered successfully' });
  } else {
    res.status(401).json({ message: result.message });
  }
};

async function  login(req,res){
    const {username,password} = req.body;
    const result = await loginUser(username,password);
    if(result.success){
        res.cookie('token', result.token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });
        res.json({success:true });
    }else{
        res.status(401).json({ message: result.message });
    }
}

function logout(req, res) {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false
    });
    res.json({ success: true });
}

module.exports = {
  register,
  login,
  logout
};