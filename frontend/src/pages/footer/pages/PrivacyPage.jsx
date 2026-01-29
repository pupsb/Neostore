import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="mt-[1rem] lg:mx-[6rem] mx-[1rem] flex flex-col gap-3 text-black bg-white">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p>
        At NeoStore, we are dedicated to safeguarding your privacy and ensuring
        the protection of your personal information. This Privacy Policy explains the
        types of information we collect, how we use and share it, and the measures we
        take to protect it.
      </p>
      <p>
        By using our services and website, you agree to the terms outlined in this policy.
        If you do not agree with any part of this policy, please discontinue use of our services.
      </p>

      <h2 className="text-xl font-semibold">1. Information We Collect</h2>
      <ul className="list-disc pl-5">
        <li><strong>Personal Information:</strong> When you use our services, make purchases,
          or contact our support team, we may collect personal information such as your name,
          email address, phone number, and payment details. This information is gathered
          through secure forms on our website.
        </li>
        <li><strong>Non-Personal Information:</strong> We may collect non-personal data,
          including your browser type, IP address, and general usage statistics. This information
          helps us enhance your experience and improve our services.
        </li>
        <li><strong>Cookies:</strong> We use cookies to enhance your interaction with our website.
          Cookies allow us to track your visits and customize your experience. You can manage your
          cookie preferences through your browser settings.
        </li>
      </ul>

      <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
      <ul className="list-disc pl-5">
        <li><strong>Service Delivery:</strong> We use your personal information to process transactions,
          respond to inquiries, and ensure seamless service delivery.
        </li>
        <li><strong>Service Improvement:</strong> Non-personal data is used to analyze site performance,
          understand user behavior, and identify areas for improvement.
        </li>
        <li><strong>Communications:</strong> We may use your email address and phone number to send you
          updates, transaction-related notifications, and promotional offers. You can opt out of marketing
          communications at any time.
        </li>
      </ul>

      <h2 className="text-xl font-semibold">3. Sharing Information with Third Parties</h2>
      <p>
        We do not share your personal information with third parties except as necessary to fulfill
        service requests, comply with legal obligations, or with your explicit consent. Any non-personal
        data used for analytical purposes is anonymized and does not include personally identifiable information.
      </p>

      <h2 className="text-xl font-semibold">4. Data Security</h2>
      <p>
        We are committed to protecting your data and use secure servers to process sensitive transactions.
        We do not store financial information such as credit card details. Despite our efforts to ensure security,
        no online method or storage system is completely secure, and we cannot guarantee absolute protection.
      </p>

      <h2 className="text-xl font-semibold">5. Access and Control of Your Information</h2>
      <p>
        You have the right to access, update, or delete your personal information stored with us.
        To make such requests, please contact our support team at <nbsp />
        <a href="mailto:neostoreofficials@gmail.com" className="text-blue-500 underline">
          neostoreofficials@gmail.com
        </a>. Verification of identity may be required to process these requests.
      </p>

      <h2 className="text-xl font-semibold">6. Policy Updates</h2>
      <p>
        We reserve the right to amend this Privacy Policy at any time. Updates will be posted on this page,
        and we encourage you to review the policy periodically to stay informed about how we protect your information.
      </p>

      <p>
        For any questions or concerns regarding this Privacy Policy, please contact us at <nbsp />
        <a href="mailto:neostoreofficials@gmail.com" className="text-blue-500 underline">
          neostoreofficials@gmail.com
        </a>.
      </p>
    </div>
  );
};

export default PrivacyPage;
