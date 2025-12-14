import { Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressRing } from '@/components/ui/progress-ring';
import { ProjectWithStats } from '@/types';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: ProjectWithStats;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const progress = project.taskCount > 0 
    ? (project.completedTasks / project.taskCount) * 100 
    : 0;

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/20"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <StatusBadge status={project.status} size="sm" />
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ProgressRing progress={progress} size={36} strokeWidth={3} />
            <div className="text-sm">
              <span className="font-medium text-foreground">{project.completedTasks}</span>
              <span className="text-muted-foreground">/{project.taskCount} tasks</span>
            </div>
          </div>

          {project.due_date && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(project.due_date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
