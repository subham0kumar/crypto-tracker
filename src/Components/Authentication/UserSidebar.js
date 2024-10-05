import React, { Fragment, useState } from "react";
import { Avatar, Button, Drawer } from "@mui/material";
import { CryptoState } from "../../CryptoContext";
import { makeStyles } from "tss-react/mui";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { numberWithCommas } from "../Banner/Carousel";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";

const useStyle = makeStyles()((theme) => {
  return {
    container: {
      [theme.breakpoints.down("md")]: {
        width: "90vw",
      },
      width: 350,
      background: 'linear-gradient(180deg, rgba(87,79,125,1) 0%, rgba(15,12,41,1) 100%)',
      padding: 25,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "monospace",
    },
    profile: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      height: "92%",
    },
    picture: {
      width: 200,
      height: 200,
      cursor: "pointer",
      backgroundColor: "#d9a8dd",
      objectFit: "contain",
    },
    logout: {
      height: "8%",
      width: "100%",
      color: "white",
      backgroundColor: "#384a80",
      marginTop: 20,
      fontWeight: "bolder",
    },
    watchlist: {
      [theme.breakpoints.down("md")]: {
        width: "80vw",
      },
      flex: 1,
      width: "100%",
      backgroundColor: "#384a80",
      borderRadius: 10,
      padding: 15,
      paddingTop: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      overflowY: "scroll",
    },
    coin: {
      padding: 10,
      borderRadius: 5,
      color: "white",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#5d6b94",
      boxShadow: "0 0 3px black",
    },
  };
});

export default function UserSidebar() {
  const [state, setState] = useState({
    right: false,
  });

  const { classes } = useStyle();

  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  // <---------------removeFromWatchlist function-------------->
  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch !== coin?.id),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${coin?.name} removed to the Watchlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        messaage: error.message,
        type: "error",
      });
    }
  };
  // <------------------logout function--------------->
  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      message: "Logout Successfull !",
    });

    toggleDrawer();
  };
  // <-----------------return component render----------------->
  return (
    <div>
      {["right"].map((anchor) => (
        <Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              cursor: "pointer",
              backgroundColor: "#d9a8dd",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <AiOutlineClose size={'2em'} onClick={toggleDrawer(anchor, false) } />
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className={classes.watchlist}>
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    WatchList
                  </span>
                  {console.log(coins)}
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return (
                        <div className={classes.coin}>
                          <span>{coin.name}</span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </span>
                        </div>
                      );
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </Fragment>
      ))}
    </div>
  );
}
