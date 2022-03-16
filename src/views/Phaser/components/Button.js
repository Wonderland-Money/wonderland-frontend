import Phaser from "phaser";

class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, text, clickAction, enabled) {
        super(scene, x + 64, y + 16, "button-img", 0);
        scene.add.existing(this);
        this.clickSound = scene.sound.add("button-click");
        this.setOrigin(0.5, 0.5);
        this.setSize(20, 56);

        this.enabled = enabled || true;

        if (this.enabled) {
            this.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(16, 0, 98, 56),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                //cursor: 'url(assets/cursor-pointer.png), pointer',
            });
        }

        this.buttonText = scene.add
            .text(x + 64, y + 8, text, {
                fontSize: 32,
                color: "#0f0f0f",
                fontFamily: "Cormorant Garamond",
                fontStyle: "bold",
            })
            .setOrigin(0.5);
        if (!this.enabled) {
            this.setTexture("button-disabled");
            this.buttonText.setColor(0x333333);
        }
        this.scale = 2;

        if (this.enabled) {
            this.on("pointerover", () => {
                if (this.highlighted) {
                    this.anims.play("button-hover-highlighted");
                    // this.buttonText.setColor('#2020a2')
                } else {
                    this.anims.play("button-hover");
                    this.buttonText.setColor("#003e10");
                }
            });
            this.on("pointerout", () => {
                this.anims.stop();
                if (this.highlighted) {
                    this.setTexture("button-img-highlighted", 0);
                } else {
                    this.setTexture("button-img", 0);
                }

                this.buttonText.setColor("#0f0f0f");
            });
            this.on("pointerdown", () => {
                this.anims.play("button-click");
                this.clickSound.play();
                this.scene.time.addEvent(
                    {
                        delay: 1500,
                        callback: clickAction(),
                    },
                    this,
                );
            });
        }
    }

    setHighlighted(boolean) {
        this.highlighted = boolean;
        if (this.highlighted) this.setTexture("button-img-highlighted", 0);
    }

    setEnabled(boolean) {
        this.enabled = boolean;
    }
}

export default Button;
