import { useContext, useState } from "react";
import { VariableContext } from "../context/VariableContext";

export const useCheckId = () => {
  const [isLoading1, setIsLoading] = useState(null);
  const [items, setItems] = useState([]);
  const { host, productPageLoading, setProductPageLoading, setVerified } =
    useContext(VariableContext);
  const [message, setMessage] = useState(null);

  const checkId = async (userid, zoneid, product,item) => {
    setIsLoading(true);
    // setProductPageLoading(true);
    const response = await fetch(`${host}/order/checkid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userid: userid,
        zoneid: zoneid,
        selectedProduct: product,
        selectedItem: item,
      }),
    });
    const data = await response.json();
    // console.log(data);
    
    // setItems(await response.json());
    if (data.message === "success") {
      if (data.use === "b") {
        setVerified(false);
        setMessage("Recharge for Indo IDs is not permitted");
      } else {
        setVerified(true);
        setMessage(`Username: ${data.username}`);
      }
    } else {
      setVerified(false);
      if(data.message === "According to moonton's request, smilone is only allowed to top up to 350,000 USD per month for users in Malaysia. We have triggered this month's limit. The limit will be reset on the first of next month, and you can continue to top up for users in Malaysia."
        || data.message === "The recharge has failed. Please contact Customer Service for more details."
        || data.message === "According to the request of the MLBB team, from 11:00 (UTC+8) on December 13, 2024, players in Malaysia/Singapore/Philippines will temporarily be unable to use smilecoin to purchase Brazilian MLBB. This ban will expire on January 1, 2025."
        || data.message === "According to the content of the moonton meeting on January 18, we have determined the following three points. <br>\r\n1. When users in the Philippines and Singapore recharge through smilecoin, the additional fee will be changed to 55%. The mlbb team is already developing a separate pricing system for users in these two countries, and the development work may be completed at the end of January or early February. <br>\r\n2. We will open a separate recharge method for Malaysian users, which will be recharged directly through the API, using the balance of US dollars instead of using Brazilian smilecoin. We will launch this new product at the end of January. <br>\r\n3. Users in other countries will still maintain the previous rules."
      ){
          setMessage("Recharge For This ID is not permitted. Contact Admin or try purchasing another region packs.");
        }else{
          setMessage(data.message);
        }
    }

    setIsLoading(false);
  };

  return { isLoading1, checkId, items, message };
};
