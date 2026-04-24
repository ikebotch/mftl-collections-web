# MFTL Collections Web

Vue 3 + Vite + TypeScript frontend for the MFTL Collections platform.

## Repositiory Rules & Git Flow

This repository follows a strict branching policy:

- **`main`**: Production-ready, stable code. Only merged from `staging` after release approval.
- **`staging`**: Integration branch. All features must be merged here first.
- **`feature/*`**: Short-lived branches for new development.

### Workflow
1. Create a feature branch from `staging`:
   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b feature/your-feature-name
   ```
2. Develop and test locally.
3. Push the feature branch and create a PR to `staging`.
4. Once merged to `staging`, it will be integrated with other features.

## Setup

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run test`: Run unit tests
- `npm run lint`: Lint and fix files
- `npm run format`: Format code with Prettier
