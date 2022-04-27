import Phaser from "phaser";
import Button from "../../components/Button";

import variables from "../../managers/Variables";

import baseSceneMixin from "../mixins/baseSceneMixin";

class PlayerWinMenu extends Phaser.Scene {
    constructor() {
        super({ key: "PlayerWinMenu" });
    }

    preload() {
        window.addEventListener("message", this.handler, false);
    }

    create(data) {
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        variables.gameState.accountIsGoatedWithTheSauce ? this.exitToMenu() : this.openMessageSigningMenu();
    }

    openMessageSigningMenu() {
        if (!this.scene.isActive("FreezeScreen")) {
            this.showMessageSigning();
            this.scene.launch("FreezeScreen", this);
        } else return;
    }

    hideMessageSigning() {
        window.parent.postMessage("hideMessage", variables.gameUrl);
    }

    showMessageSigning() {
        window.parent.postMessage("openMessage", variables.gameUrl);
    }

    handler = e => {
        if (e.origin.startsWith(variables.gameUrl) && e.data.toString().startsWith("closeMenu")) {
            variables.gameState.accountIsGoatedWithTheSauce = true;
            this.exitToMenu();
        } else if (e.origin.startsWith(variables.gameUrl) && e.data.toString().startsWith("signedMessage")) {
            variables.gameState.accountIsGoatedWithTheSauce = true;
            this.exitToMenu();
        } else {
            return;
        }
    };

    exitToMenu() {
        window.removeEventListener("message", this.handler, false);

        this.scene.manager.stop(this.toScene);
        this.resetSceneOrder();
        this.scene.manager.start("MainMenu");
        this.scene.manager.bringToTop("MainMenu");
        this.scene.stop();
    }

    update(time, delta) {}
}

Object.assign(PlayerWinMenu.prototype, baseSceneMixin);

export default PlayerWinMenu;
