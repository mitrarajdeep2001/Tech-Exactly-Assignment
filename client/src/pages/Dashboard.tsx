import { FileTextIcon, MessageSquareIcon, UsersIcon } from "lucide-react";
import { useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { getDashboardAnalytics } from "../apis/analytics";
import type { AnalyticsData } from "../types/types";
import { Link } from "react-router-dom";

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) => (
  <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 dark:text-zinc-400">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
    <Icon className="size-6 text-blue-500" />
  </div>
);

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  /**
   * These values will later come from an API:
   * GET /admin/dashboard-stats (admin)
   * GET /dashboard-stats (user)
   */
  const stats = {
    posts: 12,
    comments: 48,
    users: 5,
  };

  useEffect(() => {
    // Fetch dashboard stats from API and set them
    // Example:
    const fetchStats = async () => {
      const res = await getDashboardAnalytics();
      setAnalytics(res);
    };
    fetchStats();
  }, []);
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400">
          Welcome back, {user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/posts">
          <StatCard
            title="Total Posts"
            value={analytics?.totalBlogs as number}
            icon={FileTextIcon}
          />
        </Link>

        <Link to="">
          <StatCard
            title="Total Comments"
            value={analytics?.totalComments as number}
            icon={MessageSquareIcon}
          />
        </Link>

        <Link to="/admin/users">
          <StatCard
            title="Total Users"
            value={analytics?.totalUsers as number}
            icon={UsersIcon}
          />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
