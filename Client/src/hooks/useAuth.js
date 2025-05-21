import { useContext } from "react";
import { AuthContext } from "../context/Authprovider";


const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export default useAuth;