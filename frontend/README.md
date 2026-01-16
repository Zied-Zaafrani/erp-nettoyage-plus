# NettoyagePlus Frontend - Web Application

## Overview

React-based ERP web application for NettoyagePlus cleaning services management.

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript (Strict Mode)
- **Bundler:** Vite 5
- **Styling:** TailwindCSS 3.4
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod
- **Routing:** React Router 6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns

## Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── index.ts
│   │   └── shared/             # Shared business components
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── hooks/                  # Custom hooks
│   ├── layouts/
│   │   ├── AuthLayout.tsx      # Login/register layout
│   │   └── DashboardLayout.tsx # Main app layout
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── users/
│   │   │   ├── UsersPage.tsx
│   │   │   └── components/
│   │   ├── clients/
│   │   ├── sites/
│   │   ├── contracts/
│   │   ├── zones/
│   │   ├── schedules/
│   │   ├── interventions/
│   │   ├── checklists/
│   │   └── absences/
│   ├── services/
│   │   ├── api.ts              # Axios instance & config
│   │   └── index.ts            # API service functions
│   ├── styles/
│   │   └── index.css           # Global styles & Tailwind
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
├── .env                        # Environment variables
├── .env.example                # Environment template
├── index.html                  # HTML template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend running on localhost:3000

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format with Prettier
```

## Development Guidelines

### Component Template

All components follow this structure:

```tsx
import { useState } from 'react';
import { clsx } from 'clsx';

// ============================================
// TYPES
// ============================================

interface ComponentProps {
  // Props definition
}

// ============================================
// COMPONENT
// ============================================

export default function Component({ ...props }: ComponentProps) {
  // State
  // Hooks
  // Handlers
  // Return JSX
}
```

### Page Template

All pages follow this structure:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { someService } from '@/services';
import { Button, Card, Table } from '@/components/ui';

export default function EntityPage() {
  const queryClient = useQueryClient();
  
  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['entities', { page, search }],
    queryFn: () => someService.getAll({ page, search }),
  });
  
  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => someService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
  });
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">...</div>
      
      {/* Filters */}
      <Card>...</Card>
      
      {/* Table */}
      <Card>...</Card>
      
      {/* Modals */}
    </div>
  );
}
```

### Styling Conventions

1. **Use Tailwind classes** - No custom CSS unless absolutely necessary
2. **Use component classes** - Predefined in index.css (btn-primary, card, table, etc.)
3. **Use clsx for conditional classes** - `clsx('base', condition && 'conditional')`
4. **Use color tokens** - primary, secondary, success, warning, danger, gray

### State Management

1. **Server State** - React Query for all API data
2. **UI State** - React useState for local component state
3. **Auth State** - AuthContext for user authentication
4. **Form State** - React Hook Form with Zod validation

### API Integration

All API calls go through the services layer:

```tsx
// Good
import { usersService } from '@/services';
const users = await usersService.getAll();

// Bad - Direct axios calls
const users = await axios.get('/api/users');
```

### TypeScript Rules

1. **Strict mode enabled** - No implicit any
2. **Define all types** - Use types from `@/types`
3. **No type assertions** - Unless absolutely necessary
4. **Use proper generics** - For reusable components

### Import Aliases

Use path aliases for cleaner imports:

```tsx
// Good
import { Button } from '@/components/ui';
import { User } from '@/types';

// Bad
import { Button } from '../../../components/ui';
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | /api (proxied) |

## Pages & Features

### Implemented
- ✅ Login Page
- ✅ Dashboard with KPIs
- ✅ Users Management (full CRUD)

### Placeholder (Template Ready)
- 📝 Clients Management
- 📝 Sites Management
- 📝 Contracts Management
- 📝 Zones Management
- 📝 Schedules Management
- 📝 Interventions Management
- 📝 Checklists Management
- 📝 Absences Management

## Connecting to Backend

### Development (Local)

The Vite dev server proxies `/api` requests to `http://localhost:3000`:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  },
}
```

### Production

Set the API URL to your deployed backend:

```env
VITE_API_URL=https://nettoyageplus-backend-production.up.railway.app/api
```

## Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| primary | Green (#22c55e) | Main actions, branding |
| secondary | Blue (#3b82f6) | Secondary actions |
| success | Green (#22c55e) | Success states |
| warning | Amber (#f59e0b) | Warning states |
| danger | Red (#ef4444) | Error states, destructive |
| gray | Neutral | Text, borders, backgrounds |

## UI Components

### Button Variants
- `primary` - Green, main actions
- `secondary` - Blue, secondary actions
- `outline` - Bordered, neutral actions
- `ghost` - Transparent, subtle actions
- `danger` - Red, destructive actions
- `success` - Green, positive actions

### Badge Variants
- `primary`, `secondary`, `success`, `warning`, `danger`, `gray`
- Use `StatusBadge` for automatic status coloring

### Form Inputs
- `Input` - Standard text input with label, error, hint
- `Modal` - Dialog with header, content, footer
- `ConfirmModal` - Confirmation dialog with actions

### Table Components
- `Table`, `TableHead`, `TableBody`, `TableRow`
- `TableHeader`, `TableCell`
- `Pagination` - Page navigation
- `EmptyState` - No data placeholder

## Contributing

1. Follow the component/page templates
2. Use TypeScript types from `@/types`
3. Write clean, readable code
4. Test changes locally before committing
