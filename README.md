# Stato-graph

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v14 or later)
- npm (v6 or later) or yarn (v1.22 or later)

### Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```env
# Backend URL for the activity API endpoints
BACKEND_URL=http://localhost:8000/api/v1 # or your backend URL

# Clerk API keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
SIGNING_SECRET=<your-clerk-signing-secret>
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=<your-clerk-sign-in-force-redirect-url>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=<your-clerk-sign-in-url>
DATABASE_URL=<your-database-url>
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
