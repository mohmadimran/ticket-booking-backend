const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// Register (Admin or User)
async function register(req, res) {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || 'USER'
  });

  res.status(201).json({ message: 'User registered' });
}

// Login
async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token, role: user.role });
}

module.exports = { register, login };
