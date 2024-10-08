// import axios from "axios";
import React, { useEffect, useState } from "react";
// import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import {
  Container,
  LinearProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { numberWithCommas } from "./Banner/Carousel";

//---------------------START---------------------------------//

const CoinsTable = () => {
  // const [coins, setCoins] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { currency, symbol, coins, loading, fetchCoins } = CryptoState();
  const navigate = useNavigate();

  const useStyles = makeStyles()((theme) => {
    return {
      row: {
        backgroundColor: "#384a80",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#5d6b94",
        },
        fontFamily: "monospace",
      },
      pagination: {
        "& .MuiPaginationItem-root": {
          color: "#d9a8dd",
        },
      },
    };
  });
  const { classes } = useStyles();

  // const fetchCoins = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.get(CoinList(currency));
  //     setCoins(data);
  //   } catch (ex) {
  //     console.log("error.status:", ex);
  //   }
  //   setLoading(false);
  // };

  console.log(coins);

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#D809C1",
      },
      secondary: {
        main: "#574f7d",
      },
      primaryLight: {
        main: "#ffffff",
      },
    },
  });

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "monospace" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          // sx={{ input: { color: "#e0f0ea" } }}
          label="Search"
          variant="outlined"
          color="primaryLight"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer color="primary">
          {loading ? (
            <LinearProgress style={{ backgroundColor: "#e0f0ea" }} />
          ) : (
            <Table>
              <TableHead style={{ backgroundColor: "#d9a8dd" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                      }}
                      key={head}
                      align={head === "Coin" ? "" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;

                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ display: "flex", gap: 15 }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(row?.current_price?.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14,203,129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row?.price_change_percentage_24h?.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}
                          {numberWithCommas(
                            row?.market_cap?.toString()?.slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Pagination
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          count={(handleSearch()?.length / 10).toFixed(0)}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 459);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
