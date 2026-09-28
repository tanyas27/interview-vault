# InterviewVault 🎯

A secure, zero-cost, single-user web application to track your job interview pipeline and convert interview experiences into an active question repository for preparation.

## ✨ Features

### 🚀 CORE FEATURE: Question Extraction
- **Automatic Question Parsing**: Paste raw interview notes into the Question Scratchpad
- **Smart Deduplication**: Detects existing questions and increments frequency counter  
- **Centralized Question Bank**: All questions aggregated in one searchable repository
- **Preparation Tracking**: Track confidence levels, categorize by type, identify weak areas

### 📊 Complete Interview Pipeline
- Track applications with referral information
- Multi-round interview tracking
- Compensation and document management
- 4 analytics views: Funnel, Frequency Heatmap, Timeline, Weak Areas
- JSON/CSV data export

## 🏁 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma generate
npx prisma migrate dev

# 3. Create master password
npm run setup:password

# 4. Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with your master password!

## 🔑 Test Credentials

For development, a test password is pre-configured:
- **Password**: `password123`

To create your own secure password, run: `npm run setup:password`

## 📖 Usage Guide

### 1. Add an Application
Navigate to Applications → New Application and fill in company details, referral info, and documents.

### 2. Track Interview Rounds
After completing an interview, add a round from the application detail page.

### 3. Extract Questions (⭐ CORE FEATURE)
On the round detail page, use the Question Scratchpad to paste your notes:

```
1. Explain the difference between process and thread
2. How would you design a URL shortener?

Tell me about a time you resolved a conflict
```

Questions are automatically extracted and added to your centralized bank!

### 4. Build Your Question Bank
- Categorize questions by type (Technical, Behavioral, etc.)
- Set difficulty levels (Easy, Medium, Hard, Expert)
- Add your answers and key points
- Track confidence levels to identify weak areas

### 5. Analyze Your Progress
View the Analytics dashboard to see:
- **Conversion Funnel**: Where applications drop off
- **Question Frequency**: Most commonly asked topics
- **Timeline**: Visual calendar of your interview activity
- **Weak Areas**: Questions needing more preparation

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19
- **Database**: SQLite + Prisma ORM
- **Auth**: JWT with bcrypt password hashing
- **UI**: Tailwind CSS v4 + Radix UI
- **TypeScript**: Full type safety

## 📁 Project Structure

```
src/
├── app/(auth)/login/          # Login page
├── app/(main)/                # Protected routes
│   ├── dashboard/             # Overview with stats
│   ├── applications/          # Application CRUD
│   ├── rounds/                # QuestionScratchpad ⭐
│   ├── questions/             # Question bank
│   ├── analytics/             # 4 analytics views
│   └── settings/              # Data export
├── actions/                   # Server Actions
├── components/                # UI components
└── lib/                       # Utilities
```

## 🔐 Security

- Single-user authentication
- Bcrypt password hashing (12 rounds)
- JWT tokens with 7-day expiry
- httpOnly cookies
- Middleware-protected routes
- No external data sharing

## 💾 Data Export

Export your data anytime from Settings:
- **JSON**: Full database with all relationships
- **CSV**: Spreadsheet-friendly applications data

## 🚢 Deployment

### Local (Zero Cost)
Already running with `npm run dev`!

### Production (Vercel + Turso)
1. Sign up for [Turso](https://turso.tech) (free SQLite hosting)
2. Deploy to [Vercel](https://vercel.com) (free tier)
3. Set environment variables in Vercel dashboard
4. Push schema: `DATABASE_URL=<turso-url> npx prisma db push`

## 🎨 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run db:studio        # Open Prisma Studio
npm run setup:password   # Generate new master password
```

## 🐛 Troubleshooting

**Can't login?**
- Run `npm run setup:password` to create a password
- Check that `.env.local` exists
- Restart the dev server

**Database errors?**
- Run `npx prisma generate`
- Run `npx prisma db push`

## 📝 License

Personal use project. All data remains private and local.

---

Built with Next.js, Prisma, Tailwind CSS, and Radix UI.

**InterviewVault** - Turn your interview experiences into preparation power! 🚀
