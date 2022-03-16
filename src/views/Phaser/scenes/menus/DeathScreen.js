import Phaser from "phaser";
import SmallButton from "../../components/SmallButton";

class DeathScreen extends Phaser.Scene {
    constructor() {
        super({ key: "DeathScreen" });
    }

    preload() {
        this.load.spritesheet("button-img", "assets/tilesets/button_sprite.png", {
            frameWidth: 128,
            frameHeight: 32,
        });
    }

    create(data) {
        this.cameras.main.alpha = 0;
        this.cameras.main.setZoom(1.4);
        this.tweens.add({
            targets: this.cameras.main,
            zoom: 1,
            alpha: 1,
            ease: "Sine.easeIn",
            duration: 500,
        });
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas;

        let pauseBg = this.add.rectangle(0, 0, width, height, 0xf70056, 0.4);
        pauseBg.setOrigin(0, 0);

        let deathTextShadow = this.add
            .text(width / 2 + 4, height / 2 - 64 + 4, "You Died!", {
                fontSize: 72,
                color: "#000000",
                fontStyle: "bold",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0.5, 0);
        let deathText = this.add
            .text(width / 2, height / 2 - 64, "You Died!", {
                fontSize: 72,
                color: "#ee0000",
                fontStyle: "bold",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0.5, 0);
        let playButton = new SmallButton(this, width / 2, height / 2 + 64, "Retry", () => {
            this.restartGame();
        });
        this.input.keyboard.on("keydown-ESC", () => {
            this.restartGame();
        });
    }

    restartGame() {
        this.scene.manager.getScene("GameScene").nukeItAll();
        this.scene.manager.getScene("GameScene").scene.restart();
        this.scene.stop();
    }

    update(time, delta) {}
}

export default DeathScreen;
