import { useEffect, useState } from "react";
import { deletePosts, fetchMyPosts } from "../apis/posts";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import type { Post } from "../types/types";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePosts(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setTotalItems((prev) => prev - 1);
      toast.success("Post deleted");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await fetchMyPosts(currentPage, PAGE_SIZE);
        setPosts(res.blogs);
        setTotalItems(res.total);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My Posts</h1>

      {loading ? (
        <div className="text-sm text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-sm text-gray-500">No posts found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
                myPost={true}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default MyPosts;
