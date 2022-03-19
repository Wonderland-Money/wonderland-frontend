import Phaser from "phaser";

class SmallButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, text, clickAction) {
        super(scene, x, y, "sml-button", 0);
        scene.add.existing(this);
        this.clickSound = scene.sound.add("button-click");
        this.setOrigin(0.5, 0.5);

        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, 64, 32),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        });

        this.buttonText = scene.add
            .text(x, y, text, {
                fontSize: 28,
                color: "#efefef",
                fontFamily: "Cormorant Garamond",
                fontStyle: "normal",
            })
            .setOrigin(0.5);
        this.scale = 2;

        this.on("pointerover", () => {
            this.setFrame(1);
        });
        this.on("pointerout", () => {
            this.setFrame(0);
        });
        this.on("pointerdown", () => {
            this.clickSound.play();
            this.scene.time.addEvent(
                {
                    delay: 100,
                    callback: clickAction(),
                },
                this,
            );
        });
    }
}

export default SmallButton;
