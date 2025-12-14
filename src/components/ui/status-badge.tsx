import { cn } from '@/lib/utils';
import { ProjectStatus, TaskStatus } from '@/types';

interface StatusBadgeProps {
  status: ProjectStatus | TaskStatus;
  size?: 'sm' | 'md';
}

const statusConfig = {
  // Project statuses
  ACTIVE: {
    label: 'Active',
    className: 'bg-status-active/10 text-status-active border-status-active/20',
  },
  ON_HOLD: {
    label: 'On Hold',
    className: 'bg-status-on-hold/10 text-status-on-hold border-status-on-hold/20',
  },
  COMPLETED: {
    label: 'Completed',
    className: 'bg-status-completed/10 text-status-completed border-status-completed/20',
  },
  // Task statuses
  TODO: {
    label: 'To Do',
    className: 'bg-status-todo/10 text-status-todo border-status-todo/20',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20',
  },
  DONE: {
    label: 'Done',
    className: 'bg-status-done/10 text-status-done border-status-done/20',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      {config.label}
    </span>
  );
}
