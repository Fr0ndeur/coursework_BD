import React from 'react';

const CallList = ({ calls }) => {
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Call History</h2>
      <table className='table-auto w-full border border-gray-300 rounded-lg'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='border px-4 py-2'>Call ID</th>
            <th className='border px-4 py-2'>Type</th>
            <th className='border px-4 py-2'>Date</th>
            <th className='border px-4 py-2'>Number</th>
            <th className='border px-4 py-2'>Duration (min)</th>
            <th className='border px-4 py-2'>Cost Calculated</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr key={call.call_id}>
              <td className='border px-4 py-2'>{call.call_id}</td>
              <td className='border px-4 py-2'>{call.call_type}</td>
              <td className='border px-4 py-2'>
                {new Date(call.date).toLocaleString()}
              </td>
              <td className='border px-4 py-2'>{call.dialed_number}</td>
              <td className='border px-4 py-2'>{call.duration}</td>
              <td className='border px-4 py-2'>
                {call.cost_calculated ? 'Yes' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallList;
