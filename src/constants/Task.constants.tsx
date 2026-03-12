export const STATUS = {
  STATUS_PENDING: 'Pending',
  STATUS_PROGRESS: 'In Progress',
  STATUS_COMPLETED: 'Completed',
};

export const SYNCSTATUS = {
  SYNC_STATUS_SUCESS: 'Synced',
  SYNC_STATUS_PENDING_SYNC: 'Pending Sync',
  SYNC_STATUS_FAILED: 'Failed Sync',
};

export const statusOptions = [
  { label: 'All Status', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
];

export const dateOptions = [
  { label: 'All Dates', value: 'All' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
];
