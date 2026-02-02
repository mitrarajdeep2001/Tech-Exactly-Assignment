import type { Post } from "../types/types";
import { TrashIcon, PencilIcon } from "lucide-react";

interface Props {
  post: Post;
  onDeleteClick: () => void;
  onEditClick?: () => void;
}

const PostActions = ({ post, onDeleteClick, onEditClick }: Props) => {
  return (
    <div className="flex gap-3 text-sm">
      <button
        onClick={onEditClick}
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        <PencilIcon size={14} />
        Edit
      </button>

      {!(post.status === "deleted") && (
        <button
          onClick={onDeleteClick}
          className="text-red-600 hover:underline flex items-center gap-1"
        >
          <TrashIcon size={14} />
          Delete
        </button>
      )}
    </div>
  );
};

export default PostActions;
