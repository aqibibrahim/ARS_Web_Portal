import React from 'react'

export default function AmbulanceTable({ ambulanceData, onEditClick }) {
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
							Model
						</th>
						<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
							Make
						</th>
						<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
							Contact Number
						</th>
						<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
							Status
						</th>
						<th scope="col" className="px-3 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
							ID No
						</th>
					</tr>
				</thead>
				<tbody>
					{ambulanceData?.map((ambulance) => (
						<tr key={ambulance.id} className="hover:bg-gray-100">
							<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
								<a
									href="#"
									onClick={() => onEditClick(ambulance)}
									className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
								>
									Editaaaa<span className="sr-only">, {ambulance.name}</span>
								</a>
								<a
									href="#"
									onClick={() => onEditClick(ambulance)}
									className="text-primary-100 hover:text-indigo-900 border-2 rounded-lg border-primary-100 py-1 px-2"
								>
									View<span className="sr-only">, {ambulance.name}</span>
								</a>
							</td>
							<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.model}</td>
							<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.make}</td>
							<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.contact}</td>
							<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.status}</td>
							<td className="whitespace-nowrap px-3 py-4 text-md">{ambulance.id_no}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
