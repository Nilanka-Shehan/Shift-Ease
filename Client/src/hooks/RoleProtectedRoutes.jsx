import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRoleCheck from "./useRoleCheck";
import UnauthorizedModal from "../components/UnauthoricedModel";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { hasAccess, isRoleCheckLoading } = useRoleCheck(allowedRoles);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isRoleCheckLoading && !hasAccess) {
      setShowModal(true);
    }
  }, [hasAccess, isRoleCheckLoading]);

  const handleClose = () => {
    setShowModal(false);
    navigate("/");
  };

  if (isRoleCheckLoading) return <div>Loading...</div>;

  if (showModal) return <UnauthorizedModal onClose={handleClose} />;

  return children;
};

export default RoleProtectedRoute;
