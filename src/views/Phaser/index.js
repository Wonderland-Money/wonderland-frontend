import React, { useRef, useState, useEffect, Component } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { IonPhaser } from "@ion-phaser/react";
import ReactDOM from "react-dom";
import Phaser from "phaser";
import config from "./config";
import "./style.scss";
// Scenes
import InstructionsSplash from "./scenes/InstructionsSplash";
import GameScene from "./scenes/Game";
import ForgeScene from "./scenes/ForgeScene";
import HarborScene from "./scenes/HarborScene";
import PlayerWinScene from "./scenes/PlayerWinScene";
// Interfaces
import MainMenu from "./scenes/menus/Menu";
import FreezeScreen from "./scenes/menus/FreezeScreen";
import PauseMenu from "./scenes/menus/PauseMenu";
import GameUI from "./scenes/menus/IngameUI";
import PlayerWinMenu from "./scenes/menus/PlayerWinMenu";
import DeathScreen from "./scenes/menus/DeathScreen";

import classNames from "classnames";
import { useWeb3Context } from "../../hooks";
import variables from "./managers/Variables";

export default function App(props) {
    const { connect } = useWeb3Context();

    const gameRef = useRef(null);
    // Call `setInitialize` when you want to initialize your game! :)
    const [initialize, setInitialize] = useState(false);

    const startGame = () => {
        window.parent.postMessage("gameActive", variables.gameUrl);
        setInitialize(true);
    };

    const handleClick = () => {
        window.parent.postMessage("openBonding", variables.gameUrl);
    };

    const destroy = () => {
        if (gameRef.current) {
            gameRef.current.destroy();
        }
        window.parent.postMessage("showUI", variables.gameUrl);
        setInitialize(false);
    };

    return (
        <>
            <IonPhaser
                ref={gameRef}
                game={Object.assign(config, {
                    scene: [MainMenu, InstructionsSplash, GameScene, HarborScene, ForgeScene, PauseMenu, FreezeScreen, GameUI, DeathScreen, PlayerWinMenu, PlayerWinScene],
                })}
                initialize={initialize}
            />
            <a
                id="initialize-button"
                className={classNames("button", { disabled: initialize })}
                onClick={() => {
                    if (!props.connected) {
                        connect();
                    }
                    if (!initialize && props.connected) {
                        console.log("Trident 2D Starting up...");
                        startGame();
                    }
                }}
            >
                {props.connected ? "Enter Atlantis" : "Connect"}
            </a>
            <a className={classNames("button", "exit-button", { disabled: !initialize || !props.exitButtonOpen })} onClick={destroy}>
                Exit
            </a>
        </>
    );
}
