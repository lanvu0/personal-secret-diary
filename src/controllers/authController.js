import bcrypt from 'bcryptjs';
import { saveUserToDatabase, checkUserExists, checkUserPassword, getUserId } from '../../database.js';

function getRegisterPage(req, res) {
  // Renders an EJS view
  res.render('pages/register')
}

async function registerUser(req, res) {
  // Get email, password from req.body
  const { email, password } = req.body;

  // Have error checking for email, password

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into db
  try {
    // Check if user exists

    // Save user to database & redirect to login page
    await saveUserToDatabase(email, hashedPassword);
    res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.render('pages/register', { error: 'Registration failed' });
  }
}

function getLoginPage(req, res) {
  res.render('pages/login');
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('pages/login', { error: 'Email and password are required' });
  }

  try {
    const userExists = await checkUserExists(email);
    if (!userExists) {
      return res.render('pages/login', { error: 'User with email not found' });
    }
    const isPasswordValid = await checkUserPassword(email, password);
    if (!isPasswordValid) {
      return res.render('pages/login', { error: 'Incorrect password' });
    }

    // Store user ID in req.session.userId
    req.session.userId = await getUserId(email);
    
    console.log('success')
    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('pages/login', { error: 'Login failed' });
  }
}

async function logoutUser(req, res) {
  // Destroy the session
  req.session.destroy();

  // Redirect to login
  res.redirect('/login');
}

export default {
  getRegisterPage,
  registerUser,
  getLoginPage,
  loginUser,
  logoutUser
}