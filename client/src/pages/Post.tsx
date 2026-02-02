import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import type { FeedPost } from "../types/types";
import FeedPostCard from "../components/FeedPostCard";
import { fetchAllPosts, fetchMyPosts } from "../apis/posts";
import { useAppSelector } from "../hooks/redux";

const Post = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user } = useAppSelector((state) => state.auth);

  const [post, setPost] = useState<FeedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const isMyPost = location.pathname.startsWith("/mypost");
  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      setLoading(true);
      try {
        const data = isMyPost ? await fetchMyPosts(1, 10, postId) : await fetchAllPosts(1, 10, postId);
        setPost(data.blogs[0]);
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  /* ----------------------------
     Guards
  ---------------------------- */
  if (!postId) return <Navigate to="/feed" replace />;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center text-gray-500">
        Loading post...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center text-red-500">
        {error ?? "Post not found"}
      </div>
    );
  }

  /* ----------------------------
     Render
  ---------------------------- */
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Post</h1>
      <FeedPostCard post={post} />
    </div>
  );
};

export default Post;
