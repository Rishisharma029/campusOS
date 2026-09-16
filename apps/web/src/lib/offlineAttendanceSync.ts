import { useState, useEffect, useCallback } from 'react';
import { apiSubmitAttendance, apiUpdateAttendance, apiSyncAttendanceBatch, type AttendanceResponse } from '../api/attendance';

export interface QueuedAttendanceRecord {
  id: string;
  student_id: string;
  subject_code: string;
  date: string;
  status: string;
  timestamp: number;
  action: 'UPSERT' | 'UPDATE_ID';
  attendance_id?: string;
}

const STORAGE_KEY = 'campusos_attendance_offline_queue';

export function getOfflineQueue(): QueuedAttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue: QueuedAttendanceRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to persist offline attendance queue', err);
  }
}

export function enqueueAttendance(item: {
  student_id: string;
  subject_code: string;
  date: string;
  status: string;
  action?: 'UPSERT' | 'UPDATE_ID';
  attendance_id?: string;
}): QueuedAttendanceRecord {
  const queue = getOfflineQueue();
  const newRecord: QueuedAttendanceRecord = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    student_id: item.student_id,
    subject_code: item.subject_code,
    date: item.date,
    status: item.status,
    timestamp: Date.now(),
    action: item.action || 'UPSERT',
    attendance_id: item.attendance_id,
  };

  // If a record for the same student, subject, and date is already pending in queue, replace it with latest status
  const existingIdx = queue.findIndex(
    q => q.student_id === item.student_id && q.subject_code === item.subject_code && q.date === item.date
  );

  if (existingIdx >= 0) {
    queue[existingIdx] = newRecord;
  } else {
    queue.push(newRecord);
  }

  saveOfflineQueue(queue);
  return newRecord;
}

export async function flushOfflineQueue(): Promise<{ syncedCount: number; errors: any[] }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0, errors: [] };

  const errors: any[] = [];
  let syncedCount = 0;
  const remainingQueue: QueuedAttendanceRecord[] = [];

  // 1. Try batch sync for all UPSERT actions first (most efficient)
  const upserts = queue.filter(q => q.action === 'UPSERT');
  const directUpdates = queue.filter(q => q.action === 'UPDATE_ID');

  if (upserts.length > 0) {
    try {
      await apiSyncAttendanceBatch(
        upserts.map(u => ({
          student_id: u.student_id,
          subject_code: u.subject_code,
          date: u.date,
          status: u.status,
        }))
      );
      syncedCount += upserts.length;
    } catch (err) {
      console.warn('Batch attendance sync failed, falling back to individual sync:', err);
      // Fallback: try individual items
      for (const item of upserts) {
        try {
          await apiSubmitAttendance({
            student_id: item.student_id,
            subject_code: item.subject_code,
            date: item.date,
            status: item.status,
          });
          syncedCount++;
        } catch (singleErr) {
          remainingQueue.push(item);
          errors.push(singleErr);
        }
      }
    }
  }

  // 2. Process any specific ID updates
  for (const item of directUpdates) {
    if (item.attendance_id) {
      try {
        await apiUpdateAttendance(item.attendance_id, item.status);
        syncedCount++;
      } catch (err) {
        remainingQueue.push(item);
        errors.push(err);
      }
    }
  }

  saveOfflineQueue(remainingQueue);
  return { syncedCount, errors };
}

export function useOfflineAttendanceSync() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingQueue, setPendingQueue] = useState<QueuedAttendanceRecord[]>(() => getOfflineQueue());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const refreshQueue = useCallback(() => {
    setPendingQueue(getOfflineQueue());
  }, []);

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await flushOfflineQueue();
      if (res.syncedCount > 0) {
        setLastSyncTime(new Date());
      }
    } catch (err) {
      console.error('Error flushing attendance queue:', err);
    } finally {
      refreshQueue();
      setIsSyncing(false);
    }
  }, [isSyncing, refreshQueue]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check: if there are pending items, attempt flush
    if (navigator.onLine && getOfflineQueue().length > 0) {
      triggerSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync]);

  return {
    isOnline,
    isSyncing,
    pendingCount: pendingQueue.length,
    pendingQueue,
    refreshQueue,
    triggerSync,
    lastSyncTime,
  };
}
