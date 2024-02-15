import React from 'react'

const Skeleton = () => {
	return (
		<table className="min-w-full divide-y divide-gray-300 text-right mt-4 mr-1">
			<thead>
				<tr>
					<th scope="col" className="px-3 py-3 text-xs font-medium tracking-wide text-gray-500"></th>
					<th scope="col" className="px-3 py-3 text-xs font-medium tracking-wide text-gray-500"></th>
					<th scope="col" className="px-3 py-3 text-xs font-medium tracking-wide text-gray-500"></th>
					<th scope="col" className="px-3 py-3 text-xs font-medium tracking-wide text-gray-500"></th>
					<th scope="col" className="px-3 py-3 text-xs font-medium tracking-wide text-gray-500"></th>
					<th scope="col" className="px-3 py-3 text-xs font-medium tracking-wide text-gray-500"></th>
					<th scope="col" className="px-3 py-3 text-xs font-medium tracking-wide text-gray-500"></th>
				</tr>
			</thead>
			<tbody>
				{[...Array(10)].map((_, index) => (
					<tr key={index} className="animate-pulse">
						{[...Array(7)].map((_, colIndex) => (
							<td
								key={colIndex}
								className="whitespace-nowrap px-3 py-4 text-xs bg-gray-500"
								style={{ padding: '10px' }}
							></td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default Skeleton
