import React from "react";
import { Modal } from "antd";
import { BsArrowRightCircle, BsEye, BsSearch } from "react-icons/bs";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

export default function IncidentVIewModal(props) {
  const { showData, setViewOpen, viewOpen } = props;
  return (
    <Modal
      open={viewOpen}
      onCancel={() => setViewOpen(false)}
      footer={null}
      width={650} // Adjust the width as needed
      closeIcon={null}
    >
      <div>
        <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-5 overflow-hidden">
          <BsArrowRightCircle
            width={20} // Adjust the icon size as needed
            className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
            onClick={() => setViewOpen(false)}
          />
          <h3 className="text-xl font-semibold text-red-500 ">
            {showData?.incident_type?.name}
            <span className="text-red-600 ml-2">
              {showData?.emergency_type?.name}
            </span>
          </h3>
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
          <p>
            {" "}
            <span className="font-semibold">Incident Type: </span>{" "}
            {showData?.incident_type?.name}
            {/* {showData?.description +
              showData?.emergency_type?.name +
              showData?.gender?.name +
              showData?.incident_type?.name +
              showData?.number_of_persons} */}
          </p>{" "}
          <p>
            {" "}
            <span className="font-semibold">Emergency Type: </span>{" "}
            {showData?.emergency_type?.name}
          </p>
          <p>
            {" "}
            <span className="font-semibold">Gender: </span>{" "}
            {showData?.gender?.name}
          </p>
          <p>
            {" "}
            <span className="font-semibold">No. of Person: </span>{" "}
            {showData?.number_of_persons}
          </p>{" "}
          <p>
            {" "}
            <span className="font-semibold">Description: </span>{" "}
            {showData?.description}
          </p>
        </div>
        <div>
          <div className="px-5">
            <p className="text-lg text-right font-semibold">
              Ambulance Details
            </p>
            {showData?.ambulances?.length > 0 ? (
              showData?.ambulances?.map((ambulance, index) => (
                <div
                  className="flex flex-row justify-between p-5 bg-gray-100 mb-5 mt-2"
                  key={ambulance.id}
                >
                  <div className="flex flex-col">
                    <div className="flex justify-between gap-12 text-sm ">
                      <p className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </p>
                      <p>
                        {" "}
                        <span className="font-semibold">Make: </span>{" "}
                        {ambulance?.model?.make?.name}
                      </p>
                      <p>
                        <span className="font-semibold">Model:</span>{" "}
                        {ambulance?.model?.name}
                      </p>
                      <p>
                        <span className="font-semibold">Plate#:</span>{" "}
                        {ambulance?.plate_no}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span>{" "}
                        {ambulance?.status}
                      </p>
                    </div>
                    <p className="text-md m-5 text-right font-semibold">
                      Equipments Details
                    </p>
                    {ambulance.equipments.map((equipmentDetails, index) => (
                      <div
                        className="flex flex-row justify-between p-5 px-10  w-full  bg-gray-200 mb-5 mt-2"
                        key={equipmentDetails?.id}
                      >
                        <div className="flex justify-between gap-16 w-full   ">
                          <p className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                            {index + 1}
                          </p>
                          <p>
                            {" "}
                            <span className="font-semibold">Name: </span>
                            {equipmentDetails?.name}
                          </p>
                          <p>
                            <span className="font-semibold">Status:</span>{" "}
                            {equipmentDetails?.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-right">No Data Found</p>
            )}
          </div>

          <div className="px-5">
            <p className="text-lg text-right font-semibold">Facility Details</p>
            {showData?.ambulances?.length > 0 ? (
              showData?.ambulances?.map((facility, index) => (
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
              <p className="text-right">No Data Found</p>
            )}
          </div>
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
