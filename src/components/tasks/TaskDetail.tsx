import { useState } from 'react';
import { ArrowLeft, Calendar, User, Pencil, Trash2, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';
import { Task, TaskComment } from '@/types';
import { format } from 'date-fns';

interface TaskDetailProps {
  task: Task;
  comments: TaskComment[];
  isLoadingComments: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddComment: (content: string, authorEmail: string) => void;
}

export function TaskDetail({
  task,
  comments,
  isLoadingComments,
  onBack,
  onEdit,
  onDelete,
  onAddComment,
}: TaskDetailProps) {
  const [newComment, setNewComment] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() && authorEmail.trim()) {
      onAddComment(newComment.trim(), authorEmail.trim());
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">{task.title}</h1>
          <StatusBadge status={task.status} size="sm" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
              <p className="text-foreground">{task.description}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-6">
            {task.assignee_email && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Assignee</p>
                  <p className="text-sm font-medium">{task.assignee_email}</p>
                </div>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Due Date</p>
                  <p className="text-sm font-medium">
                    {format(new Date(task.due_date), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">Comments</h3>
            <span className="text-sm text-muted-foreground">({comments.length})</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {isLoadingComments ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-lg bg-muted/50 animate-fade-in"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.author_email}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.created_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <Input
              placeholder="Your email"
              type="email"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim() || !authorEmail.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
