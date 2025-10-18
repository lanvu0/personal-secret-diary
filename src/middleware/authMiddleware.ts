import { Request, Response, NextFunction } from "express";


export function isLoggedIn(req: Request, res: Response, next: NextFunction): void {
  // Check if session.userId exists (logged in)
  if (!req.session.userId) {
    console.log('User is not logged in');
    return res.redirect('/login');
  }

  next();
}