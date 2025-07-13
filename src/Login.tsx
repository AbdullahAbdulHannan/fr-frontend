import React, { useState } from "react";
import axios from "axios";
import { baseURL } from "./main";
import { AuthForm } from "./components/AuthForm";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const res = await axios.post(`${baseURL}/auth/login`, values);
      const { code, msg } = res.data;

      if (!res.data || !res.data.user || !res.data.access_token) {
        toast.error(msg || "Login failed.");
        return;
      }
      localStorage.setItem("access_token", res.data.access_token);
      if (res.data.expires_in) {
        // expires_in is seconds from now
        const expiresAt = Math.floor(Date.now() / 1000) + Number(res.data.expires_in);
        localStorage.setItem("expires_in", String(expiresAt));
      } else if (res.data.expires_at) {
        localStorage.setItem("expires_in", String(res.data.expires_at));
      }
      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err: any) {
      toast.error("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />;
};

export default Login;
