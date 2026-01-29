import React from 'react'

const TxnRow = ({ data }) => {

  const txn = data?.transactionid;

  // Format the `updatedAt` date
  const formatDate = (isoString) => {
    const date = new Date(isoString);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // Short month name
    const year = date.getFullYear();

    const time = date.toTimeString().split(' ')[0]; // Get time in HH:MM:SS format

    return `${day}-${month}-${year}  ${time}`;
  };

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {/* {data?.transactionid}<br></br><br></br> */}
        {txn}
        {/* {data?.userid} */}
      </th>
      <td className="px-6 py-4">{data?.itemname}</td>
      <td
        className="px-6 py-4"
        style={
          data?.status === "Processing"
            ? { color: "#FF962D" }
            : data?.status === "Completed"
              ? { color: "#9ACD32" }
              : { color: "#FF4646" }
        }
      >
        {data?.status}
      </td>
      <td className="px-3 py-4">{data?.input1}</td>
      <td className="px-3 py-4">{data?.input2}</td>

      <td className="px-3 py-4">₹ {data?.value}</td>
      <td className="px-3 py-4">{data?.paymentmode}</td>
      <td className="px-3 py-4">{data?.useremail}</td>
      <td className="px-3 py-4">{formatDate(data?.updatedAt)}</td>


    </tr>
  )
}

export default TxnRow