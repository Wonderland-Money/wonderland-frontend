import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Hidden, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useAddress, useWeb3Context } from "../hooks";

import { calcBondDetails } from "../store/slices/bond-slice";
import { loadAppDetails } from "../store/slices/app-slice";
import { loadAccountDetails, calculateUserBondDetails } from "../store/slices/account-slice";

import { Stake, ChooseBond, Bond } from "../views";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Header";
import NavDrawer from "../components/Sidebar/NavDrawer";
import NotFound from "../views/404/NotFound";
import Dashboard from "../views/Dashboard";

import { light as lightTheme } from "../themes";

import { BONDS } from "../constants";
import "./style.scss";
import { IReduxState } from "../store/slices/state.interface";
import Loading from "../components/Loader";

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 960px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
  const address = useAddress();

  const [walletChecked, setWalletChecked] = useState(false);

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const isAppLoaded = useSelector<IReduxState>(state => typeof state.app.marketPrice != "undefined");

  async function loadDetails(whichDetails: string) {
    let loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
      if (isAppLoaded) return;

      loadApp(loadProvider);
    }

    if (whichDetails === "userBonds" && address && connected) {
      Object.values(BONDS).map(async bond => {
        await dispatch(calculateUserBondDetails({ address, bond, provider, networkID: chainID }));
      });
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
      Object.values(BONDS).map(async bond => {
        await dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
      });
    },
    [connected],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
    },
    [connected],
  );

  useEffect(() => {
    if (hasCachedProvider()) {
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      setWalletChecked(true);
    }
  }, []);

  useEffect(() => {
    if (walletChecked) {
      loadDetails("app");
      loadDetails("account");
      loadDetails("userBonds");
    }
  }, [walletChecked]);

  useEffect(() => {
    if (connected) {
      loadDetails("app");
      loadDetails("account");
      loadDetails("userBonds");
    }
  }, [connected]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  if (isAppLoading) return <Loading />;

  return (
    <ThemeProvider theme={lightTheme}>
      <div className="root-background" />
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"}`}>
        <TopBar drawe={!isSmallerScreen} handleDrawerToggle={handleDrawerToggle} />
        <nav className={classes.drawer}>
          <Hidden mdUp>
            <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          </Hidden>
          <Hidden smDown>
            <Sidebar />
          </Hidden>
        </nav>

        <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`}>
          <Switch>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>

            <Route exact path="/">
              <Redirect to="/stake" />
            </Route>

            <Route path="/stake">
              <Stake />
            </Route>

            <Route path="/mints">
              {Object.values(BONDS).map(bond => {
                return (
                  <Route exact key={bond} path={`/mints/${bond}`}>
                    <Bond bond={bond} />
                  </Route>
                );
              })}
              <ChooseBond />
            </Route>

            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
