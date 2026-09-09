# 🎙️ Podcastr

> **Create. Discover. Listen.**

Podcastr is a modern AI-powered podcast platform where users can **generate podcasts, create AI thumbnails, discover shows, and listen to episodes** through a clean, responsive interface.

## ✨ Features

- 🤖 **AI Podcast Generation** — Generate podcast audio from prompts using AI voices.
- 🖼️ **AI Thumbnails** — Create podcast artwork from image prompts.
- 🎧 **Audio Player** — Play, pause, seek, mute, and control podcast episodes.
- 🔎 **Discover & Search** — Explore podcasts and search by title, author, or description.
- 👤 **Authentication** — Secure sign-in/sign-up with Clerk.
- ☁️ **Cloud Storage** — Store podcast audio and images with Convex.
- 📊 **Views & Profiles** — Track podcast views and display creator information.
- 📱 **Responsive UI** — Optimized for desktop and mobile.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | Full-stack React framework |
| **React 19 + TypeScript** | UI & type safety |
| **Clerk** | Authentication |
| **Convex** | Database, storage & backend |
| **OpenAI** | AI-powered podcast generation |
| **Tailwind CSS** | Styling |
| **React Hook Form + Zod** | Forms & validation |
| **Embla Carousel** | Podcast carousels |

## 🏗️ Project Structure

```text
app/             → Pages, layouts & routes
components/      → UI & podcast components
convex/          → Database, storage & backend logic
providers/       → Convex & audio providers
public/          → Images, icons & sample audio
types/           → TypeScript types
constants/       → App constants
```

## 🚀 Getting Started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Create `.env.local` and add your **Clerk, Convex, and AI/API credentials** required by the project.

### 3. Start development

```bash
npm run dev
```

Open **http://localhost:3000**

### 4. Production

```bash
npm run build
npm start
```

## 🔄 How It Works

```text
User
 ↓
Clerk Authentication
 ↓
Create Podcast
 ↓
AI generates audio + thumbnail
 ↓
Convex stores podcast data & files
 ↓
Discover / Search
 ↓
🎧 Listen
```

## 📌 Core Backend

The main Convex modules are:

```text
convex/
├── podcasts.ts   → Podcast operations
├── users.ts      → User management
├── files.ts      → File/storage operations
├── openai.ts     → AI integration
├── http.ts       → HTTP/webhook handling
└── schema.ts     → Database schema
```

## 🌟 Project Goal

Podcastr brings **AI-assisted podcast creation and podcast discovery into one place**, making it easy for anyone to turn an idea into a listenable podcast.

---

<p align="center">
  Made with ❤️ using Next.js, Convex & AI
</p>
