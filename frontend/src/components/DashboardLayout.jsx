import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="container mx-auto pt-6 pb-8 px-4 md:px-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

