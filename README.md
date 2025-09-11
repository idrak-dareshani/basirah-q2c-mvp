# Basirah-Q2C | Quote to Cash System

A modern Quote to Cash (Q2C) system built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

- Customer, Product, Order, Invoice, Quote, and Settings management
- Responsive UI with Tailwind CSS
- Supabase integration for authentication and data storage
- Local storage hooks for persistent state
- Mock data for development and testing

## Project Structure

```
src/
  App.tsx                # Main application component
  index.css              # Global styles
  main.tsx               # App entry point
  components/            # Feature and UI components
    Customers/
    Dashboard/
    Invoices/
    Layout/
    Orders/
    Products/
    Quotes/
    Settings/
    UI/
  data/
    mockData.ts          # Mock data for development
  hooks/
    useLocalStorage.ts   # Custom hook for local storage
    useSupabase.ts       # Custom hook for Supabase
  lib/
    supabase.ts          # Supabase client setup
  types/
    index.ts             # TypeScript types
  utils/                 # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```sh
npm run build
```

### Lint

```sh
npm run lint
```

## Configuration

- Supabase settings: [src/lib/supabase.ts](src/lib/supabase.ts)
- Tailwind CSS: [tailwind.config.js](tailwind.config.js)
- Vite: [vite.config.ts](vite.config.ts)

## License

MIT

---

For more details, see the source files in [src/](src)