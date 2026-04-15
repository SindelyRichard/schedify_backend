const { registerUser, loginUser, generateAndSendCode, resetPassword } = require('../services/authService');

async function register(req, res) {
  const { username, password, email } = req.body;
  const result = await registerUser(username, password, email);
  if (result.success) {
    res.json({ message: 'User registered successfully' });
  } else {
    res.status(401).json({ message: result.message });
  }
};

async function login(req, res) {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  if (result.success) {
    res.cookie('token', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false
    });
    res.json({ success: true });
  } else {
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

async function generateCode(req, res) {
  const { email } = req.body;
  const result = await generateAndSendCode(email);

  if (result.success) {
    res.json({ message: 'Verification code sent to your email' });
  } else {
    res.status(401).json({ message: result.message });
  }
}

async function changePassword(req, res) {
  const { email, newPassword, code } = req.body;
  const result = await resetPassword(email, code, newPassword);

  if (result.success) {
    res.json({ message: 'Password changed' });
  } else {
    res.status(401).json({ message: result.message });
  }
}

module.exports = {
  register,
  login,
  logout,
  generateCode,
  changePassword
};