import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks";
import { calcBondDetails, calcBondV2Details } from "../store/slices/bond-slice";
import { loadAppDetails } from "../store/slices/app-slice";
import { loadAccountDetails, calculateUserBondDetails, calculateUserTokenDetails, calculateUserRewardDetails } from "../store/slices/account-slice";
import { IReduxState } from "../store/slices/state.interface";
import Loading from "../components/Loader";
import useBonds from "../hooks/bonds";
import ViewBase from "../components/ViewBase";
import { Stake, ChooseBond, Bond, Dashboard, NotFound, Calculator, Bridge, Fund, Blog, Redemption, Farm } from "../views";
import "./style.scss";
import useTokens from "../hooks/tokens";
import { Networks } from "../constants/blockchain";
import { calcWrapPrice } from "../store/slices/wrap-slice";

function App() {
    const dispatch = useDispatch();

    const { connect, provider, hasCachedProvider, chainID, connected, checkWrongNetwork } = useWeb3Context();
    const address = useAddress();

    const [walletChecked, setWalletChecked] = useState(false);

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAppLoaded = useSelector<IReduxState, boolean>(state => !Boolean(state.app.marketPrice));

    const { bonds } = useBonds();

    const { tokens } = useTokens();

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

        // if (whichDetails === "userBonds" && address && connected) {
        //     bonds.map(bond => {
        //         if (bond.getAvailability(chainID)) {
        //             dispatch(calculateUserBondDetails({ address, bond, provider, networkID: chainID }));
        //         }
        //     });
        // }

        // if (whichDetails === "userTokens" && address && connected && chainID === Networks.AVAX) {
        //     tokens.map(token => {
        //         dispatch(calculateUserTokenDetails({ address, token, provider, networkID: chainID }));
        //     });
        // }
    }

    const loadApp = useCallback(
        loadProvider => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider, checkWrongNetwork }));
            // bonds.map(bond => {
            //     if (bond.getAvailability(chainID)) {
            //         if (bond.v2Bond) {
            //             dispatch(calcBondV2Details({ bond, value: null, provider: loadProvider, networkID: chainID }));
            //         } else {
            //             dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
            //         }
            //     }
            // });
            if (chainID === Networks.AVAX) {
                dispatch(calcWrapPrice({ networkID: chainID, provider: loadProvider }));
                // tokens.map(token => {
                //     dispatch(calculateUserTokenDetails({ address: "", token, provider, networkID: chainID }));
                // });
                dispatch(calculateUserRewardDetails({ networkID: chainID, address, provider: loadProvider }));
            }
        },
        [connected, chainID],
    );

    const loadAccount = useCallback(
        loadProvider => {
            dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
        },
        [connected, chainID],
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
            // loadDetails("userBonds");
            // loadDetails("userTokens");
        }
    }, [walletChecked, chainID]);

    useEffect(() => {
        if (connected) {
            loadDetails("app");
            loadDetails("account");
            // loadDetails("userBonds");
            // loadDetails("userTokens");
        }
    }, [connected, chainID]);

    if (isAppLoading) return <Loading />;

    return (
        <ViewBase>
            <Switch>
                <Route exact path="/dashboard">
                    <Dashboard />
                </Route>

                <Route exact path="/">
                    <Redirect to="/bridge" />
                </Route>

                <Route path="/stake">
                    <Stake />
                </Route>

                <Route path="/mints">
                    {bonds.map(bond => {
                        if (bond.getAvailability(chainID)) {
                            return (
                                <Route exact key={bond.name} path={`/mints/${bond.name}`}>
                                    <Bond bond={bond} />
                                </Route>
                            );
                        }
                    })}
                    <ChooseBond />
                </Route>

                <Route path="/calculator">
                    <Calculator />
                </Route>

                <Route path="/farm">
                    <Farm />
                </Route>

                <Route path="/bridge">
                    <Bridge />
                </Route>

                <Route exact path="/fund">
                    <Fund />
                </Route>

                <Route path="/blog">
                    <Blog />
                </Route>

                <Route path="/redemption">
                    <Redemption />
                </Route>

                <Route component={NotFound} />
            </Switch>
        </ViewBase>
    );
}

export default App;
