import React, { Component, useState } from "react";
import {
  Button,
  Fade,
  Modal,
  Box,
  Backdrop,
  AppBar,
  Tab,
  Tabs,
  useMediaQuery,
} from "@mui/material";
import Login from "./Login";
import Signup from "./Signup";
import { makeStyles } from "tss-react/mui";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { CryptoState } from "../../CryptoContext";
import { AiOutlineLogin } from "react-icons/ai";
import { WrapTextRounded } from "@mui/icons-material";
import { hover } from "@testing-library/user-event/dist/hover";

// <------------Styles--------------->
const useStyle = makeStyles()((theme) => {
  return {
    modal: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      [theme.breakpoints.down("md")]: {
        width: "90vw",
      },
      background: 'linear-gradient(180deg, rgba(15,12,41,1) 0%, rgba(87,79,125,1) 100%)',
      boxShadow: 24,
      borderRadius: 12,
      border: "2px solid #d9a8dd ",
      p: 4,
      color: "white",
    },
    google: {
      padding: 24,
      paddingTop: 0,
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      gap: 20,
      fontSize: 20,
    },
  };
});

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const { setAlert } = CryptoState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { classes } = useStyle();
  const googleProvider = new GoogleAuthProvider();
  const breakPoint = useMediaQuery("(max-width: 460px)");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // <-------------Google SignIn----------------->
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Sign Up Successfull. Welcome ${res.user.email}`,
          type: "success",
        });
        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
        return;
      });
  };
  // <-------------return Component render--------------->
  return (
    <div>
      <Button
        variant="contained"
        style={{
          width: WrapTextRounded,
          height: 37,
          padding: 10,
          color: "#fbedfc",
          backgroundColor: "#384a80",
          fontWeight: "bold",
        }}
        onClick={handleOpen}
      >
        {breakPoint ? <AiOutlineLogin size={"2em"} /> : "LOG IN"}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          {/* <BasicTabs /> */}
          <div className={classes.modal}>
            <AppBar
              position="static"
              style={{
                background: "transparent",
                color: "#d9a8dd",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                TabIndicatorProps={{ style: { backgroundColor: "#d9a8dd" } }}
                style={{
                  borderRadius: 5,
                }}
              >
                <Tab style={{ color: "#d9a8dd" }} label="Log In" />
                <Tab style={{ color: "#d9a8dd" }} label="Sign Up" />
              </Tabs>
            </AppBar>

            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup handleClose={handleClose} />}
            <Box className={classes.google}>
              <span>OR</span>
              <GoogleButton
                style={{ width: "100%", outline: "none" }}
                onClick={signInWithGoogle}
              ></GoogleButton>
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
