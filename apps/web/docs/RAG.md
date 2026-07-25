# 📚 CampusOS AI — Retrieval-Augmented Generation (RAG) Architecture

**Document Version**: 3.0.0  

---

## 🔎 Grounded Retrieval Flow

```mermaid
flowchart TD
    UserQuery[User Policy Question] --> KeywordScorer[searchRAGKnowledgeBase()]
    KeywordScorer --> DocStore[(CAMPUS_KNOWLEDGE_BASE - 7 Categories)]
    DocStore -->|Relevance Weighting| Filter[Filter Top 3 Sections]
    Filter --> CitationOutput[Format Citations & Grounded Answer]
```

### Knowledge Base Document Corpus
- `doc-hb-01`: Student Handbook §3.1 (Attendance 75% Threshold & Recovery).
- `doc-reg-02`: Examination Regulations §4.2 (Late Registration & Revaluation).
- `doc-syl-03`: CS Syllabus §5.4 (Elective Track Requirements).
- `doc-fee-04`: Fee Regulations §2.8 (Installments, Penalties & Refunds).
- `doc-hos-05`: Hostel Regulations §6.1 (Resident Curfew & Digital Outpass).
- `doc-fac-06`: Faculty Directory §1.2 (Advisor Office Hours & Emails).
- `doc-map-07`: Spatial Map Guide §7.3 (Lab & Lecture Hall Locations).
