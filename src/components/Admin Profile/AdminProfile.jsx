import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { Listbox } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckIcon,
  PaperClipIcon,
} from "@heroicons/react/20/solid";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import Select from "react-tailwindcss-select";
import { Vars } from "../../helpers/helpers";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const Tab = ({ selected, title, onClick }) => {
  return (
    <button
      className={`px-4 py-2 transition-colors duration-150 ${
        selected ? "bg-white" : "bg-transparent text-gray-700"
      } focus:outline-none`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const AdminProfile = ({}) => {
  var token = localStorage.getItem("token");
  var user_id = localStorage.getItem("user_id");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [adminProfile, setAdminProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [submitDone, setSubmitDone] = useState(false);
  useEffect(() => {
    const fetchuserData = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/users/${user_id}`, {
            headers: headers,
          })
          .then((response) => {
            setAdminProfile(response.data?.data);
            setIsLoading(false);
            console.log("admin", response?.data?.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    fetchuserData();
  }, [submitDone]);

  return (
    <div
      className={`w-[50rem] mx-auto mx-w-7xl py-5 bg-grayBg-100 transition-all duration-300 z-[10] h-screen `}
    >
      <Toaster position="bottom-right" richColors />
      <div className="bg-lightGray-100 w-full h-auto rounded-lg p-2">
        <div className=" px-4">
          <div className="px-4 flex justify-between  items-start sm:px-0 text-end">
            <div className="pt-1">
              <Link
                to="/change-admin-password"
                className="text-primary-100  bg-white text-sm rounded-md border-2 border-primary-100 py-1 px-2 transition-all duration-300 hover:bg-primary-100 hover:text-white"
              >
                Change Password
              </Link>
            </div>
            <div>
              <h3 className="text-base font-semibold leading-7 text-gray-900">
                My Profile
              </h3>
              <p className="mt-1  text-sm text-end leading-6 text-gray-500">
                Personal details
              </p>
            </div>
          </div>
          <div className="mt-6">
            <dl className="grid grid-cols-1  sm:grid-cols-2">
              <div className="border-t border-gray-100 px-3 py-3 text-end sm:col-span-1 sm:px-0">
                <dt className="text-sm  font-medium leading-6 text-gray-900">
                  Email
                </dt>
                <dd className="mt-0.5 text-sm leading-6 text-gray-700 sm:mt-.5">
                  {adminProfile?.email}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-3 text-end py-3 sm:col-span-1 sm:px-0 ">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Name
                </dt>
                <dd className="mt-0.5 text-sm leading-6 text-gray-700 sm:mt-0.5">
                  {adminProfile?.first_name + " " + adminProfile?.last_name}
                </dd>
              </div>
              <div className="border-t border-gray-100 px-3 text-end py-3 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6 sr-only text-gray-900">
                  Password
                </dt>
                <dd className="mt-0.5 text-sm leading-6 sr-only text-gray-700 sm:mt-0.5">
                  $120,000
                </dd>
              </div>
              <div className="border-t border-gray-100 px-3 text-end py-3 sm:col-span-1 sm:px-0">
                <dt className="text-sm font-medium leading-6  text-gray-900">
                  Designation
                </dt>
                <dd className="mt-0.5 text-sm leading-6 text-gray-700 sm:mt-0.5">
                  {adminProfile?.designation}
                </dd>
              </div>
              {/* <div className="border-t border-gray-100 px-3 text-end py-3 sm:col-span-2 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">About</dt>
            <dd className="mt-0.5 text-sm leading-6 text-gray-700 sm:mt-0.5">
              Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
              qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
              pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
            </dd>
          </div> */}
              {/* <div className="border-t border-gray-100 px-3 py-3 sm:col-span-2 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
            <dd className="mt-2 text-sm text-gray-900">
              <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">resume_back_end_developer.pdf</span>
                      <span className="flex-shrink-0 text-gray-400">2.4mb</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Download
                    </a>
                  </div>
                </li>
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                  <div className="flex w-0 flex-1 items-center">
                    <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                    <div className="ml-4 flex min-w-0 flex-1 gap-2">
                      <span className="truncate font-medium">coverletter_back_end_developer.pdf</span>
                      <span className="flex-shrink-0 text-gray-400">4.5mb</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Download
                    </a>
                  </div>
                </li>
              </ul>
            </dd>
          </div> */}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
