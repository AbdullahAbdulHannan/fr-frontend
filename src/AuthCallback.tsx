import React, { useEffect, useState } from "react";

function parseHash(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    expires_in: params.get("expires_in"),
    token_type: params.get("token_type"),
    type: params.get("type"),
  };
}

const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const tokens = parseHash(window.location.hash);
    if (tokens.access_token && tokens.refresh_token) {
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      if (tokens.expires_in) {
        const expiresAt = Math.floor(Date.now() / 1000) + Number(tokens.expires_in);
        localStorage.setItem("expires_in", String(expiresAt));
      } else if (tokens.expires_at) {
        localStorage.setItem("expires_in", String(tokens.expires_at));
      }
      localStorage.setItem("token_type", tokens.token_type || "");
      setStatus("Email confirmed! You are now logged in.");
      // Optionally, redirect to dashboard or home after a delay
      // setTimeout(() => window.location.href = "/", 2000);
    } else {
      setStatus("Invalid or missing tokens in URL.");
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Auth Callback</h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default AuthCallback; 