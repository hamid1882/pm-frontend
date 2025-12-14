import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK_COMMENTS } from '@/graphql/queries';
import { ADD_TASK_COMMENT, DELETE_TASK_COMMENT } from '@/graphql/mutations';
import { TaskComment } from '@/types';
import { toast } from 'sonner';

interface CommentResponse {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}

const transformComment = (comment: CommentResponse, taskId: string): TaskComment => ({
  id: comment.id,
  task_id: taskId,
  content: comment.content,
  author_email: comment.authorEmail,
  created_at: comment.createdAt,
});

export function useComments(taskId: string | null) {
  const { data, loading, error, refetch } = useQuery<{ taskComments: CommentResponse[] }>(GET_TASK_COMMENTS, {
    variables: { taskId },
    skip: !taskId,
  });

  return {
    data: taskId && data?.taskComments ? data.taskComments.map((c) => transformComment(c, taskId)) : undefined,
    isLoading: loading,
    error,
    refetch,
  };
}

export function useCreateComment() {
  const [addComment, { loading }] = useMutation(ADD_TASK_COMMENT, {
    refetchQueries: ['GetTaskComments'],
    onCompleted: () => {
      toast.success('Comment added');
    },
    onError: (error) => {
      toast.error('Failed to add comment: ' + error.message);
    },
  });

  return {
    mutateAsync: (comment: Omit<TaskComment, 'id' | 'created_at'>) =>
      addComment({
        variables: {
          taskId: comment.task_id,
          content: comment.content,
          authorEmail: comment.author_email,
        },
      }),
    isPending: loading,
  };
}

export function useDeleteComment() {
  const [deleteComment, { loading }] = useMutation(DELETE_TASK_COMMENT, {
    refetchQueries: ['GetTaskComments'],
    onCompleted: () => {
      toast.success('Comment deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete comment: ' + error.message);
    },
  });

  return {
    mutateAsync: (commentId: string) => deleteComment({ variables: { id: commentId } }),
    isPending: loading,
  };
}
