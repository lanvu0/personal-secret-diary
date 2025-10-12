

export function isLoggedIn(req, res, next) {
  // Check if session.userId exists (logged in)
  if (!req.session.userId) {
    console.log('User is not logged in');
    return res.redirect('/login');
  }

  next();
}