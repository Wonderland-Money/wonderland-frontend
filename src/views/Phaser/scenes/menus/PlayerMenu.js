import Phaser from "phaser";
import Button from "../../components/Button";
import CustomIconButton from "../../components/CustomIconButton";
import { createCloseButton, drawLine } from "../../components/Utils/DrawingUtils";

import variables from "../../managers/Variables";

import baseSceneMixin from "../mixins/baseSceneMixin";
import frontendControlsMixin from "../mixins/frontendControlsMixin";

class PlayerMenu extends Phaser.Scene {
    constructor() {
        super({ key: "PlayerMenu" });
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
            .text(contentContainer.getTopLeft().x + 48 + 48, contentContainer.getTopCenter().y + 48, "Account", {
                color: "#ffe7bc",
                fontSize: 32,
                fontFamily: "Cormorant Garamond",
                fontStyle: "bold",
            })
            .setOrigin(0, 0.5);

        // let closeButton = new CustomIconButton(this, contentContainer.getTopLeft().x + 32 + 24, contentContainer.getTopLeft().y + 32 + 24, "", () => this.unpauseGame(), "close-button-medium");
        // closeButton.setScale(1);
        createCloseButton(contentContainer.getTopLeft().x + 48, contentContainer.getTopLeft().y + 48, () => this.unpauseGame(), this);
        drawLine(
            contentContainer.getTopLeft().x + 16,
            contentContainer.getTopLeft().y + 86,
            contentContainer.getTopRight().x - 16,
            contentContainer.getTopRight().y + 86,
            0x333333, 1, 1, this);

        //let column = this.add.image(width / 2, 60, "menu-column").setOrigin(0.5, 0.5).setScale(3);

        this.input.keyboard.on("keydown-ESC", () => {
            if (variables.gameState.fullscreenEnabled) variables.gameState.fullscreenEnabled = false;
            this.unpauseGame();
        });
    }

    unpauseGame() {
        this.resetSceneOrder();
        this.scene.stop();
        this.scene.start(this.toScene);
        this.showExitButton();
    }

    update(time, delta) {}
}

Object.assign(PlayerMenu.prototype, frontendControlsMixin);
Object.assign(PlayerMenu.prototype, baseSceneMixin);

export default PlayerMenu;
