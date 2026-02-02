import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import type { Post, PostInput } from "../types/types";
import PostActions from "./PostActions";
import ConfirmModal from "../components/modals/ConfirmModal";
import PostModal from "./modals/PostModal";
import formatDateTime from "../lib/formatDateTime";
import { useAppSelector } from "../hooks/redux";

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
  myPost?: boolean;
}

const PostCard = ({ post, onDelete, myPost }: PostCardProps) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [searchParams, setSearchParams] = useSearchParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isEdit =
    searchParams.get("mode") === "edit" && searchParams.get("id") === post._id;

  const [initialValues] = useState<PostInput>({
    _id: post._id,
    title: post.title,
    content: post.content,
    authorId: post.author._id,
    banner: post.banner.url,
  });

  const handleDelete = () => {
    onDelete(post._id);
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    setSearchParams({ id: post._id, mode: "edit" });
  };

  const bannerUrl = post.banner?.url;

  return (
    <>
      <div
        onClick={() =>
          navigate(myPost ? `/mypost/${post._id}` : `/admin/post/${post._id}`)
        }
        className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:shadow transition"
      >
        {/* Banner */}
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt={post.title}
            className="h-40 w-full object-cover"
            loading="lazy"
          />
        )}

        <div className="p-5 space-y-3">
          <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>

          <p className="text-sm text-gray-600 dark:text-zinc-300 line-clamp-3">
            {post.content}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400">
            <span>
              By {post.author.email === user?.email ? "You" : post.author.email}
            </span>
            <span>{formatDateTime(post.publishedAt)}</span>
          </div>

          {/* Prevent navigation on actions */}
          <div
            className="flex justify-between items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <PostActions
              post={post}
              onDeleteClick={() => setShowDeleteModal(true)}
              onEditClick={handleEdit}
            />
            <p
              className={
                post.status === "published"
                  ? "bg-green-500 text-white px-2 py-1 rounded-full text-xs uppercase"
                  : post.status === "draft"
                    ? "bg-yellow-500 text-white px-2 py-1 rounded-full text-xs uppercase"
                    : "bg-red-500 text-white px-2 py-1 rounded-full text-xs uppercase"
              }
            >
              {post.status}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Post?"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Yes, delete"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* Edit Modal */}
      {isEdit && (
        <PostModal
          open
          mode="edit"
          initialValues={initialValues}
          onClose={() => navigate(-1)}
        />
      )}
    </>
  );
};

export default PostCard;
