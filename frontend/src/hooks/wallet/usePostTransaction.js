import { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";

export const usePostTransaction = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [response, setResponse] = useState([]);
  const { host, setSelected, setInput1, setInput2, setPayment } =
    useContext(VariableContext);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const { order, setOrder } = useContext(VariableContext);

  const postOrder = async (values, token) => {
    setIsLoading(true);
    try {
      console.log('Sending wallet top-up request:', values);
      
      const response = await fetch(`${host}/wallet/expay/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...values }),
      });

      const data = await response.json();
      console.log('Wallet top-up response:', data);

      // Check if response is successful and has payment URL
      if (data.status && data.result?.payment_url) {
        // ExPay3
        console.log('Redirecting to payment URL:', data.result.payment_url);
        window.location = data.result.payment_url;
      } else {
        // Handle error response
        const errorMessage = data.message || data.error || 'Failed to create wallet top-up order';
        console.error('Wallet top-up failed:', errorMessage);
        alert(`Error: ${errorMessage}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Wallet top-up error:', error);
      alert(`Something went wrong! Please try again. ${error.message}`);
      setIsLoading(false);
    }
  };

  return { isLoading, postOrder, response };
};
