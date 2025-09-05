# Replyly – Core Service & Web App

Backend for client creation and WhatsApp message routing to the correct AI assistant, plus the web frontend to buy plans, manage your account, and view chats.

## ✨ What this repo does

- **Client onboarding & plans**  
  Create accounts, select a plan, enforce quotas/limits, and manage billing state.

- **WhatsApp message routing**  
  Receive messages, resolve the target **business AI assistant**, generate a reply, and deliver it back to WhatsApp.

- **Web frontend**  
  Pages to **purchase plans**, **manage account**, and **view/search chats** from the browser.

- **Message storage & controls**  
  Persist inbound/outbound messages. Mark phone numbers that should **not** trigger the bot.

> This repo **does not** train models. It connects messages to an already configured AI assistant per client.

## Getting Started

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
