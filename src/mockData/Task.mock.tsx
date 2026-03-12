import {Task} from '../interface/Task.interface';

export const TaskData: Task[] = [
  {
    id: '1',
    title: 'Prepare project report',
    description: 'Finish the weekly report for manager',
    createdAt: new Date(),
    status: 'Pending',
    syncStatus: 'Synced',
  },
  {
    id: '2',
    title: 'Fix login bug',
    description: 'Resolve authentication issue',
    createdAt: new Date(Date.now() - 3 * 86400000),
    status: 'In Progress',
    syncStatus: 'Pending Sync',
  },
  {
    id: '3',
    title: 'Team meeting',
    description: 'Discuss roadmap planning',
    createdAt: new Date(Date.now() - 10 * 86400000),
    status: 'Completed',
    syncStatus: 'Pending Sync',
  },
];
