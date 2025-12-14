import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '@/types';

interface TaskBoardProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskClick: (task: Task) => void;
  onCreateTask: () => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

export function TaskBoard({
  tasks,
  isLoading,
  onTaskClick,
  onCreateTask,
  onUpdateTaskStatus,
}: TaskBoardProps) {
  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-8 w-24 rounded bg-muted animate-pulse" />
            <div className="h-32 rounded-lg border bg-card animate-pulse" />
            <div className="h-32 rounded-lg border bg-card animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {column.title}
              </h3>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {getTasksByStatus(column.id).length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px] rounded-lg border border-dashed bg-muted/30 p-3">
              {getTasksByStatus(column.id).map((task, index) => (
                <div
                  key={task.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TaskCard
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onStatusChange={(status) => onUpdateTaskStatus(task.id, status)}
                  />
                </div>
              ))}
              {getTasksByStatus(column.id).length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No tasks
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
