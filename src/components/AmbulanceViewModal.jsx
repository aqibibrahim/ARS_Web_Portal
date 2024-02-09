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
  const getStatusStyle = (status) => {
    let backgroundColor, textColor;

    switch (status) {
      case "Available":
        backgroundColor = "bg-green-400";
        textColor = "text-white";
        break;
      case "Dispatched":
        backgroundColor = "bg-blue-400";
        textColor = "text-white";
        break;
      case "Inactive":
        backgroundColor = "bg-red-400";
        textColor = "text-white";
        break;
      default:
        backgroundColor = "bg-yellow-400";
        textColor = "text-white";
        break;
    }

    return `inline-flex items-center rounded-full ${backgroundColor} px-2 py-1 text-base font-medium ${textColor}`;
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
      style={{ fontFamily: "Cairo" }}
    >
      <div className="">
        <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-5 overflow-hidden z-10">
          <BsArrowRightCircle
            width={9}
            className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
            onClick={() => setViewOpen(false)}
          />
          <h3 className="text-xl font-semibold text-center w-full">
            تفاصيل سيارة الإسعاف
          </h3>
        </div>
        <div>
          <div className="justify-between flex p-2 -mt-3 w-full">
            <div className="m-auto items-center justify-center text-xl w-1/2">
              <span className={` ${getStatusStyle(ambulanceData?.status)}`}>
                {ambulanceData?.status}
              </span>
            </div>
            <div className="text-right text-base w-1/2">
              <div className="flex justify-end">
                {ambulanceData?.model?.make?.name}
                <span className="font-semibold ml-1"> : ماركة </span>
              </div>
              <div className="flex justify-end">
                {ambulanceData?.model?.name}
                <span className="font-semibold  ml-1">: موديل</span>
              </div>
              <p>
                {ambulanceData?.plate_no}
                <span className="font-semibold  ml-1">: رقم لوحة</span>
              </p>
            </div>
          </div>
          <div className=" mt-2 mb-2 border border-gray-300 	" />
          <div className="px-2 -mt-2 text-base ">
            <p className="text-lg text-center font-semibold">تفاصيل السائق</p>
            {ambulanceData?.driver ? (
              <div>
                <div className="flex justify-end">
                  {ambulanceData?.driver?.first_name}
                  <span className="font-semibold  ml-1"> : اسم</span>
                </div>
                <div className="flex justify-end flex-wrap">
                  {/* <p className="text-lg text-right font-semibold">
                    Driver Phone No.
                  </p> */}
                  {ambulanceData?.driver?.phone_numbers.map((phone_numbers) => (
                    <span
                      key={phone_numbers.id}
                      className="text-base text-right"
                    >
                      <span className="flex bg-green-200 m-1 rounded-lg p-1">
                        {" "}
                        {phone_numbers.number}
                      </span>
                    </span>
                  ))}
                  <span className="font-semibold text-base  mt-2">
                    : رقم الهاتف
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-base text-center bg-gray-200">
                  لم يتم تعيين سائق حتى الآن
                </p>
              </div>
            )}

            {/* Add other details as needed */}
          </div>{" "}
          {ambulanceData?.equipments?.length > 0 ? (
            <>
              <div className=" mt-2 mb-2 border border-gray-300 	" />
              <div className="px-1 mt-3 mb-2 ">
                <p className="text-lg text-center font-semibold">
                  تفاصيل المعدات
                </p>
                <div className="flex justify-end mt-1 flex-wrap">
                  {ambulanceData?.equipments?.map((equipment, index) => (
                    <p
                      key={index} // Ensure each child in a list has a unique "key" prop
                      className="text-base inline-block font-semibold text-white bg-blue-400 px-2 m-1 rounded-xl"
                    >
                      {equipment.name}
                    </p>
                  ))}{" "}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
          <div className=" mt-2 mb-2 border border-gray-300 	" />
          <p className="text-lg text-center font-semibold mb-3">
            موقع سيارة الإسعاف
          </p>
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
