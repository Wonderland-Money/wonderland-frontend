import React, { useRef, useState, useEffect, Component } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { IonPhaser } from '@ion-phaser/react'
import ReactDOM from "react-dom";
import Phaser from 'phaser';
import config from './config';
import "./style.scss"
// Scenes
import InstructionsSplash from './scenes/InstructionsSplash'
import GameScene from './scenes/Game';
import ForgeScene from './scenes/ForgeScene'
import HarborScene from './scenes/HarborScene'
import PlayerWinScene from './scenes/PlayerWinScene'
// Interfaces
import MainMenu from './scenes/menus/Menu';
import FreezeScreen from './scenes/menus/FreezeScreen'
import PauseMenu from './scenes/menus/PauseMenu'
import GameUI from './scenes/menus/IngameUI'
import PlayerWinMenu from './scenes/menus/PlayerWinMenu'
import DeathScreen from './scenes/menus/DeathScreen'

import classNames from "classnames"


export default function App (props) {
  // const testRef = useRef(null)
  const [active, setActive] = useState(false)

  const test = () => {
    setActive(true)
  }

  // Add event listener
  const handler = (e) => {
    if (e.origin.startsWith('http://app.trident.localhost:3000') && e.data.toString().startsWith('message')) {
      test()
    } else {
        return;
    }
  }

  useEffect(() => {
    window.addEventListener("message", handler, false)
  }, [])

  const gameRef = useRef(null)
  // Call `setInitialize` when you want to initialize your game! :)
  const [initialize, setInitialize] = useState(false)
  
  const destroy = () => {
    if (gameRef.current) {
      gameRef.current.destroy()
    }
    setInitialize(false)
  }

  return (
    <>
      <IonPhaser ref={gameRef} game={Object.assign(config, {
          scene: [MainMenu, InstructionsSplash, GameScene, HarborScene, ForgeScene, PauseMenu, FreezeScreen, GameUI, DeathScreen, PlayerWinMenu, PlayerWinScene],
        })} initialize={initialize} />
      <a id="initialize-button" 
        className={classNames({"disabled": initialize})} 
        onClick={
          () => {
            if(!initialize)
              setInitialize(true)
            }
        }>Initialize</a>
      {/*<button onClick={destroy}>Destroy</button>()*/}
      <div style={active ? {"display": "block", "zIndex": "100", "position": "absolute", "left": "40%", "top": "50%"} : {"display": "none"}}>
        <h1>I've triggered a state change from within Phaser</h1>
        <a onClick={() => {
          setActive(false)
          window.parent.postMessage('closeMenu', 'http://app.trident.localhost:3000')
        }}>EXIT</a>
      </div>
    </>
  )
}
