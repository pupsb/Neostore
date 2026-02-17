import React, { useContext, useEffect } from "react";
import { VariableContext } from "../../context/VariableContext";
import { useOrderStatus } from "../../hooks/useOrderStatus";
import Waiting from "./Waiting";

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    Created: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Queued: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    Failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${styles[status] || styles.Created}`}>
      {status}
    </span>
  );
};

const DetailRow = ({ label, value, mono }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-dark-border/50 last:border-b-0">
    <span className="text-sm text-gray-500 dark:text-dark-text-muted">{label}</span>
    <span className={`text-sm font-medium text-gray-900 dark:text-white text-right ${mono ? "font-mono" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

const Confirmation = () => {
  const { token } = useContext(VariableContext);
  const { orderStatus, isLoading, order } = useOrderStatus();

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
          {/* Animated Checkmark */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6 ring-4 ring-green-50 dark:ring-green-900/10">
            <svg className="h-10 w-10 text-green-500 dark:text-dark-accent-primary" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-dark-text-muted">
            Thank you for your purchase
          </p>

          {/* Processing Notice */}
          {order?.status === "Processing" && (
            <div className="mt-4 flex items-center gap-2 justify-center bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 text-sm px-4 py-2.5 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Your order will be completed within 30 minutes.</span>
            </div>
          )}
        </div>

        {/* ── Order Details ── */}
        <div className="mx-8 mb-6 bg-gray-50 dark:bg-dark-bg-secondary/60 rounded-xl px-5 py-1">
          <DetailRow label="Order ID" value={order?.orderid} mono />
          <DetailRow label="Item" value={order?.itemname} />
          <DetailRow label="Payment Mode" value={order?.paymentmode?.toUpperCase()} />
          <DetailRow
            label="Status"
            value={<StatusBadge status={order?.status} />}
          />
          <DetailRow label="UID / Email" value={order?.input1} />
          <DetailRow label="Username" value={order?.input2} />
          <DetailRow
            label="Price"
            value={
              order?.value ? (
                <span className="text-base font-bold text-primary-600 dark:text-dark-accent-primary">
                  ₹{order.value}
                </span>
              ) : "—"
            }
          />
        </div>

        {/* ── Action Buttons ── */}
        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
          <a
            href="/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-dark-accent-primary dark:text-gray-900 dark:hover:bg-dark-accent-glow rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-dark-accent-primary"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View Order
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

export default Confirmation;
