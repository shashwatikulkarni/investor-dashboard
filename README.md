# Next.js Fintech Dashboard

A highly interactive and data-rich web dashboard for investors and corporates, built using Next.js (App Router), Redux Toolkit, and Recharts. The application simulates a complex backend through a custom service layer with mock datasets.

## Core Features

- **Investor Dashboard Overview**: Key portfolio metrics and interactive visualizations (Growth, Industry Distribution).
- **Deal Explorer**: Advanced filtering (Industry, Risk, ROI), sorting, debounced search, and pagination.
- **Deal Details Page**: In-depth analysis of a deal including company info, financial metrics, and risk assessment tabs.
- **Recommendation Engine (Frontend)**: Real-time scoring based on investor preferences.
- **My Interests**: Persisted bookmarking of favorite deals using `localStorage`.
- **Corporate Dashboard**: Analytics tailored for corporates (Funding raised, investor interest trends).

## Architecture & Data Flow

### 1. Data Layer (`/src/data`)
- Simulated datasets `mockDeals.json` (50+ deals) and `mockInvestors.json`. These are purely frontend artifacts simulating database records.

### 2. Service Layer (`/src/services`)
- `dealService.ts` and `investorService.ts` wrap the mock data access in asynchronous functions returning Promises. 
- Artificial delays (300-800ms) and random simulated errors are used to mimic real-world network latency and instability.
- Server-side features like pagination, filtering, and sorting are implemented within these services to simulate SQL queries or backend aggregations.

### 3. State Management (`/src/store` & `/src/features`)
- **Redux Toolkit** is used as the global state container.
- Uses `createAsyncThunk` for managing side effects (calling our mocked services).
- Handles the complex states of loading, success, and error gracefully.
- The `userSlice` integrates with `localStorage` to persist "My Interests" across sessions.

### 4. Component Architecture (`/src/components`)
- **UI Components**: Reusable stateless components (Cards, Buttons, Badges) built with raw CSS Modules.
- **Layouts**: Standardized structure using `Sidebar` and `Topbar` components.
- **Charts**: Recharts wrapped in standard Client Components to ensure proper hydration.

## Optimization Strategies

- **Debounced Search**: User input in the search bar is debounced (`useDebounce` hook) by 500ms before dispatching an action to fetch filtered deals, significantly reducing unnecessary "network" calls and re-renders.
- **Memoization**: While React 18+ and Next.js handle a lot inherently, components and callbacks are structured to prevent unnecessary re-renders when filters are applied.
- **CSS Modules over Inline Styles**: Prevents DOM clutter and performance hits from massive inline style recalculations.
- **Client & Server Component Separation**: Data-heavy UI logic runs on the client (`'use client'`), but Next.js SSR serves the initial layout shell instantly.
- **Pagination**: Loading 10 items per page ensures the DOM remains lightweight and scrolling performs smoothly.

## Styling & Theme

- Built entirely with **Vanilla CSS / CSS Modules**, complying with requirements to avoid utility-first frameworks like Tailwind unless requested.
- Implements a seamless Dark/Light Mode toggle using CSS variables.
- The UI follows a modern Fintech aesthetic with subtle gradients, card depth (box-shadows), and premium micro-interactions (hover states, scaling).

## Setup & Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate mock data (if changes are needed):
   ```bash
   node generate-mock-data.js
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
