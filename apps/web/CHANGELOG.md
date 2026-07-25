# Changelog

All notable changes to **CampusOS AI** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v3.0.0] - 2026-07-25

### Added
- **3-Layer Architecture**: Unification of Daily Operations (Layer 1), Executive Intelligence (Layer 2), and Autonomous AI Platform (Layer 3).
- **ADK Multi-Agent Orchestrator (`multiAgentOrchestrator.ts`)**: Keyword-intent routing engine supporting 12 sub-agent roles.
- **RAG Knowledge Base (`ragKnowledgeBase.ts`)**: Grounded policy retrieval across 7 university documentation categories with zero-hallucination fallbacks.
- **Agent Tools (`agentTools.ts`)**: 8 autonomous tool functions including `SubmitLeaveApplication`, `ReserveRoom`, `GenerateAttendanceReport`, `CalculateAttendanceRecovery`, and `SendEmail`.
- **Chief Administrative Officer (CAO) Portal**: Single-prompt executive briefing engine auditing 10 campus modules concurrently.
- **Decision Intelligence Engine**: Multi-turn root-cause absenteeism analysis and resource optimization model.
- **3D Digital Twin & Map**: Live spatial canvas overlaying occupancy, canteen queue status, and room telemetry.
- **System Health Monitor**: Live metrics dashboard tracking simulated uptime (99.98%), active AI agents, and response latency.
- **Registrar Role & Expanded RBAC**: Added full `Registrar` role and extended access control matrix across 10 roles.
- **E2E Workflow Test Suite (`campusos-e2e-workflows.test.ts`)**: Stateful integration tests covering student leave, finance restructuring, and CAO executive workflows.

### Improved
- **TypeScript Strict Safety**: Achieved 0 TypeScript compilation errors (`tsc --noEmit`).
- **Build Performance**: Code-splitting optimization via Vite resulting in 85+ dynamic lazy-loaded chunks (`vite build` in 19.30s).
- **Lighthouse Performance**: Achieved 100/100 in Best Practices, 91/100 in SEO, and 81/100 in Accessibility.
- **Logout Accessibility**: Added explicit `<button>` semantics and `aria-label` to sidebar logout controls.

### Fixed
- **`DatabaseContext.tsx` Type Alignment**: Removed spurious keys from fallback database context and aligned `issueBook` return type.
- **`App.tsx` Hoisting Violation**: Moved module import statements to top of file.
- **Security Audit Logger**: Replaced hardcoded student identity with dynamic authenticated session username.
- **`RoleContext.tsx` Invalid Keys**: Pruned non-existent module references (`Examinations`, `Departments`, `Results`).
- **`RealtimeContext.tsx` Fallback**: Replaced unsafe throwing hook with safe default context fallback pattern.
- **`Reports.tsx` Property Mismatches**: Fixed property accessors on `FeeCollection` (`amountPaid`, `paymentMethod`, `paymentDate`) and `Student` (`placementStatus`).
- **Orchestrator XSS Echo Vector**: Sanitized raw HTML tags and quotes in fallback response outputs.
- **`AuthContext.tsx` Storage Robustness**: Wrapped `JSON.parse` operations in `try/catch` wrappers with self-healing clear.

### Security
- Added explicit RBAC guards (`RoleRoute`) for all sensitive executive routes (`/cao`, `/energy`, `/security-vault`, `/system-health`).
- Sanitized orchestrator responses against XSS reflection and prompt injection keywords.

---

## [v2.0.0] - 2026-07-20
- Initial release of executive portals and basic student management modules.
