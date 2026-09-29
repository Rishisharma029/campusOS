import React, { createContext, useContext, useState } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  course: string;
  year: number;
  attendanceRate: number;
  feePaid: number;
  feeTotal: number;
  hostelRoom: string;
  transportBus: string;
  placementStatus: 'Placed' | 'Preparing' | 'Applied' | 'Eligible' | 'Not Eligible';
  cgpa: number;
  parentName: string;
  parentEmail: string;
  phone: string;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  courses: string[];
  loadHours: number;
  status: 'Active' | 'On Leave';
}

export interface LeaveRequest {
  id: string;
  facultyName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  issuedTo: { studentId: string; studentName: string; issueDate: string; dueDate: string }[];
}

export interface PlacementDrive {
  id: string;
  company: string;
  role: string;
  driveDate: string;
  packageOffer: string;
  status: 'Upcoming' | 'Ongoing' | 'Closed';
  eligibleCgpa: number;
}

export interface Exam {
  id: string;
  course: string;
  subject: string;
  examDate: string;
  duration: string;
  type: 'Midterm' | 'End Semester' | 'Practical';
  room: string;
}

export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
}

export interface FeeCollection {
  id: string;
  studentId: string;
  studentName: string;
  amountPaid: number;
  receiptNo: string;
  paymentDate: string;
  paymentMethod: string;
}

export interface ERPNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'academic' | 'fee' | 'exam' | 'placement' | 'general';
}

export interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  studentId: string;
  course: string;
  status: 'Present' | 'Absent' | 'Late';
  markedBy: string;
  timestamp: string;
}

export interface ActiveClassSession {
  id: string;
  name: string;
  code: string;
  section: string;
  room: string;
  faculty: string;
  startedAt: string;
  durationMinutes: number;
  endTime: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

interface DatabaseContextType {
  students: Student[];
  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  faculty: Faculty[];
  addFaculty: (f: Omit<Faculty, 'id'>) => void;
  leaves: LeaveRequest[];
  addLeaveRequest: (l: Omit<LeaveRequest, 'id' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  books: Book[];
  issueBook: (bookId: string, studentId: string, studentName: string) => boolean;
  returnBook: (bookId: string, studentId: string) => void;
  placements: PlacementDrive[];
  addPlacementDrive: (p: Omit<PlacementDrive, 'id'>) => void;
  exams: Exam[];
  addExam: (e: Omit<Exam, 'id'>) => void;
  results: Result[];
  addResult: (r: Omit<Result, 'id'>) => void;
  feeCollections: FeeCollection[];
  collectFee: (studentId: string, amount: number, method: string) => void;
  notifications: ERPNotification[];
  addNotification: (n: Omit<ERPNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  attendanceRecords: Record<string, DailyAttendanceRecord>;
  markStudentAttendance: (
    studentId: string,
    date: string,
    status: 'Present' | 'Absent' | 'Late',
    options?: { course?: string; markedBy?: string; timestamp?: string }
  ) => void;
  batchMarkAttendance: (
    records: { studentId: string; date: string; status: 'Present' | 'Absent' | 'Late'; course?: string }[],
    markedBy?: string
  ) => void;
  activeClassSession: ActiveClassSession | null;
  startClassSession: (session: Omit<ActiveClassSession, 'status' | 'startedAt' | 'endTime'>) => void;
  endClassSession: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial Mock Students
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'STU001',
      name: 'Rishi Sharma',
      email: 'rishi.sharma@university.edu',
      rollNo: '2024CS001',
      department: 'Computer Science',
      course: 'B.Tech CSE',
      year: 4,
      attendanceRate: 86.4,
      feePaid: 150000,
      feeTotal: 180000,
      hostelRoom: 'Block A, Room 304',
      transportBus: 'Route 12',
      placementStatus: 'Eligible',
      cgpa: 9.24,
      parentName: 'Sunil Sharma',
      parentEmail: 'rajesh.mehta@gmail.com',
      phone: '+91 98765 43210',
    },
    {
      id: 'STU002',
      name: 'Diya Sharma',
      email: 'diya.sharma@university.edu',
      rollNo: '2024EC042',
      department: 'Electronics',
      course: 'B.Tech ECE',
      year: 3,
      attendanceRate: 88.0,
      feePaid: 180000,
      feeTotal: 180000,
      hostelRoom: 'Block C, Room 102',
      transportBus: 'None (Day Scholar)',
      placementStatus: 'Placed',
      cgpa: 9.2,
      parentName: 'Anil Sharma',
      parentEmail: 'anil.sharma@gmail.com',
      phone: '+91 98123 45678',
    },
    {
      id: 'STU003',
      name: 'Rohan Sen',
      email: 'rohan.sen@university.edu',
      rollNo: '2025ME015',
      department: 'Mechanical Eng.',
      course: 'B.Tech ME',
      year: 2,
      attendanceRate: 74.2,
      feePaid: 90000,
      feeTotal: 180000,
      hostelRoom: 'Block B, Room 210',
      transportBus: 'Route 4',
      placementStatus: 'Preparing',
      cgpa: 7.1,
      parentName: 'Sanjay Sen',
      parentEmail: 'sanjay.sen@gmail.com',
      phone: '+91 97765 12345',
    },
    {
      id: 'STU004',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@university.edu',
      rollNo: '2023CS048',
      department: 'Computer Science',
      course: 'B.Tech CSE',
      year: 4,
      attendanceRate: 95.8,
      feePaid: 180000,
      feeTotal: 180000,
      hostelRoom: 'None (Day Scholar)',
      transportBus: 'Route 7',
      placementStatus: 'Placed',
      cgpa: 9.6,
      parentName: 'Venkat Iyer',
      parentEmail: 'v.iyer@yahoo.com',
      phone: '+91 95432 10987',
    },
    {
      id: 'STU005',
      name: 'Kabir Malhotra',
      email: 'kabir.malhotra@university.edu',
      rollNo: '2025IT008',
      department: 'Information Tech.',
      course: 'B.Tech IT',
      year: 2,
      attendanceRate: 81.5,
      feePaid: 120000,
      feeTotal: 180000,
      hostelRoom: 'Block A, Room 105',
      transportBus: 'None (Day Scholar)',
      placementStatus: 'Eligible',
      cgpa: 8.0,
      parentName: 'Ramesh Malhotra',
      parentEmail: 'ramesh.mal@gmail.com',
      phone: '+91 91234 56789',
    },
  ]);

