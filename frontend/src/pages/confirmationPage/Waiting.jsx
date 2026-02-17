import React from "react";

const Waiting = () => {
  return (
    <div className="max-w-md w-full bg-white dark:bg-dark-bg-card rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/30 border border-gray-200 dark:border-dark-border p-8 text-center">
      {/* Spinner */}
      <div className="mx-auto flex items-center justify-center h-16 w-16 mb-6">
        <svg
          className="animate-spin h-10 w-10 text-primary-500 dark:text-dark-accent-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Confirming Your Order
      </h2>
      <p className="text-sm text-gray-500 dark:text-dark-text-muted mb-5">
        We&apos;re verifying your payment. This won&apos;t take long.
      </p>

      <div className="flex items-center gap-2 justify-center bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 text-sm px-4 py-2.5 rounded-lg border border-amber-200 dark:border-amber-900/30">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span>Please do not refresh or leave this page</span>
      </div>
    </div>
  );
};

export default Waiting;