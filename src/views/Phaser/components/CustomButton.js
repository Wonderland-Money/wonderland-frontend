import Phaser from "phaser";

class CustomButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, text, clickAction, imageKey, toggleable, setState, scale) {
        super(scene, x, y, imageKey, 0);
        scene.add.existing(this);
        this.clickSound = scene.sound.add("button-click");
        this.setOrigin(0.5, 0.5);
        this.toggleable = toggleable || false;
        this.buttonState = false;
        this.setScale(scale || 2);

        this.setInteractive();

        this.buttonText = scene.add
            .text(x, y, text, {
                fontSize: 28,
                color: "#efefef",
                fontFamily: "Cormorant Garamond",
                fontStyle: "normal",
            }).setOrigin(0.5);

        if(!this.toggleable) {
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
        } else {
            this.toggleable = true;
            this.buttonState = setState;
            (this.buttonState) ? this.setFrame(0) : this.setFrame(1);

            this.on("pointerdown", () => {
                this.toggleState();
                clickAction();
            })
        }
    }

    toggleState() {
        if(this.toggleable) {
            this.buttonState = !this.buttonState;
            (this.buttonState) ? this.setFrame(0) : this.setFrame(1);
            return true;
        } else return false;
    }

    resetState(setState) {
        if(this.toggleable) this.buttonState = setState;
        else return;
        (this.buttonState) ? this.setFrame(0) : this.setFrame(1);
    }
}

export default CustomButton;
