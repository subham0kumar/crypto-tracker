import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import "./App.css";
import Homepage from "./Pages/Homepage";
import CoinPage from "./Pages/CoinPage";
import { makeStyles } from "tss-react/mui";
import Alert from "./Components/Alert";
function App() {
  const useStyles = makeStyles()((theme) => {
    return {
      App: {
        backgroundColor: "#14161a",
        color: "white",
        minHeight: "100vh",
      },
    };
  });

  const { classes } = useStyles();

  return (
    <div className={classes.App}>
      <Header />
      <Routes>
        <Route path="/" Component={Homepage} exact />
        <Route path="/coins/:id" Component={CoinPage} />
      </Routes>
      <Alert />
    </div>
  );
}

export default App;
