import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import dbConnect from './lib/db';
import User from './models/User';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials;

                await dbConnect();
                const user = await User.findOne({ email }).select('+password');

                if (!user) return null;
                if (!user.password) return null; // User might have signed up with Google

                const passwordsMatch = await compare(password, user.password);

                if (passwordsMatch) return user;

                return null;
            },
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account, profile }) {
            if (account.provider === 'google') {
                await dbConnect();
                const existingUser = await User.findOne({ email: user.email });

                if (!existingUser) {
                    await User.create({
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        googleId: account.providerAccountId,
                    });
                } else if (!existingUser.googleId) {
                    // Link Google account to existing email user
                    existingUser.googleId = account.providerAccountId;
                    existingUser.image = user.image; // Update image
                    await existingUser.save();
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                // On initial sign in, try to find the user in DB to get their stable _id
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                if (dbUser) {
                    token.sub = dbUser._id.toString();
                    token.id = dbUser._id.toString(); // Redundant but safe
                    token.email = dbUser.email; // Explicitly set email
                    console.log("JWT Callback: User found in DB, ID set to:", token.sub);
                } else {
                    console.log("JWT Callback: User NOT found in DB for email:", user.email);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.email = token.email || session.user.email; // Ensure email is present
                console.log("Session Callback: User ID set to:", session.user.id);
            } else {
                console.log("Session Callback: Token sub missing or session user missing");
            }
            return session;
        },
    },
    trustHost: true,
    secret: process.env.AUTH_SECRET,
});
