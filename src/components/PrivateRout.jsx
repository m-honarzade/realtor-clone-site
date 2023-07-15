import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

const PrivateRout = () => {
  const { loggedIn, chekingStatus } = useAuthStatus();
  if (chekingStatus) {
    return <h3>Loading.........</h3>;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};
export default PrivateRout;
