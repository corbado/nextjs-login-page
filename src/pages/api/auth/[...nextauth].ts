import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Define the Session interface to type the user data
export interface Session {
  user: {
    name: string | null;
    email: string | null;
  };
}
export default NextAuth({
  // Define the authentication providers
  providers: [
    GoogleProvider({
      // Set the Google client ID and client secret from environment variables
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  // Define callback functions to manage session and token
  callbacks: {
    // Modify the session object before it is returned to the client
    async session({ session, token }) {
      // Ensure the session user object exists and set name and email from token
      if (session.user) {
        session.user.name = token.name || null; 
        session.user.email = token.email || null;
      }
      return session; 
    },
  },
});
