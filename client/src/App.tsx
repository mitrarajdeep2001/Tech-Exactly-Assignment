import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import MyPosts from "./pages/MyPosts";
import Feed from "./pages/Feed";
import Post from "./pages/Post";
import UsersPage from "./pages/UsersPage";
import AuthInitializer from "./components/AuthInitializer";
import PublicLayout from "./layouts/PublicLayout";
import RequireRole from "./layouts/RequireRoleLayout";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
            </Route>
            {/* Protected */}
            <Route element={<ProtectedLayout />}>
              <Route element={<RequireRole allowedRoles={["USER"]} />}>
                <Route path="/" element={<Navigate to="/feed" replace />} />
                <Route path="/feed" element={<Feed />} />
              </Route>
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/mypost/:postId" element={<Post />} />
              {/* ADMIN ONLY */}
              <Route element={<RequireRole allowedRoles={["ADMIN"]} />}>
                <Route
                  path="/"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/posts" element={<Posts />} />
                <Route path="/admin/post/:postId" element={<Post />} />
                <Route path="/admin/users" element={<UsersPage />} />
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </AuthInitializer>
        <Toaster />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
