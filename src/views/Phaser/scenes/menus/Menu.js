import { TransferWithinAStationOutlined } from "@material-ui/icons";
import Phaser from "phaser";
import Button from "../../components/Button";
import MenuButton from "../../components/MenuButton";

import frontendControlsMixin from "../mixins/frontendControlsMixin";

class Menu extends Phaser.Scene {
    constructor(config) {
        super({ key: "MainMenu" });
    }

    preload() {
        this.load.audio("button-click", "assets/audio/button-click.mp3");
        this.load.image("trident-title", "assets/Wordmark.png");

        // Menu Specific Buttons
        this.load.spritesheet("trial-button", "assets/buttons/menu/trial-hover.png", {
            frameWidth: 128,
            frameHeight: 32,
        });
        this.load.spritesheet("harbor-button", "assets/buttons/menu/harbor-hover.png", {
            frameWidth: 128,
            frameHeight: 32,
        });
        this.load.spritesheet("forge-button", "assets/buttons/menu/forge-hover.png", {
            frameWidth: 128,
            frameHeight: 32,
        });
        this.load.spritesheet("appraiser-button", "assets/buttons/menu/appraiser-hover.png", {
            frameWidth: 128,
            frameHeight: 32,
        });

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

        this.load.spritesheet("main-menu", "assets/MainMenu.png", {
            frameWidth: 480,
            frameHeight: 240,
        });
    }

    create(data) {
        this.showExitButton();
        window.parent.postMessage("gameActive", window.location.origin);

        this.input.setDefaultCursor("url(assets/catfish-cursor.png), pointer");
        let { width, height } = this.sys.game.canvas;
        const SPACING = 16;

        this.add.rectangle(0, 0, width, height, 0x000000, 1).setOrigin(0);

        this.anims.create({
            key: "trial-button-hover",
            frames: this.anims.generateFrameNumbers("trial-button"),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "harbor-button-hover",
            frames: this.anims.generateFrameNumbers("harbor-button"),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "forge-button-hover",
            frames: this.anims.generateFrameNumbers("forge-button"),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "appraiser-button-hover",
            frames: this.anims.generateFrameNumbers("appraiser-button"),
            frameRate: 16,
            repeat: -1,
        });

        this.anims.create({
            key: "menu-loop",
            frames: this.anims.generateFrameNumbers("main-menu"),
            frameRate: 12,
            repeat: -1,
        });

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

        let title = this.add.sprite(width / 2, height / 2, "main-menu");
        title.play("menu-loop");
        title.setOrigin(0.5, 0.5);

        let wordmark = this.add.image(width / 2, 100, "trident-title");
        let scale = this.sys.canvas.width / title.width;
        title.scale = scale;

        // let playButton = new Button(
        //     this,
        //     width - 300,
        //     height / 2 - 52 - 120,
        //     "Play",
        //     () => {
        //         this.scene.start("InstructionsSplash");
        //     },
        //     true,
        // ).setHighlighted(true);

        let playButton = new MenuButton(
            this,
            width - 300,
            height / 2 - 64 - SPACING,
            "Kraken",
            () => {
                this.scene.start("InstructionsSplash");
            },
            0,
        );

        let harborButton = new MenuButton(
            this,
            width - 300,
            height / 2,
            "Harbor",
            () => {
                this.scene.start("HarborScene");
            },
            1,
        );

        let forgeButton = new MenuButton(
            this,
            width - 300,
            height / 2 + 64 + SPACING,
            "Forge",
            () => {
                this.scene.start("ForgeScene");
            },
            2,
        );

        let appraiserButton = new MenuButton(
            this,
            width - 300,
            height / 2 + 64 + SPACING + 64 + SPACING,
            "Appraiser",
            () => {
                this.scene.start("AppraiserScene");
            },
            3,
        );

        // let harborButton = new Button(
        //     this,
        //     width - 300,
        //     height / 2 - 52,
        //     "Harbor",
        //     () => {
        //         this.scene.start("HarborScene");
        //     },
        //     this.playerWonGame,
        // );

        // let forgeButton = new Button(
        //     this,
        //     width - 300,
        //     height / 2 - 52 + 120,
        //     "Forge",
        //     () => {
        //         this.scene.start("ForgeScene");
        //     },
        //     this.playerWonGame,
        // );
    }

    update(time, delta) {}
}

Object.assign(Menu.prototype, frontendControlsMixin);

export default Menu;
