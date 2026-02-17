# OWN A COLOR | The Exclusive Digital Hex Registry

![Project Status](https://img.shields.io/badge/status-production-success)
![Tech Stack](https://img.shields.io/badge/stack-Next.js_14_|_Supabase_|_Gumroad-blue)
![License](https://img.shields.io/badge/license-MIT-green)

> **"Own a Color" is a digital collectible registry allowing users to claim exclusive ownership of hexadecimal color codes. Built with scalability and real-time performance in mind.**

---

## 🏗️ Architecture & Tech Stack

This project leverages a modern, serverless architecture to ensure high availability and zero-maintenance scaling.

* **Frontend Framework:** [Next.js 14 (App Router)](https://nextjs.org/) - Utilizing Server Components for SEO and Client Components for interactivity.
* **Database & Realtime:** [Supabase (PostgreSQL)](https://supabase.com/) - Storing ownership records and pushing live updates to the UI via WebSockets.
* **Payment Gateway:** [Gumroad](https://gumroad.com/) - Handling transactions, VAT, and acting as the Merchant of Record.
* **Styling:** CSS Modules & Glassmorphism UI (Custom CSS animations).
* **Deployment:** [Vercel](https://vercel.com/) - CI/CD pipeline and Edge Network hosting.

---

## 🚀 Key Features

* **🎨 Dynamic Visual Engine:**
    * Layered background animations (`fixed` positioning for performance).
    * Real-time hex code validation and visual preview.
    * Smart gradient transitions based on user input.
* **⚡ Real-Time Ledger:**
    * Live feed of recent sales powered by Supabase Realtime subscriptions.
    * Updates instantly across all connected clients without page refresh.
    * Optimized scrollable container for scalability (`max-height` implementation).
* **🔒 Secure Transaction Flow:**
    * Direct integration with Gumroad via URL parameters (`?SelectedHex=...`).
    * Atomic database updates to prevent double-booking of colors.
* **📱 Fully Responsive:**
    * Mobile-first design approach.
    * Touch-optimized interface and adaptive layouts.
* **SEO Optimized:**
    * Server-side metadata generation in `layout.tsx`.
    * Open Graph (OG) tags for rich social media sharing.

---

## 🛠️ Local Development Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone [https://github.com/YOUR_USERNAME/own-a-color.git](https://github.com/YOUR_USERNAME/own-a-color.git)
cd own-a-color
2. Install dependenciesBashnpm install
# or
yarn install
3. Environment VariablesCreate a .env.local file in the root directory and add your Supabase credentials:KódrészletNEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
4. Run the development serverBashnpm run dev
Open http://localhost:3000 with your browser to see the result.💾 Database Schema (Supabase)The project uses a single, optimized table named sold_colors.Column NameTypeDescriptioniduuidPrimary Keyhex_codetextThe unique hex code (e.g. #FF0055)owner_nametextDisplay name of the owneremailtextOwner's contact email (Private)created_attimestamptzTransaction timestamp🌍 Live DeploymentThe project is deployed on Vercel and can be accessed here:https://own-a-color.vercel.app📜 LicenseThis project is open source and available under the MIT License.Architected by [Your Name/Handle] - 2026
