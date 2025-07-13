import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "./main";
import { AuthForm } from "./components/AuthForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/auth/register`, values);

      const { code, msg } = res.data;

      if (!res.data || !res.data.email) {
        toast.error(msg || "Registration failed.");
        return;
      }

      toast.success("Registration successful! Check your email for verification.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="register" onSubmit={handleRegister} loading={loading} />;
};

export default Register;
