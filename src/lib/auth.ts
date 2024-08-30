import User from '../models/User';
import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions, getServerSession } from "next-auth";
import { compileWelcomeTemplate, sendMail } from "@/lib/mail";


import { User as NextAuthUser } from "next-auth"; 

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

        authorization: {
        params: {
      //  scope: 'https://www.googleapis.com/auth/calendar.readonly',//https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.settings.readonly', 
      scope: 'openid profile email https://www.googleapis.com/auth/calendar.readonly',
      access_type: 'offline', // Запрашиваем refresh token
      prompt: 'consent' 

    },
        },

        async profile(profile): Promise<NextAuthUser> { 
        let user = await User.findOne({ where: { email: profile.email } });
        
        if (!user) {
         
          const charset = "#@$%!^&*abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
          let password = "";
          for (let i = 0; i < 64; i++) {
              const randomIndex = Math.floor(Math.random() * charset.length);
              password += charset[randomIndex];
          }

          user = await User.create({
            email: profile.email,
            first_name: profile.given_name,
            last_name: profile.family_name,
            google_id: profile.sub,
            avatar: profile.picture,
            password: password, 
            role: 1,
            status: 1,
          });

          try {
            await sendMail({
              to: profile.email,
              name: profile.given_name,
              subject: "Registration",
              body: compileWelcomeTemplate(profile.given_name, "youtube.com/@sakuradev"),
            });
          } catch (error) {
            console.log(error);
          }
          
        }
        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          image: user.avatar,
        } as NextAuthUser;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
     if (url.startsWith("/")) return `${baseUrl}${url}`
     else if (new URL(url).origin === baseUrl) return url
     return baseUrl
   },

    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; 
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).refreshToken = token.refreshToken;
      (session as any).accessToken = token.accessToken;
      return session;
    },
 }
};

