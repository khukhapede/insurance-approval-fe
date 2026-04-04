# Insurance Approval System - Frontend

Modern insurance claim approval system built with React, TypeScript, and Ant Design.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Ant Design 5** - UI component library
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **React Router v6** - Routing

## 📁 Project Structure

```
insurance-frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React context providers
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── assets/         # Static assets
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── public/             # Public static files
├── .env                # Environment variables
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000/api`

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**
The `.env` file is already configured with default backend URL:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Edit `.env` if your backend runs on a different URL.

3. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 🔑 Features (Development Roadmap)

- [ ] Chapter 1: Project Setup ✅
- [ ] Chapter 2: TypeScript Types & API Setup
- [ ] Chapter 3: Authentication System
- [ ] Chapter 4: Layout & Navigation
- [ ] Chapter 5: USER Role Pages
- [ ] Chapter 6: VERIFIER Role Pages
- [ ] Chapter 7: APPROVER Role Pages
- [ ] Chapter 8: Shared Components
- [ ] Chapter 9: Custom Hooks
- [ ] Chapter 10: Forms & Validation
- [ ] Chapter 11: Polish & UX
- [ ] Chapter 12: Testing & Deployment

## 🎨 Design System

### Roles & Colors
- **USER** - Blue (#1890ff)
- **VERIFIER** - Orange (#fa8c16)
- **APPROVER** - Green (#52c41a)

### Claim Status Colors
- **DRAFT** - Gray (#8c8c8c)
- **SUBMITTED** - Blue (#1890ff)
- **VERIFIED** - Orange (#fa8c16)
- **APPROVED** - Green (#52c41a)
- **REJECTED** - Red (#f5222d)

## 🔗 Backend Integration

This frontend connects to the Insurance Approval System Backend API.

**Backend Repository**: https://github.com/khukhapede/insurance-approval-system-backend

**API Base URL**: `http://localhost:3000/api` (configurable in `.env`)

## 👨‍💻 Author

Panca - Backend Developer transitioning to Full Stack
