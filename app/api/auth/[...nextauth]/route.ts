import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/app/lib/supabase";
import crypto from 'crypto';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        // ユーザーIDの生成（一貫性のあるUUID）
        const userId = crypto.createHash('md5')
          .update(user.email)
          .digest('hex');

        // usersテーブルにユーザー情報を保存/更新
        const { error } = await supabase
          .from('users')
          .upsert({
            id: userId,
            email: user.email,
            name: user.name,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'id'
          });

        if (error) throw error;
        user.id = userId;
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          id: token.userId,
        },
      };
    },
  },
});

export { handler as GET, handler as POST }; 
