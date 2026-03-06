import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

dotenv.config();

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

async function testSmileOneQueryPoints() {
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

  const urls = [
    { region: 'BR', url: 'https://www.smile.one/smilecoin/api/querypoints' },
    { region: 'PH', url: 'https://www.smile.one/ph/smilecoin/api/querypoints' }
  ];

  for (const endpoint of urls) {
    try {
      console.log(`\n📡 Querying ${endpoint.region} endpoint: ${endpoint.url} (querypoints)`);
      
      const sign = await generateSignature(signObj, mKey);

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

      console.log(`Status: ${response.status} ${response.statusText}`);
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        console.log(`Response Payload:\n${JSON.stringify(json, null, 2)}`);
      } catch (e) {
        console.log(`Response Text (first 500 chars):\n${text.substring(0, 500)}`);
      }

    } catch (error) {
      console.error(`\n❌ Error querying ${endpoint.region}:`, error.message);
    }
  }
}

testSmileOneQueryPoints().then(() => {
  console.log('\n✅ Done!');
  process.exit(0);
}).catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
