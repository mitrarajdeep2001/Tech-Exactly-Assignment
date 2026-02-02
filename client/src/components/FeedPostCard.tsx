import type { FeedPost } from "../types/types";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { useRef, useState } from "react";
import { useAppSelector } from "../hooks/redux";
import { addComment, deleteComment, updateComment } from "../apis/comments";
import toast from "react-hot-toast";
import formatDateTime from "../lib/formatDateTime";

const FeedPostCard = ({ post }: { post: FeedPost }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [comments, setComments] = useState(post.comments);
  const bottomCommentRef = useRef<HTMLDivElement | null>(null);
  const bannerUrl = post.banner?.url;

  const handleAddComment = async (content: string) => {
    const newComment = await addComment(post._id, content);

    setComments((prev) => [...prev, newComment]);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = bottomCommentRef.current;
        if (!container) return;

        container.scrollTop = container.scrollHeight;
      });
    });
  };

  const handleUpdate = async (commentId: string, content: string) => {
    try {
      await updateComment(commentId, content);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, content } : c)),
      );
      toast.success("Comment updated");
    } catch (error) {
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      {/* Banner */}
      {bannerUrl && (
        <img
          src={bannerUrl}
          alt={post.title}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      )}

      <div className="p-6 space-y-4">
        {/* Author */}
        <div className="text-sm text-gray-500 dark:text-zinc-400">
          {post.author.email === user?.email ? "You" : post.author.email} •{" "}
          <span
            className={`text-white ${post.author.role === "ADMIN".toLocaleLowerCase() ? "bg-red-500" : "bg-blue-500"} rounded p-0.5 text-xs uppercase`}
          >
            {post.author.role}
          </span>{" "}
          • {formatDateTime(post.publishedAt)}
        </div>

        {/* Content */}
        <div>
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p className="text-gray-700 dark:text-zinc-300 mt-2">
            {post.content}
          </p>
        </div>

        {/* Comments */}
        <CommentList
          comments={comments}
          bottomCommentRef={bottomCommentRef}
          canEdit={(comment) =>
            user?.role === "ADMIN" || user?._id === comment.author._id
          }
          canDelete={(comment) =>
            user?.role === "ADMIN" || user?._id === comment.author._id
          }
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        <CommentInput onSubmit={handleAddComment} />
      </div>
    </div>
  );
};

export default FeedPostCard;
