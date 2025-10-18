import session from 'express-session';

// Declare new property userId on SessionData interface
declare module 'express-session' {
  export interface SessionData {
    userId?: number;
  }
}