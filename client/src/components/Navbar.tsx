import { SearchIcon, PanelLeft, LogOutIcon } from "lucide-react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { logout } from "../redux/slices/authSlice";
import { logoutUser } from "../apis/auth";
import toast from "react-hot-toast";
import NotificationDropdown from "./NotificationDropdown";

interface NavbarProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setIsSidebarOpen }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state: any) => state.theme);
  const { user } = useAppSelector((state: any) => state.auth);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.status === 204) {
        dispatch(logout());
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.log("Unable to logout");
      toast.error("Unable to logout");
    }
  };
  return (
    <header className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Sidebar toggle */}
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg transition text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <PanelLeft size={20} />
          </button>

          {/* Search */}
          {/* <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-4" />
            <input
              type="text"
              placeholder="Search posts, comments..."
              className="pl-9 pr-4 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div> */}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {/* <button
            onClick={() => dispatch(toggleTheme())}
            className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95"
          >
            {theme === "light" ? (
              <MoonIcon className="size-4 text-gray-800" />
            ) : (
              <SunIcon className="size-4 text-yellow-400" />
            )}
          </button> */}

          <NotificationDropdown />

          {/* User info */}
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="text-sm font-medium text-gray-800 dark:text-zinc-100 truncate">
              {user?.email}
            </span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">
              {user?.role}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
            title="Logout"
          >
            <LogOutIcon size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
