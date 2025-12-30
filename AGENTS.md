# Marcapagina

**MarcaPágina** is a free digital literary platform focused on Latin American short fiction. It hosts over 350 short stories and micronarratives from emerging Latin American authors, curated weekly by an editorial team.

The site features **Transtextos**, an experimental writing feed that publishes brief narrative pieces in a continuous, social-media-style format. Beyond the stories, it includes literary playlists, literary memes, a horoscope section, and author profiles.

The platform positions itself as a space where literature happens in real time, blending contemporary Latin American voices with digital culture elements like music and art. It also accepts submissions from writers looking to publish their own short fiction.

Review the `VISION.md` file for more context about the overall project goals and philosophy.

## Build/Lint/Test Commands

### Development

- `yarn dev` - Start development server on localhost:3000
- `yarn start` - Start production server
- `yarn serve` - Alternative production server command

### Building

- `yarn build` - Build for production (includes Prisma generate and postbuild script)
- `yarn analyze` - Build with bundle analyzer

### Linting & Formatting

- `yarn lint` - Run ESLint with auto-fix across pages, app, components, lib, layouts, scripts directories
- Pre-commit hooks automatically run lint-staged (ESLint + Prettier on JS/TS/TSX/JSON/CSS/MDX files)

### Database (Prisma)

- `yarn prisma` - Access Prisma CLI
- `yarn prisma:generate` - Generate Prisma client
- `yarn prisma:studio` - Open Prisma Studio GUI
- `yarn prisma:migrate` - Run database migrations in development

### Testing

- No test framework currently configured
- To run a single test file (when added): `yarn test -- path/to/test.js`
- To run tests in watch mode: `yarn test -- --watch`

## Code Style Guidelines

### TypeScript Configuration

- Target: ES6 with lib: ["dom", "dom.iterable", "esnext"]
- Strict mode: false, but strictNullChecks: true
- Module resolution: "bundler"
- Path aliases configured:
  - `@/components/*` → `components/*`
  - `@/data/*` → `data/*`
  - `@/layouts/*` → `layouts/*`
  - `@/css/*` → `css/*`
  - `@/lib/*` → `lib/*`
  - `@/types/*` → `types/*`

### ESLint Rules

- Extends: recommended, jsx-a11y/recommended, prettier/recommended, next, next/core-web-vitals
- Prettier integration: prettier/prettier rule as error
- Custom rules:
  - `react/react-in-jsx-scope`: off (React 17+ JSX transform)
  - `react/prop-types`: off (using TypeScript)
  - `@typescript-eslint/no-unused-vars`: off (TypeScript handles this)
  - `react/no-unescaped-entities`: off
  - Custom Link component validation in jsx-a11y/anchor-is-valid

### Prettier Configuration

- `semi`: false (no semicolons)
- `singleQuote`: true
- `printWidth`: 100
- `tabWidth`: 2
- `useTabs`: false
- `trailingComma`: 'es5'
- `bracketSpacing`: true
- Plugin: prettier-plugin-tailwindcss

### React/TypeScript Patterns

#### Component Structure

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'secondary'
}

function ComponentName({ className, variant = 'default', ...props }: ComponentProps) {
  return (
    <div
      className={cn('base-classes', variant === 'secondary' && 'variant-classes', className)}
      {...props}
    />
  )
}

export { ComponentName }
```

#### Props Interface Naming

- Use `ComponentNameProps` or `Props` suffix
- Extend `React.ComponentProps<'element'>` for HTML element props
- Keep interfaces close to component definition

#### Naming Conventions

- Components: PascalCase (e.g., `FeaturedCard`, `SectionContainer`)
- Functions: camelCase (e.g., `getHomeContent`, `processMarkdown`)
- Variables: camelCase (e.g., `homeContent`, `masonryItems`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `CACHE_DURATION`)
- Files: PascalCase for components, camelCase for utilities
- Directories: kebab-case (e.g., `biblioteca-personal`, `mi-area`)

#### Imports Organization

```typescript
// React imports first
import * as React from 'react'
import { useState, useEffect } from 'react'

// External libraries (alphabetical)
import { format } from 'date-fns'
import Link from 'next/link'

// Internal imports (path aliases, then relative)
import { cn } from '@/lib/utils'
import FeaturedCard from '@/components/content/cards/FeaturedCard'
import siteMetadata from '@/data/siteMetadata'

// Types at end
import type { CardProps } from './types'
```

#### Error Handling

- Use try/catch blocks for async operations
- Provide fallback values for failed operations
- Log errors appropriately without exposing sensitive information
- Use optional chaining (`?.`) and nullish coalescing (`??`)

```typescript
try {
  const data = await fetchData()
  return data ?? fallbackData
} catch (error) {
  console.error('Error fetching data:', error)
  return fallbackData
}
```

#### Async Components (App Router)

- Use async functions for server components
- Handle searchParams with Promise resolution
- Implement proper error boundaries

```typescript
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  // ... rest of component
}
```

### CSS/Styling

#### Tailwind Classes

- Use `cn()` utility for conditional classes
- Follow mobile-first responsive design (sm:, md:, lg:)
- Use Tailwind's dark: modifier for theme support
- Custom CSS variables for brand colors

#### Component Variants

- Use class-variance-authority (cva) for component variants
- Define variants in component files
- Export variant types for TypeScript support

### Database/Content Management

#### Sanity CMS Integration

- Use GROQ queries for data fetching
- Implement PortableText for rich content rendering
- Handle content relationships (authors, tags, etc.)
- Cache expensive operations appropriately

#### Prisma Integration

- Run `prisma generate` after schema changes
- Use generated types for database operations
- Handle migrations with `prisma migrate dev`

### Performance Best Practices

- Implement caching for expensive operations (5-minute cache for home content)
- Use Promise.all for parallel async operations
- Optimize images with Next.js Image component
- Implement proper loading states and error boundaries

### Commit Guidelines

- Messages in Spanish, short and imperative style
- Examples: "Añade funcionalidad de búsqueda", "Corrige error en navegación"
- Run `yarn lint` before committing (handled by husky pre-commit)

### File Organization

- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable UI components
- `lib/`: Utility functions and configurations
- `data/`: Static data files and configurations
- `types/`: TypeScript type definitions
- `layouts/`: Page layout components
- `css/`: Stylesheets and CSS files
