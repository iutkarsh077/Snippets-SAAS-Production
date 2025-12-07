# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Snippets is a Next.js 14 application for sharing code snippets with an integrated developer community. It includes AI-powered features, real-time chat, code execution, image generation, and social feed functionality.

**Tech Stack:**
- Framework: Next.js 14 (App Router)
- Database: MongoDB with Prisma ORM
- Authentication: JWT tokens stored in HTTP-only cookies
- Real-time: Pusher for WebSocket communication
- AI: Google Gemini (chat), Nebius AI (image generation), Piston API (code execution)
- Styling: Tailwind CSS with shadcn/ui components
- Image Storage: Cloudinary
- Email: Nodemailer (Gmail SMTP)

## Development Commands

### Core Commands
```powershell
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Clean build and restart dev server
npm run clean
```

### Database Commands
```powershell
# Generate Prisma client (required after schema changes)
npx prisma generate

# Apply migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Architecture

### Directory Structure

**`/src/app/`** - Next.js App Router pages and layouts
- `(auth)/` - Authentication pages (login, sign-up) with route group
- `(home)/` - Landing page components
- `(private)/` - Protected routes (profile)
- `(CheckMessage)/` - Message checking functionality
- `api/` - API routes for image upload, AI generation, Pusher auth, bug tracking
- Feature routes: `snippets/`, `feeds/`, `userChat/`, `askAi/`, `explore/`, `uploadSnippets/`, etc.

**`/actions/`** - Server actions (Next.js server functions marked with "use server")
- All backend logic for CRUD operations, authentication, and external API calls
- Examples: `LoginAction.ts`, `GetAllSnippets.ts`, `uploadSnippets.ts`, `RunCode.ts`, `GeminiResponse.ts`

**`/prisma/`** - Database schema and configuration
- `schema.prisma` defines MongoDB models: User, PostSnippet, Comment, Chat, Friends, Feeds, FeedsComment, FeedsLikes, bugTracker

**`/src/components/`** - React components
- `ui/` - shadcn/ui components (button, dialog, toast, etc.)
- `Toggle/` - Theme toggle component
- `Navbar.tsx` - Main navigation

**`/src/lib/`** - Shared utilities and configurations
- `constants.ts` - Language versions and code snippets for code editor
- `cloudinary.ts`, `cloudinaryImageUploader.ts` - Image upload utilities
- `pusher/` - Pusher client and server configurations
- `utils.ts` - Helper functions

**`/src/helpers/`** - Email and utility functions
- `SendEmail.js` - Nodemailer email sending with HTML templates
- `VerificationEmail.jsx` - Email template component

**`/src/types/`** - TypeScript type definitions and Zod schemas

**`/src/hooks/`** - Custom React hooks
- `use-toast.ts` - Toast notification hook

### Key Architectural Patterns

**Authentication Flow:**
1. Server actions handle login/signup (`LoginAction.ts`, `CreateUserAccount.ts`)
2. JWT tokens stored in HTTP-only cookies (cookie name: "snippets", 10-day expiry)
3. Token verification in server actions using `jwt.verify()` with `JWT_SECRET`
4. User details decoded from token for protected operations

**Server Actions Pattern:**
- All backend logic in `/actions/` directory, marked with `"use server"`
- Return consistent format: `{ msg: string, status: boolean, data?: any }`
- Use `revalidatePath()` for cache invalidation after mutations
- Direct Prisma database access (no API route layer for CRUD)

**Real-time Communication:**
- Pusher WebSocket for chat (`/userChat`) and live updates
- Client: `src/lib/pusher/client/index.ts` 
- Server: `src/lib/pusher/server/index.ts` with singleton pattern
- Auth endpoint: `/api/pusher/auth`

**Code Execution:**
- Uses Piston API (emkc.org) for running code in 8 languages
- Supported: JavaScript, TypeScript, Python, Java, C#, PHP, C, C++
- See `actions/RunCode.ts` and `src/lib/constants.ts` for language configs

**AI Integrations:**
- Gemini API (`@google/genai`) for conversational AI in `/askAi`
- Nebius AI for image generation in `/explore/image-generator`
- Conversation history maintained in `GeminiResponse.ts`

**Route Groups:**
- `(auth)`, `(home)`, `(private)`, `(CheckMessage)` are layout groups (parentheses don't affect URL)
- Each feature page has `_components/` subdirectory for page-specific components

**Form Handling:**
- React Hook Form with Zod resolvers (see `/src/types/`)
- Client-side validation before server action calls

**Image Uploads:**
- Cloudinary for storage
- API routes: `/api/ImageUpload`, `/api/ImageUploadForLink`
- Config in `src/lib/cloudinary.ts`

### Database Schema Key Relationships

- **User** has many: PostSnippet, Comment, Chat, Feeds, FeedsComment, FeedsLikes, bugTracker
- **PostSnippet** (code snippets) has many Comments, belongs to User (author)
- **Feeds** (social posts) has many FeedsComment and FeedsLikes, belongs to User
- **Chat** messages connect sender (User) to receiver via IDs
- **Friends** is a join table (User ↔ User relationship)
- **bugTracker** tracks bugs with status, dates, and user assignment

## Environment Variables Required

Create a `.env` file with these variables:

```env
# Database
DATABASE_URL="mongodb+srv://..."

