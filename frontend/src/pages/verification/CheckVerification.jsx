import React from 'react';

const CheckVerification = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 -mb-10 mt-20 md:mt-5">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Please verify your email address. A verification email has been sent to your Gmail App Inbox. If you don’t see it, kindly check your spam or junk folder.
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Need help checking your email?  &nbsp;
              <a 
                href="https://mail.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Open Gmail
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckVerification;
