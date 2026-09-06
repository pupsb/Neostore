import CryptoJS from "crypto-js";

export const checkId = async (req, res) => {
    try {
      const { userid, zoneid, selectedProduct, selectedItem } = req.body;

      // Validate required inputs
      if (!userid || !zoneid) {
        return res.status(400).json({ message: "Please enter both User ID and Server ID." });
      }

      // Safely read apiType — frontend may strip it during sanitization
      const apiType = selectedItem?.apiType || "SMILEBR";

      let email = process.env.API_EMAIL;
      let uid = process.env.API_UID;
      let product = "mobilelegends";

      // Use Brazil endpoint (productid "13") as it is the only working getrole endpoint.
      // The PH endpoint (/ph/smilecoin/api/getrole) does not return valid JSON.
      const productid = "13";
      const url = "https://www.smile.one/smilecoin/api/getrole";

      let time = Math.floor(Date.now() / 1000);
  
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

      // Safely parse the response — the external API may return non-JSON (e.g. HTML error page)
      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error("[checkId] Failed to parse Smile.one response:", parseErr.message);
        return res.status(502).json({ message: "Game server is temporarily unavailable. Please try again later." });
      }
      
      res.status(200).json(data);
  
      // console.log(sign); // Output the generated sign
    } catch (err) {
      console.error("[checkId] Error:", err.message);
      res.status(500).json({ message: "Verification failed. Please try again." });
    }
  };