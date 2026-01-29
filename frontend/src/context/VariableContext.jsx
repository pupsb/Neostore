import { createContext, useEffect, useState, useLayoutEffect } from "react";
import { json } from "react-router-dom";

export const VariableContext = createContext({});
export const VariableProvider = ({ children }) => {
  // const host = "http://localhost:8080";
  // const host = "https://neostore.in"; // Use this after DNS is configured
  const host = "/api"; // Works with both IP and domain via Nginx proxy
  const imageUrl = "../../assets/"

  const [input1, setInput1] = useState(null);
  const [input2, setInput2] = useState(null);

  const [product, setProduct] = useState(null);
  const [items, setItems] = useState(null);
  const [payment, setPayment] = useState(null);

  const [selected, setSelected] = useState(null);
  const [order, setOrder] = useState(null);

  const [after, setAfter] = useState(null);
  const [show, setShow] = useState(false);

  const [productPageLoading, setProductPageLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [verified, setVerified] = useState(null);

  const deleteUser = () => {
    localStorage.setItem("user", JSON.stringify([]));
    localStorage.setItem("token", JSON.stringify(""));
    localStorage.setItem("isLoggedIn", !isLoggedIn);
  };

  useLayoutEffect(() => {
    const expiryTime = localStorage.getItem("expiryTime");
    const currentTime = new Date().getTime();

    if (expiryTime && currentTime > expiryTime) {
      // Session has expired, clear storage
      localStorage.clear();
      console.log("Session expired, please log in again.");
    } else if (localStorage.getItem("isLoggedIn")) {
      // Session is still valid
      setIsLoggedIn(JSON.parse(localStorage.getItem("isLoggedIn")));
      setUser(JSON.parse(localStorage.getItem("user")));
      setToken(JSON.parse(localStorage.getItem("token")));
    }
  }, []);

  return (
    <VariableContext.Provider
      value={{
        host, imageUrl, selected, setSelected, input1, setInput1, input2, setInput2, payment, setPayment, order, setOrder, product, setProduct, items, setItems, after, setAfter, show, setShow, productPageLoading, setProductPageLoading, isLoggedIn, deleteUser, user, token, verified, setVerified
      }}
    >
      {children}
    </VariableContext.Provider>
  )
}
