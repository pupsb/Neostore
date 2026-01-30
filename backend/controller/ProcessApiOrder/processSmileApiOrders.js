import CryptoJS from "crypto-js";

async function generateSignature(signObj, mKey) {
  let sortedKeys = Object.keys(signObj).sort();
  let sortedSignObj = {};
  sortedKeys.forEach((key) => {
    sortedSignObj[key] = signObj[key];
  });

  let str = "";
  for (let key in sortedSignObj) {
    str += key + "=" + sortedSignObj[key] + "&";
  }

  return CryptoJS.MD5(CryptoJS.MD5(str + mKey).toString()).toString();
}

async function processSmileOneOrder(clientTxnId, itemidarray, product, item, order, date) {
    const email = process.env.API_EMAIL;
    const uid = process.env.API_UID;
    const product1 = "mobilelegends";
    const mKey = process.env.API_MKEY;
  
    /* console.log('[SMILEONE] Starting order processing:', { 
      clientTxnId, 
      itemCount: itemidarray.length,
      userid: order.input1,
      zoneid: order.input2
    }); */

    for (let i = 0; i < itemidarray.length; i++) {
      const time = Math.floor(Date.now() / 1000);
  
      // Create signature object
      const signObj = {
        email,
        uid,
        userid: order.input1,
        zoneid: order.input2,
        product: product1,
        productid: itemidarray[i],
        time,
      };
  
      const sign = await generateSignature(signObj, mKey);
      
      
      // DEBUG: Check apiType value
      /* console.log('[SMILEONE] API Type Debug:', {
        apiType: item.apiType,
        typeofApiType: typeof item.apiType,
        isSMILEBR: item.apiType === "SMILEBR"
      }); */
      
      const url = item.apiType === "SMILEBR"
        ? "https://www.smile.one/smilecoin/api/createorder"
        : "https://www.smile.one/ph/smilecoin/api/createorder";
  
      /* console.log('[SMILEONE] Request details:', {
        clientTxnId,
        url,
        productid: itemidarray[i],
        userid: signObj.userid,
        zoneid: signObj.zoneid
      }); */

      try {
        // Add 30-second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...signObj,
            sign,
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
    
        const data1 = await response.json();
        /* console.log('[SMILEONE] Response received:', {
          clientTxnId,
          productid: itemidarray[i],
          status: response.status,
          message: data1.message,
          fullResponse: data1
        }); */
    
        if (data1.message !== "success") {
          console.error('[SMILEONE] Order failed:', {
            clientTxnId,
            productid: itemidarray[i],
            errorMessage: data1.message,
            errorDetails: data1,
            userid: order.input1,
            zoneid: order.input2
          });
          return false;
        }
      } catch (error) {
        console.error('[SMILEONE] Network error:', {
          clientTxnId,
          productid: itemidarray[i],
          errorName: error.name,
          errorMessage: error.message,
          isTimeout: error.name === 'AbortError'
        });
        return false;
      }
    }
  
    console.log('[SMILEONE] All items processed successfully:', { clientTxnId });
    return true;
  }


  

export default processSmileOneOrder;
