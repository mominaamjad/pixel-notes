import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../services/authService";
import { handleExportNotes } from "../utils/noteHandlers";
import useAuth from "../hooks/useAuth";
import {
  ConfirmationModal,
  NavBar,
  PixelLoader,
  PixelMenu,
  UpdatePasswordModal,
  ExportOptionsModal,
} from "../components";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await authService.getUserProfile(token);
        setUser(data);
      } catch (err) {
        toast.error("Failed to load profile", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const onExport = async (format = "txt") => {
    await handleExportNotes(format);
  };

  const handleLogout = () => {
    logout();
    setShowConfirmation(false);
    navigate("/login");
  };

  if (loading) return <PixelLoader />;

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center mt-5 px-4 font-jersey text-gray-800">
        <div className="bg-white py-8 border-2 border-black shadow-[6px_6px_0_#000000] text-center w-full max-w-md">
          <div className="px-8 flex flex-col items-center">
            <img
              src="/assets/pfp.png"
              alt="Profile"
              className="w-28 h-28 mb-4 pixelated"
            />
            <h2 className="text-3xl">{user.name}</h2>
            <p className="text-lg">{user.email}</p>
          </div>

          <hr className="border-t-2 border-dashed border-black my-6 w-full" />

          <div className="px-12">
            <PixelMenu
              options={["Update Password", "Export Notes", "Logout"]}
              onSelect={(option) => {
                if (option === "Update Password") setShowPasswordModal(true);
                else if (option === "Export Notes") setShowExportOptions(true);
                else if (option === "Logout") setShowConfirmation(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showConfirmation && (
        <ConfirmationModal
          type="logout"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {showExportOptions && (
        <ExportOptionsModal
          onExport={onExport}
          onClose={() => setShowExportOptions(false)}
        />
      )}

      {showPasswordModal && (
        <UpdatePasswordModal onCancel={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};

export default Profile;
