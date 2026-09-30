# Employee Records Management

A modular Employee Management application built with **React 19**, **TypeScript**, and **React Router v8** (SSR). The app covers CRUD operations, search, filtering, pagination, virtualization, and secure, defensive front-end coding practices.

## Tech Stack

- **React 19** + **TypeScript**
- **React Router v8** — file-based routes with SSR loaders/actions
- **TanStack React Query** — data fetching, caching, optimistic mutations
- **Tailwind CSS v4** — utility-first styling with `@tailwindcss/vite`
- **Radix UI** — accessible Dialog and Select primitives (shadcn pattern)
- **Vitest** + **React Testing Library** — unit tests
- **Vite 8** — dev server with HMR

## Features

- **Authentication** — cookie-based login/logout with server-side credential validation
- **Full CRUD** — Create, Read, Update, Delete employees via MockAPI
- **Debounced search** — custom `useDebounce` hook for performant filtering
- **Department filter** — multi-select chip-based department filter
- **Client-side pagination** — page navigation with jump-to-page
- **Virtualized table** — only visible rows are rendered (scroll-based windowing)
- **Lazy-loaded form** — `React.lazy` + `Suspense` for code-splitting the employee form
- **Export** — CSV and JSON export with formula-injection protection
- **XSS protection** — input sanitization, markup rejection, no `dangerouslySetInnerHTML`
- **CLS prevention** — fixed table layout with reserved heights across loading/data/empty states
- **Optimistic updates** — React Query mutations update the cache immediately
- **SSR prefetch** — employee data is prefetched on the server and hydrated on the client

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root (one is already provided):

```env
API_BASE_URL=https://6abcaeac5121d616d90bffdf.mockapi.io/api/v1

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
SESSION_SECRET=super-secret-session-key
AUTH_TOKEN=dummy-jwt-token-for-assessment
```

### Development

```bash
npm run dev
```

The app will be available at **http://localhost:5173**.

### Login Credentials

| Field    | Value               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `admin123`          |

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

To run in watch mode:

```bash
npm run test:watch
```

### Type Checking

```bash
npm run typecheck
```

## Project Structure

```
app/
├── components/
│   ├── ui/                  # Reusable UI primitives (Dialog, Select)
│   ├── EmployeeRecords.tsx  # Main dashboard page
│   ├── EmployeeForm.tsx     # Add/Edit form with validation
│   ├── EmployeeTable.tsx    # Virtualized table
│   ├── FilterPanel.tsx      # Department filter chips
│   ├── Pagination.tsx       # Page navigation
│   ├── SearchBar.tsx        # Search input
│   └── Loading.tsx          # Loading spinner
├── hooks/
│   ├── useEmployees.ts      # React Query hook with mutations
│   └── useDebounce.ts       # Generic debounce hook
├── services/
│   ├── apiConfig.ts         # Shared fetch wrapper with timeout
│   └── employeeApi.ts       # Employee CRUD API functions
├── routes/
│   ├── home.tsx             # Protected dashboard (SSR loader)
│   ├── login.tsx            # Login page with form action
│   └── logout.tsx           # Logout action (clears cookie)
├── lib/
│   ├── session.ts           # Cookie-based auth (httpOnly, signed)
│   ├── query-client.ts      # React Query client + SSR prefetch
│   └── utils.ts             # cn() utility (clsx + tailwind-merge)
├── types/
│   └── employee.ts          # Employee type, departments, roles
├── utils/
│   ├── sanitize.ts          # Input validation & XSS protection
│   ├── exportUtils.ts       # CSV/JSON export with formula-injection guard
│   └── helpers.ts           # Pagination helpers, constants
├── __tests__/
│   ├── setup.ts             # Test setup (jest-dom matchers)
│   └── EmployeeForm.test.tsx # Form validation & button tests
├── routes.ts                # Route config
├── root.tsx                 # App shell (QueryClientProvider)
└── app.css                  # Tailwind + shadcn theme + animations
```

## API Endpoints

All endpoints hit the MockAPI base URL defined in `.env`:

| Method   | Endpoint          | Description          |
| -------- | ----------------- | -------------------- |
| `GET`    | `/employee`       | List all employees   |
| `GET`    | `/employee/:id`   | Get employee by ID   |
| `POST`   | `/employee`       | Create new employee  |
| `PUT`    | `/employee/:id`   | Update employee      |
| `DELETE` | `/employee/:id`   | Delete employee      |

## Testing

Tests are written with **Vitest** and **React Testing Library** (`@testing-library/react` + `@testing-library/user-event`).

| Test | What it validates |
| ---- | ----------------- |
| renders all form fields | All 6 fields are present in the DOM |
| renders submit and cancel buttons | Both action buttons render |
| renders custom submit label | Dynamic label prop works |
| shows validation errors on empty submit | Required-field errors appear, `onSubmit` not called |
| shows error for invalid first name | Numbers rejected in name field |
| shows error for invalid email | Invalid email format rejected |
| rejects markup in first name (XSS) | `<script>` tags blocked |
| rejects markup in email (XSS) | `<img>` tags blocked |
| calls onCancel on cancel click | Cancel button fires callback |
| disables buttons when disabled | Both buttons disabled during save |
| validation errors have role=alert | Accessibility: errors announced to screen readers |
