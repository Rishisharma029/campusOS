# 🔌 CampusOS AI — API & Tool Reference

**Document Version**: 3.0.0  

---

## 🛠️ 1. AgentTools API Reference (`agentTools.ts`)

| Tool Function | Parameters | Return Object / Action |
| :--- | :--- | :--- |
| `SubmitLeaveApplication()` | `studentId, startDate, endDate, reason` | Application ID, status (`SUBMITTED_TO_ADVISOR`), parent SMS trigger |
| `ReserveRoom()` | `room, date, timeSlot, reason` | Reservation ID (`RES-...`), digital key code generation |
| `GenerateAttendanceReport()` | `courseId, threshold` | Total scanned, verified count, shortage flagged list |
| `FindAvailableRoom()` | `building, timeSlot` | Array of vacant classrooms (`LHC-204`, `Lab-3`, `B-302`) |
| `SendEmail()` | `to, subject, body` | Message ID (`MSG-...`), status (`DISPATCHED`) |
| `CalculateAttendanceRecovery()`| `currentRate, totalSessions, targetRate` | Required consecutive class count |
| `NotifyAdvisor()` | `studentId, note` | Status (`NOTIFIED`), advisor email dispatch |
| `QueryRAGDocuments()` | `query` | Array of grounded document section citations |
