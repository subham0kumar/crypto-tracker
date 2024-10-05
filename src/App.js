import { Route, Routes } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import "./App.css";
import Alert from "./Components/Alert";
import Header from "./Components/Header";
import CoinPage from "./Pages/CoinPage";
import Homepage from "./Pages/Homepage";
function App() {
  const useStyles = makeStyles()((theme) => {
    return {
      App: {
        // background: '#503a65',
        background: 'linear-gradient(180deg, rgba(15,12,41,1) 0%, rgba(87,79,125,1) 100%)',
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
