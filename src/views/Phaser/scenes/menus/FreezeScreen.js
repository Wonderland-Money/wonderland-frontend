import Phaser from "phaser";
import variables from "../../managers/Variables";

import baseSceneMixin from "../mixins/baseSceneMixin";
import frontendControlsMixin from "../mixins/frontendControlsMixin";

class FreezeScreen extends Phaser.Scene {
    constructor() {
        super({ key: "FreezeScreen" });
    }

    preload() {
        window.addEventListener("message", this.handler, false);
    }

    create(data) {
        this.toScene = data;
        this.scene.pause(data);
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        this.pauseBg = this.add.rectangle(0, 0, width, height, 0x203055, 0.5);
        this.pauseBg.alpha = 0;
        this.pauseBg.setOrigin(0, 0);

        this.tweens.add({
            targets: this.pauseBg,
            alpha: 1,
            duration: 750,
            ease: "Power2",
        });
    }

    handler = e => {
        if (e.origin.startsWith(variables.gameUrl) && e.data.toString().startsWith("closeMenu")) {
            this.unpauseGame();
        } else {
            return;
        }
    };

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
        window.removeEventListener("message", this.handler, false);
        this.tweens.add({
            targets: this.pauseBg,
            alpha: 0,
            duration: 750,
            ease: "Power2",
        });
        this.scene.resume(this.toScene);
        this.scene.get(this.toScene).hero.setPauseInput(false);
        this.time.delayedCall(750, () => this.scene.stop());
    }

    update(time, delta) {}
}

Object.assign(FreezeScreen.prototype, baseSceneMixin);
Object.assign(FreezeScreen.prototype, frontendControlsMixin);

export default FreezeScreen;