Technical Assessment — Front-End Developer (React)
Duration:  2–3 hours
Technology:  React 18+ · TypeScript · Vite · Functional Components · React Hooks
Focus areas:  Performance and Security are weighted heavily — build fast, and build safe.
Objective
Build a modular Records / Employee Management application in React + TypeScript. The assessment evaluates your practical React skills — component architecture, state, API integration, reusable components, forms, filtering, pagination — with a deliberate emphasis on two areas we care about most: performance under load and secure, defensive front-end coding. The application should be responsive, user-friendly and maintainable.
Project Structure
Follow a clean React + TypeScript structure similar to the following (you may adapt it if you can justify your approach):
records-app/
├── public/
├── src/
│   ├── components/
│   │   ├── EmployeeTable.tsx
│   │   ├── EmployeeForm.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── Pagination.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── services/employeeApi.ts
│   ├── hooks/useEmployees.ts
│   ├── types/employee.ts
│   ├── utils/  (exportUtils.ts, sanitize.ts, helpers.ts)
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
Section 1 — React Architecture
Component-based architecture
Build the app from reusable, typed functional components (App, EmployeeTable, EmployeeForm, SearchBar, FilterPanel, Pagination, Modal). Each should have a single, clear responsibility and avoid duplication.
React Hooks
Use hooks appropriately (useState, useEffect, and useMemo / useCallback / custom hooks where they add value). Demonstrate command of props, derived state, side effects, conditional rendering and — importantly — re-render behaviour.
Section 2 — API Integration
●	Fetch data from an external public/mock REST API (JSONPlaceholder, MockAPI, ReqRes, etc.) through a separate, typed service file — no fetch calls scattered through the UI.
●	Handle all states explicitly: loading, success, empty, and error (with a clear, user-friendly message).
Section 3 — Records Table
A responsive table generated dynamically from state, showing ID, Name, Email, Department, Role, Status and Actions (Edit / Delete), with loading and empty states.
Section 4 — Search & Filtering
●	Search by name, email or role, updating results dynamically — the search input must be debounced (no request/recompute per keystroke).
●	A multi-select department filter that works together with search (both conditions applied).
Section 5 — Pagination
Client-side pagination (next / previous / jump to page / current page / total records), working correctly together with search and filtering. Example: “Showing 1–10 of 57”.
Section 6 — Create Record
An “Add” button opens a modal form (First Name, Last Name, Email, Department, Role, Status). Use React state for the form, validate required fields and formats, show clear validation messages, add the record to the dataset, and reset/close on success.
Section 7 — Delete Record
Each row has a Delete action that asks for confirmation, then removes the record from state and updates the table and pagination (including deleting the last item on a page).
Section 8 — Data Export
Export the currently displayed data (respecting active search/filters) as CSV and JSON. Note the security requirement in Section 10 regarding CSV export.
Section 9 — Performance (core, weighted)
Performance is a scored focus, not an afterthought. We expect:
●	Virtualization of the list/table for large datasets — render only what's visible (this is expected, not just a bonus).
●	No wasted re-renders — memoize expensive work and components (useMemo / useCallback / React.memo), stable keys, no inline objects/functions passed as props where it causes churn.
●	Derived, not duplicated, state — filtered/sorted lists derived from the source data, not stored separately.
●	A lean critical path — code-splitting / lazy loading for heavy parts; keep the bundle reasonable.
●	Be ready to explain, at interview, how you would measure this (React DevTools Profiler, Core Web Vitals, p95) and where the bottlenecks are.
Section 10 — Security (core, weighted)
Secure, defensive front-end coding is a scored focus. We expect:
●	Safe rendering (XSS) — never inject unsanitized data with dangerouslySetInnerHTML; treat all API and user data as untrusted.
●	Input validation & sanitization — validate and sanitize form input on the client (and assume the server does too); reject malformed data clearly.
●	No secrets in the client — no hardcoded API keys/tokens in the code; nothing sensitive in URLs, logs or committed files (use env config).
●	Safe auth/token handling — if you implement any auth, handle tokens safely (in memory, not logged); don't expose sensitive detail in error messages.
●	CSV-injection awareness — when exporting CSV, neutralise formula-injection (cells beginning with =, +, -, @).
●	Dependency hygiene — prefer well-maintained libraries; avoid unnecessary or risky dependencies.
Section 11 — UI / UX
A clean, professional, responsive interface with proper spacing, clear actions, user-friendly forms, loading indicators, error and empty states and confirmation dialogs. Any styling approach is fine (plain CSS, CSS Modules, Tailwind, MUI, Bootstrap) — we judge the quality of the implementation, not the library.
Section 12 — React Best Practices
●	Reusable components with a single responsibility; business logic separated from UI.
●	State used appropriately with no unnecessary duplication.
●	API communication separated from presentation; clean, readable, well-typed, consistently formatted code.
Section 13 — Error & Edge Cases
Handle API failure, empty responses, no-result searches, invalid submissions, deleting the last item on a page, filters yielding no records, and export with no records.
Submission Requirements
Submit the complete source code, package.json, a README.md with install/run instructions, and any API configuration needed. The project must run with npm install then npm run dev, with no major console errors or warnings.
Evaluation Criteria
Area	Weight
React fundamentals & Hooks	15%
Component architecture & reusability	10%
API integration & error handling	10%
State management	10%
Search, filtering & pagination	10%
Forms & validation	10%
Performance optimization	15%
Security & secure coding	10%
Code quality & maintainability	5%
UI / UX & responsiveness	5%
Total	100%
Bonus (up to 10 points)
●	Automated tests (Vitest / React Testing Library).
●	Measurable performance work (profiling notes, before/after).
●	Extra security hardening (e.g. Content-Security-Policy notes, stricter validation).
●	Excellent component abstraction and thoughtful UX improvements.
Important Instructions
●	Use React functional components with TypeScript — no class components.
●	Use hooks for state and side effects; don't put all logic in App.tsx.
●	Keep API calls separate from presentation components.
●	Do not use hardcoded data as the primary data source.
●	Third-party libraries are allowed where appropriate — be able to justify each.
●	Be prepared to explain your performance and security decisions at interview.
