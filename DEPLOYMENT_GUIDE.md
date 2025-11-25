# ATLAS Deployment Guide

## Phase 1: Immediate "High-Fidelity Demo" Deployment
**Goal:** Get a live URL to share with stakeholders immediately.
**Data:** Saved locally on the user's browser (LocalStorage). Users on different computers **cannot** see each other's data.

### Steps:
1. **Export Code:** Download the project zip file from the AI Studio/Editor.
2. **Create GitHub Repository:**
   - Go to [GitHub.com](https://github.com) and create a new repository (e.g., "atlas-demo").
   - Upload your project files to this repository.
3. **Deploy to Vercel (Easiest):**
   - Go to [Vercel.com](https://vercel.com) and sign up.
   - Click "Add New..." -> "Project".
   - Import your GitHub repository.
   - **Build Settings:** Vercel usually detects these automatically.
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click **Deploy**.
4. **Done:** Vercel will give you a URL (e.g., `https://atlas-demo.vercel.app`). You can send this link to anyone.

---

## Phase 2: Making it "Real Software" (Production)
**Goal:** Users on different computers share data. Real login security.
**Data:** Saved in a cloud database (Supabase).

### Steps:
1. **Set up Backend (Supabase):**
   - Go to [Supabase.com](https://supabase.com) and create a free project.
   - This gives you a Database (PostgreSQL) and Authentication system automatically.
2. **Connect Frontend to Backend:**
   - Install the Supabase client: `npm install @supabase/supabase-js`
   - Rename `services/supabaseClient.example.ts` to `services/supabaseClient.ts`.
   - Add your Supabase URL and Key (found in Supabase Dashboard -> Settings -> API) to a `.env` file.
3. **Replace Mock Data:**
   - In `services/mockApi.ts`, you are currently faking data.
   - You need to replace the `localStorage` calls with Supabase calls.
   - **Example:**
     ```typescript
     // Old (Mock)
     // return loadFromStorage('users');

     // New (Real)
     // const { data, error } = await supabase.from('users').select('*');
     // return data;
     ```
4. **Deploy Updates:** Push your changes to GitHub. Vercel will automatically update your live site.

## Troubleshooting
- **White Screen on Deploy?** Check your `vite.config.ts` base path.
- **Routing Errors?** Ensure you have a `vercel.json` file that redirects all routes to `index.html` for React Router to work.
