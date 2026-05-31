# CLAUDE.md

## Project Overview

This is a production-grade React Native mobile application built with:

* React Native (Latest)
* Expo SDK (Latest)
* TypeScript (Strict Mode)
* Expo Router
* NativeWind (Tailwind CSS)
* Zustand
* TanStack Query
* Supabase
* React Hook Form
* Axios
* Expo Secure Store
* Expo Notifications
* Expo Image
* React Native Reanimated

The codebase must follow scalable enterprise architecture and maintainability best practices.

---

# Core Development Rules

## General Rules

* Always use TypeScript.
* Never use JavaScript files.
* Never use class components.
* Always use functional components.
* Always use named exports.
* Prefer composition over inheritance.
* Keep components small and reusable.
* Avoid duplicated logic.
* Use absolute imports where configured.
* Follow DRY principles.
* Follow SOLID principles where applicable.

---

# Folder Structure

src/

├── api/

├── assets/

├── components/

│ ├── common/

│ ├── forms/

│ └── ui/

├── constants/

├── hooks/

├── navigation/

├── screens/

├── services/

├── store/

├── theme/

├── types/

├── utils/

├── validators/

└── features/

Each feature should contain:

features/

└── auth/

├── api/

├── components/

├── hooks/

├── screens/

├── types/

└── validation/

---

# React Rules

## Components

Always:

* Use arrow functions.
* Use TypeScript interfaces.
* Keep components under 200 lines.
* Extract complex logic into hooks.
* Extract repeated UI into reusable components.

Example:

interface ButtonProps {
title: string;
onPress: () => void;
}

export const Button = ({
title,
onPress,
}: ButtonProps) => {
return (...)
}

---

# Styling Rules

Use NativeWind exclusively.

Preferred:

className="flex-1 bg-white"

Avoid:

StyleSheet.create()

Avoid inline styles unless dynamic.

Use design tokens.

Example:

className="bg-primary rounded-xl p-4"

---

# State Management

Use Zustand for:

* Auth State
* User State
* App Settings
* Theme Preferences

Do NOT use Redux.

Store structure:

store/

├── auth.store.ts

├── user.store.ts

└── app.store.ts

Keep stores minimal.

Business logic belongs in hooks/services.

---

# Server State

Use TanStack Query.

Always:

* useQuery
* useMutation
* Query Keys
* Cache Invalidation

Never fetch directly inside components.

Incorrect:

useEffect(() => {
fetch(...)
}, [])

Correct:

useQuery(...)

---

# API Rules

Use Axios.

Create a centralized API client.

api/

├── axios.ts

├── auth.api.ts

├── user.api.ts

Handle:

* Request Interceptors
* Response Interceptors
* Token Refresh
* Error Formatting

Never call fetch directly.

---

# Authentication

Use Supabase Authentication.

Supported:

* Email Login
* Google Login
* Apple Login

Persist session using:

expo-secure-store

Never store tokens in AsyncStorage.

---

# Forms

Use:

* React Hook Form
* Zod

All forms must use schema validation.

Example:

const schema = z.object({
email: z.string().email(),
password: z.string().min(8),
});

Never use manual validation.

---

# Error Handling

Always:

* Show user-friendly messages
* Log unexpected errors
* Handle loading states
* Handle empty states

Every screen must support:

* Loading
* Success
* Error
* Empty

---

# Custom Hooks

Business logic belongs inside hooks.

Example:

hooks/

useLogin.ts

useProfile.ts

useUploadImage.ts

Screens should remain mostly UI.

---

# Navigation

Use Expo Router.

Structure:

app/

(auth)/

(tabs)/

settings/

profile/

Use file-based routing.

Avoid React Navigation boilerplate.

---

# Performance Rules

Always:

* Use memo where beneficial
* Use FlashList for large lists
* Lazy load heavy screens
* Use Expo Image instead of Image
* Minimize re-renders

Never optimize prematurely.

Profile first.

---

# Accessibility

Every interactive element must have:

* accessibilityLabel
* accessibilityRole

Support:

* Screen Readers
* Dynamic Font Sizes

---

# Naming Conventions

Components:

UserCard.tsx

Hooks:

useUser.ts

Stores:

auth.store.ts

Types:

user.types.ts

Validation:

user.schema.ts

Constants:

auth.constants.ts

---

# Testing

Use:

* Jest
* React Native Testing Library

Test:

* Components
* Hooks
* Utilities
* API Functions

Avoid snapshot-only tests.

---

# Code Generation Rules

When generating code:

1. Generate complete production-ready code.
2. Include imports.
3. Include TypeScript types.
4. Include loading states.
5. Include error handling.
6. Follow existing architecture.
7. Avoid placeholders unless requested.
8. Prefer reusable components.
9. Follow feature-based architecture.
10. Ensure Expo compatibility.

---

# AI Coding Instructions

When implementing a feature:

1. Create types first.
2. Create validation schema.
3. Create API layer.
4. Create Zustand store if needed.
5. Create custom hooks.
6. Create reusable UI components.
7. Create screen/page.
8. Add loading/error states.
9. Add TypeScript types.
10. Add comments only when necessary.

Always generate maintainable, scalable, production-quality code.
