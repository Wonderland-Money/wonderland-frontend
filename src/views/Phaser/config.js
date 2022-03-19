import Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth,
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight,
    );
}

const WIDTH = 1280;
const HEIGHT = 720;

export default {
    type: Phaser.AUTO,
    parent: "phaser-wrapper",
    gameTitle: "Trial of the Trident",
    hidePhaser: true,
    hideBanner: true,
    backgroundColor: "#0a0a0a",
    scale: {
        width: WIDTH,
        height: HEIGHT,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
        pixelArt: true,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 850 },
            debug: false, // ENABLE DEBUG
            debugShowVelocity: true,
            debugShowBody: true,
            debugShowStaticBody: true,
        },
    },
    canvasStyle: "z-index: 6; position:absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #000;",
    dom: {
        createContainer: true,
    },
    plugins: {
        scene: [
            {
                key: "rexUI",
                plugin: RexUIPlugin,
                mapping: "rexUI",
            },
        ],
    },
    audio: {
        disableWebAudio: true,
    },
};
