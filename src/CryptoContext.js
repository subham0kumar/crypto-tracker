import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "./config/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

const crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [watchlist, setWatchlist] = useState([]);

  // <------------------ fetchCoins'-list Function ------------------->

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (ex) {
      console.log("error.status:", ex);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);

      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setWatchlist(coin.data().coins);
        } else {
          console.log("No items in the watchlist!");
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  // <---------------------- Auth UseEffect -------------------->

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

  // <-------------- Currency-Symbol UseEffect ------------------->

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  // <---------------------- returing properties -------------------->

  return (
    <crypto.Provider
      value={{
        fetchCoins,
        currency,
        symbol,
        setCurrency,
        coins,
        loading,
        alert,
        setAlert,
        user,
        watchlist,
      }}
    >
      {" "}
      {children}{" "}
    </crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(crypto);
};
