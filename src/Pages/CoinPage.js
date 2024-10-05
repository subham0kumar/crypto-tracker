import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { SingleCoin } from "../config/api";
import { makeStyles } from "tss-react/mui";
import CoinInfo from "../Components/CoinInfo";
import axios from "axios";
import { Button, LinearProgress, Typography } from "@mui/material";
import { numberWithCommas } from "../Components/Banner/Carousel";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol, user, watchlist, setAlert } = CryptoState();

  const fetchCoins = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const useStyles = makeStyles()((theme) => {
    return {
      container: {
        display: "flex",
        [theme.breakpoints.down("md")]: {
          flexDirection: "column",
          alignItems: "center",
        },
      },

      sidebar: {
        width: "30%",
        [theme.breakpoints.down("md")]: {
          width: "100%",
          paddingLeft: 20,
          paddingRight: 20,
          borderBottom: "2px solid grey",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 25,
        paddingLeft: 20,
        paddingRight: 20,
        borderRight: "2px solid grey",
      },
      heading: {
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "monospace",
      },
      description: {
        width: "90%",
        fontFamily: "monospace",
        padding: 25,
        paddingBottom: 15,
        paddingTop: 0,
        textAlign: "justify",
      },
    };
  });

  const inWatchlist = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin?.id] : [coin?.id],
      });

      setAlert({
        open: true,
        message: `${coin?.name} added to the Watchlist`,
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

  const removeFromWatchlist = async () => {
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

  const { classes } = useStyles();

  if (!coin) return <LinearProgress style={{ backgroundColor: "#d9a8dd" }} />;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          height="200"
          style={{ marginBottom: 20 }}
        />
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          {coin?.description.en.split(". ")[0]}.
        </Typography>
        <div className={classes.marketData}>
          {/*------------------------------ Rank Span ------------------------------------------ */}

          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Rank:{" "}
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "monospace" }}>
              {coin?.market_cap_rank}
            </Typography>
          </span>

          {/*------------------------------ Current Price Span -------------------------------------- */}
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current price:{" "}
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "monospace" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </span>

          {/*------------------------------ Market Cap Span ---------------------------------- */}
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Market Cap:{" "}
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" style={{ fontFamily: "monospace" }}>
              {symbol}{" "}
              {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  ?.slice(0, -6)
              )}
              M
            </Typography>
          </span>

          {/*----------------------- Add to Watchlist button --------------------------------- */}
          {user && (
            <Button
              variant="outlined"
              style={{
                margin: 10,
                width: "100%",
                height: 40,
                color: inWatchlist ? "white" : "black",
                backgroundColor: inWatchlist ? "#fa007d" : "#d9a8dd",
                fontWeight: "bolder",
              }}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            >
              {" "}
              {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>

      <CoinInfo coin={coin} />
      {/* chart */}
    </div>
  );
};

export default CoinPage;
