import { TransferWithinAStationOutlined } from "@material-ui/icons";
import Phaser from "phaser";
import Button from "../../components/Button";
import MenuButton from "../../components/MenuButton";
import CustomIconButton from "../../components/CustomIconButton";
import ButtonMenu from "../../components/Buttons/ButtonMenu";

import PauseMenu from "./PauseMenu";

import variables from "../../managers/Variables";
import { sharedInstance as events } from "../../managers/EventCenter";
import { generateGrid, visualizeGrid } from "../../components/Utils/DrawingUtils";

import baseSceneMixin from "../mixins/baseSceneMixin";
import frontendControlsMixin from "../mixins/frontendControlsMixin";

class MainMenu extends Phaser.Scene {
    constructor(config) {
        super({ key: "MainMenu" });
    }

    preload() {
        this.load.audio("button-click", "assets/audio/button-click.mp3");
        this.load.image("trident-title", "assets/Wordmark.png");
        this.load.image("button-background", "assets/menu_assets/main_menu/button-background.png");

        this.load.image("menu-column", "assets/menu_assets/column-horizontal.png");
        this.load.image("menu-box", "assets/menu_assets/box.png");

        this.load.image("menu-bg", "assets/menu_assets/menu-bg.jpg");

        // Menu Specific Buttons
        this.load.spritesheet("trial-button", "assets/menu_assets/main_menu/buttons/trial-hover.png", {
            frameWidth: 114,
            frameHeight: 26,
        });
        this.load.spritesheet("harbor-button", "assets/menu_assets/main_menu/buttons/harbor-hover.png", {
            frameWidth: 114,
            frameHeight: 26,
        });
        this.load.spritesheet("forge-button", "assets/menu_assets/main_menu/buttons/forge-hover.png", {
            frameWidth: 114,
            frameHeight: 26,
        });
        this.load.spritesheet("appraiser-button", "assets/menu_assets/main_menu/buttons/appraiser-hover.png", {
            frameWidth: 114,
            frameHeight: 26,
        });
        this.load.spritesheet("oasis-button", "assets/menu_assets/main_menu/buttons/oasis-hover.png", {
            frameWidth: 114,
            frameHeight: 26,
        });
        this.load.spritesheet("pve-button", "assets/menu_assets/main_menu/buttons/pve-hover.png", {
            frameWidth: 114,
            frameHeight: 26,
        });

        this.load.spritesheet("sml-button", "assets/buttons/small/button.png", {
            frameWidth: 64,
            frameHeight: 32,
        });
        this.load.spritesheet("wide-button", "assets/buttons/wide/button.png", {
            frameWidth: 128,
            frameHeight: 32,
        });

        // Small Button Icons
        this.load.spritesheet("sound-button", "assets/buttons/sound.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("music-button", "assets/buttons/music.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("fullscreen-button", "assets/buttons/fullscreen.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("settings-button", "assets/buttons/settings.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.spritesheet("player-menu-button", "assets/buttons/player-menu.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet("close-button-medium", "assets/menu_assets/close-button.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Default Button
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

        window.addEventListener("message", this.shutdownHandler, false); // Listens for plugin-shutdown message
    }

    create(data) {
        this.sceneInit();
        this.showExitButton();
        window.parent.postMessage("gameActive", window.location.origin);

        // this.input.setDefaultCursor("url(assets/catfish-cursor.png), pointer");
        this.input.setDefaultCursor("url(assets/cursors/sword-cursor.png), default");
        this.input.setDefaultCursor("url(assets/cursors/sword-pointer.png), pointer");
        let { width, height } = this.sys.game.canvas;
        const SPACING = 16;

        this.add.rectangle(0, 0, width, height, 0x000000, 1).setOrigin(0);

        this.anims.create({
            key: "trial-button-hover",
            frames: this.anims.generateFrameNumbers("trial-button", { start: 1 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "harbor-button-hover",
            frames: this.anims.generateFrameNumbers("harbor-button", { start: 1 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "forge-button-hover",
            frames: this.anims.generateFrameNumbers("forge-button", { start: 1 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "appraiser-button-hover",
            frames: this.anims.generateFrameNumbers("appraiser-button", { start: 1 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "oasis-button-hover",
            frames: this.anims.generateFrameNumbers("oasis-button", { start: 1 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "pve-button-hover",
            frames: this.anims.generateFrameNumbers("pve-button", { start: 1 }),
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

        let title = this.add.sprite(width / 2, height / 2, "main-menu");
        title.play("menu-loop");
        title.setOrigin(0.5, 0.5);

        let buttonBackground = this.add.sprite(width, height, "button-background");
        buttonBackground.setOrigin(1, 1);

        this.textures.getTextureKeys().forEach(item => {
            this.textures.get(item).setFilter(Phaser.Textures.FilterMode.NEAREST);
        });
        let wordmark = this.add.image(100, 48, "trident-title");

        wordmark.setOrigin(0);
        wordmark.setScale(0.5);
        const titleScale = this.sys.canvas.width / title.width;
        title.scale = titleScale;

        const backgroundScale = this.sys.canvas.height / buttonBackground.height;
        // buttonBackground.scale = backgroundScale;
        buttonBackground.scale = 3;

        // --------- Grid ---------

        var buttonGrid = generateGrid(0, 0, width, height, 0, 12, 10);
        // visualizeGrid(buttonGrid, 0x00ff00, this);

        let pveButtonMenu = new MenuButton(this, width - 12, (buttonGrid.rows[3].rightInner + buttonGrid.rows[3].leftInner) / 2, "Story", () => {}, 5);

        let krakenButton = new MenuButton(
            this,
            width - 12,
            (buttonGrid.rows[3].rightInner + buttonGrid.rows[3].leftInner) / 2,
            "Kraken",
            () => {
                this.scene.start("InstructionsSplash");
                this.scene.bringToTop("InstructionsSplash");
            },
            0,
        );

        let harborButton = new MenuButton(
            this,
            width - 12,
            (buttonGrid.rows[4].rightInner + buttonGrid.rows[4].leftInner) / 2,
            "Harbor",
            () => {
                this.scene.start("HarborScene");
                this.scene.bringToTop("HarborScene");
            },
            1,
        );

        let forgeButton = new MenuButton(
            this,
            width - 12,
            (buttonGrid.rows[5].rightInner + buttonGrid.rows[5].leftInner) / 2,
            "Forge",
            () => {
                this.scene.start("ForgeScene");
                this.scene.bringToTop("ForgeScene");
            },
            2,
        );

        let appraiserButton = new MenuButton(
            this,
            width - 12,
            (buttonGrid.rows[6].rightInner + buttonGrid.rows[6].leftInner) / 2,
            "Appraiser",
            () => {
                this.scene.start("AppraiserScene");
                this.scene.bringToTop("AppraiserScene");
            },
            3,
        );

        let oasisButton = new MenuButton(
            this,
            width - 12,
            (buttonGrid.rows[7].rightInner + buttonGrid.rows[7].leftInner) / 2,
            "Oasis",
            () => {
                this.scene.start("AppraiserScene");
                this.scene.bringToTop("AppraiserScene");
            },
            4,
        );

        let buttonMenu = new ButtonMenu(this, [pveButtonMenu, harborButton, forgeButton, appraiserButton, oasisButton], false);
        let buttonSubMenu = new ButtonMenu(this, [krakenButton], true, buttonMenu);

        pveButtonMenu.setCallback(() => {
            buttonSubMenu.show();
        });

        // Display settings button with next release

        let settingsButton = new CustomIconButton(
            this,
            width - 48,
            height - 48,
            "",
            () => {
                this.scene.launch("SettingsMenu", "MainMenu");
                this.scene.bringToTop("SettingsMenu");
            },
            "settings-button",
        );
        settingsButton.setScale(3);

        let playerMenuButton = new CustomIconButton(
            this,
            width - 48,
            120,
            "",
            () => {
                this.scene.launch("PlayerMenu", "MainMenu");
                this.scene.bringToTop("PlayerMenu");
            },
            "player-menu-button",
        );
        playerMenuButton.setScale(3);

        this.scale.on('resize', function(gameSize, baseSize, displaySize, previousWidth, previousHeight) {
            // Update 'width' and 'height' with new canvas size
            let { width, height } = this.sys.game.canvas;
            const widthDiff = previousWidth - gameSize._width;
            const heightDiff = previousHeight - gameSize._height;

            // Adjust buttonBackground position relative to change
            buttonBackground.x -= widthDiff;

            // --- Adjust buttons positions relative to change ---
            // Regenerate grid
            buttonGrid = generateGrid(0, 0, width, height, 0, 12, 10);
            // Align buttons to grid, and adjust based on new width
            // Menu Buttons
            pveButtonMenu.setPosition(pveButtonMenu.x - widthDiff, pveButtonMenu.y);
            krakenButton.setPosition(krakenButton.x - widthDiff, krakenButton.y);
            harborButton.setPosition(harborButton.x - widthDiff, harborButton.y);
            forgeButton.setPosition(forgeButton.x - widthDiff, forgeButton.y);
            appraiserButton.setPosition(appraiserButton.x - widthDiff, appraiserButton.y);
            oasisButton.setPosition(oasisButton.x - widthDiff, oasisButton.y);
            // Settings & Profile Buttons
            settingsButton.setPosition(settingsButton.x - widthDiff, settingsButton.y);

            // visualizeGrid(buttonGrid, 0xffff00, this);
        }, this);
    }

    shutdownHandler = e => {
        if (e.origin.startsWith(variables.gameUrl) && e.data.toString().startsWith("shutdownInit")) {
            this.plugins.removeScenePlugin("rexUI");
            /* Standard syntax */
            document.removeEventListener("fullscreenchange", PauseMenu.checkFullscreenState);
            /* Firefox */
            document.removeEventListener("mozfullscreenchange", PauseMenu.checkFullscreenState);
            /* Chrome, Safari and Opera */
            document.removeEventListener("webkitfullscreenchange", PauseMenu.checkFullscreenState);
            /* IE / Edge */
            document.removeEventListener("msfullscreenchange", PauseMenu.checkFullscreenState);

            variables.setPreferences();
            variables.resetStateVariables();
            this.sys.game.destroy(true, false);

            events.destroy();

            window.postMessage("shutdownFinal", variables.gameUrl);
            window.removeEventListener("message", this.shutdownHandler, false);
        } else return;
    };

    update(time, delta) {}
}

Object.assign(MainMenu.prototype, baseSceneMixin);
Object.assign(MainMenu.prototype, frontendControlsMixin);

export default MainMenu;
