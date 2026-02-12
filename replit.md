# Aurelle - Fashion eCommerce Platform

## Overview

Aurelle is a full-stack Shopify-style fashion eCommerce website with a minimal, luxury aesthetic inspired by thebeige.in. It features product browsing, shopping cart, checkout, order management, user profiles, and an admin dashboard for product management. The design uses a beige/cream/black/gold color palette with serif headings (Playfair Display) and sans-serif body text (DM Sans) for a premium feel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Overall Structure
The project follows a monorepo pattern with three main directories:
- `client/` — React frontend (SPA)
- `server/` — Express backend (REST API)
- `shared/` — Shared types, schemas, and route definitions used by both client and server

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Routing**: Wouter (lightweight client-side router) — NOT React Router
- **State Management**: TanStack React Query for server state; no global client state library
- **Styling**: Tailwind CSS with CSS variables for theming, shadcn/ui component library (new-york style)
- **UI Components**: shadcn/ui components live in `client/src/components/ui/`. Custom components (Navbar, Footer, ProductCard) are in `client/src/components/`
- **Forms**: react-hook-form with zod validation via @hookform/resolvers
- **Animations**: framer-motion for hover effects and page transitions
- **Icons**: lucide-react
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

**Key pages**: Home, Shop, ProductDetail, Cart, Checkout, Profile, Admin, NotFound

**Custom hooks** (in `client/src/hooks/`):
- `use-auth` — Fetches current user from `/api/auth/user`, handles login redirect
- `use-cart` — CRUD operations for server-persisted cart
- `use-products` — Product listing/detail queries and admin mutations
- `use-orders` — Order listing and creation
- `use-toast` — Toast notification system
- `use-mobile` — Responsive breakpoint detection

### Backend Architecture
- **Framework**: Express.js running on Node with TypeScript (tsx for dev, esbuild for production)
- **HTTP Server**: Node's built-in `createServer` wrapping Express
- **API Pattern**: RESTful JSON API under `/api/` prefix. Route definitions are shared between client and server via `shared/routes.ts` using Zod schemas for input validation and response typing
- **Authentication**: Replit Auth (OpenID Connect via `openid-client/passport`). Sessions stored in PostgreSQL via `connect-pg-simple`. Auth code lives in `server/replit_integrations/auth/`
- **Dev Server**: Vite middleware mode with HMR in development
- **Production**: Static file serving from `dist/public/` with SPA fallback

### Route Contract (`shared/routes.ts`)
The `api` object defines all API endpoints with their HTTP methods, paths, Zod input schemas, and response schemas. This is the single source of truth for the API contract. Both the server (for validation) and client (for type-safe fetching) use these definitions.

### Data Storage
- **Database**: PostgreSQL via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with `drizzle-zod` for automatic Zod schema generation from table definitions
- **Schema location**: `shared/schema.ts` (main tables) and `shared/models/auth.ts` (auth-specific tables)
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Storage layer**: `server/storage.ts` implements `IStorage` interface with `DatabaseStorage` class — all database operations go through this layer

### Database Tables
1. **users** — User accounts (id, email, firstName, lastName, profileImageUrl, timestamps). Required by Replit Auth.
2. **sessions** — Session storage for express-session. Required by Replit Auth.
3. **products** — Product catalog (title, description, price, originalPrice, category, images[], sizes[], colors[], stock, isFeatured, sku, tags[])
4. **cartItems** — Server-persisted shopping cart (userId, productId, quantity, size, color)
5. **orders** — Order records (userId, status, total, shippingAddress as JSONB, paymentMethod, paymentId, trackingNumber)
6. **orderItems** — Line items for orders (orderId, productId, quantity, price, size, color)

### Build System
- **Development**: `tsx server/index.ts` runs the server with Vite dev middleware
- **Production build**: Custom `script/build.ts` that runs Vite build for client and esbuild for server, outputting to `dist/`
- **Server bundling**: esbuild bundles server code with an allowlist of dependencies to bundle (reducing cold start syscalls); other deps are kept external

## External Dependencies

### Database
- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable. Used for all data storage including sessions.

### Authentication
- **Replit Auth** (OpenID Connect) — Handles user authentication. Uses `openid-client` and `passport` with session persistence in PostgreSQL. Login flow redirects to `/api/login`, logout to `/api/logout`.

### Key NPM Packages
- `drizzle-orm` + `drizzle-kit` — Database ORM and schema management
- `express` + `express-session` — HTTP server and session handling
- `passport` + `openid-client` — Authentication
- `connect-pg-simple` — PostgreSQL session store
- `zod` + `drizzle-zod` — Schema validation
- `@tanstack/react-query` — Server state management on client
- `framer-motion` — Animations
- `embla-carousel-react` — Product carousels
- `wouter` — Client-side routing
- shadcn/ui ecosystem (`@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`)

### Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Secret for express-session
- `ISSUER_URL` — OpenID Connect issuer (defaults to `https://replit.com/oidc`)
- `REPL_ID` — Replit environment identifier (used for OIDC client ID)

### Planned but Not Yet Implemented
Based on the requirements document (`attached_assets/`), these integrations are planned but not yet coded:
- **Razorpay** — Payment processing
- **Shiprocket API** — Order tracking
- **Cloudinary** — Product image uploads
- Wishlist functionality
- Address book management