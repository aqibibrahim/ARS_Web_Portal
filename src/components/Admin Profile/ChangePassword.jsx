import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { Vars } from "../../helpers/helpers";
import { useFormik } from "formik";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { EyeSlashIcon,EyeIcon } from "@heroicons/react/24/outline";

const ChangePassword = () => {
  var token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ChangePassword = useFormik({
    initialValues: {
        oldPassword: "",
        newPassword: "",
    },
    onSubmit: (values) => {
      const JSON = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };
      const Changepassword = async () => {
        setLoading(true)
        console.log(JSON);
        try {
          await axios
            .post(`${Vars.domain}/auth/change-password`, JSON, config)
            .then((res) => {
              console.log(res);
              setLoading(false)
              toast.success("Updated Successfuly");
              ChangePassword.resetForm();
        
            });
        } catch (e) {
          toast.error("Try Again");
          setLoading(false)
          console.log(e);
        }
      };

      Changepassword();
    },

    enableReinitialize: true,
  });


  const [showOldPassword, setShowOldPassword] = useState(false);
  const [shownewPassword, setShownewPassword] = useState(false);

  const handleToggleOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleTogglenewPassword = () => {
    setShownewPassword(!shownewPassword);
  };
  const goBack = () => {
    window.history.back();
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Toaster richColors />
      <div className="flex justify-between flex-col py-4">
   
          <span
            onClick={() => goBack()}
            className="hover:cursor-pointer w-16 flex justify-start items-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1 flex justify-center items-center  text-gray-500 cursor-pointer" />{" "}
            Back
          </span>
    

        <div>
          <h1 className="text-lg  text-gray-800">Password Change</h1>
        </div>
      </div>
      <form
        onSubmit={ChangePassword.handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96"
      >
        <div className="mb-4">
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium leading-6 text-gray-900 text-right"
          >
          Old Password
          </label>
          <div className="relative mt-2 flex items-center">
      <button
        type="button"
        onClick={handleToggleOldPassword}
        className="peer  px-2 border-0 bg-offWhiteCustom-100 py-2 sm:text-sm sm:leading-6"
      >
        {showOldPassword ?  <EyeIcon className="h-5 w-5  flex justify-center items-center  text-gray-500 cursor-pointer" /> : <EyeSlashIcon className="h-5 w-5  flex justify-center items-center  text-gray-500 cursor-pointer" />}
      </button>
      <div className="flex-1">
        <input
          id="oldPassword"
          name="oldPassword"
          type={showOldPassword ? 'text' : 'password'}
          placeholder="Enter Old Password"
          onChange={ChangePassword.handleChange}
          value={ChangePassword.values.oldPassword}
          className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
          required
        />
        <div
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
          aria-hidden="true"
        />
      </div>
    </div>
</div>
        <div className="mb-6">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium leading-6 text-gray-900 text-right"
          >
            New Password
          </label>
          <div className="relative mt-2 flex items-center">
      <button
        type="button"
        onClick={handleTogglenewPassword}
        className="peer  px-2 border-0 bg-offWhiteCustom-100 py-2 sm:text-sm sm:leading-6"
      >
        {shownewPassword ?  <EyeIcon className="h-5 w-5  flex justify-center items-center  text-gray-500 cursor-pointer" /> : <EyeSlashIcon className="h-5 w-5  flex justify-center items-center  text-gray-500 cursor-pointer" />}
      </button>
      <div className="flex-1">
        <input
          id="newPassword"
          name="newPassword"
          type={shownewPassword ? 'text' : 'password'}
          placeholder="Enter New Password"
          onChange={ChangePassword.handleChange}
          value={ChangePassword.values.newPassword}
          className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
          required
        />
        <div
          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
          aria-hidden="true"
        />
      </div>
    </div>
        </div>
        <div className="flex items-center justify-between">
          {loading ? (
            <div
              className="text-primary-100 bg-white rounded-md border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
              type="button"
            >
              Logging in...
            </div>
          ) : (
            <button
              className="text-primary-100 bg-white rounded-md border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
              type="submit"
            >
              Update
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
