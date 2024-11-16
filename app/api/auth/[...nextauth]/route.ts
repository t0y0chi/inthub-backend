import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
    async jwt({ token, account }) {
      // アクセストークンを保存
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにアクセストークンを追加
      return {
        ...session,
        accessToken: token.accessToken,
      };
    },
  },
});

export { handler as GET, handler as POST }; 
