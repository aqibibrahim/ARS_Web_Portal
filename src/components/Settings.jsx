import React from "react";

export default function Settings() {
  return (
    <div className="bg-white w-full px-2 mb-2">
      <div>
        <p className="text-base font-bold text-right">Nissan HJC-4653</p>
        <p className="text-md text-right">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
          alias necessitatibus, excepturi consectetur inventore dolores?
          Distinctio dignissimos ad, dolores, ipsam quod asperiores est,
          assumenda inventore culpa quidem rem quia. Hic.
        </p>
      </div>
      <div className="flex justify-end mt-2">
        <button className="text-primary-100 bg-white rounded-md border-2 border-primary-100 py-2 px-5 transition-all duration-300 hover:bg-primary-100 hover:text-white">
          Respond
        </button>
      </div>
    </div>
  );
}
