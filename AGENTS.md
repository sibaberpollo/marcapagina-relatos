# Marcapagina

## Directory Structure and File Organization

### Recommended Next.js 15 App Router Structure

```
root/
├── @/
│   └── hooks/                   # Custom hooks
├── app/                         # App Router directory
│   ├── layout.tsx               # Root layout (required)
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── (auth)/                  # Route group - doesn't affect URL
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── dashboard/               # Regular route
│   │   ├── layout.tsx          # Nested layout
│   │   ├── page.tsx            # Dashboard page
│   │   ├── loading.tsx         # Loading UI
│   │   ├── error.tsx           # Error handling
│   │   └── settings/
│   │       └── page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/             # Dynamic route
│   │       └── page.tsx
│   └── api/                     # Route handlers
│       ├── auth/
│       │   └── route.ts
│       └── users/
│           └── route.ts
├── components/                  # Shared components
│   ├── ui/                     # Base UI components
│   │   ├── button.tsx
│   │   ├── modal.tsx
│   │   └── index.ts
│   ├── forms/                  # Form components
│   └── layout/                 # Layout components
├── data/                       # Data fetching and management
├── layouts/                    # Layouts for different sections
├── lib/                        # Utility functions
│   ├── utils.ts
│   ├── validations.ts
│   └── db.ts
├── hooks/                      # Custom React hooks
│   ├── use-auth.ts
│   └── use-local-storage.ts
├── types/                      # TypeScript definitions
│   └── meme.ts
├── css/                        # Additional styles
│   └── components.css
├── public/                     # Static assets
│   ├── images/
│   └── icons/
├── prisma/                     # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── middleware.ts               # Middleware
├── next.config.ts              # Next.js config (TypeScript support)
└── package.json
```

### Special Files in App Router

- **`layout.tsx`** - Shared UI for route segments
- **`page.tsx`** - Unique UI of a route (makes route publicly accessible)
- **`loading.tsx`** - Loading UI with React Suspense
- **`error.tsx`** - Error UI with React Error Boundaries
- **`not-found.tsx`** - Not found UI
- **`route.ts`** - API endpoints (Route Handlers)
- **`template.tsx`** - Re-rendered layout UI
- **`default.tsx`** - Parallel route fallback

### Organization Strategies

#### Feature-based Structure

```
app/
├── (marketing)/
│   ├── components/
│   └── lib/
├── (dashboard)/
│   ├── components/
│   └── lib/
└── globals/
    ├── components/
    └── lib/
```

## Architecture Best Practices

### Component Architecture and Patterns

#### Server Components vs Client Components

**Server Components (Default):**

```tsx
// app/products/page.tsx - Server Component
export default async function ProductList() {
  const products = await fetch('https://api.example.com/products', {
    cache: 'force-cache', // Next.js 15 requires explicit caching
  }).then((res) => res.json())

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

**Client Components:**

```tsx
'use client'
// components/InteractiveButton.tsx
import { useState } from 'react'

export default function InteractiveButton() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
```

#### Server-Client Composition Pattern

```tsx
// Server Component with Client Component child
import ClientModal from './client-modal'
import ServerContent from './server-content'

export default function Page() {
  return (
    <ClientModal>
      <ServerContent /> {/* Server component as child */}
    </ClientModal>
  )
}
```

### State Management Approaches

#### Modern State Management Stack

- **Server State**: TanStack Query v5+
- **Client State**: Zustand for global state
- **Form State**: React Hook Form with Server Actions

```tsx
// stores/ui-store.ts
import { create } from 'zustand'

