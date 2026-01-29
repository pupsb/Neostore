import React from "react";
import Sidebar from "./Sidebar";
import { Routes, Route } from "react-router-dom";
import AdminCounter from "./AdminCounter";
import OrdersAdminTable from "./orders/OrdersAdminTable";
import ChangePrice from "./ChangePriceDropdown";
import UsersData from "./users/UsersData";
import AllTxn from "./allTransactions/AllTxn";
import AllWalletTxn from "./walletTransactions/AllWalletTxn";
import AdminGallery from "./AdminGallery/admingallery";
import CreateProduct from "./Products/createProduct";
import CreateItems from "./Items/createItems";
import AllItems from "./Items/AllItems";
import AllProducts from "./Products/AllProducts";

const AdminPage = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-y-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <Routes>
          <Route path="/" element={<AdminCounter />} />
          <Route path="orders" element={<OrdersAdminTable />} />
          <Route path="price" element={<ChangePrice />} />
          <Route path="usersdata" element={<UsersData />} />
          <Route path="txn" element={<AllTxn />} />
          <Route path="wallettxn" element={<AllWalletTxn />} />
          <Route path="admingallery" element={<AdminGallery />} />
          <Route path="createproduct" element={<CreateProduct/>} />
          <Route path="createitems" element={<CreateItems/>} />
          <Route path="viewitems" element={<AllItems/>} />
          <Route path="viewproducts" element={<AllProducts/>} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
