export interface RAGDocument {
  id: string;
  title: string;
  category: 'Handbook' | 'Regulations' | 'Syllabus' | 'Fees' | 'Hostel' | 'Faculty' | 'Exams' | 'Map';
  section: string;
  content: string;
  keywords: string[];
}

export const CAMPUS_KNOWLEDGE_BASE: RAGDocument[] = [
  {
    id: 'doc-hb-01',
    title: 'Student Handbook 2026',
    category: 'Handbook',
    section: '§3.1 Attendance Requirements & 75% Threshold',
    content: `Students are strictly required to maintain a minimum of 75% aggregate attendance in each registered subject to be eligible to sit for Semester End Examinations. If attendance drops below 75% due to medical reasons, a formal medical certificate must be submitted within 7 days. Condonation up to 10% may be granted by the Academic Council upon Principal approval. To recover attendance below 75%, students must attend consecutive future lectures without absence.`,
    keywords: ['attendance', 'below 75', '75%', 'threshold', 'medical leave', 'condonation', 'absent', 'shortage'],
  },
  {
    id: 'doc-reg-02',
    title: 'Academic & Examination Regulations',
    category: 'Regulations',
    section: '§4.2 Late Examination Registration & Fee Waiver',
    content: `Students may register late for mid-semester or end-semester examinations up to 3 days prior to exam commencement upon payment of a late fee of ₹500. Registration closes strictly 72 hours before the first scheduled exam. Hall tickets can be downloaded from the Examination portal only after clearing all tuition fee dues. Re-valuation requests must be filed within 10 days of results declaration.`,
    keywords: ['register late', 'late exam', 'late registration', 'revaluation', 'exam rules', 'hall ticket', 'admit card'],
  },
  {
    id: 'doc-syl-03',
    title: 'Computer Science Syllabus & Electives Guide',
    category: 'Syllabus',
    section: '§5.4 Semester 6 Elective Rules & Prerequisites',
    content: `Semester 6 students must choose 2 professional electives from Track A (Artificial Intelligence & Machine Learning) or Track B (Cloud Infrastructure & Security). Prerequisites for CS405 (Deep Learning) include a grade of 'B+' or higher in AI401 (Machine Learning) and CS301 (Data Structures). Recommended electives: CS405 Deep Learning, CS408 Distributed Cloud Systems, AI409 Natural Language Processing & RAG.`,
    keywords: ['recommend electives', 'electives', 'syllabus', 'deep learning', 'cloud', 'prerequisites', 'course choice'],
  },
  {
    id: 'doc-fee-04',
    title: 'Fee Structure & Refund Regulations',
    category: 'Fees',
    section: '§2.8 Tuition Deadlines, Payment Installments & GST Invoices',
    content: `Tuition fees are payable in two equal installments at the beginning of each semester. Late payment attracts a penalty of ₹100 per day after the 15th day of the semester. Official GST invoices are automatically generated upon payment via UPI/NetBanking. Fee refunds for course withdrawal follow UGC guidelines: 100% refund if withdrawn 15 days prior to admission closure.`,
    keywords: ['fee', 'tuition', 'payment', 'scholarship', 'gst', 'receipt', 'refund', 'penalty', 'dues'],
  },
  {
    id: 'doc-hos-05',
    title: 'Hostel & Outpass Regulations',
    category: 'Hostel',
    section: '§6.1 Resident Curfew & Digital Outpass Approval',
    content: `Resident curfew is strictly 09:30 PM for all hostel blocks. Evening or weekend outpass applications must be submitted digitally via the Hostel Portal at least 4 hours in advance. Parent SMS verification is automatically dispatched upon outpass generation. Visitors are permitted in the Common Lounge between 04:00 PM and 07:00 PM daily.`,
    keywords: ['hostel', 'outpass', 'curfew', 'mess', 'visitor', 'room allocation', 'night outpass'],
  },
  {
    id: 'doc-fac-06',
    title: 'Faculty & Mentorship Directory',
    category: 'Faculty',
    section: '§1.2 Departmental Advisors & Office Hours',
    content: `Department of Computer Science:
- Dr. Arindam Sen (Associate Professor & Student Advisor): Office Block A, Room 204. Office Hours: Tue/Thu 02:00 PM - 04:00 PM. Email: arindam.sen@campusos.edu.
- Prof. Rajesh K. Mehta (DBMS Lead): Office Block A, Room 210. Email: rajesh.mehta@campusos.edu.
- Dr. Sarah Jenkins (Robotics & AI Lead): Office Block B, Room 102. Email: sarah.jenkins@campusos.edu.`,
    keywords: ['advisor', 'faculty advisor', 'mentor', 'professor', 'arindam sen', 'email professor', 'office hours'],
  },
  {
    id: 'doc-map-07',
    title: 'Campus Spatial Map & Room Guide',
    category: 'Map',
    section: '§7.3 Laboratory & Lecture Hall Locations',
    content: `Campus Layout:
- Block A (Computer Science & AI Wing): Houses LHC-101 to LHC-104, Computing Lab-1 to Lab-4, Server Room.
- Block B (Electronics & Hardware Wing): Houses Lab-5 (Hardware & Embedded Systems Lab - 3rd Floor, Room 304), Mechatronics Workshop, Robotics Hall.
- Block L (Central Library 2.0): RFID Gate, Quiet Study Pods, Digital Vault.
- Medical Station: Emergency Response Bay, Ground Floor near Gate 2.`,
    keywords: ['where is', 'lab-5', 'lab 5', 'lab 4', 'block b', 'location', 'campus map', 'room 302'],
  },
];

export interface RAGQueryResult {
  document: RAGDocument;
  relevanceScore: number;
}

export function searchRAGKnowledgeBase(query: string): RAGQueryResult[] {
  const q = query.toLowerCase();
  const results: RAGQueryResult[] = [];

  for (const doc of CAMPUS_KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of doc.keywords) {
      if (q.includes(kw)) {
        score += 2.5;
      }
    }
    if (q.includes(doc.title.toLowerCase()) || q.includes(doc.category.toLowerCase())) {
      score += 1.5;
    }

    if (score > 0) {
      results.push({ document: doc, relevanceScore: score });
    }
  }

  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results.slice(0, 3);
}
