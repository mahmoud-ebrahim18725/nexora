"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useCurrentUser } from "../../context/current-user";
import { formatDate } from "../../lib/format";
import { useResource } from "../../lib/use-resource";
import { useSubmit } from "../../lib/use-submit";
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from "../../services/task-services";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { FormError, TextAreaField } from "../ui/field";

export function TaskComments({
  projectId,
  taskId,
  canManage,
}: {
  projectId: number;
  taskId: number;
  canManage: boolean;
}) {
  const user = useCurrentUser();
  const { pending, error, run } = useSubmit();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const load = useCallback(
    () => listComments(projectId, taskId),
    [projectId, taskId],
  );
  const comments = useResource(load);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = event.currentTarget;
    const content = String(new FormData(target).get("content")).trim();
    if (content && (await run(() => createComment(projectId, taskId, content)))) {
      target.reset();
      comments.reload();
    }
  }

  async function save(event: FormEvent<HTMLFormElement>, commentId: number) {
    event.preventDefault();
    const content = String(new FormData(event.currentTarget).get("content")).trim();
    if (content && (await run(() => updateComment(projectId, taskId, commentId, content)))) {
      setEditingId(null);
      comments.reload();
    }
  }

  return (
    <section className="flex flex-col gap-3.5 border-t border-line pt-4">
      <h3 className="font-semibold">Comments</h3>
      <FormError message={error?.message ?? comments.error?.message} />
      {comments.data?.length === 0 && (
        <p className="text-sm text-muted">No comments yet.</p>
      )}
      {comments.data?.map((comment) => {
        const author = comment.user?.name ?? "Former member";
        const mine = comment.user?.id === user.id;
        return (
          <article key={comment.id} className="flex gap-2.5">
            <Avatar name={author} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <strong>{author}</strong>{" "}
                <span className="text-[13px] text-muted">
                  {formatDate(comment.createdAt)}
                </span>
              </p>
              {editingId === comment.id ? (
                <form
                  onSubmit={(event) => save(event, comment.id)}
                  className="mt-1 flex flex-col gap-2"
                >
                  <TextAreaField
                    label="Edit comment"
                    name="content"
                    rows={2}
                    defaultValue={comment.content}
                    maxLength={5000}
                    required
                  />
                  <span className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="dark" loading={pending}>
                      Save
                    </Button>
                  </span>
                </form>
              ) : (
                <>
                  <p className="text-sm break-words whitespace-pre-line">{comment.content}</p>
                  {(mine || canManage) && (
                    <span className="flex gap-3 text-[13px] text-muted">
                      {mine && (
                        <button
                          type="button"
                          onClick={() => setEditingId(comment.id)}
                          className="min-h-11 underline"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setRemovingId(comment.id)}
                        className="min-h-11 underline"
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </>
              )}
            </div>
          </article>
        );
      })}
      <form onSubmit={add} className="flex flex-col gap-2">
        <TextAreaField
          label="Add a comment"
          name="content"
          rows={2}
          maxLength={5000}
          required
        />
        <Button type="submit" variant="dark" loading={pending} className="self-end">
          Post comment
        </Button>
      </form>
      {removingId !== null && (
        <ConfirmDialog
          title="Delete comment"
          message="Delete this comment? This cannot be undone."
          confirmLabel="Delete"
          onConfirm={async () => {
            await deleteComment(projectId, taskId, removingId);
            comments.reload();
          }}
          onClose={() => setRemovingId(null)}
        />
      )}
    </section>
  );
}
