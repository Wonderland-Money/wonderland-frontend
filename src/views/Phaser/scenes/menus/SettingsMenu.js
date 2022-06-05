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

        let contentContainer = this.add.nineslice(40, 40, width - 80, height - 80, "menu-box", 6);

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
        
        this.menuLine = new drawLine(
            contentContainer.getTopLeft().x + 16,
            contentContainer.getTopLeft().y + 86,
            contentContainer.getTopRight().x - 16,
            contentContainer.getTopRight().y + 86,
            0x333333,
            1,
            1,
            this,
        );

        this.grid = generateGrid(
            contentContainer.getTopLeft().x,
            contentContainer.getTopLeft().y + 86,
            contentContainer.width * contentContainer.scale,
            contentContainer.height * contentContainer.scale - 86,
            3,
            6,
            30,
        );

        // Placed on first column, second row. Width stretches to end of column.
        this.createDestroyButton();

        // Debug grid
        // visualizeGrid(grid, 0x000fff, this);

        /**
         * **************** TOGGLE BUTTONS ******************
         */

        this.soundToggleButton = new CustomIconButton(
            this,
            this.grid.cols[2].rightInner + this.grid.xOffset + 24 - 48,
            (this.grid.rows[5]["rightInner"] + this.grid.rows[5]["leftInner"]) / 2 + this.grid.yOffset,
            "",
            () => {
                this.scene.manager.getScene(this.toScene).toggleSound();
            },
            "sound-button",
            true,
            variables.preferences.soundEnabled,
            3,
        );

        this.musicToggleButton = new CustomIconButton(
            this,
            this.grid.cols[2].rightInner + this.grid.xOffset + 24 - 48 * 2,
            (this.grid.rows[5]["rightInner"] + this.grid.rows[5]["leftInner"]) / 2 + this.grid.yOffset,
            "",
            () => {
                this.scene.manager.getScene(this.toScene).toggleMusic();
            },
            "music-button",
            true,
            variables.preferences.musicEnabled,
            3,
        );

        this.fullscreenToggleButton = new CustomIconButton(
            this,
            this.grid.cols[2].rightInner + this.grid.xOffset + 24 - 48 * 3,
            (this.grid.rows[5]["rightInner"] + this.grid.rows[5]["leftInner"]) / 2 + this.grid.yOffset,
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

        // Update UI on window resize
        this.scale.on('resize', function(gameSize, baseSize, displaySize, previousWidth, previousHeight) {
            const widthDiff = previousWidth - gameSize._width;
            const heightDiff = previousHeight - gameSize._height;
            // console.log(widthDiff, heightDiff);
            // Update container
            contentContainer.resize(displaySize._width - 80, displaySize._height - 80);
            // Update Menu Line
            this.menuLine.destroy();
            const vals = [...this.menuLine.prevVals]; // get previous values
            vals[2] -= widthDiff; // Change x2 value of line according to width change on resize
            this.menuLine.draw(...vals);
            // Update grid
            this.grid = generateGrid(
                contentContainer.getTopLeft().x,
                contentContainer.getTopLeft().y + 86,
                contentContainer.width * contentContainer.scale,
                contentContainer.height * contentContainer.scale - 86,
                3,
                6,
                30,
            );
            // Update buttons
            // To update the button, simply set its width using the updated grid
            this.test.setWidth(this.grid.cols[0]["rightInner"] - this.grid.cols[0]["leftInner"]);
            // this.test.changeWidth(widthDiff * -1);
        }, this);
    }

    createDestroyButton() {
        this.test = new createBlackButton(
            this.grid.cols[0]["leftInner"] + this.grid.xOffset,
            this.grid.rows[0]["leftInner"] + this.grid.yOffset,
            this.grid.cols[0]["rightInner"] - this.grid.cols[0]["leftInner"],
            "Visualize Grid",
            () => {
                visualizeGrid(this.grid, Math.random() * 500000, this);
            },
            this,
        );
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
        this.scale.removeAllListeners();
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
