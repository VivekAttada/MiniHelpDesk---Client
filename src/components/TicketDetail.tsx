import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ticketApi, commentApi } from '../api';
import type { Ticket, Comment, Status } from '../types';

const commentSchema = z.object({
  author: z.string().min(2, 'Author name must be at least 2 characters'),
  body: z
    .string()
    .min(2, 'Comment must be at least 2 characters')
    .max(500, 'Comment must not exceed 500 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    if (id) {
      fetchTicketAndComments();
    }
  }, [id]);

  const fetchTicketAndComments = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [ticketData, commentsData] = await Promise.all([
        ticketApi.get(id),
        commentApi.list(id),
      ]);
      setTicket(ticketData);
      setComments(commentsData);
      setError('');
    } catch (err) {
      setError('Failed to load ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (!id || !ticket) return;

    try {
      setUpdatingStatus(true);
      const updatedTicket = await ticketApi.update(id, { status: newStatus });
      setTicket(updatedTicket);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update ticket status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const onSubmitComment = async (data: CommentFormData) => {
    if (!id) return;

    try {
      const newComment = await commentApi.create(id, data);
      setComments([...comments, newComment]);
      reset();
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Failed to add comment');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading ticket...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Ticket not found'}</p>
        <Link to="/tickets" className="text-blue-600 hover:text-blue-800">
          Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back button */}
      <div className="mb-4">
        <Link
          to="/tickets"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <span>&larr;</span> Back to tickets
        </Link>
      </div>

      {/* Ticket details */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {ticket.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Reported by {ticket.reporter}</span>
              <span>•</span>
              <span>Created {formatDate(ticket.createdAt)}</span>
              <span>•</span>
              <span>Updated {formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Description
          </h3>
          <p className="text-gray-900 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as Status)}
            disabled={updatingStatus}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Comments section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Comments ({comments.length})
        </h3>

        {/* Comments list */}
        <div className="space-y-4 mb-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {comment.author}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Add comment form */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Add a comment
          </h4>
          <form onSubmit={handleSubmit(onSubmitComment)} className="space-y-4">
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Name *
              </label>
              <input
                {...register('author')}
                type="text"
                id="author"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.author.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comment *
              </label>
              <textarea
                {...register('body')}
                id="body"
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.body ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Write your comment..."
              />
              {errors.body && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.body.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Comment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
