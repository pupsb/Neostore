import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="mt-[1rem] lg:mx-[6rem] mx-[1rem] flex flex-col gap-3 text-black bg-white">
      <h1 className="text-3xl font-bold">Refund and Cancellation Policy</h1>
      <p>
        At NeoStore, we strive to ensure a seamless experience when purchasing
        digital content and services. Please review our Refund and Cancellation Policy
        carefully:
      </p>

      <h2 className="text-xl font-semibold">1. Non-Refundable Items</h2>
      <p>
        Due to the nature of our products, which include digital content such as game
        credits, virtual items, and pre-paid gift cards, all sales are final. Once
        payment has been processed and the product has been delivered, refunds or
        cancellations are not available.
      </p>

      <h2 className="text-xl font-semibold">2. Payment Issues</h2>
      <p>
        In the event that payment has been successfully processed but the purchased
        items have not been delivered, please contact our support team promptly. Provide
        relevant details, including your order number and proof of payment, to expedite
        the resolution process.
      </p>

      <h2 className="text-xl font-semibold">3. Order Discrepancies</h2>
      <p>
        If you identify any discrepancies or issues with your order that you believe are
        due to an error on our part, please inform us within 48 hours of receiving the product.
        We will review the matter and, if appropriate, offer corrective measures.
      </p>

      <h2 className="text-xl font-semibold">4. Contacting Support</h2>
      <p>
        For any questions or concerns regarding your purchase or order, please contact
        our support team at <nbsp />
        <a href="mailto:neostoreofficials@gmail.com" className="text-blue-500 underline">
          neostoreofficials@gmail.com
        </a>. We are dedicated to providing assistance and resolving any issues you may encounter.
      </p>

      <h2 className="text-xl font-semibold">5. Policy Updates</h2>
      <p>
        NeoStore reserves the right to amend this Refund and Cancellation Policy at any
        time. Any updates will be posted on this page. We encourage you to periodically
        review this policy to stay informed about our practices.
      </p>

      <p>
        For more information, please review our <a href="/terms-and-condition" className="text-blue-500 underline">Terms and Conditions</a>.
      </p>
    </div>
  );
};

export default RefundPolicy;
