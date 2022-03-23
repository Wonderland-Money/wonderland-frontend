import Phaser from "phaser";
import Button from "../../components/Button";
import CustomButton from "../../components/CustomButton";

import variables from "../../managers/Variables";

class SettingsMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SettingsMenu" });
    }

    preload() {}

    create(data) {
        this.toScene = data;
        this.scene.pause(data);
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        this.elem = document.documentElement;

        let pauseBg = this.add.rectangle(0, 0, width, height, 0x000000, 1);
        pauseBg.setOrigin(0, 0);

        const SPACING_HEIGHT = 58;
        const SPACING_WIDTH = 110;

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

        let fullscreenToggleButton = new CustomButton(
            this,
            width - 144,
            height - 48,
            "",
            () => {
                !variables.gameState.fullscreenEnabled ? this.openFullscreen() : this.closeFullscreen();
            },
            "fullscreen-button",
            true,
            variables.preferences.soundEnabled,
            3,
        );

        this.input.keyboard.on("keydown-ESC", () => {
            if (variables.gameState.fullscreenEnabled) variables.gameState.fullscreenEnabled = false;
            this.unpauseGame();
        });
    }

    openFullscreen() {
        try {
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
        } catch (e) {
            variables.gameState.fullscreenEnabled = true;
        }
    }

    closeFullscreen() {
        try {
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
        } catch (e) {
            variables.gameState.fullscreenEnabled = false;
        }
    }

    resetScenes() {
        this.scene.manager.sendToBack("InstructionsSplash");
        this.scene.manager.stop("InstructionsSplash");
        this.scene.manager.sendToBack("IngameUI");
        this.scene.manager.stop("IngameUI");
        this.scene.manager.sendToBack("GameScene");
        this.scene.manager.stop("GameScene");
        this.scene.manager.sendToBack("HarborScene");
        this.scene.manager.stop("HarborScene");
        this.scene.manager.sendToBack("ForgeScene");
        this.scene.manager.stop("ForgeScene");
    }

    unpauseGame() {
        this.scene.stop();
        this.scene.resume(this.toScene);
    }

    update(time, delta) {}
}

export default SettingsMenu;