# Authentication
JWT_SECRET="your-secret-key"

# AI Services
GOOGLE_GEMINI_API_KEY="your-gemini-key"
NEBIUS_API_KEY="your-nebius-key"

# Cloudinary
CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email (Gmail SMTP)
SMTP_EMAIL="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Pusher
PUSHER_APP_ID="your-app-id"
PUSHER_SECRET="your-secret"
NEXT_PUBLIC_PUSHER_KEY="your-public-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
```

## Project-Specific Guidelines

### Code Style
- ESLint rules disable strict TypeScript checks (`@typescript-eslint/no-explicit-any`, `no-unused-vars`, `no-unused-expressions` are off)
- Use `"use client"` directive for client components (forms, animations, hooks)
- Use `"use server"` directive for server actions in `/actions/`

### Path Aliases
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Always use this alias for imports: `import X from "@/components/X"`

### Fonts
- Poppins (weight 500) loaded via `next/font/google` in root layout

### Theming
- Dark mode via `next-themes` with class-based strategy
- Theme toggle in `SwitchToggle` component
- Tailwind configured with CSS variables for theme colors

### Route Protection
- Check JWT cookie presence and validity in server actions
- Return `{ msg: "Unauthorized access", status: false }` for unauthenticated requests
- Navbar conditionally shows user name or login button

### Error Handling
- Server actions return error messages in `msg` field
- Client components handle errors with try-catch and display via toasts
- Use `useToast` hook from shadcn/ui for notifications

### Testing Code Changes
- After modifying server actions, test via the UI (no separate test command found)
- Use Prisma Studio (`npx prisma studio`) to verify database changes
- Check browser console for client-side errors

### Working with Prisma
1. Modify `prisma/schema.prisma`
2. Run `npx prisma generate` to update Prisma Client types
3. Run `npx prisma migrate dev --name description` to create and apply migration
4. Import `prisma` from `"../prisma"` or `"../../prisma"` (relative path from actions)

### Adding New Features
1. Create page in `/src/app/[feature-name]/page.tsx`
2. Add components in `/src/app/[feature-name]/_components/`
3. Create server actions in `/actions/` for backend logic
4. Add route to `navLinks` in `src/components/Navbar.tsx` if it needs navigation
5. Update Prisma schema if new data models needed
6. Add environment variables if external services required

### Monaco Editor
- Used for code editing in `/explore/code-editor`
- Configured with `@monaco-editor/react` package
- Language configs in `src/lib/constants.ts`

### Image Upload Flow
1. Client selects image via `react-dropzone`
2. Image sent to `/api/ImageUpload` route
3. Route uploads to Cloudinary via `src/lib/cloudinaryImageUploader.ts`
4. Returns Cloudinary URL
5. URL saved to database (user profile, feed post, etc.)

### Common Patterns

**Fetching User Details:**
```typescript
import { GetUserDetails } from "@/actions/GetUserDetails";
const res = await GetUserDetails();
if (res.status === false) throw new Error(res.msg);
const user = res.decodeCookieValue;
```

**Creating a Server Action:**
```typescript
"use server";
import prisma from "../prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function MyAction(data: any) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("snippets")?.value;
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Your logic here
    
    return { msg: "Success", status: true };
  } catch (error) {
    return { msg: "Internal Server error", status: false };
  }
}
```

**Using React Hook Form with Zod:**
```typescript
import { useForm } from "react-hook-form";
import { myResolver, myTypes } from "@/types/MyTypes";

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: myResolver,
  defaultValues: { ... }
});

const onSubmit = async (data: myTypes) => {
  const res = await MyAction(data);
  if (!res.status) throw new Error(res.msg);
};
```
