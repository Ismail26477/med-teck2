// Session management for the app
// This stores user info in localStorage (can be replaced with httpOnly cookies in production)

const SESSION_KEY = 'medisync_session';

export interface Session {
  userId: string;
  email: string;
  name: string;
  token?: string;
}

export const sessionManager = {
  // Store session
  setSession: (session: Session) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  // Get current session
  getSession: (): Session | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  // Clear session (logout)
  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return !!sessionManager.getSession();
  },

  // Get current user ID
  getUserId: (): string | null => {
    const session = sessionManager.getSession();
    return session?.userId || null;
  },
};
