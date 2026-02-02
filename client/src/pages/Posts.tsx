import { useEffect, useState } from "react";
import { deletePosts, fetchAllPosts } from "../apis/posts";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import type { Post } from "../types/types";
import { useAppSelector } from "../hooks/redux";

const PAGE_SIZE = 9;

const Posts = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleDeletePost = async (postId: string) => {
    await deletePosts(postId);
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    setTotalItems((prev) => prev - 1);
  };

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await fetchAllPosts(currentPage, PAGE_SIZE);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {user?.role === "ADMIN" ? "All Posts" : "Posts"}
        </h1>
      </div>

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
                onDelete={() => handleDeletePost(post._id)}
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

export default Posts;
