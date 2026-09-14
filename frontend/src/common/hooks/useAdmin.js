import { useContext } from "react";
import { AdminContext } from "../context/admin/AdminContext";

const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin deve ser usado dentro de AdminProvider.");
  }

  return context;
};

export default useAdmin;
