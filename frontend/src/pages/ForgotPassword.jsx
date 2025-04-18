import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import Input from "../components/Input";
import Button from "../components/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (formErrors.email) {
      setFormErrors({});
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    toast.loading("Sending reset link ...");
    const response = await authService.forgotPassword({ email });
    toast.dismiss();

    if (response?.status == "success") {
      toast.success("Reset link sent to email");
      setSuccess(true);
    } else {
      toast.error("Error sending link");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, #b83556, #dc97a5)`,
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
            FORGOT PASSWORD
          </h2>
          {!success ? (
            <form onSubmit={handleSubmit} noValidate>
              <p className="font-jersey text-custom-brown mb-2">
                Enter your email
              </p>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {formErrors.email && (
                <p className="text-red-500 font-jersey text-sm text-left">
                  {formErrors.email}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-custom-dark-pink text-white py-2 px-4 border-2 border-black hover:bg-custom-light-pink transition-colors relative mt-4"
                style={{
                  boxShadow: "3px 3px 0 rgba(0, 0, 0, 0.2)",
                }}
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div>
              <p className="font-jersey text-center text-custom-brown text-lg">
                Reset link sent. Please check your email :)
              </p>
            </div>
          )}
          <div className="flex justify-center">
            <Link
              to="/login"
              className="mt-3 text-custom-dark-pink bg-custom-light-pink py-1 px-4 rounded font-jersey hover:underline hover:text-custom-light-pink inline-flex items-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
