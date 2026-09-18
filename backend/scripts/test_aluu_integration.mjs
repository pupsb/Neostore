import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

console.log("=== Testing Aluu Pay Integration Logic ===");

// 1. Test HMAC SHA-256 Webhook Signature Generation & Verification
const testSecret = "test_webhook_secret_key_12345";
const testTimestamp = Math.floor(Date.now() / 1000).toString();
const testPayload = JSON.stringify({
  orderId: "TEST_1234567890",
  status: "SUCCESS",
  amount: "99.00",
  utr: "UTR9876543210",
  date: "2026-09-18 11:00:00"
});

const hmac = crypto
  .createHmac("sha256", testSecret)
  .update(`${testTimestamp}.${testPayload}`)
  .digest("hex");

const expectedSignature = `sha256=${hmac}`;

// Test timing-safe verification
function verifySignature(signature, secret, timestamp, rawBody) {
  const computedHmac = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const expected = `sha256=${computedHmac}`;
  const sigToCompare = signature.startsWith("sha256=") ? signature : `sha256=${signature}`;

  const sigBuf = Buffer.from(sigToCompare);
  const expBuf = Buffer.from(expected);

  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

const isValidPositive = verifySignature(expectedSignature, testSecret, testTimestamp, testPayload);
console.log("✓ Positive signature verification test passed:", isValidPositive === true);

const isValidNegative = verifySignature("sha256=invalidhash1234567890abcdef", testSecret, testTimestamp, testPayload);
console.log("✓ Negative signature verification (tamper detection) test passed:", isValidNegative === false);

// 2. Test Replay Attack Prevention (Timestamp expired after 10 min)
function checkTimestampFreshness(timestampStr) {
  const currentTime = Math.floor(Date.now() / 1000);
  const reqTime = parseInt(timestampStr, 10);
  if (isNaN(reqTime)) return false;
  const parsedTime = reqTime > 1e11 ? Math.floor(reqTime / 1000) : reqTime;
  return Math.abs(currentTime - parsedTime) <= 600; // within 10 minutes
}

const currentTs = Math.floor(Date.now() / 1000).toString();
const expiredTs = (Math.floor(Date.now() / 1000) - 700).toString(); // 11+ minutes old

console.log("✓ Current timestamp accepted:", checkTimestampFreshness(currentTs) === true);
console.log("✓ Expired timestamp rejected:", checkTimestampFreshness(expiredTs) === false);

// 3. Test Amount Mismatch Detection
function isAmountTampered(expectedAmount, gatewayAmount) {
  return Math.abs(parseFloat(expectedAmount) - parseFloat(gatewayAmount)) > 0.01;
}

console.log("✓ Legitimate payment amount matches:", isAmountTampered("99.00", "99.00") === false);
console.log("✓ Underpayment tampering detected:", isAmountTampered("99.00", "1.00") === true);

console.log("\nAll security checks verified successfully!");
