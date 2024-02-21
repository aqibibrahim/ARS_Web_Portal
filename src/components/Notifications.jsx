import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AmbulanceViewModal from "./AmbulanceViewModal";
import axios from "axios";
import IncidentVIewModal from "./IncidentVIewModal";
import { useAmbulanceContext } from "./AmbulanceContext";

export default function Notifications({ onCloseDropdown }) {
  const navigate = useNavigate();
  const [notificationsData, setNotificationsData] = useState([]);
  const [lastPage, setLastPage] = useState();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [page, setPage] = useState(1); // Current page number
  const [showData, setShowData] = useState([]);
  const {
    resetState,
    resetNotificationDropdown,
    notificationDropdown,
    setNotificationDropdown,
    viewModalOpen,
    setViewModalOpen,
    setNotificationDropdownData,
    notificationDropdownData,
  } = useAmbulanceContext();
  useEffect(() => {
    fetchNotifications();
    if (selectedNotification !== null) {
      setViewOpen(true); // Open the modal once selectedNotification is not null
    }
  }, [selectedNotification]);
  const AmbulanceIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-6-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 12H2v2h3v-2zm14 1h-3v2h3v-2zm-4-6V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v4H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4h4a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-4zM8 5h8v2H8V5zm8 10H8v-2h8v2zm0-4H8V9h8v2z"
        clipRule="evenodd"
      />
    </svg>
  );

  const fetchNotifications = async () => {
    console.log(page, "pageNo");
    var token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(
        `https://ars.disruptwave.com/api/notifications/get-all?page=${page}
        `,
        {
          headers,
        }
      );

      if (response.status === 200 || response.status === 201) {
        const data = await response?.data;
        setLastPage(data?.data?.last_page);
        console.log("Data", data);
        {
          page === 1
            ? setNotificationsData(() => [...data.data.data])
            : setNotificationsData((prevNotifications) => [
                ...prevNotifications,
                ...data.data.data,
              ]);
        }
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleViewClick = async (notification) => {
    {
      const ConvertedNotifications = JSON.parse(notification.payload);
      if (ConvertedNotifications?.type.includes("INCIDENT")) {
        console.log(ConvertedNotifications?.type, "type");
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        alert("We are waiting for incident data");
        try {
          setShowData(ConvertedNotifications?.payload);

          navigate("/incidents");
          //   <IncidentVIewModal
          //     viewOpen={viewOpen}
          //     setViewOpen={setViewOpen}
          //     showData={showData}
          //     setShowData={setShowData}
          //   />;
          await axios.patch(
            `https://ars.disruptwave.com/api/notifications/update/${notification.id}`,
            {},
            {
              headers,
            }
          );
        } catch (error) {
          console.error("Error updating notification:", error);
        }
      } else {
        var token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        try {
          setSelectedNotification(ConvertedNotifications?.payload);
          setNotificationDropdownData(ConvertedNotifications?.payload);
          setViewModalOpen(true);
          setViewOpen(true);
          setNotificationDropdown(null);
          navigate("/ambulances_files");
          await axios.patch(
            `https://ars.disruptwave.com/api/notifications/update/${notification.id}`,
            {},
            {
              headers,
            }
          );
        } catch (error) {
          console.error("Error updating notification:", error);
        }
      }
    }
    console.log(selectedNotification, "selected");
  };
  const loadMoreNotifications = () => {
    setPage(page + 1); // Increment page number
    fetchNotifications(); // Fetch next page of notifications
  };
  return (
    <div>
      {notificationsData.map((data) => (
        <div
          className={`${
            data?.is_read === 0 ? "bg-gray-300" : "bg-white"
          } w-full px-2 mb-4`}
          key={data.id}
        >
          <p className="text-base font-bold text-right">{data.message}</p>
          <div className="flex justify-end mt-2">
            {data.type.includes("AMBULANCE") ? (
              <>
                <button
                  className="flex flex-row text-primary-100 bg-white rounded-md border-2 border-primary-100 my-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
                  onClick={() => {
                    handleViewClick(data);
                  }}
                >
                  <AmbulanceIcon /> View
                </button>
              </>
            ) : (
              <button
                className="text-primary-100 bg-white rounded-md border-2 border-primary-100 my-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white"
                onClick={() => handleViewClick(data)}
              >
                View
              </button>
            )}
          </div>
        </div>
      ))}
      {notificationsData.length > 0 && lastPage !== page && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={loadMoreNotifications}
        >
          Load More
        </button>
      )}
      {notificationsData.length === 0 && (
        <p className="bg-white w-full p-4 mb-4 text-right">
          No Notifications Yet...
        </p>
      )}
      <AmbulanceViewModal
        viewModalOpen={viewModalOpen}
        setViewOpen={setViewOpen}
        selectedAmbulance={notificationDropdownData}
      />
    </div>
  );
}
