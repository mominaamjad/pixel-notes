import React, { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Input from "../components/Input";
import Button from "../components/Button";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

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
    let errors = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least six characters";
    }

    if (!formData.confirmPassword) {
      errors.confirm = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirm = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit clicked");

    if (!validateForm()) return;

    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resetPassword({
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        token,
      });

      console.log("Reset response:", response);

      if (response?.status === "success") {
        toast.success("Password reset successful!");
        navigate("/login");
      } else {
        toast.error(response?.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to top, #b83556, #dc97a5)`,
        }}
      ></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-custom-offwhite p-6  relative shadow-xl">
          <img
            src="/assets/pixel-logo.png"
            alt="Pixel Notes Logo"
            className="h-24 mx-auto"
          />
          <h2 className="font-pixel text-lg text-custom-dark-pink text-center mb-4">
            RESET PASSWORD
          </h2>
          <p className="font-jersey text-center text-custom-brown mb-2">
            Enter your new password
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required={true}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none active:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-red-500 font-jersey text-sm text-left">
                {formErrors.password}
              </p>
            )}

            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                id="confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none active:outline-none"
                onClick={toggleConfirmVisibility}
              >
                {showConfirm ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>
            {formErrors.confirm && (
              <p className="text-red-500 font-jersey text-sm text-left">
                {formErrors.confirm}
              </p>
            )}

            <Button
              type="submit"
              className=" bg-custom-dark-pink text-white py-2 px-4 border-2 border-black hover:bg-custom-light-pink transition-colors relative"
              fullWidth={true}
            >
              {loading ? "Reseting..." : "Reset"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
