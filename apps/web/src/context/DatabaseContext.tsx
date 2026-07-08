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
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial Mock Students
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'STU001',
      name: 'Aarav Mehta',
      email: 'aarav.mehta@university.edu',
      rollNo: '2024CS001',
      department: 'Computer Science',
      course: 'B.Tech CSE',
      year: 3,
      attendanceRate: 92.5,
      feePaid: 150000,
      feeTotal: 180000,
      hostelRoom: 'Block A, Room 304',
      transportBus: 'Route 12',
      placementStatus: 'Eligible',
      cgpa: 8.7,
      parentName: 'Rajesh Mehta',
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
        { studentId: 'STU001', studentName: 'Aarav Mehta', issueDate: '2026-07-01', dueDate: '2026-07-15' },
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
    { id: 'R001', studentId: 'STU001', studentName: 'Aarav Mehta', subjectName: 'Data Structures', marksObtained: 88, maxMarks: 100, grade: 'A+' },
    { id: 'R002', studentId: 'STU001', studentName: 'Aarav Mehta', subjectName: 'Computer Architecture', marksObtained: 79, maxMarks: 100, grade: 'A' },
    { id: 'R003', studentId: 'STU002', studentName: 'Diya Sharma', subjectName: 'Microprocessors', marksObtained: 94, maxMarks: 100, grade: 'O' },
  ]);

  // Initial Fee Collections Ledger
  const [feeCollections, setFeeCollections] = useState<FeeCollection[]>([
    { id: 'RCP1001', studentId: 'STU001', studentName: 'Aarav Mehta', amountPaid: 50000, receiptNo: 'RCP1001', paymentDate: '2026-06-15', paymentMethod: 'UPI / NetBanking' },
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
      message: `Received fee payment of ₹${amount.toLocaleString()} from ${student.name} via ${method}. Receipt: ${receiptNo}.`,
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
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
