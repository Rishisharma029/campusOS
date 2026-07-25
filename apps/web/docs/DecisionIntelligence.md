# 🧠 CampusOS AI — Decision Intelligence Engine Architecture

**Document Version**: 3.0.0  

---

## 🔍 Overview

The `DecisionIntelligenceEngine` (`decisionIntelligenceEngine.ts`) provides university executives with multi-turn analytical reasoning for operational anomalies.

```mermaid
flowchart TD
    Prompt[Executive Query] --> Engine{DecisionIntelligenceEngine}
    Engine -->|Absenteeism Query| AbsenteeismAnalysis[Analyze Absenteeism Patterns]
    Engine -->|Space Utilization| SpaceAnalysis[Analyze Room Utilization]
    Engine -->|Admission Trend| AdmissionAnalysis[Analyze Admission Velocity]
    
    AbsenteeismAnalysis --> Output[Synthesize Root Cause & Recommendations]
    SpaceAnalysis --> Output
    AdmissionAnalysis --> Output
```

### Supported Decision Queries
- **Absenteeism Root Cause Analysis**: Identifies high-absence departments (e.g. Mechanical Engineering at 18.4% vs 5.5% campus baseline).
- **Space Optimization**: Recommends room re-allocation for under-utilized lecture halls.
- **Admission Velocity**: Projects upcoming semester enrollment trends.