  // Initial Mock Faculty
  const [faculty, setFaculty] = useState<Faculty[]>([
    {
      id: 'FAC001',
      name: 'Dr. Arindam Sen',
      email: 'arindam.sen@university.edu',
      department: 'Computer Science',
      designation: 'Professor & HOD',
      courses: ['B.Tech CSE', 'M.Tech AI'],
      loadHours: 12,
      status: 'Active',
    },
    {
      id: 'FAC002',
      name: 'Prof. Meera Deshmukh',
      email: 'meera.d@university.edu',
      department: 'Electronics',
      designation: 'Associate Professor',
      courses: ['B.Tech ECE'],
      loadHours: 16,
      status: 'Active',
    },
    {
      id: 'FAC003',
      name: 'Dr. Vikram Rathore',
      email: 'vikram.rathore@university.edu',
      department: 'Mechanical Eng.',
      designation: 'Assistant Professor',
      courses: ['B.Tech ME'],
      loadHours: 14,
      status: 'On Leave',
    },
  ]);

  // Initial Leave Requests
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    {
      id: 'LV001',
      facultyName: 'Dr. Vikram Rathore',
      startDate: '2026-07-10',
      endDate: '2026-07-14',
      reason: 'Medical Leave - Eye surgery recovery',
      status: 'Approved',
    },
    {
      id: 'LV002',
      facultyName: 'Prof. Meera Deshmukh',
      startDate: '2026-07-20',
      endDate: '2026-07-22',
      reason: 'Academic Development - Attending IEEE Conference',
      status: 'Pending',
    },
  ]);

  // Initial Books
  const [books, setBooks] = useState<Book[]>([
    {
      id: 'B001',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen',
      isbn: '9780262033848',
      category: 'Computer Science',
      totalCopies: 10,
      availableCopies: 8,
      issuedTo: [
        { studentId: 'STU001', studentName: 'Rishi Sharma', issueDate: '2026-07-01', dueDate: '2026-07-15' },
      ],
    },
    {
      id: 'B002',
      title: 'Digital Signal Processing',
      author: 'John G. Proakis',
      isbn: '9780131873742',
      category: 'Electronics',
      totalCopies: 5,
      availableCopies: 5,
      issuedTo: [],
    },
    {
      id: 'B003',
      title: 'Engineering Thermodynamics',
      author: 'P.K. Nag',
      isbn: '9789352606429',
      category: 'Mechanical Eng.',
      totalCopies: 8,
      availableCopies: 7,
      issuedTo: [
        { studentId: 'STU003', studentName: 'Rohan Sen', issueDate: '2026-07-04', dueDate: '2026-07-18' },
      ],
    },
  ]);

  // Initial Placement Drives
  const [placements, setPlacements] = useState<PlacementDrive[]>([
    {
      id: 'PL001',
      company: 'Google',
      role: 'Software Development Engineer (SDE-1)',
      driveDate: '2026-08-12',
      packageOffer: '32.5 LPA',
      status: 'Upcoming',
      eligibleCgpa: 8.5,
    },
    {
      id: 'PL002',
      company: 'Microsoft',
      role: 'Support Engineer / Consultant',
      driveDate: '2026-07-18',
      packageOffer: '18.0 LPA',
      status: 'Ongoing',
      eligibleCgpa: 8.0,
    },
    {
      id: 'PL003',
      company: 'TCS Digital',
      role: 'Systems Engineer',
      driveDate: '2026-06-28',
      packageOffer: '7.0 LPA',
      status: 'Closed',
      eligibleCgpa: 7.0,
    },
  ]);

  // Initial Exams
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 'EX001',
      course: 'B.Tech CSE',
      subject: 'Data Structures and Algorithms',
      examDate: '2026-07-15',
      duration: '3 Hours (09:00 AM - 12:00 PM)',
      type: 'End Semester',
      room: 'LHC-101',
    },
    {
      id: 'EX002',
      course: 'B.Tech ECE',
      subject: 'Analog Communications',
      examDate: '2026-07-16',
      duration: '3 Hours (01:30 PM - 04:30 PM)',
      type: 'End Semester',
      room: 'LHC-204',
    },
  ]);

  // Initial Mock Exam Results
  const [results, setResults] = useState<Result[]>([
    { id: 'R001', studentId: 'STU001', studentName: '.Rishi Sharma', subjectName: 'Data Structures', marksObtained: 88, maxMarks: 100, grade: 'A+' },
    { id: 'R002', studentId: 'STU001', studentName: '.Rishi Sharma', subjectName: 'Computer Architecture', marksObtained: 79, maxMarks: 100, grade: 'A' },
    { id: 'R003', studentId: 'STU002', studentName: 'Diya Sharma', subjectName: 'Microprocessors', marksObtained: 94, maxMarks: 100, grade: 'O' },
  ]);

  // Initial Fee Collections Ledger
  const [feeCollections, setFeeCollections] = useState<FeeCollection[]>([
    { id: 'RCP1001', studentId: 'STU001', studentName: '.Rishi Sharma', amountPaid: 50000, receiptNo: 'RCP1001', paymentDate: '2026-06-15', paymentMethod: 'UPI / NetBanking' },
    { id: 'RCP1002', studentId: 'STU002', studentName: 'Diya Sharma', amountPaid: 180000, receiptNo: 'RCP1002', paymentDate: '2026-06-10', paymentMethod: 'Credit Card' },
    { id: 'RCP1003', studentId: 'STU003', studentName: 'Rohan Sen', amountPaid: 90000, receiptNo: 'RCP1003', paymentDate: '2026-06-20', paymentMethod: 'Debit Card' },
  ]);

  // Initial Notifications
  const [notifications, setNotifications] = useState<ERPNotification[]>([
    {
      id: 'NT001',
      title: 'End-Term Examination Schedule Out',
      message: 'The End-Semester theory & practical examinations for B.Tech third year will begin from July 15, 2026. Download details from the Examinations tab.',
      timestamp: '2026-07-08T10:00:00Z',
      read: false,
      category: 'exam',
    },
    {
      id: 'NT002',
      title: 'Google SDE Drive Registrations Open',
      message: 'Google has listed its drive date for August 12. Eligible students (CGPA >= 8.5) must upload updated resumes in the Placements Portal by July 25.',
      timestamp: '2026-07-07T14:30:00Z',
      read: false,
      category: 'placement',
    },
    {
      id: 'NT003',
      title: 'Fee Payment Deadline Reminder',
      message: 'This is a reminder for pending course fee collections. Late fine calculations of 5% will trigger after July 15.',
      timestamp: '2026-07-06T09:15:00Z',
      read: true,
      category: 'fee',
    },
  ]);

  // Real-time Institutional Attendance Records Ledger
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, DailyAttendanceRecord>>(() => {
    const initial: Record<string, DailyAttendanceRecord> = {};
    const defaultAbsents = ['2026-09-04', '2026-09-11'];
    const defaultLates = ['2026-09-08', '2026-09-15'];

    for (let day = 1; day <= 30; day++) {
      const d = new Date(2026, 8, day);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
      const status: 'Present' | 'Absent' | 'Late' = defaultAbsents.includes(dateStr)
        ? 'Absent'
        : defaultLates.includes(dateStr)
        ? 'Late'
        : 'Present';

      const rec: DailyAttendanceRecord = {
        date: dateStr,
        studentId: 'STU001',
        course: 'B.Tech CSE',
        status,
        markedBy: status === 'Present' ? 'Biometric RFID Turnstile Gate A' : 'Dr. Arindam Sen (Faculty)',
        timestamp: status === 'Present' ? '08:58 AM' : status === 'Late' ? '09:18 AM' : '09:00 AM',
      };

      initial[`${dateStr}_STU001`] = rec;
      initial[`${dateStr}_std_2026_001`] = rec;
      initial[`${dateStr}_2024CS001`] = rec;
    }
    return initial;
  });

  // Handler functions for dynamic operations
  const addStudent = (s: Omit<Student, 'id'>) => {
    const newId = `STU${String(students.length + 1).padStart(3, '0')}`;
    setStudents((prev) => [...prev, { ...s, id: newId }]);
    addNotification({
      title: 'New Student Registered',
      message: `${s.name} (${s.course}) has been admitted successfully under department ${s.department}.`,
      category: 'academic',
    });
  };

  const updateStudent = (s: Student) => {
    setStudents((prev) => prev.map((st) => (st.id === s.id ? s : st)));
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (student) {
      addNotification({
        title: 'Student Registration Cancelled',
        message: `${student.name} (${student.id}) record has been removed.`,
        category: 'academic',
      });
    }
  };

  const addFaculty = (f: Omit<Faculty, 'id'>) => {
    const newId = `FAC${String(faculty.length + 1).padStart(3, '0')}`;
    setFaculty((prev) => [...prev, { ...f, id: newId }]);
    addNotification({
      title: 'New Faculty Appointed',
      message: `${f.name} joined as ${f.designation} in ${f.department}.`,
      category: 'academic',
    });
  };

  const addLeaveRequest = (l: Omit<LeaveRequest, 'id' | 'status'>) => {
    const newId = `LV${String(leaves.length + 1).padStart(3, '0')}`;
    setLeaves((prev) => [...prev, { ...l, id: newId, status: 'Pending' }]);
  };

  const updateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setLeaves((prev) =>
      prev.map((lv) => {
        if (lv.id === id) {
          if (status === 'Approved') {
            setFaculty((fPrev) =>
              fPrev.map((fac) => (fac.name === lv.facultyName ? { ...fac, status: 'On Leave' } : fac))
            );
          }
          return { ...lv, status };
        }
        return lv;
      })
    );
  };

  const issueBook = (bookId: string, studentId: string, studentName: string): boolean => {
    let success = false;
    setBooks((prev) =>
      prev.map((bk) => {
        if (bk.id === bookId && bk.availableCopies > 0) {
          success = true;
          const issueDate = new Date().toISOString().split('T')[0];
          const due = new Date();
          due.setDate(due.getDate() + 14); // 14 days due
          const dueDate = due.toISOString().split('T')[0];
          return {
            ...bk,
            availableCopies: bk.availableCopies - 1,
            issuedTo: [...bk.issuedTo, { studentId, studentName, issueDate, dueDate }],
          };
        }
        return bk;
      })
    );
    if (success) {
      addNotification({
        title: 'Library Book Issued',
        message: `Book ID ${bookId} issued to ${studentName} (${studentId}). Due on ${new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString()}.`,
        category: 'general',
      });
    }
    return success;
  };

  const returnBook = (bookId: string, studentId: string) => {
    setBooks((prev) =>
      prev.map((bk) => {
        if (bk.id === bookId) {
          return {
            ...bk,
            availableCopies: bk.availableCopies + 1,
            issuedTo: bk.issuedTo.filter((iss) => iss.studentId !== studentId),
          };
        }
        return bk;
      })
    );
    addNotification({
      title: 'Library Book Returned',
      message: `Book ID ${bookId} returned by student ${studentId}.`,
      category: 'general',
    });
  };

  const addPlacementDrive = (p: Omit<PlacementDrive, 'id'>) => {
    const newId = `PL${String(placements.length + 1).padStart(3, '0')}`;
    setPlacements((prev) => [...prev, { ...p, id: newId }]);
    addNotification({
      title: `Placement Drive: ${p.company}`,
      message: `Drive scheduled for ${p.driveDate} for ${p.role}. Package offered: ${p.packageOffer}.`,
      category: 'placement',
    });
  };

  const addExam = (e: Omit<Exam, 'id'>) => {
    const newId = `EX${String(exams.length + 1).padStart(3, '0')}`;
    setExams((prev) => [...prev, { ...e, id: newId }]);
  };

  const addResult = (r: Omit<Result, 'id'>) => {
    const newId = `R${String(results.length + 1).padStart(3, '0')}`;
    setResults((prev) => [...prev, { ...r, id: newId }]);
  };

  const collectFee = (studentId: string, amount: number, method: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    // Update student's fee paid
    setStudents((prev) =>
      prev.map((st) => (st.id === studentId ? { ...st, feePaid: st.feePaid + amount } : st))
    );

    // Create receipt
    const receiptNo = `RCP${String(feeCollections.length + 1001)}`;
    const paymentDate = new Date().toISOString().split('T')[0];
    setFeeCollections((prev) => [
      ...prev,
      {
        id: receiptNo,
        studentId,
        studentName: student.name,
        amountPaid: amount,
        receiptNo,
        paymentDate,
        paymentMethod: method,
      },
    ]);

    addNotification({
      title: 'Fee Payment Received',
      message: `Received fee payment of ₹${(Number(amount) || 0).toLocaleString()} from ${student.name} via ${method}. Receipt: ${receiptNo}.`,
      category: 'fee',
    });
  };

  const addNotification = (n: Omit<ERPNotification, 'id' | 'timestamp' | 'read'>) => {
    const newId = `NT${String(notifications.length + 1).padStart(3, '0')}`;
    const timestamp = new Date().toISOString();
    setNotifications((prev) => [
      { ...n, id: newId, timestamp, read: false },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // Helper to calculate exact real-time attendance rate for a student given their records
  const calculateStudentRate = (
    targetStudentId: string,
    currentRecords: Record<string, DailyAttendanceRecord>
  ): number => {
    let workingDays = 0;
    let presentDays = 0;

    for (let day = 1; day <= 30; day++) {
      const d = new Date(2026, 8, day);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      workingDays++;

      const dateStr = `2026-09-${String(day).padStart(2, '0')}`;
      const rec =
        currentRecords[`${dateStr}_${targetStudentId}`] ||
        (targetStudentId === 'STU001' ? currentRecords[`${dateStr}_std_2026_001`] || currentRecords[`${dateStr}_2024CS001`] : undefined);

      if (rec) {
        if (rec.status === 'Present') presentDays += 1;
        else if (rec.status === 'Late') presentDays += 0.5;
        // Absent adds 0
      } else {
        // Default: Day 4 & 11 absent, Day 8 & 15 late, others present
        if (day === 4 || day === 11) {
          // absent
        } else if (day === 8 || day === 15) {
          presentDays += 0.5;
        } else {
          presentDays += 1;
        }
      }
    }

    return workingDays > 0 ? parseFloat(((presentDays / workingDays) * 100).toFixed(1)) : 86.4;
  };

  const markStudentAttendance = (
    studentId: string,
    date: string,
    status: 'Present' | 'Absent' | 'Late',
    options?: { course?: string; markedBy?: string; timestamp?: string }
  ) => {
    const student = students.find((s) => s.id === studentId || s.rollNo === studentId) || students[0];
    const targetStudentId = student ? student.id : studentId;
    const nowTime = options?.timestamp || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const facultyName = options?.markedBy || 'Dr. Arindam Sen (Faculty)';

    const newRecord: DailyAttendanceRecord = {
      date,
      studentId: targetStudentId,
      course: options?.course || student?.course || 'B.Tech CSE',
      status,
      markedBy: facultyName,
      timestamp: nowTime,
    };

    const nextRecords = {
      ...attendanceRecords,
      [`${date}_${targetStudentId}`]: newRecord,
      [`${date}_STU001`]: targetStudentId === 'STU001' || student?.rollNo === '2024CS001' ? newRecord : attendanceRecords[`${date}_STU001`],
      [`${date}_std_2026_001`]: targetStudentId === 'STU001' || student?.rollNo === '2024CS001' ? newRecord : attendanceRecords[`${date}_std_2026_001`],
      [`${date}_2024CS001`]: targetStudentId === 'STU001' || student?.rollNo === '2024CS001' ? newRecord : attendanceRecords[`${date}_2024CS001`],
    };

    setAttendanceRecords(nextRecords);

    if (student) {
      const nextRate = calculateStudentRate(targetStudentId, nextRecords);

      setStudents((prev) =>
        prev.map((st) =>
          st.id === student.id || st.rollNo === student.rollNo
            ? { ...st, attendanceRate: nextRate }
            : st
        )
      );

      addNotification({
        title: status === 'Absent' ? 'Attendance Shortage Alert' : 'Attendance Verified',
        message: `${facultyName} marked ${student.name} as ${status.toUpperCase()} for ${date} (${newRecord.course}). Live attendance percentage adjusted to ${nextRate}%.`,
        category: 'academic',
      });
    }
  };

  const batchMarkAttendance = (
    records: { studentId: string; date: string; status: 'Present' | 'Absent' | 'Late'; course?: string }[],
    markedBy = 'AI Face Recognition Scanner (Faculty Session)'
  ) => {
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const updates: Record<string, DailyAttendanceRecord> = {};

    records.forEach((r) => {
      const rec: DailyAttendanceRecord = {
        date: r.date,
        studentId: r.studentId,
        course: r.course || 'B.Tech CSE',
        status: r.status,
        markedBy,
        timestamp: nowTime,
      };
      updates[`${r.date}_${r.studentId}`] = rec;
      if (r.studentId === 'STU001') {
        updates[`${r.date}_std_2026_001`] = rec;
        updates[`${r.date}_2024CS001`] = rec;
      }
    });

    const nextRecords = { ...attendanceRecords, ...updates };
    setAttendanceRecords(nextRecords);

    setStudents((prev) =>
      prev.map((st) => {
        const hasUpdate = records.some((r) => r.studentId === st.id || r.studentId === st.rollNo);
        if (hasUpdate) {
          const nextRate = calculateStudentRate(st.id, nextRecords);
          return { ...st, attendanceRate: nextRate };
        }
        return st;
      })
    );
  };

  // Live active classroom session state
  const [activeClassSession, setActiveClassSession] = useState<ActiveClassSession | null>(null);

  const startClassSession = (session: Omit<ActiveClassSession, 'status' | 'startedAt' | 'endTime'>) => {
    const now = new Date();
    const endTime = new Date(now.getTime() + session.durationMinutes * 60000);
    const newSession: ActiveClassSession = {
      ...session,
      startedAt: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'IN_PROGRESS',
    };
    setActiveClassSession(newSession);

    addNotification({
      title: `Live Class Started: ${session.code}`,
      message: `${session.name} in ${session.room} is now live. Attendance window opened for students.`,
      category: 'academic',
    });
  };

  const endClassSession = () => {
    if (activeClassSession) {
      addNotification({
        title: `Class Concluded: ${activeClassSession.code}`,
        message: `${activeClassSession.name} period has concluded. Attendance window automatically locked and committed to ERP ledger.`,
        category: 'academic',
      });
    }
    setActiveClassSession(null);
  };

  return (
    <DatabaseContext.Provider
      value={{
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        faculty,
        addFaculty,
        leaves,
        addLeaveRequest,
        updateLeaveStatus,
        books,
        issueBook,
        returnBook,
        placements,
        addPlacementDrive,
        exams,
        addExam,
        results,
        addResult,
        feeCollections,
        collectFee,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        attendanceRecords,
        markStudentAttendance,
        batchMarkAttendance,
        activeClassSession,
        startClassSession,
        endClassSession,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

const fallbackDatabaseContext: DatabaseContextType = {
  students: [],
  addStudent: () => {},
  updateStudent: () => {},
  deleteStudent: () => {},
  faculty: [],
  addFaculty: () => {},
  leaves: [],
  addLeaveRequest: () => {},
  updateLeaveStatus: () => {},
  books: [],
  issueBook: () => false,
  returnBook: () => {},
  placements: [],
  addPlacementDrive: () => {},
  exams: [],
  addExam: () => {},
  results: [],
  addResult: () => {},
  feeCollections: [],
  collectFee: () => {},
  notifications: [],
  addNotification: () => {},
  markNotificationRead: () => {},
  markAllNotificationsRead: () => {},
  attendanceRecords: {},
  markStudentAttendance: () => {},
  batchMarkAttendance: () => {},
  activeClassSession: null,
  startClassSession: () => {},
  endClassSession: () => {},
};

export const useDatabase = () => {
  try {
    const context = useContext(DatabaseContext);
    if (!context) return fallbackDatabaseContext;
    return context;
  } catch {
    return fallbackDatabaseContext;
  }
};
