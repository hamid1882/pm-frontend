import { Calendar, User, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task, TaskStatus } from '@/types';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

export function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const handleStatusChange = (e: React.MouseEvent, status: TaskStatus) => {
    e.stopPropagation();
    onStatusChange(status);
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20 bg-card"
      onClick={onClick}
    >
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-foreground line-clamp-2">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'TODO')}>
                Move to To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'IN_PROGRESS')}>
                Move to In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'DONE')}>
                Move to Done
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-3 space-y-2">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.assignee_email && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-[120px]">{task.assignee_email}</span>
            </div>
          )}
          {task.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.due_date), 'MMM d')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
