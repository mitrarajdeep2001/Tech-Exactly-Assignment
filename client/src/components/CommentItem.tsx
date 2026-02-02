import { useState } from "react";
import { PencilIcon, TrashIcon, CheckIcon, XIcon } from "lucide-react";
import type { Comment } from "../types/types";

interface Props {
  comment: Comment;
  canEdit: boolean;
  canDelete: boolean;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

const CommentItem = ({
  comment,
  canEdit,
  canDelete,
  onUpdate,
  onDelete,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.content);

  const handleSave = () => {
    if (!text.trim()) return;
    onUpdate(comment._id, text);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-800 rounded-md px-3 py-2 space-y-1 my-2">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            {comment.author.email}
          </p>

          {isEditing ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full mt-1 text-sm rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 focus:outline-none"
            />
          ) : (
            <p className="text-sm text-gray-700 dark:text-zinc-200">
              {comment.content}
            </p>
          )}
        </div>

        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} title="Save">
                  <CheckIcon size={14} className="text-green-600" />
                </button>
                <button
                  onClick={() => {
                    setText(comment.content);
                    setIsEditing(false);
                  }}
                  title="Cancel"
                >
                  <XIcon size={14} className="text-gray-500" />
                </button>
              </>
            ) : (
              <>
                {canEdit && (
                  <button onClick={() => setIsEditing(true)} title="Edit">
                    <PencilIcon size={14} className="text-blue-600" />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => onDelete(comment._id)}
                    title="Delete"
                  >
                    <TrashIcon size={14} className="text-red-600" />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