interface UIStore {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
```

```tsx
// hooks/use-products.ts
import { useQuery } from '@tanstack/react-query'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products')
      return res.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### API Routes and Data Fetching

#### Route Handlers with Async Request APIs (Next.js 15)

```tsx
// app/api/users/route.ts
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Async request APIs in Next.js 15
  const cookieStore = await cookies()
  const headersList = await headers()

  const token = cookieStore.get('auth-token')

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await fetchUsersFromDB()
    return NextResponse.json({ users })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
```

#### Parallel Data Fetching

```tsx
export default async function UserProfile({ params }: { params: { id: string } }) {
  // Parallel fetching
  const [user, posts] = await Promise.all([getUser(params.id), getUserPosts(params.id)])

  return (
    <div>
      <UserInfo user={user} />
      <UserPosts posts={posts} />
    </div>
  )
}
```

### Performance Optimization Techniques

#### Partial Prerendering (PPR) - Experimental

```tsx
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}

export default nextConfig
```

```tsx
// app/page.tsx
import { Suspense } from 'react'

export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <StaticHeader />
      <Suspense fallback={<LoadingSkeleton />}>
        <DynamicContent />
      </Suspense>
    </>
  )
}
```

#### Image Optimization

```tsx
import Image from 'next/image'

export default function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority={true} // Above-the-fold images
      placeholder="blur"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      quality={75}
    />
  )
}
```

#### Dynamic Imports

```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR for client-only components
})
```

### SEO Best Practices

#### Metadata API

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
  openGraph: {
    title: 'OG Title',
    description: 'OG Description',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter Title',
    images: ['/twitter-image.png'],
  },
}

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id)

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  }
}
```

#### Dynamic OG Image Generation

```tsx
// app/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Default Title'

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  )
}
```

## Testing Practices

### Unit Testing Setup

#### Vitest Configuration (Recommended)

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
```

```typescript
// vitest.config.mts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup-test-environment.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

### Testing Components

#### Client Component Testing

```typescript
// components/Button.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button Component', () => {
  it('handles onClick event', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### E2E Testing with Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

```typescript
// e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test('form submission works correctly', async ({ page }) => {
  await page.goto('/contact')
  await page.fill('[name="name"]', 'John Doe')
  await page.fill('[name="email"]', 'john@example.com')
  await page.click('button[type="submit"]')
  await expect(page.locator('.success-message')).toBeVisible()
})
```

## TypeScript Best Practices

### Type-Safe Route Parameters

```typescript
// app/blog/[slug]/page.tsx
interface PageProps {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogPost({ params, searchParams }: PageProps) {
  const { slug } = params
  const post = await getPost(slug)

  return <article>{post.title}</article>
}
```

### Type-Safe Environment Variables

```typescript
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXT_PUBLIC_API_URL: string
    JWT_SECRET: string
    NODE_ENV: 'development' | 'test' | 'production'
  }
}
```

### Server Actions Type Safety

```typescript
'use server'
// app/actions/posts.ts
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface CreatePostFormState {
  message: string
  errors?: {
    title?: string[]
    content?: string[]
  }
}

export async function createPost(
  prevState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  if (!title || title.length < 3) {
    return {
      message: 'Validation failed',
      errors: { title: ['Title must be at least 3 characters'] },
    }
  }

  try {
    await createPostInDB({ title, content })
    revalidatePath('/posts')
    redirect('/posts')
  } catch (error) {
    return { message: 'Failed to create post' }
  }
}
```

### Generic API Response Types

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T
  message: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
  }
}
```

## Tailwind CSS Integration

### Configuration for Next.js 15

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

### Component Styling Patterns

```tsx
// components/Card.tsx
export default function Card({ children, variant = 'default' }) {
  const baseClasses = 'rounded-lg shadow-md p-6'
  const variants = {
    default: 'bg-white border border-gray-200',
    primary: 'bg-blue-50 border border-blue-200',
    success: 'bg-green-50 border border-green-200',
  }

  return <div className={`${baseClasses} ${variants[variant]}`}>{children}</div>
}
```

### Dark Mode Implementation

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

### Lucide React Icons Integration

```tsx
// components/icons.tsx
import { X, Copy, ChevronLeft, ChevronRight, Github, Twitter } from 'lucide-react'

export const Icons = {
  close: X,
  copy: Copy,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  gitHub: Github,
  twitter: Twitter,
}

// Usage with accessibility
export function SearchButton() {
  return (
    <button aria-label="Search" className="rounded-md p-2 hover:bg-gray-100">
      <Icons.search size={20} aria-hidden="true" />
    </button>
  )
}
```

## Vercel Deployment Optimization

### Build Configuration

```javascript
// next.config.js
module.exports = {
  output: 'export', // For static export if applicable
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@material-ui/core', 'lucide-react'],
  },
}
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

```bash
# Using Vercel CLI
vercel env add NEXT_PUBLIC_GA_ID
vercel env pull .env.local
```

### Edge Functions and Middleware

