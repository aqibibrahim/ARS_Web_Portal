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
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export default function IncidentVIewModal(props) {
  const { showData, setViewOpen, viewOpen, setShowData } = props;
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

    return `inline-flex items-center rounded-full ${backgroundColor} px-2 py-1 text-lg font-medium ${textColor}`;
  };
  return (
    <Modal
      open={viewOpen}
      onCancel={() => {
        setShowData;
        setViewOpen(false);
      }}
      footer={null}
      width={1200}
      closeIcon={null}
    >
      <div className="" style={{ fontFamily: "Cairo" }}>
        <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full p-5 overflow-hidden">
          <BsArrowRightCircle
            width={20} // Adjust the icon size as needed
            className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
            onClick={() => setViewOpen(false)}
          />
          <div className="flex  justify-center w-full">
            <h3 className="text-2xl font-semibold text-center flex  ">
              تفاصيل الحادث
            </h3>
          </div>
          {/* <h3 className="text-xl font-semibold text-red-500 ">
            {showData?.incident_type?.name}
            <span className="text-red-600 ml-2">
              {showData?.emergency_type?.name}
            </span>
          </h3> */}
        </div>
        <div className="flex w-full">
          <div className="p-5 text-right w-1/2 text-lg">
            <p className="text-xl text-center font-bold">تفاصيل الحادث</p>
            {/* <div className="flex gap-3">
            <p className="font-bold">Created By: </p>{" "}
            <span>
              {showData?.created_by?.first_name +
                " " +
                showData?.created_by?.last_name}
            </span>
            <p className="font-bold">Created at: </p>{" "}
            <span>{formattedDate}</span>
          </div> */}
            <div className="flex flex-col mx-auto   justify-around">
              <div className="flex justify-end text-base">
                {showData?.incident_type?.name}
                <span className="text-base font-bold ml-1"> : نوع الحادث</span>
              </div>{" "}
              <div className="flex justify-end text-base">
                {showData?.emergency_type?.name}
                <span className="text-base font-bold ml-1"> : نوع الطوارئ</span>
              </div>{" "}
              <div className="flex justify-end text-base">
                {showData?.gender?.name}
                <span className="text-base font-bold ml-1"> : جنس</span>
              </div>{" "}
              <div className="flex justify-end text-base">
                {showData?.number_of_persons}
                <span className="font-bold ml-1 text-base"> : رقم الشخص </span>
              </div>
              <div className="flex justify-end flex-row">
                <div
                  className="text-base flex text-wrap  w-full justify-end  mr-1 "
                  style={{ wordBreak: "break-word" }}
                >
                  {showData.description}
                </div>
                <div className="font-bold flex text-base justify-center ">
                  <span style={{ marginRight: "5px" }}>: </span>
                  <span>وصف</span>
                </div>
              </div>
            </div>
          </div>
          <div className=" border mt-2 border-gray-300 	" />

          <div className="p-5 text-right w-1/2 text-lg">
            <p className="text-xl text-center font-bold"> تفاصيل المتصل</p>
            <div className="flex justify-end text-base">
              <div> {showData?.informer?.name}</div>
              <div className="font-bold text-base ml-1"> : اسم </div>
            </div>
            <div className="flex justify-end text-base">
              {showData?.informer?.phone_numbers[0]?.number}
              <div className="font-semibold ml-1 text-base">
                {" "}
                : رقم الهاتف{" "}
              </div>{" "}
            </div>
          </div>
        </div>
        <div className=" border mt-2 border-gray-300 	" />
        <div className="p-5">
          <p className="text-xl mt-1 text-center font-semibold">
            تفاصيل سيارة الإسعاف
          </p>
          {showData?.ambulances?.length > 0 ? (
            showData?.ambulances?.map((ambulance, index) => (
              // <div
              //   className="flex flex-col bg-gray-100 mb-5 mt-2 p-4 rounded"
              //   key={ambulance.id}
              // >
              <div
                className="flex flex-row justify-between p-5 text-base bg-gray-100 mt-4"
                key={ambulance.id}
              >
                <p className={` ${getStatusStyle(ambulance.status)}`}>
                  {ambulance?.status}
                </p>
                <div className="flex justify-end">
                  <span className="mr-1"> {ambulance?.plate_no}</span>
                  <span className="font-semibold"> : رقم لوحة</span>
                </div>
                <div className="flex justify-end">
                  <span className="mr-1"> {ambulance?.model?.name}</span>
                  <span className="font-semibold"> : موديل</span>
                </div>
                <span className="flex items-center">
                  {/* Flex container */}
                  <div className="flex justify-end">
                    {ambulance?.model?.make?.name}
                    <span className="font-semibold ml-2"> : ماركة</span>
                  </div>
                  <span className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center ml-4">
                    {index + 1}
                  </span>
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-row text-center w-full justify-center p-5 text-lg bg-gray-100 mt-4">
              لم يتم تخصيص سيارة إسعاف
            </div>
          )}
        </div>

        {showData?.ambulances?.length > 0 ? (
          <>
            <div className=" border mt-2 border-gray-300 	" />
            <div className="p-5">
              <p className="text-xl mt-1 text-center font-semibold">
                تفاصيل السائق
              </p>
              {showData?.ambulances?.map((ambulance, index) => (
                // <div
                //   className="flex flex-col bg-gray-100 mb-5 mt-2 p-4 rounded"
                //   key={ambulance.id}
                // >
                <div
                  className="flex flex-row flex-wrap justify-between p-5 text-base bg-gray-100 mt-4"
                  key={ambulance?.driver?.id}
                >
                  <p className="text-wrap flex items-center">
                    <span className="ml-auto ">
                      {" "}
                      {/* Aligns phone numbers to the right */}
                      {ambulance?.driver?.phone_numbers?.map((phone, index) => (
                        <p className="mr-1" key={index}>
                          {phone.number}
                        </p>
                      ))}
                    </span>
                    <span className="font-semibold ml-auto"> : رقم الهاتف</span>
                  </p>
                  <p className="items-center flex">
                    <span className="items-center">
                      {ambulance?.driver?.email}
                    </span>
                    <span className="font-semibold ml-2"> : بريد إلكتروني</span>
                  </p>

                  <p className="flex items-center">
                    {" "}
                    {/* Flex container */}
                    <div className="flex justify-end">
                      {ambulance?.driver?.first_name}
                      <span className="font-semibold ml-2"> : اسم</span>
                    </div>
                    <span className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center ml-4">
                      {index + 1}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          ""
        )}
        {showData?.ambulances?.length > 0 ? (
          <>
            <div className=" border mt-2 border-gray-300 	" />
            <div className="p-5">
              <p className="text-xl mt-1 text-center font-semibold">
                تفاصيل الرعاية الصحية{" "}
              </p>
              {showData?.ambulances?.map((ambulance, index) => (
                <div
                  className="flex flex-row flex-wrap justify-between p-5 text-base bg-gray-100 mt-4"
                  key={ambulance?.id}
                >
                  {ambulance?.facility ? (
                    <>
                      {" "}
                      <div className="flex justify-between w-full">
                        <div className="flex justify-evenly">
                          <div className="flex justify-evenly">
                            <p className="text-wrap flex items-center">
                              <span className="ml-auto">
                                {/* Aligns phone numbers to the right */}
                                {ambulance?.facility?.phone_numbers?.map(
                                  (phone) => (
                                    <p className="mr-1" key={phone.id}>
                                      {phone.number}
                                    </p>
                                  )
                                )}
                              </span>
                              <span className="font-semibold ml-auto">
                                : رقم الهاتف
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className="items-center flex">
                          <span className="mr-1">
                            {" "}
                            {ambulance?.facility?.email}
                          </span>
                          <span className="font-semibold">: بريد إلكتروني</span>
                        </p>
                        <span className="flex items-center">
                          {/* Flex container */}
                          <span className="flex items-center">
                            {ambulance?.facility?.name}
                            <span className="font-semibold ml-2"> : اسم</span>
                          </span>
                          <span className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center ml-4">
                            {index + 1}
                          </span>
                        </span>
                      </div>
                      <div className="mt-2 mb-2 border flex w-full border-gray-300" />
                      <div className="flex justify-center w-full m-auto text-xl font-semibold ">
                        تفاصيل شخص مسؤول
                      </div>
                      <div className="flex flex-row justify-between p-5  w-full">
                        {ambulance?.facility?.focal_persons?.map((focal) => (
                          <div
                            key={focal.id}
                            className="flex justify-between w-full items-center"
                          >
                            <p>
                              <span className="text-base flex-wrap">
                                {focal.email}
                              </span>{" "}
                              <span className="font-semibold">
                                : بريد إلكتروني{" "}
                              </span>
                            </p>
                            <p>
                              <span className="text-base flex-wrap">
                                {focal.phone_numbers?.map((phone) => (
                                  <span key={phone.id}>{phone.number}</span>
                                ))}
                              </span>{" "}
                              <span className="font-semibold">
                                : رقم الهاتف.{" "}
                              </span>
                            </p>
                            <p>
                              <span className="text-base flex-wrap">
                                {focal.first_name}
                              </span>{" "}
                              <span className="font-semibold"> : اسم </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="font-semibold w-full items-center justify-center flex">
                      لم يتم تعيين المنشأة
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          ""
        )}

        <div className=" mt-2 mb-2 border bg-gray-300  " />

        <div className="p-5  ">
          <p className="text-xl text-center font-bold">تفاصيل أخرى </p>
          <div className="flex flex-row justify-between p-5 text-base bg-gray-100  mt-4">
            <div className="flex justify-end">
              <span className="mr-1">
                {formatDateTime(showData?.created_by?.updated_at)}
              </span>{" "}
              <span className="font-semibold"> : تاريخ الانتهاء</span>
            </div>
            <div className="flex justify-end">
              <span className="mr-1">
                {formatDateTime(showData?.created_by?.created_at)}
              </span>{" "}
              <span className="font-semibold"> : تاريخ الإنشاء</span>
            </div>
            <div className="flex justify-end ">
              <span className="mr-1"> {showData?.created_by?.email} </span>
              <span className="font-semibold"> : بريد إلكتروني</span>
            </div>
            <div className="flex justify-end">
              <span className="text-green-500 mr-1">
                {showData?.created_by?.first_name +
                  " " +
                  showData?.created_by?.last_name}
              </span>{" "}
              <span className="font-semibold"> : انشأ من قبل</span>
            </div>
          </div>
        </div>
        <div className=" border mt-2 border-gray-300 	" />

        <p className="text-xl text-center font-bold mr-4 my-2 mb-4">
          موقع الحادث
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
