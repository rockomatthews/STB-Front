import supabase from './supabaseClient';

const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export const initializeAuthRefresh = () => {
  const refreshToken = async () => {
    const { data: session, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing token:', error);
    } else if (session) {
      console.log('Token refreshed successfully, new expiry:', session.expires_at);
    } else {
      console.log('No active session to refresh');
    }
  };

  // Refresh immediately
  refreshToken();

  // Set up interval for token refresh
  const intervalId = setInterval(refreshToken, REFRESH_INTERVAL);

  // Return a function to clear the interval when needed
  return () => clearInterval(intervalId);
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return data.session;
};