import React from "react";

export default function HealthcareTable({ healthcares, onEditClick }) {
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
              Address
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Facility Email Address
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Phone Number
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500"
            >
              Facilty Name
            </th>
          </tr>
        </thead>
        <tbody>
          {healthcares?.map((healthcare) => (
            <tr key={healthcare.id} className="hover:bg-gray-100">
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                <a
                  href="#"
                  onClick={() => onEditClick(healthcare)}
                  className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
                >
                  Edit<span className="sr-only">, {healthcare.name}</span>
                </a>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {healthcare.address}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {healthcare.status}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {healthcare.email}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {healthcare.phone_numbers.map((phone) => (
                  <div key={phone.id}>{phone.number}</div>
                ))}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-md">
                {healthcare.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
