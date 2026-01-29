import React from 'react';

const WalletTxnRow = ({ data }) => {
    // console.log(data);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const time = date.toTimeString().split(' ')[0];
        return `${day}-${month}-${year} ${time}`;
    };

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
                {data.txnid}
            </th>
            <td className="px-6 py-4"
                style={
                    data.type === "Debit" ? { color: "#FF962D" }
                        : data.type === "Credit" ? { color: "#9ACD32" }
                            : { color: "#FF4646" }
                }>{data.type}</td>
            <td className="px-6 py-4"
                style={
                    data.status === "Processing"
                    ? { color: "#FF962D" }
                    : data.status === "Success"
                    ? { color: "#9ACD32" }
                    : { color: "#FF4646" }
                }
                >
                {data.status}
            </td>
            <td className="px-6 py-4">₹ {data.amount}</td>
            <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
                {data.orderid}
            </th>
            <td className="px-6 py-4">{data.userid}</td>
            <td className="px-6 py-4">{data.useremail}</td>
            <td className="px-6 py-4">{formatDate(data.updatedAt)}</td>
        </tr>
    );
};

export default WalletTxnRow;
