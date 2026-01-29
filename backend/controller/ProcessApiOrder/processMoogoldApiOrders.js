import axios from "axios";
import crypto from "crypto"; // Ensure this is installed via `npm install crypto`

// Helper function to generate Basic Auth
const generateBasicAuth = (partnerId, secretKey) => {
    return Buffer.from(`${partnerId}:${secretKey}`).toString('base64');
};

// Helper function to generate Auth Signature
const generateAuthSignature = (payload, timestamp, path, secretKey) => {
    const stringToSign = `${payload}${timestamp}${path}`;
    return crypto.createHmac('sha256', secretKey).update(stringToSign).digest('hex');
};

async function processMoogoldApiOrder(clientTxnId, itemidarray, item, product, order, date) {
    console.log("I am in moogold order function.");
    
    const partnerId = process.env.MG_PARTNERID;
    const secretKey = process.env.MG_SECRET_KEY;

    if (!partnerId || !secretKey) {
        console.error('Missing partnerId or secretKey in environment variables.');
        return;
    }
    
    const path = "order/create_order";

    let payload;

    if (item.apiType === "MOOGOLDMLBB") {
        payload = {
            path,
            data: {
                category: "50",
                "product-id": itemidarray[0],
                quantity: "1",
                "User ID": order.input1,
                "Server ID": order.input2,
            },
            partnerOrderId: clientTxnId,
        };
    } else if (item.apiType === "MOOGOLDGENSHIN") {
        payload = {
            path,
            data: {
                category: "50",
                "product-id": itemidarray[0],
                quantity: "1",
                "User ID": order.input1,
                "Server": order.input2,
            },
            partnerOrderId: clientTxnId,
        };
    } else {
        payload = {
            path,
            data: {
                category: "50",
                "product-id": itemidarray[0],
                quantity: "1",
                "Player ID": order.input1,
            },
            partnerOrderId: clientTxnId,
        };
    }

    let createOrderResponse;
    let checkOrderResponse;

    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const basicAuth = generateBasicAuth(partnerId, secretKey);
        // console.log("Basic Auth 46:", basicAuth);
        
        const authSignature = generateAuthSignature(JSON.stringify(payload), timestamp, path, secretKey);

        // Step 1: Create Order
        createOrderResponse = await axios.post(
            "https://moogold.com/wp-json/v1/api/order/create_order",
            // "https://mgtest.onrender.com/order/create_order",
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${basicAuth}`,
                    auth: authSignature,
                    timestamp: timestamp.toString(),
                },
            }
        );

        // console.log("Create Order Response line 57:", createOrderResponse.data);
        
        const partnerOrderId = createOrderResponse?.data?.partnerOrderId;

        if (!partnerOrderId) {
            console.error("Partner order ID is missing in the create order response.");
            console.log(createOrderResponse.data);
            return false;
        }

        // console.log("Create Order Response line 66:", createOrderResponse.data);

        // Step 2: Poll Check Order Endpoint
        const maxAttempts = 10;
        const interval = 1000;

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const checkOrderPayload = {
                path: "order/order_detail_partner_id",
                partner_order_id: partnerOrderId,
            };

            const checkOrderTimestamp = Math.floor(Date.now() / 1000);
            const checkOrderSignature = generateAuthSignature(
                JSON.stringify(checkOrderPayload),
                checkOrderTimestamp,
                "order/order_detail_partner_id",
                secretKey
            );

            const response = await axios.post(
                "https://moogold.com/wp-json/v1/api/order/order_detail_partner_id",
                // "https://mgtest.onrender.com/order/order_detail_partner_id",
                checkOrderPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Basic ${basicAuth}`,
                        auth: checkOrderSignature,
                        timestamp: checkOrderTimestamp.toString(),
                    },
                }
            );

            checkOrderResponse = response.data;

            console.log("Check Order Response:", checkOrderResponse);

            if (checkOrderResponse?.order_status === "completed") {
                console.log("Order completed successfully.");
                return true;
            }

            await delay(interval);
        }

        console.error("Order did not complete within the maximum attempts.");
        return false;

    } catch (error) {
        console.error("Error in Moogold API Order:", error.response ? error.response.data : error.message);
        return false;
    }
}

export default processMoogoldApiOrder;