import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginForm from "./pages/LoginForm";
import SignupForm from "./pages/SignupForm";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  );
}

export default App;
