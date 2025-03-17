// import NextAuth, { SessionStrategy } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import { prisma } from "@/lib/db";

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Invalid credentials");
//         }

//         const user = await prisma.user.findUnique({
//           where: {
//             email: credentials.email,
//           },
//         });

//         if (!user || !user?.hashedPassword) {
//           throw new Error("Invalid credentials");
//         }

//         // Check if email is verified
//         if (!user.emailVerified) {
//           throw new Error("Please verify your email before signing in");
//         }

//         const isCorrectPassword = await bcrypt.compare(
//           credentials.password,
//           user.hashedPassword
//         );

//         if (!isCorrectPassword) {
//           throw new Error("Invalid credentials");
//         }

//         return user;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/sign-in",
//     signUp: "/auth/sign-up",
//     error: "/auth/error",
//     verifyRequest: "/auth/verify-request",
//   },
//   callbacks: {
//     async signIn({ user, account }: any) {
//       // Allow sign in if using OAuth provider (Google)
//       if (account?.provider !== "credentials") {
//         return true;
//       }

//       // For credentials, check if email is verified
//       const dbUser = await prisma.user.findUnique({
//         where: { email: user.email as string },
//       });

//       return dbUser?.emailVerified !== null;
//     },
//   },
//   debug: process.env.NODE_ENV === "development",
//   session: {
//     strategy: "jwt" as SessionStrategy,
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
