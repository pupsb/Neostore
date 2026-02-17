import React, { useContext, useEffect } from "react";
import { useTxnStatus } from "../../hooks/wallet/useTxnStatus";
import { VariableContext } from "../../context/VariableContext";
import Waiting from "./Waiting";

const StatusBadge = ({ status }) => {
  const styles = {
    Success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[status] || "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
      {status}
    </span>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-dark-border/50 last:border-b-0">
    <span className="text-sm text-gray-500 dark:text-dark-text-muted">{label}</span>
    <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
      {value || "—"}
    </span>
  </div>
);

const WalletConfirmation = () => {
  const { token } = useContext(VariableContext);
  const { orderStatus, isLoading, order } = useTxnStatus();

  useEffect(() => {
    async function fetchItems() {
      await orderStatus(token);
    }
    fetchItems();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg-primary p-4">
        <Waiting />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg-primary p-4">
      <div className="max-w-lg w-full bg-white dark:bg-dark-bg-card rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/30 border border-gray-200 dark:border-dark-border overflow-hidden">

        {/* ── Success Header ── */}
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6 ring-4 ring-green-50 dark:ring-green-900/10">
            <svg className="h-10 w-10 text-green-500 dark:text-dark-accent-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Wallet Top-Up Successful!
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-dark-text-muted">
            Your wallet has been credited
          </p>
        </div>

        {/* ── Transaction Details ── */}
        <div className="mx-8 mb-6 bg-gray-50 dark:bg-dark-bg-secondary/60 rounded-xl px-5 py-1">
          <DetailRow label="Transaction ID" value={<span className="font-mono">{order?.txnid}</span>} />
          <DetailRow label="Status" value={<StatusBadge status={order?.status} />} />
          <DetailRow
            label="Amount"
            value={
              order?.amount ? (
                <span className="text-base font-bold text-primary-600 dark:text-dark-accent-primary">
                  ₹{order.amount}
                </span>
              ) : "—"
            }
          />
        </div>

        {/* ── Action Buttons ── */}
        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
          <a
            href="/wallet"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-dark-accent-primary dark:text-gray-900 dark:hover:bg-dark-accent-glow rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-dark-accent-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            View Wallet
          </a>
          <a
            href="/home"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-dark-text-secondary bg-gray-100 hover:bg-gray-200 dark:bg-dark-bg-hover dark:hover:bg-dark-border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default WalletConfirmation;