```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const country = request.geo?.country || 'US'
  const response = NextResponse.next()

  response.headers.set('x-country', country)
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### Caching Strategies

```javascript
// app/page.js
export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
  })

  return <div>{/* Your content */}</div>
}
```

### Monitoring and Analytics

```javascript
// app/layout.js
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## Google Analytics Implementation

### GA4 Setup with @next/third-parties

```javascript
// app/layout.js
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </html>
  )
}
```

### Custom Event Tracking

```javascript
'use client'
import { sendGAEvent } from '@next/third-parties/google'

export function TrackingButton() {
  const handleClick = () => {
    sendGAEvent('event', 'button_clicked', {
      event_category: 'engagement',
      event_label: 'header_cta',
      value: 1,
    })
  }

  return <button onClick={handleClick}>Track This Click</button>
}
```

### GDPR-Compliant Cookie Consent

```javascript
'use client'
// components/CookieConsent.js
import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [consent, setConsent] = useState(null)

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie_consent')
    if (savedConsent) {
      setConsent(JSON.parse(savedConsent))
      updateGoogleConsent(JSON.parse(savedConsent))
    }
  }, [])

  const updateGoogleConsent = (consentValue) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: consentValue ? 'granted' : 'denied',
        ad_storage: consentValue ? 'granted' : 'denied',
      })
    }
  }

  const handleConsent = (accepted) => {
    setConsent(accepted)
    localStorage.setItem('cookie_consent', JSON.stringify(accepted))
    updateGoogleConsent(accepted)
  }

  if (consent !== null) return null

  return (
    <div className="fixed right-0 bottom-0 left-0 bg-gray-900 p-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <p>We use cookies to improve your experience.</p>
        <div className="flex space-x-4">
          <button onClick={() => handleConsent(false)}>Decline</button>
          <button onClick={() => handleConsent(true)}>Accept</button>
        </div>
      </div>
    </div>
  )
}
```

### E-commerce Tracking

```javascript
import { sendGAEvent } from '@next/third-parties/google'

export function trackPurchase(transactionData) {
  sendGAEvent('event', 'purchase', {
    transaction_id: transactionData.id,
    value: transactionData.total,
    currency: 'USD',
    items: transactionData.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
    })),
  })
}
```

## Code Quality and Development Workflow

### ESLint Configuration (Next.js 15 with ESLint 9)

```typescript
// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }),
]

export default eslintConfig
```

### Prettier Configuration

```javascript
// prettier.config.js
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 80,
  plugins: ['prettier-plugin-tailwindcss'],
}
```

### Git Hooks with Husky

```bash
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

```javascript
// lint-staged.config.js
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
}
```

### CI/CD with GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type checking
        run: npm run type-check

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm run test

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "format": "prettier --check .",
    "format:fix": "prettier --write ."
  }
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "typescript.suggest.autoImports": true
}
```

## Key Next.js 15 Features Summary

1. **Async Request APIs**: `cookies`, `headers`, `params` are now async
2. **New Caching Defaults**: GET routes and client navigation not cached by default
3. **React 19 Support**: Forward compatibility with React 18 support
4. **Turbopack Stable**: Up to 96.3% faster code updates
5. **Enhanced Security**: Improved Server Actions with dead code elimination
6. **TypeScript Config**: Support for `next.config.ts`
7. **Improved Error Handling**: Better hydration error messages
8. **Partial Prerendering**: Experimental feature combining static and dynamic content

## Performance Targets

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5 seconds
- **INP (Interaction to Next Paint)**: < 200 milliseconds
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Optimization

- Use dynamic imports for heavy components
- Implement proper tree-shaking for icons and libraries
- Leverage Server Components to reduce client bundle

## Conclusion

This comprehensive guide covers the essential best practices for building production-ready Next.js 15 applications with TypeScript. By following these patterns and recommendations, you'll create performant, maintainable, and scalable applications that leverage the latest features of Next.js 15 while maintaining excellent developer experience and code quality.

Remember to:

- Leverage Server Components by default
- Use proper TypeScript typing throughout
- Implement comprehensive testing strategies
- Optimize for Core Web Vitals
- Follow security best practices
- Monitor performance in production

Keep this document updated as Next.js continues to evolve and new best practices emerge in the ecosystem.
