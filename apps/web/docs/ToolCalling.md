# 🛠️ CampusOS AI — Tool Calling Framework Specification

**Document Version**: 3.0.0  

---

## ⚡ Tool Execution Architecture

```mermaid
flowchart LR
    Orchestrator[Multi-Agent Orchestrator] --> ToolDispatcher[AgentTools Engine]
    ToolDispatcher --> ToolExec{Tool Call Function}
    ToolExec -->|SubmitLeaveApplication| Result1[Application ID + Parent Alert]
    ToolExec -->|ReserveRoom| Result2[Reservation ID + Digital Key]
    ToolExec -->|CalculateAttendanceRecovery| Result3[Required Class Count]
```

### Safety & Null Verification
All tool functions in `agentTools.ts` feature default parameter fallbacks, ensuring deterministic execution even if partial arguments are provided by the user.
