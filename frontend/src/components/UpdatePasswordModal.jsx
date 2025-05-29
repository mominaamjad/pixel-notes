import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import Input from "./Input";
import Button from "./Button";

const UpdatePasswordModal = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { updatePassword } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmVisibility = () => {
    setShowConfirm(!showConfirm);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.password) errors.password = "Old password is required";
    if (!formData.newPassword) errors.newPassword = "New password is required";
    else if (formData.newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters";

    if (!formData.confirmNewPassword)
      errors.confirmNewPassword = "Please confirm your password";
    else if (formData.newPassword !== formData.confirmNewPassword)
      errors.confirmNewPassword = "Passwords do not match";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await updatePassword(formData);

    if (success) {
      toast.success("Password updated successfully!");
      onCancel();
    } else {
      toast.error("Failed to update password.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-custom-offwhite border p-6 shadow-xl w-96">
        <h2 className="text-lg font-semibold font-mono text-center mb-4 text-gray-800">
          Update Your Password
        </h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Current Password"
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm font-jersey">
              {formErrors.password}
            </p>
          )}

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New Password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          {formErrors.newPassword && (
            <p className="text-red-500 text-sm font-jersey">
              {formErrors.newPassword}
            </p>
          )}

          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              placeholder="Confirm New Password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={toggleConfirmVisibility}
            >
              {showConfirm ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          {formErrors.confirmNewPassword && (
            <p className="text-red-500 text-sm font-jersey">
              {formErrors.confirmNewPassword}
            </p>
          )}

          <div className="flex justify-center gap-4 mt-4">
            <Button
              type="button"
              onClick={onCancel}
              className="bg-custom-light-pink w-20 hover:opacity-70"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-custom-dark-pink text-white w-20 hover:opacity-70"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
