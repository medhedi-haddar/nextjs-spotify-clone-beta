import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi ,{ LOGIN_URL } from "../../../lib/spotify"


async function refreshAccessToken(token) { 
    try {
      spotifyApi.setAccessToken(token.accessToken);
      spotifyApi.setRefreshToken(token.refreshToken);

      const { body : refreshedToken } = await spotifyApi.refreshAccessToken();

      console.log('refrech token is ', refreshedToken);

      return {
          ...token,
          accessToken : refreshedToken.access_token,
          accessTokenExpires : Date.now() + refreshedToken.expires_in * 1000,
          refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
      }

    } catch (error) {
      console.log(error);

    return {
        ...token,
        error: "RefreshAccessTokenError",
    };
  } 
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization : 'https://accounts.spotify.com/authorize?scope=user-read-email%2Cplaylist-read-private%2Cplaylist-read-collaborative%2Cuser-read-private%2Cstreaming%2Cuser-library-read%2Cuser-top-read%2Cuser-read-recently-played%2Cuser-read-playback-state%2Cuser-modify-playback-state%2Cuser-follow-read%2Cuser-read-currently-playing%2Cuser-library-modify',
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
      signIn : '/',
  },
  callbacks: {
    async jwt({ token, user, account }) {

        if(account && user ){
            return {
                ...token, 
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000,
                user,
            }
        }

        if (Date.now() < token.accessTokenExpires) {
            console.log("existing access token ")
            return token
        }
        return await refreshAccessToken(token)
      }, 
      async session({ session, token }) {
    
        session.user = token.user;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.error = token.error;
    
        return session
      },
    },
});