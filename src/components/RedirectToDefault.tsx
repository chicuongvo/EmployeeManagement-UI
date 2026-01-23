import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { ROLE_LEVELS } from "@/constants/roleLevel";

const RedirectToDefault = () => {
  const { roleLevel, isLoading } = useUser();
  
  // Wait for user data to load before redirecting
  if (isLoading) {
    return null; // or a loading spinner
  }
  
  // If user doesn't have manager level or higher (roleLevel < MANAGEMENT_LEVEL or null)
  // redirect to /employee/me, otherwise redirect to /management/employees
  const defaultRoute = 
    roleLevel === null || roleLevel < ROLE_LEVELS.MANAGEMENT_LEVEL
      ? "/employee/me"
      : "/management/employees";

  return <Navigate to={defaultRoute} replace />;
};

export default RedirectToDefault;


