import React from "react";

export default function RegionTable({ regions }) {
  return (
    <div className="rtl">
      <table className="min-w-full divide-y divide-gray-300 text-right">
        <thead>
          <tr>
            <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
              <span className="sr-only">Edit</span>
            </th>
            <th
              scope="col"
              className="py-3 pl-4 pr-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-0"
            >
              Ambulance Count
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Contact Number
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Address
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Location
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Region Name
            </th>
          </tr>
        </thead>
        <tbody>
          {regions?.map((region) => (
            <tr key={region.id} className="hover:bg-gray-100">
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <a
                  href="#"
                  className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                >
                  Edit<span className="sr-only">, {region.name}</span>
                </a>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {region.ambulances.length}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {region.contact}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {region.address}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {region.latitude} {region.longitude}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {region.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
