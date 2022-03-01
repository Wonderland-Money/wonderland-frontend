import Phaser from "phaser";
import Button from "../../components/Button";

import frontendControlsMixin from "../mixins/frontendControlsMixin";

class Menu extends Phaser.Scene {
    constructor(config) {
        super({ key: "MainMenu" });
        console.log(this.sys.config);
    }

    preload() {
        console.log(this.load.baseURL);
        this.load.audio("button-click", "assets/audio/button-click.mp3");
        this.load.spritesheet("button-img", "assets/buttons/normal/button2.png", {
            frameWidth: 128,
            frameHeight: 52,
        });
        this.load.spritesheet("button-hover-spritesheet", "assets/buttons/hover/button2hover.png", {
            frameWidth: 128,
            frameHeight: 52,
        });
        this.load.spritesheet("button-click-spritesheet", "assets/buttons/click/button2click.png", {
            frameWidth: 128,
            frameHeight: 52,
        });
        this.load.spritesheet("button-disabled", "assets/buttons/disabled/disabled2.png", {
            frameWidth: 128,
            frameHeight: 52,
        });

        this.load.spritesheet("button-img-highlighted", "assets/buttons/normal/button2_highlighted.png", {
            frameWidth: 128,
            frameHeight: 52,
        });
        this.load.spritesheet("button-hover-highlighted", "assets/buttons/hover/button2hover_highlighted.png", {
            frameWidth: 128,
            frameHeight: 52,
        });

        this.load.image("title", "assets/MainMenu.png");
    }

    create(data) {
        window.parent.postMessage("gameActive", "http://app.trident.localhost:3000");

        this.input.setDefaultCursor("url(assets/catfish-cursor.png), pointer");
        let { width, height } = this.sys.game.canvas;

        this.add.rectangle(0, 0, width, height, 0x000000, 1).setOrigin(0);

        this.anims.create({
            key: "button-hover",
            frames: this.anims.generateFrameNumbers("button-hover-spritesheet"),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "button-click",
            frames: this.anims.generateFrameNumbers("button-click-spritesheet"),
            frameRate: 16,
            repeat: 0,
        });

        this.anims.create({
            key: "button-hover-highlighted",
            frames: this.anims.generateFrameNumbers("button-hover-highlighted"),
            frameRate: 16,
            repeat: -1,
        });

        this.input.mouse.disableContextMenu();

        // let title = this.add.image(width / 2, 140, 'title')
        // title.setOrigin(0.5, 0.5)
        // title.scale = 3

        let title = this.add.image(width / 2, height / 2, "title");
        title.setOrigin(0.5, 0.5);
        let scale = this.sys.canvas.width / title.width;
        title.scale = scale;

        let playButton = new Button(
            this,
            width - 300,
            height / 2 - 52 - 120,
            "Play",
            () => {
                this.scene.start("InstructionsSplash");
            },
            true,
        ).setHighlighted(true);

        /**
         * @TODO this shit needs to check if the player has won already
         */
        this.playerWonGame = true;

        let harborButton = new Button(
            this,
            width - 300,
            height / 2 - 52,
            "Harbor",
            () => {
                this.scene.start("HarborScene");
            },
            this.playerWonGame,
        );

        let forgeButton = new Button(
            this,
            width - 300,
            height / 2 - 52 + 120,
            "Forge",
            () => {
                this.scene.start("ForgeScene");
            },
            this.playerWonGame,
        );
    }

    update(time, delta) {}
}

Object.assign(Menu.prototype, frontendControlsMixin);

export default Menu;
