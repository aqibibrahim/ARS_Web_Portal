import React from "react";
import { Modal } from "antd";
import {
  BsArrowRightCircle,
  BsEye,
  BsSearch,
  BsPerson,
  BsPeople,
} from "react-icons/bs";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

export default function IncidentVIewModal(props) {
  const { showData, setViewOpen, viewOpen } = props;
  console.log(showData, "view");
  const getEmergencyTypeColor = (emergencyType) => {
    switch (emergencyType) {
      case "Critical":
        return "red-500";
      case "Moderate":
        return "orange-500";
      case "Mild":
        return "green-500";
      default:
        return "black";
    }
  };
  const formattedDate = showData?.created_at
    ? new Date(showData.created_at).toLocaleString()
    : "";

  return (
    <Modal
      open={viewOpen}
      onCancel={() => setViewOpen(false)}
      footer={null}
      width={850} // Adjust the width as needed
      closeIcon={null}
    >
      <div>
        <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-5 overflow-hidden">
          <BsArrowRightCircle
            width={20} // Adjust the icon size as needed
            className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
            onClick={() => setViewOpen(false)}
          />
          <h3 className="text-xl font-semibold ">Incident Details</h3>
          {/* <h3 className="text-xl font-semibold text-red-500 ">
            {showData?.incident_type?.name}
            <span className="text-red-600 ml-2">
              {showData?.emergency_type?.name}
            </span>
          </h3> */}
        </div>
        <div className="p-5 text-right -mb-5">
          <p className="text-xl text-right font-bold">Informer Details</p>
          <p>
            {" "}
            <span className="font-semibold">Name: </span>{" "}
            {showData?.informer?.name}
          </p>
          <p>
            {" "}
            <span className="font-semibold">Phone Number: </span>{" "}
            {showData?.informer?.phone_numbers[0]?.number}
          </p>
        </div>{" "}
        <div className="p-5 text-right">
          <p className="text-xl text-right font-bold">Incident Details</p>
          <div className="flex gap-3">
            <p className="font-bold">Created By: </p>{" "}
            <span>
              {showData?.created_by?.first_name +
                " " +
                showData?.created_by?.last_name}
            </span>
            <p className="font-bold">Created at: </p>{" "}
            <span>{formattedDate}</span>
          </div>
          <div className="flex mx-auto gap-10 mt-3 justify-around">
            <p className="bg-blue-300 text-white p-2 border rounded-full">
              {showData?.incident_type?.name}
            </p>{" "}
            <p
              className={`bg-${getEmergencyTypeColor(
                showData?.emergency_type?.name
              )} text-white p-2 border rounded-full`}
            >
              {showData?.emergency_type?.name}
            </p>
            <p className="mt-0.5">
              {showData?.gender?.name === "Male" ? (
                <BsPerson className="text-blue-500" />
              ) : (
                <BsPeople className="text-pink-500" />
              )}
              {showData?.gender?.name}
            </p>
            <p className="flex flex-col">
              <span className="font-semibold">No. of Person: </span>
              {showData?.number_of_persons}
            </p>
            <p className="flex flex-col">
              <span className="font-semibold">Description: </span>
              {showData?.description}
            </p>
          </div>
        </div>
        <div>
          <div className="px-5">
            <p className="text-lg text-right font-semibold">
              Ambulance Details
            </p>

            {showData?.ambulances?.length > 0 ? (
              showData?.ambulances?.map((ambulance, index) => (
                <div
                  className="flex flex-col bg-gray-100 mb-5 mt-2 p-4 rounded"
                  key={ambulance.id}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-wrap gap-2">
                      {/* Other ambulance details */}
                      <p>{ambulance?.model?.make?.name}</p>
                      <p>{ambulance?.model?.name}</p>
                      <p>{ambulance?.plate_no}</p>
                    </div>
                    <p>
                      <span
                        className={`font-semibold p-2 rounded-full ${ambulance?.status === "Dispatched"
                            ? "bg-blue-400 text-white"
                            : ambulance?.status === "Enroute"
                              ? "bg-orange-400 text-white"
                              : ""
                          }`}
                      >
                        {ambulance?.status}
                      </span>{" "}
                    </p>
                  </div>

                  <div className="px-5">
                    <p className="text-lg text-right font-semibold">
                      Facility Details
                    </p>

                    <div
                      className="flex flex-row justify-between p-4 bg-gray-100 mb-5 mt-2"
                      key={ambulance?.facility?.id}
                    >
                      <div className="flex justify-between gap-10  ">
                        <p className="bg-blue-200 p-2 rounded-full w-7 h-7 flex items-center justify-center">
                          {index + 1}
                        </p>
                        <p>
                          {" "}
                          <span className="font-semibold">Name: </span>{" "}
                          {ambulance?.facility?.name}
                        </p>
                        <p>
                          <span className="font-semibold">Status:</span>{" "}
                          {ambulance?.facility?.status}
                        </p>
                        <p>
                          <span className="font-semibold">Address: </span>{" "}
                          {ambulance?.facility?.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                // </div>
              ))
            ) : (
              <p className="text-right">No Data Found</p>
            )}
          </div>

          {/* <div className="px-5">
            <p className="text-lg text-right font-semibold">Facility Details</p>
            {showData?.ambulances?.facilitiy?.length > 0 ? (
              showData?.ambulances?.facilitiy?.map((facility, index) => (
                <div
                  className="flex flex-row justify-between p-4 bg-gray-100 mb-5 mt-2"
                  key={facility?.id}
                >
                  <div className="flex justify-between gap-10  ">
                    <p className="bg-blue-200 p-2 rounded-full w-7 h-7 flex items-center justify-center">
                      {index + 1}
                    </p>
                    <p>
                      {" "}
                      <span className="font-semibold">Name: </span>{" "}
                      {facility?.facility?.name}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {facility?.facility?.status}
                    </p>
                    <p>
                      <span className="font-semibold">Address: </span>{" "}
                      {facility?.facility?.address}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-right">No Facility Assigned</p>
            )}
          </div> */}
        </div>{" "}
        <p className="text-lg text-right font-semibold mr-4 my-2">
          Incident Location
        </p>
        <div className="h-80 z-50 relative">
          <Map
            google={window.google}
            zoom={10}
            style={{ width: "100%", height: "100%" }}
            center={{
              lat: parseFloat(showData?.latitude),
              lng: parseFloat(showData?.longitude),
            }}
            initialCenter={{
              lat: parseFloat(showData?.latitude),
              lng: parseFloat(showData?.longitude),
            }}
          >
            <Marker
              position={{
                lat: parseFloat(showData?.latitude),
                lng: parseFloat(showData?.longitude),
              }}
            />
          </Map>
        </div>
      </div>
    </Modal>
  );
}
