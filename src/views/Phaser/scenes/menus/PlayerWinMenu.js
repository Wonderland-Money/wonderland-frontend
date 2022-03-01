import Phaser from "phaser";
import Button from "../../components/Button";

class PlayerWinMenu extends Phaser.Scene {
    constructor() {
        super({ key: "PlayerWinMenu" });
    }

    create(data) {
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        /**
         * @TODO Should draw a RexUI popup taht allows player to sign.
         */
    }

    exitToMenu() {
        this.scene.manager.sendToBack("InstructionsSplash");
        this.scene.manager.sendToBack("IngameUI");
        this.scene.manager.sendToBack("GameScene");
        this.scene.manager.sendToBack("HarborScene");
        this.scene.manager.sendToBack("ForgeScene");
    }

    update(time, delta) {}
}

export default PlayerWinMenu;
