import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { Vars } from "../../helpers/helpers";
import { Toaster, toast } from "sonner";
import { BsArrowRightCircle, BsSearch } from "react-icons/bs";
import InputMask from "react-input-mask";

const ModalComponent = (props) => {
  const { visible, handle, editData, updateDriver, editVisible, editBit } =
    props;
  const [state, setState] = useState({
    name: "",
    email: "",
    pin: "",
  });
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  // const [validationErrors, setValidationErrors] = useState({
  //   name: "",
  //   email: "",
  //   pin: "",
  //   phoneNumbers: "",
  // });
  // const resetValidationErrors = () => {
  //   setValidationErrors({
  //     name: "",
  //     email: "",
  //     pin: "",
  //     phoneNumbers: "",
  //   });
  // };
  // const validateForm = () => {
  //   const errors = {};
  //   let isValid = true;

  //   // Validate name
  //   if (!state?.name?.trim()) {
  //     errors.name = "Name is required";
  //     isValid = false;
  //   }

  //   // Validate email
  //   if (!state?.email?.trim()) {
  //     errors.email = "Email is required";
  //     isValid = false;
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
  //     errors.email = "Invalid email format";
  //     isValid = false;
  //   }

  //   // Validate PIN
  //   if (!editBit) {
  //     // Perform validation only if editbit is false
  //     if (!state?.pin?.trim()) {
  //       errors.pin = "PIN is required";
  //       isValid = false;
  //     } else if (state.pin.length !== 6 || !/^\d+$/.test(state.pin)) {
  //       errors.pin = "PIN must be a 6-digit number";
  //       isValid = false;
  //     }
  //   }

  //   // Validate phone numbers
  //   if (phoneNumbers?.length === 0) {
  //     errors.phoneNumbers = "At least one phone number is required";
  //     isValid = false;
  //   }

  //   setValidationErrors(errors);

  //   return isValid;
  // };

  const handleAddPhoneNumber = () => {
    if (newPhoneNumber.trim() !== "") {
      setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
      setNewPhoneNumber("");
    }
  };
  useEffect(() => {
    setState(() => ({
      name: editData?.name,
      email: editData?.email,
      pin: editData?.pin,
      id: editData?.id,
    }));
    setPhoneNumbers(editData?.phoneNumbers || []);
  }, [editData]);

  const handleRemovePhoneNumber = (index) => {
    const updatedPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    setPhoneNumbers(updatedPhoneNumbers);
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const createNewDriver = async () => {
    try {
      // if (validateForm()) {
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
        toast.success("تم تسجيل السائق بنجاح", {
          className: "toast-align-right",
        });
        setState({
          name: "",
          email: "",
          pin: "",
        });
        setPhoneNumbers([]);
        setNewPhoneNumber("");
        handle(false);
      }
      console.log("Role created successfully:", response.data);
      // }
    } catch (error) {
      console.error("Error creating role:", error);
      toastErrorMessages(error.response.data.data);
    }
  };
  const UpdateDriver = async () => {
    try {
      // if (validateForm()) {
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

      const response = await axios.patch(
        `${Vars.domain}/drivers/${state?.id}`,
        data,
        {
          headers,
        }
      );

      console.log(response, "res");
      if (response.status === 200 || response.status === 201) {
        toast.success("تم تحديث برنامج التشغيل بنجاح", {
          className: "toast-align-right",
        });
        setState({
          name: "",
          email: "",
          pin: "",
        });
        setPhoneNumbers([]);
        setNewPhoneNumber("");
        handle(false);
        // }
      }
    } catch (error) {
      console.error("Error updating driver:", error);
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
  const toastErrorMessages = (errors) => {
    Object.keys(errors).forEach((field) => {
      const messages = errors[field];
      messages.forEach((message) => {
        toast.error(`${field}: ${message}`);
      });
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform any additional validation if needed

    // Call the appropriate function based on editBit value
    if (!editBit) {
      createNewDriver();
    } else {
      UpdateDriver();
    }
  };
  return (
    <>
      <Toaster position="bottom-right" richColors />
      {editVisible ||
        (visible && (
          <form
            onSubmit={handleSubmit}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full m-auto"
          >
            <div className="  -left-[14.5rem] p-0 border w-2/4 shadow-lg rounded-md bg-white  h-auto mb-5 m-auto mt-10">
              <div className="flex flex-row justify-between items-center mb-4 bg-grayBg-300 w-full  p-5 overflow-hidden">
                <BsArrowRightCircle
                  width={9}
                  className="text-black cursor-pointer hover:scale-150 transition-all duration-300"
                  onClick={() => {
                    setNewPhoneNumber("");
                    setPhoneNumbers([]);
                    handle(false);
                    setState("");
                  }}
                />
                <h3 className="text-xl font-semibold">
                  {editData && editData.name
                    ? " تحديث السائق "
                    : "تسجيل السائق"}
                </h3>
              </div>
              <div className="p-5">
                <div className="flex flex-row justify-between gap-4 mb-4">
                  <div className="flex flex-col space-y-2 w-full">
                    {editBit ? (
                      ""
                    ) : (
                      <div>
                        <label
                          htmlFor="pin"
                          className="block text-sm font-medium leading-6  text-gray-900 text-right"
                        >
                          PIN
                        </label>
                        <div className="relative mt-2">
                          <input
                            tabIndex={1}
                            onChange={handlePinChange}
                            name="pin"
                            type="number"
                            placeholder="Enter PIN"
                            className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                            required
                            disabled={!editBit ? false : true}
                            onKeyDown={(e) => {
                              if (e.key === "Tab") {
                                e.preventDefault();
                                document
                                  .querySelector('[tabIndex="2"]')
                                  .focus();
                              }
                            }}
                          />

                          <div
                            className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="phone_numbers"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        رقم التليفون{" "}
                      </label>

                      <div className="w-full  mb-6 ">
                        <div className="flex w-full ">
                          {" "}
                          {/* <div>
                            {newPhoneNumber ? (
                              <button
                                type="button"
                                onClick={handleAddPhoneNumber}
                                className="flex bg-gray-300 p-1 mr-5 mt-2 text-2xl rounded-md hover:bg-gray-400"
                              >
                                +
                              </button>
                            ) : (
                              ""
                            )}
                          </div> */}
                          <div className="relative mt-2 w-full">
                            <InputMask
                              tabIndex={3}
                              mask="00218 99 9999999" // Define your desired mask here
                              maskChar=""
                              placeholder="00218 XX XXXXXXX"
                              onChange={(e) =>
                                setNewPhoneNumber(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  console.log("e.key", e.key);
                                  e.preventDefault();
                                  handleAddPhoneNumber();
                                }
                              }}
                              value={newPhoneNumber}
                              type="tel"
                              name="phone_numbers"
                              id="phone_numbers"
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
                        </div>
                        {/* {validationErrors.phoneNumbers && (
                          <p className="text-red-500 text-sm">
                            {validationErrors.phoneNumbers}
                          </p>
                        )} */}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 w-full">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        اسم
                      </label>
                      <div className="relative mt-2">
                        <input
                          tabIndex={0}
                          type="text"
                          name="name"
                          id="name"
                          onChange={handleChange}
                          value={state?.name}
                          placeholder="أدخل الاسم "
                          className="peer block w-full px-2 border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                          onKeyDown={(e) => {
                            if (e.key === "Tab") {
                              e.preventDefault();
                              document.querySelector('[tabIndex="1"]').focus();
                            }
                          }}
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
                        بريد إلكتروني
                      </label>
                      <div className="relative mt-2">
                        <input
                          tabIndex={2}
                          name="email"
                          onChange={handleChange}
                          placeholder="أدخل البريد الإلكتروني"
                          className="peer block px-2 w-full border-0 bg-offWhiteCustom-100 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6 text-right"
                          required
                          value={state?.email || ""}
                          onKeyDown={(e) => {
                            if (e.key === "Tab") {
                              e.preventDefault();
                              document.querySelector('[tabIndex="3"]').focus();
                            }
                          }}
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-primary-100"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {phoneNumbers.length > 0 && (
                  <div className="flex flex-wrap mt-2 justify-end">
                    {phoneNumbers.map((phoneNumber, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 p-2 rounded-md flex items-center mr-2 mb-2"
                      >
                        <span className="mr-1 text-xs">{phoneNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoneNumber(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <span className="text-xs">X</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-left mt-10">
                  {loadingMessage ? (
                    <button
                      type="button"
                      className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                    >
                      تحميل...{" "}
                    </button>
                  ) : !editBit ? (
                    <button
                      type="submit"
                      className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                    >
                      تسجيل
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={`text-white bg-primary-100 rounded-xl border-2 border-primary-100 hover:border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-white hover:text-primary-100  `}
                    >
                      تحديث
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        ))}
    </>
  );
};

export default ModalComponent;
