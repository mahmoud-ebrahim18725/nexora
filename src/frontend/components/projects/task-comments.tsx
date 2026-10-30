"use client";

import { useState } from "react";
import Avatar from "@/frontend/components/ui/avatar";
import Button from "@/frontend/components/ui/button";
import { FormError, inputClasses } from "@/frontend/components/ui/field";
import { ErrorState } from "@/frontend/components/ui/states";
import { formatRelativeTime } from "@/frontend/lib/format";
import { getErrorMessage, useResource } from "@/frontend/lib/use-resource";
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from "@/frontend/services/task-services";
import type { Comment } from "@/frontend/types/task";

function CommentItem({
  comment,
  canEdit,
  canDelete,
  onUpdate,
  onDelete,
}: {
  comment: Comment;
  canEdit: boolean;
  canDelete: boolean;
  onUpdate: (content: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    setError("");
    setIsBusy(true);
    try {
      await action();
      setIsEditing(false);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsBusy(false);
    }
  }

  const authorName = comment.user?.name ?? "Former member";

  return (
    <li className="flex gap-3">
      <Avatar name={authorName} id={comment.user?.id ?? 0} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="truncate text-sm font-medium text-gray-900">
            {authorName}
          </p>
          <time
            dateTime={comment.createdAt}
            className="shrink-0 text-xs text-gray-400"
          >
            {formatRelativeTime(comment.createdAt)}
          </time>
        </div>
        {isEditing ? (
          <div className="mt-1.5 space-y-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={2}
              aria-label="Edit comment"
              className={`${inputClasses} resize-none py-2`}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                isLoading={isBusy}
                disabled={!draft.trim()}
                onClick={() => run(() => onUpdate(draft.trim()))}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={isBusy}
                onClick={() => {
                  setDraft(comment.content);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
            {comment.content}
          </p>
        )}
        {!isEditing && (canEdit || canDelete) && (
          <div className="mt-1 flex gap-3 text-xs font-medium">
            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-900"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => run(onDelete)}
                className="text-gray-500 hover:text-red-600 disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </li>
  );
}

export default function TaskComments({
  projectId,
  taskId,
  currentUserId,
  canComment,
  canModerate,
}: {
  projectId: number;
  taskId: number;
  currentUserId: number;
  canComment: boolean;
  canModerate: boolean;
}) {
  const {
    data: comments,
    error,
    reload,
  } = useResource(
    () => listComments(projectId, taskId),
    `comments-${projectId}-${taskId}`,
  );
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await createComment(projectId, taskId, content.trim());
      setContent("");
      reload();
    } catch (caughtError) {
      setSubmitError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="comments-title">
      <h3
        id="comments-title"
        className="flex items-center gap-2 text-sm font-semibold text-gray-900"
      >
        Comments
        {comments && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            {comments.length}
          </span>
        )}
      </h3>

      <div className="mt-4">
        {error ? (
          <ErrorState error={error} onRetry={reload} />
        ) : !comments ? (
          <div className="space-y-3" aria-busy="true">
            {[1, 2].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
                <div className="h-10 flex-1 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => {
              const isAuthor = comment.user?.id === currentUserId;
              return (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  canEdit={isAuthor}
                  canDelete={isAuthor || canModerate}
                  onUpdate={async (nextContent) => {
                    await updateComment(
                      projectId,
                      taskId,
                      comment.id,
                      nextContent,
                    );
                    reload();
                  }}
                  onDelete={async () => {
                    await deleteComment(projectId, taskId, comment.id);
                    reload();
                  }}
                />
              );
            })}
          </ul>
        )}
      </div>

      {canComment && (
        <form onSubmit={handleSubmit} className="mt-5 space-y-2">
          <FormError message={submitError} />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.currentTarget.form?.requestSubmit();
              }
            }}
            rows={3}
            placeholder="Write a comment…"
            aria-label="Write a comment"
            className={`${inputClasses} resize-none py-2`}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Ctrl + Enter to send</span>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              disabled={!content.trim()}
            >
              Comment
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
