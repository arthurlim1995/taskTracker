import { StatusType, SyncStatusType } from '../types/Task.types';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: StatusType;
  syncStatus: SyncStatusType;
  priority?: string;
}
