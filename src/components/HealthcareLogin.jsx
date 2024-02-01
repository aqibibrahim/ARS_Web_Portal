import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StyledInput from "./StyledInput";
import { Toaster, toast } from "sonner";
import { BsEye, BsEyeSlash } from "react-icons/bs";
const HealthcareLogin = ({ updateAuthenticationStatus }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Track password visibility
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  const Tab = ({ selected, title, onClick }) => {
    return (
      <button
        className={`px-[62.5px]  py-2 transition-colors duration-150 ${
          selected
            ? "bg-blue-500 text-white"
            : "bg-white  hover:bg-gray-200  text-black"
        } focus:outline-none`}
        onClick={onClick}
        style={{
          backgroundColor: selected ? "#3182ce !important" : "#fff !important",
        }}
      >
        {title}
      </button>
    );
  };
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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
        updateAuthenticationStatus(true);

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
    <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
      <Toaster richColors />
      <div className="mb-5 font-bold text-lg">Health Care Manager</div>
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
        <div className="mb-6 relative rtl">
          <StyledInput
            label={"Password"}
            id={"password"}
            type={showPassword ? "text" : "password"} // Toggle between text and password
            placeholder={"Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10" // Add padding to accommodate the icon
          />
          {/* Show/Hide password button */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="relative -top-7 left-1 cursor-pointer z-10"
          >
            {showPassword ? <BsEyeSlash /> : <BsEye />}
          </button>
        </div>

        <div className="flex items-center justify-center">
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
         <p className="mx-3">Or</p>
          <p>Login  <a  className="text-primary-100" href="/login">Admin</a></p>           </div>
      </form>
    </div>
  );
};

export default HealthcareLogin;
