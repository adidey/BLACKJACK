# 🔑 Environment Variables Setup

## Where to Put Your API Keys

Create a file named `.env` in the **root directory** of the project (same level as `package.json`).

## Step-by-Step Instructions

### 1. Get Your Supabase Credentials

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in or create an account
3. Create a new project (or select an existing one)
4. Wait for the project to finish setting up (takes 1-2 minutes)

### 2. Find Your API Keys

1. In your Supabase project dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL** - Copy this value
   - **anon public** key - Copy this value (under "Project API keys")

### 3. Create the `.env` File

1. In the root of this project, create a file named `.env`
2. Add the following content (replace with your actual values):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGcisInR5cCI6IkpXVCJ9...
```

**Example:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI4MCwiZXhwIjoxOTU0NTQzMjgwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### 4. Important Notes

- ⚠️ **Never commit `.env` to Git** - It's already in `.gitignore`
- ✅ The `.env` file should be in the root directory (same folder as `package.json`)
- ✅ Restart the dev server after creating/updating `.env`
- ✅ The file should start with `VITE_` prefix for Vite to pick it up

### 5. Verify It's Working

After setting up `.env` and running `npm run dev`, check the browser console. If you see "Missing Supabase environment variables" error, double-check:
- File is named exactly `.env` (not `.env.txt` or `.env.local`)
- File is in the root directory
- Values don't have quotes around them
- No extra spaces before/after the `=` sign

## Quick Setup Checklist

- [ ] Created Supabase project
- [ ] Ran `supabase-schema.sql` in Supabase SQL Editor
- [ ] Copied Project URL from Supabase dashboard
- [ ] Copied anon key from Supabase dashboard
- [ ] Created `.env` file in project root
- [ ] Added `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Restarted dev server

## Need Help?

If you're having trouble:
1. Make sure the `.env` file is in the correct location
2. Check that there are no typos in the variable names
3. Ensure values don't have extra spaces
4. Restart the terminal/dev server after creating the file

