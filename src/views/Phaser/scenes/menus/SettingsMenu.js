import Phaser from "phaser";
import Button from "../../components/Button";
import CustomIconButton from "../../components/CustomIconButton";
import { createBlackButton, createCloseButton, drawLine, generateGrid, visualizeGrid } from "../../components/Utils/DrawingUtils";

import variables from "../../managers/Variables";

import baseSceneMixin from "../mixins/baseSceneMixin";
import frontendControlsMixin from "../mixins/frontendControlsMixin";

class SettingsMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SettingsMenu" });
    }

    preload() {}

    create(data) {
        this.sceneInit();
        this.hideExitButton();

        this.toScene = data;
        this.scene.pause(data);
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        this.elem = document.documentElement;

        let pauseBg = this.add.rectangle(0, 0, width, height, 0x000000, 1);
        pauseBg.setOrigin(0, 0);
        let backgroundImg = this.add.image(width / 2, height / 2, "menu-bg").setScale(1.1);

        const SPACING_HEIGHT = 58;
        const SPACING_WIDTH = 110;

        let contentContainer = this.add
            .image(width / 2, height / 2, "menu-box")
            .setOrigin(0.5, 0.5)
            .setScale(2);
        let title = this.add
            .text(contentContainer.getTopLeft().x + 48 + 48, contentContainer.getTopCenter().y + 48, "Settings", {
                color: "#ffe7bc",
                fontSize: 32,
                fontFamily: "Cormorant Garamond",
                fontStyle: "bold",
            })
            .setOrigin(0, 0.5);

        /**
         * **************** TOP BAR *******************
         */
        createCloseButton(contentContainer.getTopLeft().x + 48, contentContainer.getTopLeft().y + 48, () => this.unpauseGame(), this);
        drawLine(
            contentContainer.getTopLeft().x + 16,
            contentContainer.getTopLeft().y + 86,
            contentContainer.getTopRight().x - 16,
            contentContainer.getTopRight().y + 86,
            0x333333, 1, 1, this);

        const grid = generateGrid(
            contentContainer.getTopLeft().x,
            contentContainer.getTopLeft().y + 86,
            contentContainer.width * contentContainer.scale,
            (contentContainer.height * contentContainer.scale) - 86,
            3,
            6,
            30
        );

        // Placed on first column, second row. Width stretches to end of column. 
        var test = createBlackButton(
            grid.cols[0]["leftInner"] + grid.xOffset, 
            grid.rows[0]["leftInner"] + grid.yOffset, 
            grid.cols[0]["rightInner"] - grid.cols[0]["leftInner"], "Destroy >:)", () => test.destroy(), this
        );

        

        // Debug grid
        // visualizeGrid(grid, 0x000fff, this);
        
        /**
         * **************** TOGGLE BUTTONS ******************
         */

        let soundToggleButton = new CustomIconButton(
            this,
            grid.cols[2].rightInner + grid.xOffset + 24 - 48,
            ((grid.rows[5]["rightInner"] + grid.rows[5]["leftInner"]) / 2) + grid.yOffset,
            "",
            () => {
                this.scene.manager.getScene(this.toScene).toggleSound();
            },
            "sound-button",
            true,
            variables.preferences.soundEnabled,
            3,
        );

        let musicToggleButton = new CustomIconButton(
            this,
            grid.cols[2].rightInner + grid.xOffset + 24 - (48 * 2),
            ((grid.rows[5]["rightInner"] + grid.rows[5]["leftInner"]) / 2) + grid.yOffset,
            "",
            () => {
                this.scene.manager.getScene(this.toScene).toggleMusic();
            },
            "music-button",
            true,
            variables.preferences.musicEnabled,
            3,
        );

        let fullscreenToggleButton = new CustomIconButton(
            this,
            grid.cols[2].rightInner + grid.xOffset + 24 - (48 * 3),
            ((grid.rows[5]["rightInner"] + grid.rows[5]["leftInner"]) / 2) + grid.yOffset,
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

    unpauseGame() {
        this.resetSceneOrder();
        this.scene.stop();
        this.scene.start(this.toScene);
        this.showExitButton();
    }

    update(time, delta) {}
}

Object.assign(SettingsMenu.prototype, frontendControlsMixin);
Object.assign(SettingsMenu.prototype, baseSceneMixin);

export default SettingsMenu;