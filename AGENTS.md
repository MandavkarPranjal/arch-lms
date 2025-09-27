# AGENTS.md

## Build/Lint/Test Commands

**Package Manager**: pnpm

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format:write` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm check` - Run lint and typecheck together

**Note**: No testing framework is configured in this project.

## Code Style Guidelines

### TypeScript

- **Strict mode**: Enabled with full type safety
- **Target**: ES2017
- **Path mapping**: Use `@/*` for imports (e.g., `@/lib/utils`)
- **Module resolution**: Bundler resolution
- **JSX**: Preserve mode

### Imports

- Use absolute imports with `@/` prefix for internal modules
- External dependencies without `@/` prefix
- Import sorting is automatically handled by Prettier plugin

### Formatting (Prettier)

- **Print width**: 100 characters
- **Indentation**: 4 spaces (no tabs)
- **Semicolons**: Required
- **Quotes**: Single quotes
- **Plugins**: Import sorting and Tailwind CSS support enabled

### ESLint

- Extends Next.js core web vitals and TypeScript rules
- Uses flat config format
- Integrated with lint-staged for pre-commit hooks

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Functions**: camelCase
- **Variables**: camelCase
- **Constants**: UPPER_CASE
- **Types/Interfaces**: PascalCase
- **Files**: kebab-case for components, camelCase for utilities

### Error Handling

- Use try-catch blocks for async operations
- Leverage custom hooks like `use-try-catch.ts` for consistent error handling
- Use Zod schemas for runtime validation

### Project Structure

- **App Router**: Next.js 15 with app directory structure
- **Components**: Organized in `/components` with UI components in `/ui`
- **Database**: Prisma ORM with schema in `/prisma`
- **Styling**: Tailwind CSS with custom components
- **Authentication**: Better Auth integration
