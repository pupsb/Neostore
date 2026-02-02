import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

dotenv.config();

// Generate signature function (same as your processSmileApiOrders.js)
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

// Fetch available products from SmileOne
async function fetchSmileOneProducts() {
  const email = process.env.API_EMAIL;
  const uid = process.env.API_UID;
  const product = "mobilelegends";
  const mKey = process.env.API_MKEY;
  const time = Math.floor(Date.now() / 1000);

  const signObj = {
    email,
    uid,
    product,
    time,
  };

  const sign = await generateSignature(signObj, mKey);

  // Try both BR and PH endpoints
  const urls = [
    { region: 'BR', url: 'https://www.smile.one/smilecoin/api/goodslist' },
    { region: 'PH', url: 'https://www.smile.one/ph/smilecoin/api/goodslist' }
  ];

  console.log('\n🔍 Fetching SmileOne Product List...\n');

  for (const endpoint of urls) {
    try {
      console.log(`\n📡 Querying ${endpoint.region} endpoint: ${endpoint.url}`);
      
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...signObj,
          sign,
        }),
      });

      const data = await response.json();
      
      console.log(`\n✅ Response from ${endpoint.region}:`);
      console.log(JSON.stringify(data, null, 2));

      if (data.message === "success" && data.goodslist) {
        console.log(`\n📦 Available Products (${endpoint.region}):`);
        data.goodslist.forEach(item => {
          console.log(`  - ID: ${item.productid} | Name: ${item.productname} | Price: ${item.price}`);
        });
      }
    } catch (error) {
      console.error(`\n❌ Error querying ${endpoint.region}:`, error.message);
    }
  }
}

fetchSmileOneProducts().then(() => {
  console.log('\n✅ Done!');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
