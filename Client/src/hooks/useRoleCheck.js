import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRoleCheck = (allowedRoles = []) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data = { hasAccess: true, role: null },
    isLoading: isRoleCheckLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["roleCheck", user?.id, allowedRoles], // Add user to query key
    queryFn: async () => {
      if (allowedRoles.length === 0) {
        return { hasAccess: true, role: null };
      }

      const res = await axiosSecure.get("/user/roles");
      const userRole = res.data?.role;

      return {
        hasAccess: allowedRoles.includes(userRole),
        role: userRole,
      };
    },
    enabled: !!user && allowedRoles.length > 0,
    retry: false,
  });

  return {
    hasAccess: data.hasAccess,
    role: data.role,
    isRoleCheckLoading,
    isError,
    refetch,
  };
};

export default useRoleCheck;