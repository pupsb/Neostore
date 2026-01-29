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
      const url = item.apiType === "SMILEBR"
        ? "https://www.smile.one/smilecoin/api/createorder"
        : "https://www.smile.one/ph/smilecoin/api/createorder";
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...signObj,
          sign,
        }),
      });
  
      const data1 = await response.json();
      // console.log(data1);
      
  
      if (data1.message !== "success") {
        // Return false immediately if any item fails
        return false;
      }
    }
  
    // If all items succeed, return true
    return true;
  }


  

export default processSmileOneOrder;
