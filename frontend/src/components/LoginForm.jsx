import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import useAuth from "../hooks/useAuth";
import Input from "./Input";
import Button from "./Button";
import CustomLink from "./CustomLink";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { login, loading, error } = useAuth();
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

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const success = await login(formData);
      if (success) navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, #b83556, #dc97a5, #fed385)`,
        }}
      ></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Login Form Card */}
        <div className="bg-custom-offwhite border-4 border-custom-offwhite p-6  relative shadow-md [clip-path:polygon(0_4px,4px_0,calc(100%-4px)_0,100%_4px,100%_calc(100%-4px),calc(100%-4px)_100%,4px_100%,0_calc(100%-4px))]">
          <img
            src="/assets/pixel-logo.png"
            alt="Pixel Notes Logo"
            className="h-20 mx-auto"
          />
          <h2 className="font-mono text-2xl text-custom-dark-pink text-center mb-4">
            LOGIN
          </h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 font-jersey">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-base font-jersey text-custom-brown text-left"
              >
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {formErrors.email && (
                <p className="text-red-500 font-jersey text-sm text-left">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-base font-jersey text-custom-brown text-left"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="password"
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
            </div>

            <Button
              type="submit"
              disabled={loading}
              fullWidth={true}
              className="bg-custom-dark-pink text-white"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse">Loading...</span>
                </span>
              ) : (
                "Login"
              )}
            </Button>

            <div className="mt-6 text-center font-jersey text-custom-brown">
              <p>
                Do not have an account?{" "}
                <CustomLink to="/signup">Sign up</CustomLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
