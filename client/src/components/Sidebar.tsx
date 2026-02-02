import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  PlusCircleIcon,
  MessageSquareIcon,
  UsersIcon,
  RssIcon,
} from "lucide-react";
import clsx from "clsx";
import useAuth from "../hooks/useAuth";
import PostModal from "./modals/PostModal";
import type { PostInput } from "../types/types";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
}

type Role = "ADMIN" | "USER";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) => {
  const { user } = useAuth();
  console.log(user, "user");

  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const isCreate = searchParams.get("mode") === "create";

  const [loading, setLoading] = useState(false);

  // 👉 Action: Open Create Modal
  const openCreateModal = () => {
    setSearchParams({ mode: "create" });
  };

  // 👉 Close modal
  const closeModal = () => {
    setSearchParams({});
  };

  const handleSubmit = async (data: PostInput) => {
    setLoading(true);
    try {
      // await createPost(data);
      closeModal();
      navigate("/posts");
    } finally {
      setLoading(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      name: "Feed",
      href: "/feed",
      icon: RssIcon,
      roles: ["USER"],
    },
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboardIcon,
      roles: ["ADMIN"],
    },
    {
      name: "Posts",
      href: "/admin/posts",
      icon: FileTextIcon,
      roles: ["ADMIN"],
    },
    {
      name: "Your Posts",
      href: "/my-posts",
      icon: FileTextIcon,
      roles: ["ADMIN", "USER"],
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: UsersIcon,
      roles: ["ADMIN"],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsSidebarOpen]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={clsx(
          "z-20 bg-white dark:bg-zinc-900 min-w-64 h-screen flex flex-col",
          "border-r border-gray-200 dark:border-zinc-800",
          "max-sm:absolute transition-all duration-300",
          isSidebarOpen ? "left-0" : "-left-full"
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Bloggy</h2>
          <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
           Welcome, {user?.username}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Normal routes */}
          {menuItems
            .filter((item) =>
              item.roles.includes((user?.role ?? "USER") as Role)
            )
            .map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition",
                    "text-gray-700 dark:text-zinc-200",
                    isActive
                      ? "bg-gray-100 dark:bg-zinc-800 font-medium"
                      : "hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                  )
                }
              >
                <item.icon size={16} />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}

          {/* Create Post Action */}
          <button
            onClick={openCreateModal}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm transition
                       text-gray-700 dark:text-zinc-200
                       hover:bg-gray-50 dark:hover:bg-zinc-800/60"
          >
            <PlusCircleIcon size={16} />
            <span className="truncate">Create Post</span>
          </button>
        </nav>
      </aside>

      {/* Create Post Modal */}
      {isCreate && <PostModal open mode="create" onClose={closeModal} />}
    </>
  );
};

export default Sidebar;
