import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StyledInput from "./StyledInput";
import { Toaster, toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        "https://ars.disruptwave.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);
      if (data.success) {
        // console.log(data);
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("role", data.data.user.role.name);
        localStorage.setItem("user_id", data.data.user.id);
        if (
          data.data.user.role.name == "Admin" ||
          data.data.user.role.name == "Administration"
        ) {
          navigate("/");
        } else if (data.data.user.role.name == "Healthcare Manager") {
          navigate("/HomeHealthCare");
        } else if (data.data.user.role.name == "Call Center Operator") {
          navigate("/");
        }
        window.dispatchEvent(new Event("login-success"));
      } else if (data.code == 400) {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Login error", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Toaster richColors />
      <h1 className="text-5xl p-10 text-gray-700">Please Login to Continue.</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96"
      >
        <div className="mb-4">
          <StyledInput
            label={"Email"}
            id={"email"}
            type={"email"}
            placeholder={"Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <StyledInput
            label={"Password"}
            id={"password"}
            type={"password"}
            placeholder={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          {loading ? (
            <div
              className="text-primary-100 bg-white rounded-md border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
              type="submit"
            >
              Logging in...
            </div>
          ) : (
            <button
              className="text-primary-100 bg-white rounded-md border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
              type="submit"
            >
              Sign In
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
