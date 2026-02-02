import { useEffect, useState } from "react";
import type { PostInput, User } from "../types/types";
import { useAppSelector } from "../hooks/redux";
import { getAllUsers } from "../apis/users";
import { createPosts, fetchMyPosts, updatePosts } from "../apis/posts";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Props {
  initialValues?: PostInput;
  onClose: () => void;
  mode: "create" | "edit";
}

const PostForm = ({ initialValues, onClose, mode }: Props) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "ADMIN";
  const isEdit = mode === "edit" ? true : false;
  const [loading, setLoading] = useState(false);

  // Form fields
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [authorId, setAuthorId] = useState<string | undefined>(
    initialValues?.authorId,
  );

  // Banner states
  const [banner, setBanner] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removeBanner, setRemoveBanner] = useState(false);

  // Users (admin only)
  const [users, setUsers] = useState<User[]>([]);

  /* ----------------------------------
     Fetch users for admin
  ---------------------------------- */
  useEffect(() => {
    if (!isAdmin) return;

    (async () => {
      const res = await getAllUsers(1, 50);
      setUsers(res.users);
    })();
  }, [isAdmin]);

  /* ----------------------------------
     Banner preview
  ---------------------------------- */
  useEffect(() => {
    if (!banner) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(banner);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [banner]);

  /* ----------------------------------
     Submit handler
  ---------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", "published");

      if (isAdmin && authorId) {
        formData.append("authorId", authorId);
      }

      if (removeBanner) {
        formData.append("removeBanner", "true");
      }

      if (banner) {
        formData.append("banner_image", banner);
      }

      if (isEdit) {
        await updatePosts(formData, initialValues?._id as string);
        toast.success("Post updated");
      } else {
        await createPosts(formData);
        toast.success("Post published");
      }

      await fetchMyPosts(1, 10);
      onClose();
      if (user?.role === "ADMIN") {
        setTimeout(() => {
          location.href = "/admin/posts";
        }, 100);
      } else {
        setTimeout(() => {
          location.href = "/my-posts";
        }, 100);
      }
    } catch (error) {
      console.error("Post submit failed:", error);
      if (!isEdit) {
        toast.error("Failed to create post");
      } else {
        toast.error("Failed to update post");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     UI
  ---------------------------------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Admin: Author selector */}
      {isAdmin && (
        <div>
          <label className="text-sm font-medium">Post Author</label>
          <select
            value={authorId ?? user?._id}
            onChange={(e) => setAuthorId(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md bg-white dark:bg-zinc-900"
          >
            <option value="">{user.email} (Self)</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Banner Image */}
      <div>
        <label className="text-sm font-medium">
          Banner Image <span className="text-red-600">*</span>
        </label>

        {(preview || (initialValues?.banner && !removeBanner)) && (
          <div className="relative mt-2">
            <img
              src={preview || (initialValues?.banner as string)}
              alt="Banner preview"
              className="h-40 w-full object-cover rounded-md border"
            />

            <button
              type="button"
              onClick={() => {
                setBanner(null);
                setPreview(null);
                setRemoveBanner(true);
              }}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
              aria-label="Remove banner"
            >
              ✕
            </button>
          </div>
        )}

        {!preview && (!initialValues?.banner || removeBanner) && (
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => {
              setBanner(e.target.files?.[0] || null);
              setRemoveBanner(false);
            }}
            className="w-full mt-2 text-sm"
          />
        )}
      </div>

      {/* Title */}
      <div>
        <label className="text-sm font-medium">
          Title <span className="text-red-600">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-zinc-900"
        />
      </div>

      {/* Content */}
      <div>
        <label className="text-sm font-medium">
          Content <span className="text-red-600">*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
          className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-zinc-900"
        />
      </div>
      {<p></p>}

      {/* Submit */}
      {!isEdit && (
        <button
          disabled={loading}
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Post"}
        </button>
      )}
      {isEdit && (
        <button
          disabled={loading}
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Post"}
        </button>
      )}
    </form>
  );
};

export default PostForm;
