# PunditTracker

PunditTracker is a modern web application designed to track, verify, and grade predictions made by public figures (pundits) in Finance, Sports, and Tech. It leverages AI to assist in verifying outcomes and runs on the edge using Cloudflare Pages and D1.

## 🚀 Features

- **Pundit Profiles**: Comprehensive profiles displaying bio, category, and historical accuracy.
- **Prediction Tracking**: Log specific predictions with dates, deadlines, and confidence levels.
- **AI Auto-Grading**: Integrated with **OpenRouter** to automatically verify if a prediction came true using LLMs (e.g., Gemini, GPT-4).
- **Admin Dashboard**: A secure interface for managing pundits, adding predictions, and grading outcomes.
- **Edge-Native**: Built for performance using **Next.js** on **Cloudflare Pages** with **D1 Database**.
- **Premium UI**: A sleek, dark-themed interface with responsive design and smooth animations.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS Modules & CSS Variables
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite at the Edge)
- **AI Provider**: [OpenRouter](https://openrouter.ai/) (Access to free & paid models)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for Cloudflare):
  ```bash
  npm install -g wrangler
  ```
- A [Cloudflare Account](https://dash.cloudflare.com/sign-up).
- An [OpenRouter Account](https://openrouter.ai/) (for AI features).

---

## 💻 Local Development Setup

Follow these steps to get the project running on your local machine.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pundit-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp env.example .env.local
```
Open `.env.local` and add your OpenRouter API key:
```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
OPENROUTER_MODEL=alibaba/tongyi-deepresearch-30b-a3b:free
```

### 4. Setup Local Database (D1)
We use Wrangler to emulate the D1 database locally.

1.  **Create the database config**:
    The `wrangler.jsonc` file is already configured, but you need to ensure the database exists locally.
    ```bash
    npx wrangler d1 create pundit-tracker-db
    ```
    *Note: If this command outputs a `database_id`, update the `database_id` in `wrangler.jsonc` with this new ID.*

2.  **Apply the Schema**:
    This creates the tables and seeds initial data.
    ```bash
    npx wrangler d1 execute pundit-tracker-db --local --file=./schema.sql
    ```

### 5. Run the Development Server
Start the Next.js dev server. It will automatically connect to the local D1 emulation.
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment Guide (Cloudflare Pages)

To deploy this application to the internet, we use Cloudflare Pages.

### 1. Login to Cloudflare
```bash
npx wrangler login
```
Follow the browser prompts to authorize Wrangler.

### 2. Create Remote Database
Create the D1 database in your Cloudflare account:
```bash
npx wrangler d1 create pundit-tracker-db
```
**Important**: Copy the `database_id` from the output and paste it into your `wrangler.jsonc` file under `d1_databases`.

### 3. Initialize Remote Database
Apply the schema to the live database on Cloudflare:
```bash
npx wrangler d1 execute pundit-tracker-db --remote --file=./schema.sql
```

### 4. Build the Application
Next.js needs to be built specifically for the Cloudflare Edge runtime:
```bash
npm run pages:build
```
This will create a `.vercel/output/static` directory.

### 5. Deploy to Cloudflare Pages
Deploy the built assets:
```bash
npx wrangler pages deploy .vercel/output/static --project-name=pundit-tracker
```

### 6. Configure Production Environment
1.  Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Navigate to **Workers & Pages** > **pundit-tracker**.
3.  Go to **Settings** > **Environment Variables**.
4.  Add the following variables:
    - `OPENROUTER_API_KEY`: Your OpenRouter API Key.
    - `OPENROUTER_MODEL`: (Optional) Your preferred model.
5.  Go to **Settings** > **Functions** > **D1 Database Bindings**.
6.  Bind the variable `DB` to your `pundit-tracker-db` database.
7.  **Redeploy** (or trigger a new deployment) for changes to take effect.

---

---

## 📖 How to Use

### 1. Browsing Pundits
- **Home Page**: The landing page displays a grid of all tracked pundits.
- **Pundit Cards**: Click on any card to view that pundit's full profile.
- **Stats**: Quickly see a pundit's accuracy rating directly from the card.

### 2. Viewing Profiles
- **Profile Page**: Shows the pundit's bio, image, and detailed stats.
- **Prediction History**: A timeline of all predictions made by this pundit.
- **Outcomes**: Predictions are color-coded:
    - 🟢 **Correct**: The prediction came true.
    - 🔴 **Incorrect**: The prediction was false.
    - ⚪ **Pending**: The deadline hasn't passed or it hasn't been graded yet.

### 3. Admin Dashboard (The Control Center)
Access the dashboard at `/admin`. This is where the magic happens.

#### Adding a Prediction
1.  Select a **Pundit** from the dropdown menu.
2.  Enter the **Prediction Statement** (e.g., "Bitcoin will hit $100k by EOY").
3.  Set the **Date Made** (when they said it).
4.  (Optional) Set a **Deadline** and **Confidence** level.
5.  Click **Add Prediction**.

#### Using AI Auto-Grading ✨
1.  Scroll to the **Pending Predictions** list.
2.  Find a prediction you want to verify.
3.  Click the **✨ Check with AI** button.
4.  The AI (OpenRouter) will analyze the statement against current knowledge/web search (depending on the model) and suggest an outcome with a confidence score and reasoning.
    *   *Example Output*: "AI Suggests: Correct (95% confidence). Reason: Bitcoin reached $102,000 on Dec 5th."

#### Manual Grading
- If you prefer to be the judge, simply click **Mark Correct** or **Mark Incorrect** on any pending prediction.
- The pundit's accuracy score will update immediately.

---

## 📂 Project Structure

```
pundit-tracker/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API Routes (Edge compatible)
│   │   ├── pundit/[id]/     # Dynamic pundit profile pages
│   │   ├── globals.css      # Global styles & theme variables
│   │   └── page.tsx         # Home page
│   ├── lib/
│   │   ├── data.ts          # Mock data (fallback)
│   │   ├── db-access.ts     # Data access layer (D1 + API)
│   │   └── db.ts            # Database connection utility
├── public/                  # Static assets
├── schema.sql               # Database schema & seed data
├── wrangler.jsonc           # Cloudflare configuration
├── next.config.ts           # Next.js configuration
└── package.json             # Dependencies & scripts
```

## ❓ Troubleshooting

- **Port 3000 in use**: If `npm run dev` fails, Next.js will try port 3001 or 3002. Check the terminal output for the correct URL.
- **D1 Error in Local Dev**: Ensure you ran `npx wrangler d1 execute ... --local`.
- **"No D1 binding found"**: In `src/lib/db.ts`, we handle the case where D1 isn't available by falling back to mock data or returning null. Ensure `wrangler.jsonc` has the correct binding name `DB`.

## 📄 License

MIT
