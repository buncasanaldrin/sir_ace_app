# Threads App

A full-stack application built on Next.js 13 replicating the Threads app functionality.

## 🚀 Getting Started

Install the packages:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚙️ Environment Variables (.env)

- 🗝️ **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
- 🗝️ **CLERK_SECRET_KEY**
- 🌐 **NEXT_CLERK_WEBHOOK_SECRET**
- 🔑 **NEXT_PUBLIC_CLERK_SIGN_IN_URL**
- 🔑 **NEXT_PUBLIC_CLERK_SIGN_UP_URL**
- ➡️ **NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL**
- ➡️ **NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL**
- 📂 **MONGODB_URL**
- 🆙 **UPLOADTHING_SECRET**
- 🆔 **UPLOADTHING_APP_ID**

## 📦 Packages Used

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Svix](https://www.svix.com)
- [Clerk](https://clerk.com/docs/nextjs/get-started-with-nextjs)
- [Uploadthing](https://uploadthing.com)
- [Mongoose](https://mongoosejs.com)

## 📂 Folder Structure

### `app/`

This is the primary directory for the application.

- **auth/**: Registration process-related pages.

  - **onboarding/**: Onboarding process after signing up.
  - **sign-in/**: User sign-in page.
  - **sign-up/**: User registration page.

- **root/**: Pages that require authentication to access.

  - **activity/**: Display user activities.
  - **communities/**: Community discussions.
  - **create-thread/**: Page to create new threads.
  - **profile/**: User profile page.
  - **search/**: Page to search threads or discussions.
  - **thread/**: Individual thread discussions.

- **api/**: Backend API routes.
  - **uploadthing/**: Routes related to image uploads.
  - **webhook/clerk**: Endpoints for receiving webhooks from Clerk.

### `components/`

Reusable React components.

- **cards/**: UI components related to cards.
- **forms/**: UI components related to forms.
- **shared/**: UI components that can be shared across different pages.
- **ui/**: Components related specifically to app's UI design.

### `constants/`

Holds constant data that can be reused throughout the application.

### `lib/`

Library functions and utilities.

- **mongoose/**: MongoDB related operations.

  - **actions/**: Reusable operations like fetch, update, create, and delete.
  - **models/**: Schema or model definitions.
  - **database.ts**: MongoDB connection configurations.

- **validations/**: Related to Zod validations.
- **uploadthing.ts**: Related to file and image uploads.
- **utils.ts**: General reusable utility functions.

### `public/assets/`

Directory for static assets like images.
