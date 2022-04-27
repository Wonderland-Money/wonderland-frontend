import Phaser from "phaser";
import Button from "../../components/Button";

import frontendControlsMixin from "../mixins/frontendControlsMixin";
import baseSceneMixin from "../mixins/baseSceneMixin";

class PlayerWinScene extends Phaser.Scene {
    constructor() {
        super({ key: "PlayerWinScene" });
    }

    preload() {
        this.load.audio("holy", "assets/audio/holy.mp3");
    }

    create(data) {
        this.sceneInit();
        this.cameras.main.fadeIn(5000, 255, 255, 255);

        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        this.time.delayedCall(3000, () => {
            this.scene.manager.getScene("KrakenScene").nukeItAll();
            this.scene.manager.stop("KrakenScene");
            this.scene.start("PlayerWinMenu");
            this.scene.bringToTop("PlayerWinMenu");
        });
    }

    update(time, delta) {}
}

Object.assign(PlayerWinScene.prototype, baseSceneMixin);
Object.assign(PlayerWinScene.prototype, frontendControlsMixin);

export default PlayerWinScene;
