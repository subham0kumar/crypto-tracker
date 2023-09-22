import {
  AppBar,
  Container,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
// import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { CryptoState } from "../CryptoContext";
import AuthModal from "./Authentication/AuthModal";
import UserSidebar from "./Authentication/UserSidebar";
import { WrapText } from "@mui/icons-material";

const Header = () => {
  
  const useStyles = makeStyles()((theme) => {
    return {
      title: {
        flex: 1,
        color: "gold",
        cursor: "pointer",
        fontFamily: "monospace",
        fontWeight: "bold",
      },
    };
  });

  const breakPoint = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();
  const { classes } = useStyles();
  
  const {currency, setCurrency, user} = CryptoState();
  // console.log(currency)
  const darkTheme = createTheme({
    palette: {
        mode: "dark",
    }, 
  });
  
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" onClick={() => navigate("/")} className={classes.title}>
              {breakPoint? "C_T" : "Crypto-Tracker"}
            </Typography>
            <Select
              variant="outlined"
              style={{
                marginRight: 15,
                width: WrapText,
                height: 40,
              }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"INR"}>{breakPoint? "₹":"INR"}</MenuItem>
              <MenuItem value={"USD"}>{breakPoint? "$":"USD"}</MenuItem>
            </Select>
            {user? <UserSidebar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
