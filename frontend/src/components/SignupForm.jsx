import { React, useState } from "react";
import useAuth from "../hooks/useAuth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import CustomLink from "./CustomLink";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

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

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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
    if (validateForm()) {
      const success = await signup(formData);
      if (success) {
        toast.success("Created account successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, #fed385, #dc97a5, #b83556)`,
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-custom-offwhite border-4 border-custom-offwhite p-6 relative shadow-md rounded-sm ">
          <div className="flex items-center justify-center">
            <img
              src="/assets/pixel-logo.png"
              alt="Pixel Notes Logo"
              className="h-20 mr-3"
            />
            <h2 className="font-pixel text-2xl text-custom-dark-pink text-center">
              PIXEL NOTES
            </h2>
          </div>
          <p className="text-lg font-jersey mb-3 text-custom-brown">
            Create an account
          </p>

          {error && toast.error(error)}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              autoComplete="name"
            />
            {formErrors.name && (
              <p className="text-red-500 font-jersey text-sm text-left">
                {formErrors.name}
              </p>
            )}

            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              autoComplete="email"
            />
            {formErrors.email && (
              <p className="text-red-500 font-jersey text-sm text-left">
                {formErrors.email}
              </p>
            )}

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
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none active:outline-none"
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
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none active:outline-none"
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
              disabled={loading}
              className=" bg-custom-dark-pink text-white py-2 px-4 border-2 border-black hover:bg-custom-light-pink transition-colors relative"
              fullWidth={true}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse">Loading...</span>
                </span>
              ) : (
                "Sign up"
              )}
            </Button>

            <div className="mt-6 text-center font-jersey text-custom-brown">
              <p>
                Already have an account?{" "}
                <CustomLink to="/login">Login</CustomLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
