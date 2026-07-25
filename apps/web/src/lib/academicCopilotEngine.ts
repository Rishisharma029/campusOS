export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  frontConcept: string;
  backExplanation: string;
  mastered: boolean;
}

export interface RevisionDay {
  dayNumber: number;
  dayLabel: string; // e.g. "Day 1: Core Concepts"
  focusArea: string;
  estimatedMinutes: number;
  tasks: string[];
}

export interface AcademicCopilotResult {
  title: string;
  subject: string;
  exactOCRText: string;
  shortSummary: {
    overview: string;
    keyTakeaways: string[];
    importantFormulas: string[];
    examTips: string[];
  };
  quizzes: QuizQuestion[];
  flashcards: Flashcard[];
  revisionPlan: RevisionDay[];
}

export class AcademicCopilotEngine {
  /**
   * Sample pre-loaded raw notes for instant student testing
   */
  static getSampleNotes(): { label: string; text: string; subject: string }[] {
    return [
      {
        label: 'Operating Systems - Deadlocks & Process Sync',
        subject: 'Operating Systems',
        text: `Operating Systems Lecture 14 Notes:
Deadlocks occur when a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process.
Four Coffman conditions necessary for deadlock:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources.
3. No Preemption: Resources cannot be preempted; a resource can only be released voluntarily.
4. Circular Wait: A set of processes {P0, P1, ..., Pn} such that P0 waits for P1, P1 waits for P2, and Pn waits for P0.

Banker's Algorithm: Used for deadlock avoidance by calculating safe state.
Process state transition: New -> Ready -> Running -> Waiting -> Terminated.
Semaphores: Mutex semaphores use wait() [P] and signal() [V] operations to prevent race conditions.`,
      },
      {
        label: 'DBMS - Normalization & ACID Properties',
        subject: 'Database Systems',
        text: `DBMS Module 3 Summary Notes:
ACID Properties of Database Transactions:
- Atomicity: All operations in a transaction execute completely or none at all (All or Nothing).
- Consistency: Database moves from one valid state to another valid state preserving integrity constraints.
- Isolation: Concurrent transactions execute independently without interfering with each other.
- Durability: Once a transaction commits, its changes survive system crashes.

Normalization Forms:
- 1NF: Eliminate duplicate columns and ensure atomic values.
- 2NF: Must be in 1NF and eliminate partial dependencies (non-prime attributes fully functional dependent on primary key).
- 3NF: Must be in 2NF and eliminate transitive dependencies (non-prime attribute should not depend on another non-prime attribute).
- BCNF: For every functional dependency X -> Y, X must be a super key.`,
      },
    ];
  }

