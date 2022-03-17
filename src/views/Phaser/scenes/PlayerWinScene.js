import Phaser from "phaser";
import Button from "../components/Button";

import frontendControlsMixin from "./mixins/frontendControlsMixin";

class PlayerWinScene extends Phaser.Scene {
    constructor() {
        super({ key: "PlayerWinScene" });
    }

    preload() {
        this.load.audio("holy", "assets/audio/holy.mp3");
    }

    create(data) {
        this.cameras.main.fadeIn(5000, 255, 255, 255);

        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        this.time.delayedCall(3000, () => {
            this.scene.start("PlayerWinMenu");
        });
    }

    update(time, delta) {}
}

Object.assign(PlayerWinScene.prototype, frontendControlsMixin);

export default PlayerWinScene;
