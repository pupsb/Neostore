import CryptoJS from "crypto-js";

export const checkId = async (req, res) => {
    try {
      const { userid, zoneid, selectedProduct, selectedItem } = req.body;

      const apiType = selectedItem.apiType;
      // console.log("apiType", apiType);
      
      let email = process.env.API_EMAIL;
      let uid = process.env.API_UID;
      let product = "mobilelegends";

      const productid = apiType === "SMILEBR" ? "13" : "212";


      let time = Math.floor(Date.now() / 1000);
      // console.log(time + " ");
  
      let m_key = process.env.API_MKEY;
  
      // Create an object with the fields
      let sign_obj = {
        email: email,
        uid: uid,
        userid: userid,
        zoneid: zoneid,
        product: product,
        productid: productid,
        time: time,
      };
  
      // Sort the object by key
      let sorted_keys = Object.keys(sign_obj).sort();
      let sorted_sign_obj = {};
      sorted_keys.forEach((key) => {
        sorted_sign_obj[key] = sign_obj[key];
      });
  
      // Construct the string to be hashed
      let str = "";
      for (let key in sorted_sign_obj) {
        str += key + "=" + sorted_sign_obj[key] + "&";
      }
  
      // Generate the sign using double MD5 hashing
      function md5(string) {
        return CryptoJS.MD5(string).toString();
      }
  
      let sign = md5(md5(str + m_key));

      const url = apiType === "SMILEBR" 
      ? "https://www.smile.one/smilecoin/api/getrole" 
      : "https://www.smile.one/ph/smilecoin/api/getrole";
    
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            uid: uid,
            userid: userid,
            zoneid: zoneid,
            product: product,
            productid: productid,
            time: time,
            sign: sign,
          }),
        }
      );
  
      const data = await response.json();
      // console.log(data);
      
      res.status(200).json(data);
  
      // console.log(sign); // Output the generated sign
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };