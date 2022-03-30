import { useEffect, useState, useRef, useCallback } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks";
import { calcBondDetails } from "../store/slices/bond-slice";
import { getPresaleOneDetails } from "../store/slices/presale-one-slice";
import { getPresaleTwoDetails } from "src/store/slices/presale-two-slice";
import { getPresaleThreeDetails } from "src/store/slices/presale-three-slice";
import { getPresaleFourDetails } from "src/store/slices/presale-four-slice";
import { loadAppDetails } from "../store/slices/app-slice";
import { loadAccountDetails, calculateUserBondDetails } from "../store/slices/account-slice";
import { DEFAULT_NETWORK } from "../constants";
import { IReduxState } from "../store/slices/state.interface";
import Loading from "../components/Loader";
import useBonds from "../hooks/bonds";
import ViewBase from "../components/ViewBase";
import { Stake, ChooseBond, Bond, Presale, Dashboard, PhaserGame, MessageSign } from "../views";
import "./style.scss";
import Landing from "src/views/Landing";
import classNames from "classnames";
import { checkKrakenSlayed } from "../helpers/kraken-slayed";

function App() {
    const dispatch = useDispatch();

    const { connect, provider, hasCachedProvider, providerChainID, chainID, connected } = useWeb3Context();
    const address = useAddress();

    const phaserWrapper = useRef<any>(null);

    const [walletChecked, setWalletChecked] = useState(false);

    const [dashboardActive, setDashboardActive] = useState(false); // Closed by default, opened ingame as needed.
    const [stakingActive, setStakingActive] = useState(false); // Closed by default, opened ingame as needed.
    const [bondingActive, setBondingActive] = useState(false); // Closed by default, opened ingame as needed.
    const [presaleActive, setPresaleActive] = useState(false); // Closed by default, opened ingame as needed.
    const [messageActive, setMessageActive] = useState(false); // Closed by default, opened ingame as needed.
    const [socialActive, setSocialActive] = useState(true); // Social open by default, open during menu. Closed during games.
    const [connectButtonActive, setConnectButtonActive] = useState(true); // Connect button open by default, open during menu. Closed during games.

    const [exitButtonOpen, setExitButtonOpen] = useState(true);

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAppLoaded = useSelector<IReduxState, boolean>(state => !Boolean(state.app.marketPrice));

    const { bonds } = useBonds();

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
            bonds.map(bond => {
                dispatch(calculateUserBondDetails({ address, bond, provider, networkID: chainID }));
            });
        }

        if (whichDetails === "presale" && address && connected) {
            dispatch(getPresaleOneDetails({ provider, networkID: chainID, address }));
            dispatch(getPresaleTwoDetails({ provider, networkID: chainID, address }));
            dispatch(getPresaleThreeDetails({ provider, networkID: chainID, address }));
            dispatch(getPresaleFourDetails({ provider, networkID: chainID, address }));

            checkKrakenSlayed(provider, address);
        }
    }

    const loadApp = useCallback(
        loadProvider => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
            bonds.map(bond => {
                dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
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

    /**
     * @TODO Fix URL for prod.
     *
     * phaserMessageHandler interprets input from the Phaser game canvas to control the UI.
     **/
    const phaserMessageHandler = (e: any) => {
        if (e.origin.startsWith(window.location.origin)) {
            let msg = e.data.toString();
            if (msg.startsWith("closeDashboard")) {
                setDashboardActive(false);
            } else if (msg.startsWith("closeStaking")) {
                setStakingActive(false);
            } else if (msg.startsWith("closeBonding")) {
                setBondingActive(false);
            } else if (msg.startsWith("closePresale")) {
                setPresaleActive(false);
            } else if (msg.startsWith("closeSocial")) {
                setSocialActive(false);
            } else if (msg.startsWith("closeMessage")) {
                setMessageActive(false);
            } else if (msg.startsWith("closeConnectButton")) {
                setConnectButtonActive(false);
            } else if (msg.startsWith("openDashboard")) {
                setDashboardActive(true);
            } else if (msg.startsWith("openStaking")) {
                setStakingActive(true);
            } else if (msg.startsWith("openBonding")) {
                setBondingActive(true);
            } else if (msg.startsWith("openPresale")) {
                setPresaleActive(true);
            } else if (msg.startsWith("openSocial")) {
                setSocialActive(true);
            } else if (msg.startsWith("openMessage")) {
                setMessageActive(true);
            } else if (msg.startsWith("openConnectButton")) {
                setConnectButtonActive(true);
            } else if (msg.startsWith("closeExitButton")) {
                setExitButtonOpen(false);
            } else if (msg.startsWith("openExitButton")) {
                setExitButtonOpen(true);
            } else if (msg.startsWith("hideUI")) {
                setPresaleActive(false);
                setDashboardActive(false);
                setStakingActive(false);
                setBondingActive(false);
                setMessageActive(false);
                setSocialActive(false);
                setConnectButtonActive(false);
            } else if (msg.startsWith("showUI")) {
                setSocialActive(true);
                setConnectButtonActive(true);
            }
        } else {
            return;
        }
    };

    const setGameActive = (bool: boolean) => {
        bool ? (phaserWrapper.current!.className = "active") : (phaserWrapper.current!.className = "");
    };

    useEffect(() => {
        window.addEventListener("message", phaserMessageHandler, false);
    }, []);

    useEffect(() => {
        if (hasCachedProvider()) {
            connect().then(() => {
                setWalletChecked(true);
            });
        } else {
            setWalletChecked(true);
        }
    }, []);

    /*
     * @TODO Re-add loading of userBonds once bonds are live
     */

    useEffect(() => {
        if (walletChecked) {
            loadDetails("app");
            loadDetails("account");
            //loadDetails("userBonds");
            loadDetails("presale");
        }
    }, [walletChecked]);

    useEffect(() => {
        if (connected) {
            loadDetails("app");
            loadDetails("account");
            //loadDetails("userBonds");
            loadDetails("presale");
        }
    }, [connected]);

    return (
        <>
            {isAppLoading && <Loading />}
            <div id="phaser-wrapper" ref={phaserWrapper}>
                <PhaserGame setGameActive={setGameActive} exitButtonOpen={exitButtonOpen} />
            </div>
            <ViewBase socialIsOpen={socialActive} connectButtonIsOpen={connectButtonActive}>
                <div className={classNames("psi-interface", "psi-dashboard")}>
                    <Dashboard active={dashboardActive} />
                </div>
                <div className={classNames("psi-interface", "psi-staking")}>
                    <Stake active={stakingActive} />
                </div>
                <div className={classNames("psi-interface", "psi-presale")}>
                    <Presale active={presaleActive} />
                </div>
                <div className={classNames("psi-interface", "psi-message")}>
                    <MessageSign active={messageActive} />
                </div>
                <Switch>
                    <div className={classNames("psi-interface", "psi-bonding")}>
                        {bonds.map(bond => {
                            return (
                                <Route exact key={bond.name} path={`/mints/${bond.name}`}>
                                    <Bond bond={bond} />
                                </Route>
                            );
                        })}
                        <ChooseBond active={bondingActive} />
                    </div>
                </Switch>
            </ViewBase>
        </>
    );
}

export default App;
