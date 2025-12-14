import { CheckCircle2, Circle, Clock, FolderKanban } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectWithStats } from '@/types';

interface ProjectStatsProps {
  projects: ProjectWithStats[];
}

export function ProjectStats({ projects }: ProjectStatsProps) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'ACTIVE').length;
  const totalTasks = projects.reduce((acc, p) => acc + p.taskCount, 0);
  const completedTasks = projects.reduce((acc, p) => acc + p.completedTasks, 0);
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: FolderKanban,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: Clock,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Circle,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
