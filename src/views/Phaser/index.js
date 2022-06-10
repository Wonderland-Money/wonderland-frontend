import React, { useRef, useState, useEffect } from "react";

import { IonPhaser } from "@ion-phaser/react";
import config from "./config";
import "./style.scss";
import { Link, SvgIcon } from "@material-ui/core";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
// Scenes
import InstructionsSplash from "./scenes/pve/InstructionsSplash";

import KrakenScene from "./scenes/pve/KrakenScene";
import ForgeScene from "./scenes/ForgeScene";
import HarborScene from "./scenes/HarborScene";
import AppraiserScene from "./scenes/AppraiserScene";
import OasisScene from "./scenes/OasisScene";

import PlayerWinScene from "./scenes/pve/PlayerWinScene";
// Interfaces
import MainMenu from "./scenes/menus/MainMenu";
import FreezeScreen from "./scenes/menus/FreezeScreen";
import PauseMenu from "./scenes/menus/PauseMenu";
import SettingsMenu from "./scenes/menus/SettingsMenu";
import PlayerMenu from "./scenes/menus/PlayerMenu";
import GameUI from "./scenes/menus/IngameUI";
import PlayerWinMenu from "./scenes/menus/PlayerWinMenu";
import DeathScreen from "./scenes/menus/DeathScreen";

import classNames from "classnames";
import { useWeb3Context, useAddress } from "../../hooks";
import variables from "./managers/Variables";

import { DEFAULT_NETWORK, checkValidNetwork } from "../../constants";

export default function App(props) {
    const { connect, connected, web3, providerChainID, checkWrongNetwork } = useWeb3Context();
    const [isConnected, setConnected] = useState(connected);

    const account = useAddress();

    const gameRef = useRef(null);

    // Call `setInitialize` when you want to initialize your game! :)
    const [initialize, setInitialize] = useState(false);

    const shutdownHandler = e => {
        if (e.origin.startsWith(variables.gameUrl) && e.data.toString().startsWith("shutdownFinal")) {
            if (gameRef.current) {
                gameRef.current.destroy();
            }
            window.parent.postMessage("hideUI", variables.gameUrl);
            window.parent.postMessage("showUI", variables.gameUrl);
            setInitialize(false);
            props.setGameActive(false);
            window.removeEventListener("message", shutdownHandler, variables.gameUrl);
        } else return;
    };

    const startGame = () => {
        window.parent.postMessage("hideUI", variables.gameUrl);
        variables.loadFromPreferences();
        setInitialize(true);
    };

    const destroy = () => {
        window.addEventListener("message", shutdownHandler, false);
        window.postMessage("shutdownInit", variables.gameUrl);
    };

    let buttonText = "Connect Wallet";
    let clickFunc = connect;

    if (isConnected) {
        buttonText = "Enter Atlantis";
        clickFunc = () => {
            variables.gameState.currentAccount = account;
            console.log("Connected with: " + variables.gameState.currentAccount);
            props.setGameActive(true);
            startGame();
        };
    }

    if (isConnected && !checkValidNetwork(providerChainID)) {
        buttonText = "Connect Wallet";
        clickFunc = () => {
            checkWrongNetwork();
        };
    }

    useEffect(() => {
        setConnected(connected);
    }, [web3, connected]);

    return (
        <>
            <IonPhaser
                ref={gameRef}
                game={Object.assign(config, {
                    scene: [
                        MainMenu,
                        KrakenScene,
                        HarborScene,
                        ForgeScene,
                        AppraiserScene,
                        OasisScene,
                        PlayerMenu,
                        SettingsMenu,
                        GameUI,
                        InstructionsSplash,
                        PauseMenu,
                        FreezeScreen,
                        DeathScreen,
                        PlayerWinMenu,
                        PlayerWinScene,
                    ],
                })}
                initialize={initialize}
            />
            <a id="initialize-button" className={classNames("button", { disabled: initialize })} onClick={clickFunc}>
                {buttonText}
            </a>
            <a className={classNames("button", "exit-button", "window-btn", { disabled: !initialize || !props.exitButtonOpen })} onClick={destroy}>
                <SvgIcon viewBox={"0 0 18 18"} color="primary" component={XIcon} />
            </a>
        </>
    );
}
