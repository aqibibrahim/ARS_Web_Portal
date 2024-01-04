import React from "react";

export default function Notifications({ notificationsData }) {
  return (
    <div>
      {notificationsData ? (
        notificationsData.map((data) => (
          <>
            <div className="bg-white w-full px-2 mb-4">
              <div key={data.id}>
                <p className="text-base font-bold text-right">{data.title}</p>
                <p className="text-md text-right">{data.description}</p>
              </div>
              <div className="flex justify-end mt-2">
                <button className="text-primary-100 bg-white rounded-md border-2 border-primary-100 my-2 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white">
                  Respond
                </button>
              </div>
            </div>
          </>
        ))
      ) : (
        <p className="bg-white w-full p-4 mb-4 text-right">
          No Notifications Yet...
        </p>
      )}
    </div>
  );
}
