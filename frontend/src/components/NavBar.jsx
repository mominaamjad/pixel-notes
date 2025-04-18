import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, NotebookText, Package, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import ToolTipIcon from "./ToolTipIcon";
import Button from "./Button";

const Navbar = () => {
  const { logout } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowToast(true);
  };

  const confirmAndLogout = () => {
    logout();
    setShowToast(false);
    navigate("/login");
  };

  return (
    <header className="bg-white py-5 px-8 shadow-lg">
      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-custom-offwhite border p-6 shadow-xl text-center w-96">
            <p className="mb-4 text-lg text-gray-800 font-semibold font-mono">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={confirmAndLogout}
                className="bg-custom-dark-pink w-20 text-white px-4 hover:opacity-70"
              >
                Yes
              </Button>
              <Button
                onClick={() => setShowToast(false)}
                className="bg-custom-light-pink w-20 px-4 hover:opacity-70"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="font-pixel text-xl tracking-wide text-custom-dark-pink">
          PIXEL NOTES
        </h1>

        <nav className="flex space-x-10 font-mono font-semibold text-custom-brown">
          <ToolTipIcon href="/dashboard" icon={NotebookText} label="Notes" />
          <ToolTipIcon href="/archives" icon={Package} label="Archives" />
          <ToolTipIcon href="/profile" icon={User} label="Profile" />
          <button
            onClick={handleLogout}
            className="group flex flex-col items-center hover:text-red-500 transition"
          >
            <ToolTipIcon
              icon={LogOut}
              label="Logout"
              color="hover:text-red-500"
            />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
