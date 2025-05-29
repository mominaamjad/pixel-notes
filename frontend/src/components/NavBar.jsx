import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, NotebookText, Package, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import ToolTipIcon from "./ToolTipIcon";
import ConfirmationModal from "./ConfirmationModal";

const Navbar = () => {
  const { logout } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowConfirmation(false);
    navigate("/login");
  };

  return (
    <header className="bg-white py-5 px-8 shadow-lg">
      {showConfirmation && (
        <ConfirmationModal
          type="logout"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="font-pixel text-xl tracking-wide mb-1 bg-custom-dark-pink text-white px-2 py-1 shadow-[5px_5px_0_#eba2b0]">
          PIXEL NOTES
        </h1>

        <nav className="flex space-x-10 font-mono font-semibold text-custom-brown">
          <ToolTipIcon href="/dashboard" icon={NotebookText} label="Notes" />
          <ToolTipIcon href="/archives" icon={Package} label="Archives" />
          <ToolTipIcon href="/profile" icon={User} label="Profile" />
          <button
            onClick={() => {
              setShowConfirmation(true);
            }}
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
