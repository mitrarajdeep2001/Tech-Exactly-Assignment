import { useEffect, useState } from "react";
import { fetchFeed } from "../apis/feeds";
import type { FeedPost } from "../types/types";
import FeedPostCard from "../components/FeedPostCard";
import Pagination from "../components/Pagination";

const Feed = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await fetchFeed(currentPage, PAGE_SIZE);
        setPosts(res.blogs);
        setTotalItems(res.total);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Feed</h1>

      {loading ? (
        <div className="text-sm text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-sm text-gray-500">No posts found.</div>
      ) : (
        <>
          {posts.map((post) => (
            <FeedPostCard key={post._id} post={post} />
          ))}
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

export default Feed;
