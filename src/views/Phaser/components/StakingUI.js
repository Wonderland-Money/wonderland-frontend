import Phaser from "phaser";

class StakingUI extends Phaser.GameObjects.DOMElement {
    constructor(scene) {
        this.scene = scene;
        this.domElement = scene.add.dom(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2).createFromDOM("staking-form");
        this.registerEmitters();
    }

    registerEmitters() {}
}
