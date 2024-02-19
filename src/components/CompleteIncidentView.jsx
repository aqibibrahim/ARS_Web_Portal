import React from "react";
import { BsArrowRightCircle, BsEye, BsSearch } from "react-icons/bs";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

export default function CompleteIncidentView(props) {
  const {
    formatDateTime,
    completedIncidentDetails,
    setCompletedIncidentsView,
  } = props;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="mx-auto mt-10 p-0 border w-[1200px] shadow-lg rounded-md bg-white overflow-hidden h-auto mb-5">
        <div className="flex flex-row  items-center mb-1 bg-grayBg-300 w-full  p-5 overflow-hidden">
          <BsArrowRightCircle
            width={9}
            className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
            onClick={() => setCompletedIncidentsView(false)}
          />
          <div className="flex  justify-center w-full">
            <h3 className="text-2xl font-semibold text-center flex  ">
              تفاصيل الحادث
              {/* <span className="text-red-600 ml-2">
                  {completedIncidentDetails?.incident?.status}
                </span> */}
            </h3>
          </div>
        </div>
        <div className="flex w-full">
          <div className="p-5 text-right w-1/2 bg-gray-200 rounded-xl m-5">
            <p className="text-xl text-center font-bold">تفاصيل الحادث</p>
            {/* <p>
                  <span className="text-green-500">
                    {completedIncidentDetails?.incident?.status}
                  </span>                    <span className="font-semibold">:Incident Status </span>

                </p> */}
            <div className="flex justify-end text-base">
              <span>
                {completedIncidentDetails?.incident?.incident_type?.name}
              </span>{" "}
              <span className="text-base font-bold ml-1"> : نوع الحادث </span>
            </div>
            <div className="flex justify-end text-base">
              <span
                className={` ${
                  completedIncidentDetails?.incident?.emergency_type?.name ===
                  "Critical"
                    ? "text-red-500"
                    : completedIncidentDetails?.incident?.emergency_type
                        ?.name === "Moderate"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {completedIncidentDetails?.incident?.emergency_type?.name}
              </span>{" "}
              <span className="text-base font-bold ml-1">: نوع الطوارئ</span>
            </div>
            <div className="flex justify-end text-base">
              <span>{completedIncidentDetails?.incident?.gender?.name}</span>{" "}
              <span className="text-base font-bold ml-1">: جنس </span>
            </div>
            <div className="flex justify-end text-base">
              <span>
                {
                  completedIncidentDetails?.completedIncidentDetails
                    ?.number_of_persons
                }
              </span>{" "}
              <span className="font-semibold"> : رقم الشخص</span>
            </div>

            <div className="flex justify-end flex-row">
              <div
                className="text-base flex text-wrap  w-full justify-end  mr-1 "
                style={{ wordBreak: "break-word" }}
              >
                {completedIncidentDetails?.incident?.description}
              </div>
              <div className="font-bold flex text-base justify-center ">
                <span style={{ marginRight: "5px" }}>: </span>
                <span>وصف</span>
              </div>
            </div>
          </div>

          <div className="p-5 text-right w-1/2 bg-gray-200 rounded-xl m-5">
            <p className="text-xl text-center font-bold">تفاصيل المخبر</p>
            <p>
              {completedIncidentDetails?.incident?.informer?.name}{" "}
              <span className="font-semibold ml-1"> :اسم </span>
            </p>
            <p>
              {
                completedIncidentDetails?.incident.informer?.phone_numbers[0]
                  ?.number
              }{" "}
              <span className="font-semibold ml-1"> : رقم الهاتف</span>
            </p>
          </div>
        </div>
        <div className=" mt-2 mb-2 border border-gray-300 	" />
        <div className="p-5">
          <p className="text-xl mt-1 text-center font-semibold">
            تفاصيل سيارة الإسعاف
          </p>
          <div
            className="flex flex-row justify-between p-5 bg-gray-100  mt-4"
            key={completedIncidentDetails.ambulance.id}
          >
            {/* <p className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </p> */}
            <div className="flex justify-end text-base">
              <span className="mr-1">
                {" "}
                {completedIncidentDetails.ambulance?.plate_no}{" "}
              </span>
              <span className="font-semibold"> : رقم لوحة</span>
            </div>{" "}
            <div className="flex justify-end text-base">
              <span className="mr-1">
                {completedIncidentDetails.ambulance?.model?.name}{" "}
              </span>
              <span className="font-semibold"> : موديل</span>
            </div>{" "}
            <div className="flex justify-end text-base">
              {completedIncidentDetails.ambulance?.model?.make?.name}{" "}
              <span className="font-semibold ml-2"> : ماركة </span>
            </div>
          </div>
        </div>
        <div className=" mt-2 mb-2 border border-gray-300 	" />

        <div className="p-5">
          <p className="text-xl text-center font-semibold">تفاصيل السائق</p>
          <div
            className="flex flex-row justify-between p-5 bg-gray-100  mt-4"
            key={completedIncidentDetails?.driver.id}
          >
            {/* <p className="bg-blue-200 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </p> */}
            <p className="text-wrap flex items-center">
              <span className="mr-1 ">
                {" "}
                {/* Aligns phone numbers to the right */}
                {completedIncidentDetails.driver?.phone_numbers.map(
                  (phone, index) => (
                    <p key={index}>{phone.number}</p>
                  )
                )}
              </span>
              <span className="font-semibold ml-auto"> : رقم الهاتف</span>
            </p>{" "}
            <p>
              x {completedIncidentDetails.driver?.email}{" "}
              <span className="font-semibold"> : بريد إلكتروني</span>
            </p>
            <div className="flex justify-end text-base">
              <span className="mr-1">
                {completedIncidentDetails.driver?.first_name}
              </span>
              <span className="font-semibold"> : اسم </span>
            </div>
          </div>
        </div>
        <div className=" mt-2 mb-2 border border-gray-300 	" />

        <div className="p-5">
          <p className="text-xl text-center font-semibold">
            تفاصيل الرعاية الصحية
          </p>
          {/* {completedIncidentDetails?.ambulances?.length > 0 ? (
                  showData?.ambulances?.map((facility, index) => ( */}
          <div
            className="flex flex-row justify-between p-5 bg-gray-100  mt-4"
            key={completedIncidentDetails.facility?.id}
          >
            {/* <p className="bg-blue-200 p-2 rounded-full w-7 h-7 flex items-center justify-center">
                      {index + 1}
                    </p> */}

            <p className="text-wrap flex items-center">
              <span className="mr-1 ">
                {" "}
                {/* Aligns phone numbers to the right */}
                {completedIncidentDetails.facility?.phone_numbers.map(
                  (phone, index) => (
                    <p key={index}>{phone.number}</p>
                  )
                )}
              </span>
              <span className="font-semibold ml-auto"> : رقم الهاتف</span>
            </p>
            <p>
              <span className="text-base flex-wrap">
                {completedIncidentDetails?.facility?.address
                  ? completedIncidentDetails?.facility?.address
                  : "Not Available"}
              </span>{" "}
              <span className="font-semibold"> : عنوان </span>
            </p>

            <div className="flex justify-end text-base">
              <span className="text-base flex-wrap mr-1">
                {completedIncidentDetails?.facility?.name
                  ? completedIncidentDetails?.facility?.name
                  : "Not Assigned"}
              </span>{" "}
              <span className="font-semibold text-base"> : اسم</span>
            </div>
          </div>
          <div className=" mt-2 mb-2 border border-gray-300 	" />

          <div className="flex justify-center w-full m-auto text-xl font-semibold bg-gray-100">
            تفاصيل شخص مسؤول
          </div>

          <div className="flex flex-row justify-between p-5 bg-gray-100">
            {completedIncidentDetails?.facility?.focal_persons?.map((focal) => (
              <div
                key={focal.id}
                className="flex justify-between w-full items-center"
              >
                {" "}
                <div className="flex justify-end text-base">
                  <span className="text-base flex-wrap">
                    {focal.phone_numbers?.map((phone) => (
                      <span className="mr-1" key={phone.id}>
                        {phone.number}
                      </span>
                    ))}
                  </span>{" "}
                  <span className="font-semibold"> : رقم الهاتف</span>
                </div>
                <div className="flex justify-end text-base">
                  <span className="text-base flex-wrap mr-1">
                    {focal.email}
                  </span>{" "}
                  <span className="font-semibold"> : بريد إلكتروني </span>
                </div>
                <div className="flex justify-end text-base">
                  <span className="text-base flex-wrap">
                    {focal.first_name}
                  </span>{" "}
                  <span className="font-semibold"> : اسم </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className=" mt-2 mb-2 border border-gray-300 	" />

        <div className="p-5  ">
          <p className="text-xl text-center font-bold">تفاصيل أخرى</p>
          <div className="flex flex-row justify-between p-5 bg-gray-100  mt-4">
            <p>
              <span>
                {formatDateTime(completedIncidentDetails?.incident?.updated_at)}
              </span>{" "}
              <span className="font-semibold"> : تاريخ الانتهاء</span>
            </p>
            <p>
              <span>
                {formatDateTime(completedIncidentDetails?.incident?.created_at)}
              </span>{" "}
              <span className="font-semibold"> :تاريخ الإنشاء </span>
            </p>
            <p>
              {completedIncidentDetails?.incident?.created_by?.email}{" "}
              <span className="font-semibold"> : بريد إلكتروني</span>
            </p>
            <p>
              <span className="text-green-500">
                {completedIncidentDetails?.incident?.created_by?.first_name +
                  " " +
                  completedIncidentDetails?.incident?.created_by?.last_name}
              </span>{" "}
              <span className="font-semibold">: انشأ من قبل</span>
            </p>
          </div>
        </div>
        <div className=" mt-2 mb-2 border border-gray-300 	" />

        <div className="p-5  ">
          <p className="text-xl text-center font-bold">Incident Location</p>
          <div className="h-80 z-50 relative mt-4">
            <Map
              google={window.google}
              zoom={10}
              style={{ width: "100%", height: "100%" }}
              center={{
                lat: parseFloat(completedIncidentDetails?.incident?.latitude),
                lng: parseFloat(completedIncidentDetails?.incident?.longitude),
              }}
              initialCenter={{
                lat: parseFloat(completedIncidentDetails?.incident?.latitude),
                lng: parseFloat(completedIncidentDetails?.incident?.longitude),
              }}
            >
              <Marker
                position={{
                  lat: parseFloat(completedIncidentDetails?.incident?.latitude),
                  lng: parseFloat(
                    completedIncidentDetails?.incident?.longitude
                  ),
                }}
              />
            </Map>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
