import Phaser from "phaser";
import Button from "../../components/Button";
import CustomButton from "../../components/CustomButton";
import WideButton from "../../components/WideButton";

import variables from "../../managers/Variables";

class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: "PauseMenu" });
    }

    preload() {}

    create(data) {
        this.toScene = data;
        this.scene.pause(data);
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        this.elem = document.documentElement;

        let pauseBg = this.add.rectangle(0, 0, width, height, 0x203055, 0.5);
        pauseBg.setOrigin(0, 0);

        const SPACING_HEIGHT = 16;
        const SPACING_WIDTH = 110;

        // Main Buttons
        let playButton = new WideButton(this, width / 2, height / 2 - 64 - SPACING_HEIGHT, "Resume", () => {
            this.unpauseGame();
        });

        let menuButton = new WideButton(this, width / 2, height / 2 + 64 + SPACING_HEIGHT, "Menu", () => {
            this.scene.manager.getScene(this.toScene).nukeItAll();
            this.scene.manager.stop(this.toScene);
            this.scene.manager.start("MainMenu");
            this.scene.manager.bringToTop("MainMenu");
            this.resetScenes();
            this.scene.stop();
        });

        let restartButton = new WideButton(
            this,
            width / 2,
            height / 2,
            "Retry",
            () => {
                this.scene.manager.getScene(this.toScene).nukeItAll();
                this.scene.manager.getScene(this.toScene).scene.restart();
                this.scene.stop();
            },
            false,
        );

        // Settings buttons
        let musicToggleButton = new CustomButton(
            this,
            width - 96,
            height - 48,
            "",
            () => {
                this.scene.manager.getScene(this.toScene).toggleMusic();
            },
            "music-button",
            true,
            variables.preferences.musicEnabled,
            3,
        );

        let soundToggleButton = new CustomButton(
            this,
            width - 48,
            height - 48,
            "",
            () => {
                this.scene.manager.getScene(this.toScene).toggleSound();
            },
            "sound-button",
            true,
            variables.preferences.soundEnabled,
            3,
        );

        this.fullscreenToggleButton = new CustomButton(
            this,
            width - 144,
            height - 48,
            "",
            () => {
                this.checkFullscreenState();
                !variables.gameState.fullscreenEnabled ? this.openFullscreen() : this.closeFullscreen();
            },
            "fullscreen-button",
            true,
            variables.gameState.fullscreenEnabled,
            3,
        );

        this.input.keyboard.on("keydown-ESC", () => {
            this.unpauseGame();
        });

        this.input.keyboard.on("keydown-P", () => {
            this.unpauseGame();
        });

        /* Standard syntax */
        document.addEventListener("fullscreenchange", this.checkFullscreenState);

        /* Firefox */
        document.addEventListener("mozfullscreenchange", this.checkFullscreenState);

        /* Chrome, Safari and Opera */
        document.addEventListener("webkitfullscreenchange", this.checkFullscreenState);

        /* IE / Edge */
        document.addEventListener("msfullscreenchange", this.checkFullscreenState);

        window.addEventListener("message", this.messageHandler, false);
    }

    messageHandler = e => {
        if (e.origin.startsWith(variables.gameUrl) && e.data.toString().startsWith("shutdownInit")) {
            console.log("TESINTG: Dead");
            this.dead = true;
            window.removeEventListener("message", this.messageHandler);
        } else return;
    }

    checkFullscreenState = () => {
        if (this.dead) return;
        window.innerHeight == screen.height ? (variables.gameState.fullscreenEnabled = true) : (variables.gameState.fullscreenEnabled = false);
        this.fullscreenToggleButton.resetState(variables.gameState.fullscreenEnabled);
    };

    openFullscreen() {
        if (this.elem.requestFullscreen) {
            this.elem.requestFullscreen();
        } else if (this.elem.webkitRequestFullscreen) {
            /* Safari */
            this.elem.webkitRequestFullscreen();
        } else if (this.elem.msRequestFullscreen) {
            /* IE11 */
            this.elem.msRequestFullscreen();
        }
        variables.gameState.fullscreenEnabled = true;
        return true;
    }

    closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE11 */
            document.msExitFullscreen();
        }
        variables.gameState.fullscreenEnabled = false;
        return true;
    }

    resetScenes() {
        this.scene.manager.sendToBack("IngameUI");
        this.scene.manager.stop("IngameUI");
        this.scene.manager.sendToBack("InstructionsSplash");
        this.scene.manager.stop("InstructionsSplash");
        this.scene.manager.sendToBack("GameScene");
        this.scene.manager.stop("GameScene");
        this.scene.manager.sendToBack("HarborScene");
        this.scene.manager.stop("HarborScene");
        this.scene.manager.sendToBack("ForgeScene");
        this.scene.manager.stop("ForgeScene");
    }

    unpauseGame() {
        variables.setPreferences();
        /* Standard syntax */
        document.removeEventListener("fullscreenchange", this.checkFullscreenState);
        /* Firefox */
        document.removeEventListener("mozfullscreenchange", this.checkFullscreenState);
        /* Chrome, Safari and Opera */
        document.removeEventListener("webkitfullscreenchange", this.checkFullscreenState);
        /* IE / Edge */
        document.removeEventListener("msfullscreenchange", this.checkFullscreenState);
        this.scene.stop();
        this.scene.resume(this.toScene);
    }

    update(time, delta) {}
}

export default PauseMenu;
