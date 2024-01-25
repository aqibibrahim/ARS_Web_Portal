import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import { Map, Marker } from "google-maps-react"; // Assuming you're using google-maps-react for the Map component
import axios from "axios";

const AmbulanceViewModal = ({ viewOpen, selectedAmbulance, setViewOpen }) => {
  var token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const [ambulanceData, setAmbulanceData] = useState();

  const fetchAmbulanceData = async () => {
    try {
      await axios
        .get(`${window.$BackEndUrl}/ambulances/${selectedAmbulance?.id}`, {
          headers: headers,
          params: {},
        })
        .then((response) => {
          setAmbulanceData(response?.data?.data);
          //   setIsLoading(false);
          console.log(response?.data?.data, "rgjsrd");
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAmbulanceData();
  }, [selectedAmbulance]);
  return (
    <Modal
      open={viewOpen}
      onCancel={() => {
        setViewOpen(false);
        setAmbulanceData();
      }}
      footer={null}
      closeIcon={null}
      width={650} // Adjust the width as needed
    >
      <div className="">
        <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-5 overflow-hidden z-10">
          <BsArrowRightCircle
            width={9}
            className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
            onClick={() => setViewOpen(false)}
          />
          <h3 className="text-xl font-semibold">
            Ambulance{" "}
            <span className="text-lime-600">{ambulanceData?.status}</span>
          </h3>
        </div>
        <div>
          <div className=" justify-between p-5 -mt-3">
            <p className="text-lg text-right font-semibold">
              Ambulance Details
            </p>
            <div className="text-right text-base">
              <p>
                {" "}
                <span className="font-semibold">Make:</span>{" "}
                {ambulanceData?.make}
              </p>
              <p>
                <span className="font-semibold">Model:</span>{" "}
                {ambulanceData?.model}
              </p>
              <p>
                <span className="font-semibold">Plate#:</span>{" "}
                {ambulanceData?.plate_no}
              </p>
            </div>
          </div>
          <div className="px-5 -mt-2">
            <p className="text-lg text-right font-semibold">Driver Details</p>
            {ambulanceData?.driver ? (
              <div>
                <p className="text-base text-right">
                  {ambulanceData?.driver?.first_name}
                </p>
                <div className="mt-1">
                  {/* <p className="text-lg text-right font-semibold">
                    Driver Phone No.
                  </p> */}
                  {ambulanceData?.driver?.phone_numbers.map((phone_numbers) => (
                    <p key={phone_numbers.id} className="text-base text-right">
                      {phone_numbers.number}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-base text-right">No Driver Assigned Yet</p>
              </div>
            )}

            {/* Add other details as needed */}
          </div>
          <div className="px-5 mt-3 mb-2">
            <p className="text-lg text-right font-semibold">
              Equipment Details
            </p>
            {ambulanceData?.equipments?.map((equipment) => (
              <p key={equipment.id} className="text-base text-right">
                {equipment.name}
              </p>
            ))}
          </div>
          <div className="h-80 z-50 relative">
            <Map
              google={window.google}
              zoom={12}
              style={{ width: "100%", height: "100%" }}
              center={{
                lat: parseFloat(ambulanceData?.gps_latitude),
                lng: parseFloat(ambulanceData?.gps_longitude),
              }}
            >
              <Marker
                position={{
                  lat: parseFloat(ambulanceData?.gps_latitude),
                  lng: parseFloat(ambulanceData?.gps_longitude),
                }}
              />
            </Map>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AmbulanceViewModal;