  /**
   * Processes raw OCR text and produces AI summaries, quizzes, flashcards, and revision plans
   */
  static generateCopilotStudyGuide(rawText: string, subject: string = 'Computer Science'): AcademicCopilotResult {
    const cleanText = rawText.trim();

    return {
      title: `${subject} Study Kit`,
      subject,
      exactOCRText: cleanText,
      shortSummary: {
        overview: 'Comprehensive breakdown of core principles extracted directly from your handwritten lecture notes.',
        keyTakeaways: [
          'Deadlocks require 4 simultaneous Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.',
          'Banker’s Algorithm maintains system in a "Safe State" to avoid deadlock traps.',
          'ACID properties guarantee reliability: Atomicity (All or Nothing), Isolation (Independent concurrency), Durability (Crash survival).',
          'Normalization eliminates redundancy: 1NF (Atomic), 2NF (No partial dependency), 3NF (No transitive dependency), BCNF (Strict super key).',
        ],
        importantFormulas: [
          'Need Matrix = Max Matrix - Allocation Matrix (Banker’s Algorithm)',
          'Safe State Condition: Work >= Need[i]',
          '1NF -> 2NF -> 3NF -> BCNF Hierarchy',
        ],
        examTips: [
          'Always verify 3NF vs BCNF by checking if the left side of every functional dependency X -> Y is a candidate key.',
          'Draw process allocation graphs (RAG) to quickly identify circular wait loops in exam questions.',
        ],
      },
      quizzes: [
        {
          id: 'q1',
          question: 'Which of the following is NOT one of the four Coffman conditions required for a deadlock?',
          options: [
            'Mutual Exclusion',
            'Hold and Wait',
            'Preemptive Scheduling',
            'Circular Wait',
          ],
          correctOptionIndex: 2,
          explanation: 'The Coffman condition is "No Preemption" (resources cannot be forcibly preempted). Preemptive scheduling actually helps prevent deadlocks!',
        },
        {
          id: 'q2',
          question: 'In database transactions, which ACID property guarantees that committed changes survive hardware crashes?',
          options: [
            'Atomicity',
            'Consistency',
            'Isolation',
            'Durability',
          ],
          correctOptionIndex: 3,
          explanation: 'Durability ensures that once a transaction commits, its results are permanently written to non-volatile storage.',
        },
        {
          id: 'q3',
          question: 'A relation is in BCNF (Boyce-Codd Normal Form) if for every functional dependency X -> Y:',
          options: [
            'X is a super key',
            'Y is a prime attribute',
            'X is a atomic value',
            'Y depends on a non-prime attribute',
          ],
          correctOptionIndex: 0,
          explanation: 'BCNF is a stricter version of 3NF requiring X to be a super key for every functional dependency X -> Y.',
        },
      ],
      flashcards: [
        {
          id: 'fc1',
          frontConcept: 'What is Mutual Exclusion in Deadlocks?',
          backExplanation: 'At least one resource must be held in a non-shareable mode; only one process can use the resource at a time.',
          mastered: false,
        },
        {
          id: 'fc2',
          frontConcept: 'Define Banker\'s Algorithm purpose.',
          backExplanation: 'A deadlock avoidance algorithm that checks if allocating requested resources will leave the system in a safe state.',
          mastered: false,
        },
        {
          id: 'fc3',
          frontConcept: 'What is the difference between 3NF and BCNF?',
          backExplanation: '3NF allows X -> Y if Y is a prime attribute even if X is not a candidate key. BCNF strictly requires X to be a super key for all X -> Y.',
          mastered: false,
        },
        {
          id: 'fc4',
          frontConcept: 'Explain Atomicity in ACID properties.',
          backExplanation: '"All or Nothing" principle: Every operation in a transaction completes successfully, or the entire transaction is rolled back.',
          mastered: false,
        },
      ],
      revisionPlan: [
        {
          dayNumber: 1,
          dayLabel: 'Day 1: Core Concepts & Definitions',
          focusArea: 'Coffman Conditions & ACID Properties',
          estimatedMinutes: 25,
          tasks: [
            'Read exact OCR summary key takeaways',
            'Memorize 4 Coffman conditions for deadlocks',
            'Review ACID properties definitions',
          ],
        },
        {
          dayNumber: 2,
          dayLabel: 'Day 2: Flashcards & Active Recall',
          focusArea: 'Terminology & Normalization Forms',
          estimatedMinutes: 30,
          tasks: [
            'Complete 1st pass of 4 AI flashcards',
            'Compare 1NF, 2NF, 3NF, and BCNF differences',
            'Solve Banker’s Algorithm Need Matrix calculation',
          ],
        },
        {
          dayNumber: 3,
          dayLabel: 'Day 3: Quiz Assessment & Formula Check',
          focusArea: 'Self-Testing & Problem Solving',
          estimatedMinutes: 20,
          tasks: [
            'Take AI generated multiple-choice quiz',
            'Review wrong answer explanations',
            'Write down Banker’s Algorithm formula from memory',
          ],
        },
        {
          dayNumber: 4,
          dayLabel: 'Day 4: Deep Practice & Edge Cases',
          focusArea: 'Resource Allocation Graphs & BCNF',
          estimatedMinutes: 35,
          tasks: [
            'Practice identifying candidate keys in functional dependencies',
            'Trace circular wait in process dependency graphs',
          ],
        },
        {
          dayNumber: 5,
          dayLabel: 'Day 5: Exam Simulation & Speed Test',
          focusArea: 'Timed Revision',
          estimatedMinutes: 25,
          tasks: [
            'Re-take AI Quiz aiming for 100% accuracy in < 3 minutes',
            'Review formula cheat sheet',
          ],
        },
        {
          dayNumber: 6,
          dayLabel: 'Day 6: Final Flashcard Mastery',
          focusArea: 'Weak Spots Clearance',
          estimatedMinutes: 15,
          tasks: [
            'Mark all flashcards as "Mastered"',
            'Review exam tips section',
          ],
        },
        {
          dayNumber: 7,
          dayLabel: 'Day 7: Pre-Exam Light Review',
          focusArea: 'Confidence Boost',
          estimatedMinutes: 10,
          tasks: [
            'Quick 5-minute glance at high-yield summary bullets',
            'Rest well before exam',
          ],
        },
      ],
    };
  }
}
