import { CONNREFUSED } from "dns"
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token){
    try{

        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const {body: refreshAccessToken}= await spotifyApi.refreshAccessToken(
            );

            console.log('REFRESHED TOKEN IS', refreshToken);

            return{
                ...token,
                accessToken: refreshToken.access_token,
                accessTokenExpires: Date.now + refreshToken.expires_in*1000,
                refreshToken: refreshToken.refresh_token ?? token.refreshToken,

            };

    }catch(error){
        console.error(error);

        return{
            ...token,
            error: "RefreshAccessTokenError"
        };
    }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret : process.env.JWT_secret,
  pages : {
    signIn: '/login'
  },
  callbacks:{
    async jwt({token, account, user}){

        //intial sign in
        if (account && user){ 
            return{
            ...token,
            acessToken: account.access_token,
            refreshToken: account.refresh_token,
            username: account.providerAccountId,
            accessTokenExpires: account.expires_at *1000, //we are handling expiry 1000 Millisecond hence *1000

        }      
        }
        //return previous token if the access token has not expired yet
        if (Date.now()<token.accessTokenExpires){
            console.log('EXISTING ACCESS TOKEN IS VALID');
            return token;
        }
        //Acess token has expired, so we need to refresh it...
        console.log('ACESS TOKEN HAS EXPIRED, REFRESHING...');
        return await refreshAccessToken (token) ;
    },

    async session({ session, token}){
        session.user.accessToken= token.accessToken;
        session.user.refreshToken= token.refreshToken;
        session.user.username= token.username

        return session;
    }
  }
})