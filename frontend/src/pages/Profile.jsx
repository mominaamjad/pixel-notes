import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import authService from "../services/authService";
import { ConfirmationModal, NavBar, PixelLoader } from "../components";
import PixelMenu from "../components/PixelMenu";
import noteService from "../services/noteService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
