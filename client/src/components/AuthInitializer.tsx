import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../hooks/redux";
import { loginSuccess, logout, authStart } from "../redux/slices/authSlice";
import { getAccessToken } from "../apis/auth";
import { Loader2Icon } from "lucide-react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);
  const location = useLocation();

  const lastPathRef = useRef<string | null>(null);
  const hasShownAuthErrorToast = useRef(false);

  useEffect(() => {
    if (lastPathRef.current === location.pathname) return;
    lastPathRef.current = location.pathname;

    const initAuth = async () => {
      dispatch(authStart());

      try {
        const res = await getAccessToken();

        hasShownAuthErrorToast.current = false; // reset on success

        dispatch(
          loginSuccess({
            user: res.data.user,
            accessToken: res.data.accessToken,
          }),
        );
      } catch (err: any) {
        dispatch(logout());

        if (!hasShownAuthErrorToast.current) {
          hasShownAuthErrorToast.current = true;
          // toast.error(
          //   err?.response?.data?.message ??
          //     "Session expired. Please login again.",
          // );
        }
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [location.pathname]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
