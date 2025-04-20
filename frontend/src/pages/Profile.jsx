import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import authService from "../services/authService";
import { ConfirmationModal, NavBar, PixelLoader } from "../components";
import PixelMenu from "../components/PixelMenu";
import noteService from "../services/noteService";
import { useNavigate } from "react-router-dom";
import UpdatePasswordModal from "../components/UpdatePasswordModal";

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

  const handleExportNotes = async (format = "txt") => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await noteService.exportNotes(format, token);
      if (!res) return;

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      const fileName = `notes-export.${format}`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to export notes.", err.message);
    }
  };

  const handleLogout = () => {
    logout();
    setShowConfirmation(false);
    navigate("/login");
  };

  if (loading) return <PixelLoader />;

  return (
    <>
      {showConfirmation && (
        <ConfirmationModal
          type="logout"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {showExportOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white shadow-lg border-2 border-custom-brown w-80 max-w-full">
            <div className="bg-custom-brown text-white px-6 py-3 text-sm font-bold">
              Select Export Format
            </div>
            <ul className="divide-y divide-custom-brown">
              {["txt", "csv", "json"].map((format) => (
                <li
                  key={format}
                  onClick={() => {
                    handleExportNotes(format);
                    setShowExportOptions(false);
                  }}
                  className="px-4 py-3 hover:bg-custom-offwhite cursor-pointer font-mono text-sm"
                >
                  {format.toUpperCase()}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowExportOptions(false)}
              className="w-full text-center py-2 text-red-500 font-semibold border-t border-custom-brown"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <UpdatePasswordModal onCancel={() => setShowPasswordModal(false)} />
      )}

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
    </>
  );
};

export default Profile;
