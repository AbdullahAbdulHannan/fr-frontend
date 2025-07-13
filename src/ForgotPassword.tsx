import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "./main";
import { AuthForm } from "./components/AuthForm";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleForgot = async (values: { email: string }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/auth/forgot-password`, values);
    

      

      toast.success("If this email is registered, a reset link has been sent.");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="forgot" onSubmit={handleForgot} loading={loading} />;
};

export default ForgotPassword;
