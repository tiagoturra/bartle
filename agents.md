# Project Architectural and Structural Guidelines

This document serves as the Single Source of Truth (SSOT) for the development, architecture, security, and code governance of the application. All team members and AI agents must strictly adhere to these definitions.

---

## 1. Core Tech Stack

- **Core:** React 19+ (or current stable version) with TypeScript.
- **Build Tool:** Vite (ESM-native, fast development environment).
- **Styling:** CSS Modules combined with Sass (`.module.scss`).
  - *Mandatory Premise:* All CSS/Sass files must use **nested selectors** by default to guarantee isolated scope and high readability.
- **Global Utilities:** Tailwind CSS is the preferred option for standard utility styling: layout, spacing, sizing, typography, responsive variants, and simple states. Configure theme tokens in `src/index.scss` using Tailwind's `@theme` block.
- **Deploy & Infra:** Vercel.

## 2. Directory and File Structure

The project adopts a domain-driven modular architecture alongside an Atomic Design pattern for shared components.

```text
project-root/
├── .vercelignore              # Managed deployment exclusions for Vercel
├── vercel.json                # Vercel route configurations, headers, and serverless limits
├── vite.config.ts             # Vite configuration with path aliases
├── tailwind.config.js         # Global Tailwind token configurations
├── README.md                  # Main project overview and setup guide (Auto-updated)
├── src/
│   ├── main.tsx               # React application entry point
│   ├── index.css              # Global styles and Tailwind injection
│   ├── assets/                # Static images, fonts, and vector graphics
│   │
│   ├── api/                   # Handlers for Serverless Functions (Backend-in-Frontend)
│   │   ├── users.ts
│   │   └── payment.ts
│   │
│   ├── core/                  # Global frontend infrastructure elements
│   │   ├── config/            # Environment variables and global constants
│   │   ├── http/              # Configured HTTP client (e.g., Axios or native Fetch)
│   │   └── security/          # Encryption, sanitization, and token middlewares
│   │
│   ├── i18n/                  # Centralized internationalization configurations
│   │   ├── locales/           # Translation dictionaries split by language
│   │   │   ├── pt-BR/
│   │   │   │   ├── common.json
│   │   │   │   └── auth.json
│   │   │   └── en-US/
│   │   │       ├── common.json
│   │   │       └── auth.json
│   │   ├── config.ts          # i18next / react-i18next initialization
│   │   └── index.ts           # Clean export for main.tsx bootstrap
│   │
│   ├── design-system/         # Domain-agnostic isolated UI design system
│   │   ├── tokens/            # Colors, spacing, and typography (Sass variables/tokens)
│   │   └── components/        # Atomic, stateless, and reusable UI components
│   │       ├── atoms/         # Button, Input, Badge
│   │       │   └── Button/
│   │       │       ├── Button.tsx
│   │       │       ├── Button.module.scss  # Strictly written using Nested Sass
│   │       │       └── index.ts
│   │       └── molecules/     # FormField, SearchBar
│   │
│   ├── modules/               # Domain-driven business modules
│   │   ├── auth/              # Example: Authentication flow
│   │   │   ├── components/    # Smart components exclusive to this flow
│   │   │   ├── hooks/         # Domain-specific custom hooks (e.g., useLogin.ts)
│   │   │   ├── services/      # Specific API orchestration layer
│   │   │   └── pages/         # Login page, Register page, etc.
│   │   └── dashboard/
│   │
│   └── routes/                # Application routing configuration and guards
```

## 3. CSS and Styling Guidelines

1. **Utility-first baseline:** Use Tailwind classes whenever an existing utility expresses the styling intent. This includes layout, spacing, sizing, typography, responsive variants, alignment, and simple visual states.
2. **Scoping:** Use CSS Modules only for custom visual behavior that Tailwind cannot describe cleanly, such as component-specific pseudo-elements, organic textures, complex animation, state relationships, and intricate selectors. Business-specific custom styling belongs inside the component's folder.
3. **Nested CSS Constraint:** The use of Sass requires code structures to follow nesting patterns to directly map to the component's DOM tree.
   - *Mandatory Example:*

     ```scss
     /* Button.module.scss */
     .container {
       display: inline-flex;
       padding: var(--spacing-md);

       .icon {
         width: 16px;
         height: 16px;
       }

       &:hover {
         background-color: var(--color-primary-hover);
       }
     }
     ```

## 3.1 Reusable Component Architecture

1. **Composition first:** Prefer composing pages from reusable components over implementing structural UI directly in a page. Repeated or broadly applicable elements such as `Header`, `Footer`, navigation, theme controls, language selectors, buttons, cards, inputs, and section wrappers must be extracted into appropriately scoped components.
2. **Placement:** Domain-agnostic components belong in `src/design-system/components/`; components reused only within a business domain belong in that domain's `components/` directory. Pages should focus on orchestration, content composition, and module-specific state.
3. **Single responsibility:** A reusable component must have one clear UI responsibility, a typed public API, and no dependency on a specific page unless it is explicitly domain-scoped.
4. **Avoid premature abstraction:** Keep one-off visual details within their owning component. Extract a component when it is reused, represents a meaningful interface unit, or is likely to be independently maintained.
5. **Consistency:** Before creating a new component, inspect the design system and relevant module for an existing component that can be reused or extended.

