import { useAppSelector } from "./redux";

const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  return auth;
};
export default useAuth;
