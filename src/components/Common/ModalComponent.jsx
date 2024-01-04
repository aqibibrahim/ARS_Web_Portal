import React, { useState } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../../helpers/helpers";
import { Toaster, toast } from "sonner";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";

const ModalComponent = (props) => {
  const { visible, handle } = props;
  const [state, setState] = useState({
    name: "",
    email: "",
    pin: "",
  });
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  const handleAddPhoneNumber = () => {
    if (newPhoneNumber.trim() !== "") {
      setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
      setNewPhoneNumber("");
    }
  };

  const handleRemovePhoneNumber = (index) => {
    const updatedPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhoneNumbers);
  };

  // const onCancelHandler = () => {
  //   handle(false);
  // };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };
  const createNewDriver = async () => {
    try {
      var token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const data = {
        first_name: state.name,
        email: state.email,
        pin: state.pin,
        phone_numbers: phoneNumbers,
      };

      const response = await axios.post(`${Vars.domain}/drivers`, data, {
        headers,
      });
      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        toast.success("Driver Created Successfuly");
        setState("");
        setPhoneNumbers[""];
        handle(false);
      }
      console.log("Role created successfully:", response.data);
    } catch (error) {
      debugger;
      console.error("Error creating role:", error);
      toast.error(error?.response?.data?.data?.pin);
    }
  };
  const handlePinChange = (event) => {
    const inputValue = event.target.value;
    const maxLength = 6;

    if (inputValue.length > maxLength) {
      event.target.value = inputValue.slice(0, maxLength);
    }
    setState({ ...state, [event.target.name]: event.target.value });
  };
  return (
    <>
      <Toaster position="bottom-right" richColors />

      {visible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full m-auto">
          <div className="  -left-[14.5rem] p-0 border w-2/4 shadow-lg rounded-md bg-white  h-auto mb-5 m-auto mt-10">
            <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
              <BsArrowRightCircle
                width={9}
                className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                onClick={() => {
                  setNewPhoneNumber("");
                  setPhoneNumbers([""]);
                  handle(false);
                }}
              />
              <h3 className="text-xl font-semibold">Create Driver</h3>
            </div>
            <div className="p-5">
              <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6  text-gray-900 text-right"
                    >
                      PIN
                    </label>
                    <div className="relative mt-2">
                      <input
                        onChange={handlePinChange}
                        name="pin"
                        type="number"
                        placeholder="Enter PIN"
                        className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="phone_numbers"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Phone Number
                    </label>

                    <div className="w-full  mb-6 ">
                      {/* <div className="flex w-full justify-center m-auto"> */}

                      <div className="flex w-full ">
                        <div
                          className={`relative mt-2 ${
                            newPhoneNumber ? "w-11/12" : "w-full"
                          }`}
                        >
                          <input
                            type="number"
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                            value={newPhoneNumber}
                            placeholder="Enter Phone Number"
                            className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                            {...(phoneNumbers
                              ? { required: false }
                              : { required: true })}
                          />
                          <div
                            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          {newPhoneNumber ? (
                            <button
                              type="button"
                              onClick={handleAddPhoneNumber}
                              className="flex bg-gray-300 p-1 ml-5 mt-2 text-2xl rounded-md hover:bg-gray-400"
                            >
                              +
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      {/* </div> */}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Name
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleChange}
                        value={state?.name}
                        placeholder="Enter Name"
                        className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      Email
                    </label>
                    <div className="relative mt-2">
                      <input
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter Email"
                        className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                        required
                      />
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {phoneNumbers.length > 0 ? (
                <div
                  className={`grid grid-cols-2 gap-2 ${
                    phoneNumbers.length > 0 ? "bg-gray-100" : ""
                  } p-4`}
                >
                  {phoneNumbers.map((phoneNumber, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-lg bg-white p-2 rounded-md"
                    >
                      <div className="flex text-sm">{phoneNumber}</div>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoneNumber(index)}
                        className="bg-red-300 p-2 text-2xl rounded-md hover:bg-red-400"
                      >
                        -
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}

              <div className="text-left mt-10">
                {loadingMessage ? (
                  <button
                    type="button"
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={createNewDriver}
                    className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalComponent;
