import type { Comment } from "../types/types";
import CommentItem from "./CommentItem";

interface Props {
  comments: Comment[];
  bottomCommentRef?: React.RefObject<HTMLDivElement | null>;
  canEdit: (comment: Comment) => boolean;
  canDelete: (comment: Comment) => boolean;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}
const CommentList = ({
  comments,
  bottomCommentRef,
  canEdit,
  canDelete,
  onUpdate,
  onDelete,
}: Props) => {
  if (!comments?.length) return null;

  return (
    <div className="mt-4 space-y-2 border-gray-200 dark:border-zinc-800 rounded-xl p-6">
      <h3 className="font-semibold">Comments | {comments.length}</h3>
      <div ref={bottomCommentRef} className="h-40 overflow-y-auto">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            canEdit={canEdit(comment)}
            canDelete={canDelete(comment)}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
