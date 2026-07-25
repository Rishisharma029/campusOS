# 🏛️ CampusOS AI — System Architecture & Design Specification

**Document Version**: 3.0.0  
**Target Audience**: Systems Engineers, Solution Architects, Core Maintainers  

---

## 🏢 1. Three-Layer Architectural Paradigm

CampusOS AI separates administrative computing into three distinct runtime layers:

```mermaid
flowchart TD
    subgraph Layer3 ["Layer 3: Autonomous AI Platform"]
        ADK[ADK Multi-Agent Router]
        RAG[RAG Knowledge Base Engine]
        TOOLS[Agent Tool Call Suite]
        COPILOT[Academic & Faculty Copilots]
    end

    subgraph Layer2 ["Layer 2: Executive Intelligence"]
        CAO[Chief Administrative Officer Portal]
        DECISION[Decision Intelligence Engine]
        TWIN[3D Digital Twin & Map]
        FIN[Finance Risk Engine]
        ENERGY[Energy & Sustainability]
        HEALTH[System Health Monitor]
    end

    subgraph Layer1 ["Layer 1: Daily Operations"]
        ATT[Attendance Engine]
        TIME[Timetable & Rooms]
        STUDENT[Students Directory]
        FACULTY[Faculty & Mentorship]
        FEES[Fee Collection Ledger]
        LIB[Library & Outpass]
        EXAM[Examinations & Reports]
    end

    Layer3 --> Layer2
    Layer2 --> Layer1
```

---

## 🔄 2. Data Flow & Request Lifecycle

```mermaid
flowchart LR
    User[User Input / UI Trigger] --> Router[React Router v7]
    Router --> Context{Auth & Role Context Guards}
    Context -->|Authorized| Component[Page Component]
    Component --> Engine[Core Engine / AI Orchestrator]
    Engine --> State[Database / Realtime Context State]
    State --> View[Reactive UI Rerender]
```

---

## 📂 3. Component Architecture & Hierarchy

- **Root Layout (`App.tsx`)**: Central router wrapped in context providers (`AuthProvider`, `RoleProvider`, `DatabaseProvider`, `RealtimeProvider`, `ThemeProvider`, `ToastProvider`).
- **Protected Layout (`DashboardLayout.tsx`)**: Integrates responsive `Sidebar` navigation, top `Navbar`, breadcrumb trail, and floating `AIAssistantModal`.
- **Feature Modules (`src/pages/`)**: 35 lazy-loaded module views.
