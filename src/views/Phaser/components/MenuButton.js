import Phaser from "phaser";

class MenuButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, text, clickAction, imgId) {
        let images = [
            ["trial-button", "trial-button-hover"],
            ["harbor-button", "harbor-button-hover"],
            ["forge-button", "forge-button-hover"],
            ["appraiser-button", "appraiser-button-hover"],
            ["oasis-button", "oasis-button-hover"],
            ["pve-button", "pve-button-hover"],
        ];

        super(scene, x, y, images[imgId][0], 0);
        scene.add.existing(this);
        this.clickSound = scene.sound.add("button-click");
        this.setOrigin(1, 0.5);
        this.callback = clickAction;

        this.width = 114;
        this.height = 26;
        // this.setSize(20, 56);

        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, this.width, this.height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            //cursor: 'url(assets/cursor-pointer.png), pointer',
        });

        this.buttonText = scene.add
            .text(x - this.width, y, text, {
                fontSize: 34,
                color: "#ffffff",
                fontFamily: "Cormorant Garamond",
                fontWeight: "Bold",
            })
            .setOrigin(0.5);
        
        this.scale = 2;

        this.on("pointerover", () => {
            this.anims.play(images[imgId][1]);
        });
        this.on("pointerout", () => {
            this.anims.stop();
            this.setFrame(0);
        });
        this.on("pointerdown", () => {
            this.clickSound.play();
            this.callback();
        });
    }

    show(bool) {
        this.setVisible(bool);
        this.buttonText.setVisible(bool);
    }

    setCallback(callback) {
        this.callback = callback;
    }
}

export default MenuButton;