## 3.2 Routes and Browser Helpers

1. **Routing:** Use `react-router-dom` for all client-side application routes. Route declarations belong in `src/routes/`; pages must be rendered through the route configuration rather than mounted directly from `main.tsx`.
2. **Browser helpers:** Repeated browser operations must be implemented as typed, focused helpers under `src/core/`, rather than being duplicated in components. This includes URL parameter parsing, cookie access, and local/session storage access.
3. **Storage safety:** Never use `localStorage`, `sessionStorage`, or client-readable cookies for long-lived authentication credentials. Cookie helpers are only for non-sensitive values; authentication cookies must be set as `HttpOnly`, `Secure`, and `SameSite=Strict` by server-side code.
4. **Runtime guards:** Browser helpers must guard access to `window`, `document`, and browser storage so they fail safely in non-browser rendering environments.

## 4. Serverless Architecture (Vercel Functions)

To safely stay within the resource constraints and limits of the Vercel infrastructure, the following API governance rules apply:

- **Strict Cap:** The project enforces a maximum limit of **12 active Serverless Functions**.
- **Resource-Based Routing Strategy (Monolithic Functions):** To avoid hitting the 12-function threshold, creating a separate file for every single action/endpoint (e.g., `createUser.ts`, `deleteUser.ts`) is strictly forbidden. Instead, group endpoints by resource inside a single file controlled by HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- *Example Internal Structure of a Serverless Function (`src/api/users.ts`):*

  ```typescript
  export default async function handler(req: Request) {
    const { method } = req;
    switch (method) {
      case 'GET': return handleGetUsers(req);
      case 'POST': return handleCreateUser(req);
      default: return new Response('Method Not Allowed', { status: 405 });
    }
  }
  ```

## 5. Mandatory Security Practices

1. **Environment Variables:** Never inject raw credential strings (`secret_keys`, tokens) into the codebase. Use `import.meta.env.VITE_APP_...` on the client and `process.env` on serverless environments. All secrets must be securely declared via the Vercel Dashboard.
2. **Input Sanitization:** Any user input originating from forms must be validated and sanitized on the client side and re-validated on the serverless backend using structural schemas (e.g., `Zod` or `Yup`).
3. **Security Headers Configuration:** Enforce explicit, strict security policies in the `vercel.json` configuration, including `Content-Security-Policy (CSP)`, `X-Frame-Options` (to prevent Clickjacking), and `X-Content-Type-Options`.
4. **Secure Client Storage:** Long-lived authorization tokens (JWT) must never be exposed in `localStorage`. Cookies configured with `HttpOnly`, `Secure`, and `SameSite=Strict` via Serverless APIs are the required standard.

## 6. Deployment and Performance Governance (Vercel)

- **Ignoring Documentation Files:** To optimize build performance, save bandwidth, and prevent unintended exposure of governance files, all markdown files (`.md`), local documentation directories, and Storybook stories must be listed in the `.vercelignore` file.
- **Caching Policies:** Static assets or serverless API responses that do not undergo frequent modifications must implement `Cache-Control: s-maxage` headers to leverage Vercel's global CDN edges.

## 7. Internationalization Governance (i18n)

To guarantee the application is fully translatable in the future, hardcoding raw text strings directly into React template files (`.tsx`) is strictly prohibited.

### Implementation Guidelines

1. **Tooling:** Use `i18next` and `react-i18next`.
2. **Namespace Segregation:** Do not manage all translations inside a single monolith file. Split translations into distinct `.json` files mapped by context (namespaces), such as `common.json` (global), `auth.json` (authentication), or `dashboard.json`.
3. **Key Convention:** Use descriptive keys formatted in `camelCase` or `snake_case`. Avoid vague keys that might result in structural ambiguity.
4. **Bootstrapping:** The `src/i18n/index.ts` config entrypoint must be imported at the very top of `src/main.tsx` to ensure dictionary assets load completely before React components render.

### Code Review and AI Validation Rule

- **Prohibited:** `<span>Sign in</span>` or `<Button>Submit</Button>`
- **Mandatory:** `<span>{t('auth:login.submit_button')}</span>` or `<Button>{t('common:actions.send')}</Button>`

## 8. AI Documentation Maintenance Rule (README.md Continuous Updates)

- **Context Awareness:** Any AI agent interacting with this repository that alters project configurations, modifies dependencies, updates environment variable definitions, or introduces new core workflows **must immediately document the changes in the `README.md` file**.
- **Scope:** The `README.md` should always contain an up-to-date **Quick Start** guide, local **Installation** steps, and an accurate list of required local **Environment Variables**. Never leave documentation sync for a future step.
