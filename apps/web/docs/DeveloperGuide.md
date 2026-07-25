# 💻 CampusOS AI — Developer Setup & Architecture Principles Guide

**Document Version**: 3.0.0  

---

## 🛠️ 1. Environment Commands Quick Reference

```bash
# Install dependencies
npm install

# Run local development server (HMR enabled)
npm run dev

# Run strict TypeScript type check
npx tsc --noEmit

# Run Linter
npm run lint

# Run Unit & Integration Test Suite
npx vitest run

# Run Production Build
npm run build
```

---

## 📐 2. Architecture Principles

1. **3-Layer Separation**: Keep Daily Operations, Executive Intelligence, and AI Orchestration decoupled.
2. **Safe Fallback Hooks**: Custom React Context hooks must return safe default objects instead of raw throwing logic when invoked outside provider trees.
3. **Strict Schemas**: Validate stateful forms and models using Zod schemas (`studentSchema`, `billingSchema`).
