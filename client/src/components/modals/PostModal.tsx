import PostForm from "../PostForm";
import type { PostInput } from "../../types/types";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: PostInput;
  onClose: () => void;
}

const PostModal = ({ open, mode, initialValues, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 rounded-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Create Post" : "Edit Post"}
          </h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <PostForm initialValues={initialValues} onClose={onClose} mode={mode} />
      </div>
    </div>
  );
};

export default PostModal;
