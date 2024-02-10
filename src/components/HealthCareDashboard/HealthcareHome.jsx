import React, { useEffect, useState } from "react";
import CheckboxItem from "../CheckboxItem";
import { Toaster, toast } from "sonner";
import axios from "axios";

const Tab = ({ selected, title, onClick }) => {
  return (
    <button
      className={`px-4 py-2 transition-colors duration-150  ${selected ? "bg-white" : "bg-transparent text-gray-700"
        } focus:outline-none`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default function Home() {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [activeTab, setActiveTab] = useState("active");
  const [checkedItems, setCheckedItems] = useState({});
  const [incident, setIncident] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitDone, setSubmitDone] = useState(false);
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        await axios
          .get(`https://ars.disruptwave.com/api/incidents`, {
            headers: headers,
          })
          .then((response) => {
            setIncident(response.data.data);
            setLoading(false);
            console.log(response?.data?.data);
          });
      } catch (e) {
        toast.error("An error occurred while fetching incidents");
        console.log(e);
      }
    };
    fetchIncident();
  }, [submitDone]);

  return (
    <div
      className={`w-full bg-grayBg-100 transition-all duration-300 z-[10] rounded-lg overflow-y-scroll no-scrollbar p-2 pr-[200px] h-screen ml-20`}
    >
      {" "}
      <Toaster position="bottom-right" richColors />
      <div className="bg-lightGray-100 w-full max-h-screen rounded-lg p-2">
        <div className="p-4 text-right">
          <h1 className="text-2xl font-semibold">قائمة الحوادث </h1>
        </div>
        <div className="flex flex-row items-center p-4 space-x-4">
          <div className="flex flex-row space-x-2">
            <Tab
              selected={activeTab === "active"}
              title="Active Incidents"
              onClick={() => setActiveTab("active")}
            />
            <Tab
              selected={activeTab === "closed"}
              title="Closed Incidents"
              onClick={() => setActiveTab("closed")}
            />
          </div>
          {/* Search Bar */}
          <div className="flex flex-1 ml-4 items-center bg-gray-200 rounded-lg px-3 py-1">
            <span className="text-gray-500">🔍</span>
            <input
              className="bg-transparent outline-none border-0 w-full text-right"
              type="text"
              placeholder="Search incidents..."
            // Implement onChange handler to update the search query state
            // onChange={handleSearchQueryChange}
            />
          </div>
        </div>
        <div className="bg-white overflow-hidden mx-4">
          {/* List of Incidents */}
          <div className="rtl">
            {loading ? (
              <p className="text-center text-xl text-primary-100">Loading...</p>
            ) : incident.length == 0 ? (
              <p className="text-center text-xl text-primary-100">
                No data available
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-300 text-right">
                <thead>
                  <tr>
                    <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="py-3 pl-4 pr-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Incident Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Number of persons
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      ID
                    </th>{" "}
                    <th
                      scope="col"
                      className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                      Informer Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {incident?.data?.map((item) => (
                    <tr className="hover:bg-gray-100">
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a
                          href="#"
                          className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                        >
                          Edit
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-md"></td>
                      <td className="whitespace-nowrap px-3 py-4 text-md">
                        {item.informer_address}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-md">
                        {item.type}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-md">
                        {item.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-md">
                        {item.incident_type_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-md">
                        {item.informer_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Implement the list based on the activeTab and search query */}
        </div>
      </div>
    </div>
  );
}
