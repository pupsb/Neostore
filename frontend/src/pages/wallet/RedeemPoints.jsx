import React from "react";
import { VariableContext } from "../../context/VariableContext";
import { usePostPoints } from "../../hooks/points/usePostPoints";

const RedeemPoints = () => {
  const [value, setValue] = React.useState("");
  const { user, token } = React.useContext(VariableContext);

  const { postPoints, message } = usePostPoints();

  const handleSubmit = () => {
    const amount = parseInt(value);

    if (amount <= 0 || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }

    const userid = user?.userid;

    const values = { value, userid };
    postPoints(values, token);
  };

  return (
    <div className="mt-[3rem] lg:mx-[6rem] mx-[1rem] flex flex-col gap-6 items-center">
      {/* Heading Section */}
      <h1 className="text-3xl font-bold text-[#0077B6]">Redeem Your Points</h1>
      <p className="text-gray-600 text-sm md:text-base text-center max-w-[600px]">
        Enter the amount of points you'd like to redeem and click the button below to proceed.
      </p>

      {/* Input Section */}
      <div className="flex flex-col w-full max-w-md gap-4">
        <label className="text-lg font-medium text-[#03045E]">Enter Points</label>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter points"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
        />
      </div>

      {/* Error Message */}
      {message && <div className="text-black text-sm">{message}</div>}

      {/* Button Section */}
      <button
        type="button"
        className="mt-4 w-full max-w-md text-white bg-blue-800 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-green-700 font-medium rounded-lg text-base px-6 py-3"
        onClick={handleSubmit}
      >
        Redeem
      </button>

      {/* Information Section */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Make sure to double-check your points before redeeming.</p>
        <p className="text-[#0077B6] font-medium">Contact support if you face any issues.</p>
      </div>
    </div>
  );
};

export default RedeemPoints;
