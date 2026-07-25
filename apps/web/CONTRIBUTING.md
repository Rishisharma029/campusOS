# 🤝 Contributing to CampusOS AI

Thank you for your interest in contributing to **CampusOS AI**! We welcome contributions from developers, designers, technical writers, and researchers.

---

## 🛠️ Development Setup

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/campusOS.git
   cd campusOS/apps/web
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Local Dev Server**:
   ```bash
   npm run dev
   ```
4. **Run Validation Suite**:
   ```bash
   # Run Vitest unit & integration tests
   npx vitest run

   # Run TypeScript strict type check
   npx tsc --noEmit

   # Run Linter
   npm run lint
   ```

---

## 🌿 Branch Naming & Commit Guidelines

- **Branch Naming**:
  - `feat/feature-name`
  - `fix/bug-description`
  - `docs/documentation-update`
  - `refactor/component-name`

- **Commit Message Standard** (Conventional Commits):
  - `feat(adk): add multi-agent fallback routing`
  - `fix(reports): align fee collection property names`
  - `docs(readme): update system architecture diagrams`
  - `test(e2e): add stateful leave workflow assertion`

---

## 📥 Pull Request Workflow

1. Ensure all tests pass (`npx vitest run`) and TypeScript compiles with zero errors (`npx tsc --noEmit`).
2. Keep Pull Requests focused on a single feature or bug fix.
3. Update relevant documentation in `docs/` or `README.md` if adding or modifying features.
4. Open a Pull Request against the `main` branch with a clear summary of changes.

---

## 🏗️ Architecture Principles

1. **3-Layer Separation**: Keep Layer 1 Daily Ops, Layer 2 Intelligence, and Layer 3 AI modules decoupled.
2. **Fail-Safe UI Hooks**: Never use raw `throw` in React Context hooks; return safe fallback objects so UI error boundaries don't trigger unnecessarily.
3. **Strict Type Safety**: Never use implicit `any`. All schemas must be validated with Zod or TypeScript interfaces.
