# Snaprime Assignment

## Overview

This application generates Meta/Facebook advertisements from a website URL.

The application extracts website content using Browserless, generates a structured brand profile with Gemini, and creates three editable advertisements that can be regenerated or customized before being saved.

---

## Tech Stack

- React
- TanStack Start
- TypeScript
- Tailwind CSS
- Firebase Firestore
- Browserless
- Google Gemini 2.5 Flash
- Cloudflare Workers

---

## Features

- Extracts website content from any public URL
- Supports JavaScript-rendered websites through Browserless
- Generates a structured brand profile using Gemini
- Creates three unique advertisements
- Edit advertisement copy
- Regenerate individual advertisements
- Swap advertisement images using extracted website assets
- Persist advertisements to Firestore
- Cache generated projects by URL to avoid unnecessary AI requests
- Friendly error handling for AI and extraction failures

---

## Architecture

The application follows a simple pipeline:

1. User submits a website URL.
2. Browserless extracts the rendered website.
3. Gemini generates a structured brand profile.
4. Gemini generates three advertisements.
5. The project is stored in Firestore.
6. Subsequent requests for the same URL are served from Firestore instead of regenerating content.

---

## State Management

Each advertisement card owns its own local editing state (`draft`) rather than lifting all advertisement state into the parent grid.

This was a deliberate simplification because advertisements are edited independently and no cross-card interactions exist. Persisted changes are immediately saved to Firestore, and regenerated advertisements update the local card state without requiring a full project refresh.

For a larger application supporting optimistic updates, collaborative editing, undo/redo, or shared editing workflows, the advertisement collection would instead be managed by the parent component or a dedicated state management solution such as TanStack Query, Zustand, or Redux to provide a single source of truth.

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Environment Variables

Create a `.env` file containing:

- Browserless API key
- Gemini API key
- Firebase configuration

---

## Future Improvements

- Upload custom advertisement images
- Optimistic UI updates
- Advertisement history and versioning
- Retry strategy for temporary AI failures
- Automated testing
- Analytics and usage metrics
