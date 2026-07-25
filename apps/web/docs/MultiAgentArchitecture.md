# 🤖 CampusOS AI — Multi-Agent System Specification

**Document Version**: 3.0.0  

---

## 👥 Sub-Agent Roles & Intent Mapping

`CampusOSAIOrchestrator` maps user prompts to 12 specialized agent roles:

| Agent Role | Primary Responsibilities | Trigger Tool |
| :--- | :--- | :--- |
| `StudentAgent` | Student operations & leave requests | `SubmitLeaveApplication` |
| `TimetableAgent` | Room reservations & vacancy lookup | `ReserveRoom`, `FindAvailableRoom` |
| `AttendanceAgent` | Biometrics audit & shortage recovery | `GenerateAttendanceReport`, `CalculateAttendanceRecovery` |
| `FacultyAgent` | Mentorship & advisor communication | `SendEmail` |
| `FinanceAgent` | Fee structure & refund queries | RAG Grounding + `executeFinanceAction` |
| `PrincipalAgent` | Executive policy & decision support | `RunDecisionIntelligenceModel` |
| `ChiefAdministrativeOfficerAgent` | Single-prompt campus agenda audit | `AuditCampusAttentionAgenda` |
