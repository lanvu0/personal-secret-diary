import bcrypt from 'bcryptjs';
import { saveUserToDatabase } from '../../database';
import e from 'express';

export function getRegisterPage(req, res) {
  // Renders an EJS view
  res.render('pages/register')
}

export async function registerUser(req, res) {
  // Get email, password from req.body
  const { email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into db
  try {

    // Save user to database & redirect to login page
    await saveUserToDatabase(email, hashedPassword);
    res.redirect('login');
  } catch (err) {
    console.error('Registration error:', err);
  }
}