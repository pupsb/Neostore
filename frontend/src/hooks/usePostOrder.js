import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { VariableContext } from "../context/VariableContext";


export const usePostOrder = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [response, setResponse] = useState([]);
  const { host, setSelected, setInput1, setInput2, setPayment } = useContext(VariableContext);
  const [paymentUrl, setPaymentUrl] = useState(null);

  const { order, setOrder } = useContext(VariableContext)


  const postOrder = async (values, token) => {
    setIsLoading(true);
    try {
      console.log('Sending order creation request:', values);
      
      const response = await fetch(`${host}/order/expay/createOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...values, apiKey: "$2b$10$NWHETA43s8Vqah.PkqfzH.ptOFbE8b7xeKo4R395t7NNZruWr5BR6" }),
      });

      const data = await response.json();
      console.log('Order creation response:', data);

      if (data.status && data.result?.payment_url) {
        // FOR ExPay3
        console.log('Redirecting to payment URL:', data.result.payment_url);
        window.location  = data.result.payment_url;

      } else if (data.error === "Token has expired. Please login again.") {
        toast.warning("Session expired! Please re-login to proceed.", { autoClose: 3000 });

        // Delay logout to let the user see the message
        setTimeout(() => {
          localStorage.clear();
          window.location = "/login";
        }, 3000);

      } else if (data.error || data.message) {
        const errorMsg = data.error || data.message;
        console.error('Order creation failed:', errorMsg);
        toast.error(errorMsg, { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(`Something went wrong! Please try again. ${error}`, { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, postOrder, response };
}