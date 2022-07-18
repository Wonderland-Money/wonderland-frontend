import Phaser from "phaser";
import HeroLegacy from "../entities/pve/HeroLegacy";

import baseSceneMixin from "./mixins/baseSceneMixin";
import frontendControlsMixin from "./mixins/frontendControlsMixin";
import loadingBar from "./mixins/loadingBar";

import { sharedInstance as events } from "../managers/EventCenter";

import dialogue from "./dialogue/Oasis.json";

class OasisScene extends Phaser.Scene {
    constructor() {
        super({ key: "OasisScene" });
    }
    preload() {
        this.loadingBar(() => {
            this.loadSpritesAndShit();
            this.loadAudioShit();
        });
    }

    loadAudioShit() {
        // ========= Audio =========
        // Music
        this.load.audio("oasis-song", "assets/audio/music/oasis-song.mp3");
        // Hurt Sounds
        this.load.audio("player-hurt", "assets/audio/player-hurt.wav");
        // Death
        this.load.audio("evil-laugh", "assets/audio/evil-laugh.wav");
        this.load.audio("player-death", "assets/audio/player-death.wav");
        this.load.audio("kraken-death", "assets/audio/kraken-death.wav");

        this.load.audio("switch-attack-audio", "assets/audio/switch-attacks.wav");
    }

    loadSpritesAndShit() {
        // ========= Tilemaps & Spritesheets =========
        this.load.tilemapTiledJSON("oasis", "assets/gamescenes/OasisDex/oasis-tilemap.json");
        // Tilesheet
        this.load.image("oasis-tileset", "assets/gamescenes/OasisDex/oasis-tileset.png");

        this.load.spritesheet("enon", "assets/gamescenes/OasisDex/enon.png", {
            frameWidth: 64,
            frameHeight: 54,
        });

        // ------ Background, Foreground, Clouds ------
        this.load.spritesheet("oasis-fg", "assets/gamescenes/OasisDex/oasis-foreground.png", {
            frameWidth: 960,
            frameHeight: 403,
        });
        this.load.image("oasis-bg", "assets/gamescenes/OasisDex/oasis-background.png");
        this.load.image("oasis-clouds", "assets/gamescenes/OasisDex/oasis-cloud.png");
        // ------ Hero Character ------
        // Idle
        this.load.spritesheet("hero-idle", "assets/player_assets/player_body/atlantianidle.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Running
        this.load.spritesheet("hero-running", "assets/player_assets/player_body/atlantianrun.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Jumping
        this.load.spritesheet("hero-jumping", "assets/player_assets/player_body/atlantianjump.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Dying
        this.load.spritesheet("hero-dying", "assets/player_assets/player_body/atlantiandeath.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Teleporting
        this.load.spritesheet("hero-teleporting", "assets/player_assets/player_body/atlantianteleport.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Flares
        this.load.atlas("flares", "assets/particles/flares.png", "assets/particles/flares.json");
    }

    loadAnims() {
        /*
         * ======== LOAD ANIMATIONS ========
         */
        // Background Animation
        this.anims.create({
            key: "oasis-loop",
            frames: this.anims.generateFrameNames("oasis-fg"),
            frameRate: 7,
            repeat: -1,
        });
        /**
         * ====== HERO ======
         */
        // Running
        this.anims.create({
            key: "player-running",
            frames: this.anims.generateFrameNumbers("hero-running", {
                start: 0,
                end: 8,
            }),
            frameRate: 12,
            repeat: -1,
        });

        // Pivoting
        this.anims.create({
            key: "player-pivoting",
            frames: this.anims.generateFrameNumbers("hero-running", {
                start: 2,
                end: 4,
            }),
            frameRate: 12,
            repeat: -1,
        });

        // Jumping
        this.anims.create({
            key: "player-jumping",
            frames: this.anims.generateFrameNumbers("hero-jumping", { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0,
        });

        // Falling
        this.anims.create({
            key: "player-falling",
            frames: this.anims.generateFrameNumbers("hero-jumping", {
                start: 3,
                end: 4,
            }),
            frameRate: 12,
            repeat: -1,
        });

        // Idle
        this.anims.create({
            key: "player-idle",
            frames: this.anims.generateFrameNumbers("hero-idle", {
                start: 0,
                end: 11,
            }),
            frameRate: 6,
            repeat: -1,
        });

        // Dead
        this.anims.create({
            key: "player-dead",
            frames: this.anims.generateFrameNumbers("hero-dying"),
            frameRate: 14,
            repeat: 0,
        });
        // Teleporting
        this.anims.create({
            key: "player-teleporting",
            frames: this.anims.generateFrameNumbers("hero-teleporting"),
            frameRate: 16,
            repeat: 0,
        });

        // Enon Loop
        this.anims.create({
            key: "enon-loop",
            frames: this.anims.generateFrameNumbers("enon"),
            frameRate: 8,
            repeat: -1,
        });
    }

    create() {
        this.sceneInit();
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.input.mouse.disableContextMenu();

        this.loadEventHandlers();
        this.loadAnims();
        this.addMap();

        this.addEnon();
        this.addHero();

        this.backgroundmusic = this.sound.add("oasis-song");
        this.playBackgroundMusic();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.fadeIn(750);
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(this.hero, true, 0.08, 0.08, 0, -400);
        this.cameras.main.setFollowOffset(0, 500);

        this.hoverTimer = 0;

        this.input.keyboard.on("keydown-Q", () => {
            if (!this.enon.body.touching.none || this.enon.body.embedded) {
                this.openOasisDex();
            }
        });
        this.input.keyboard.on("keydown-R", () => {
            if (!this.enon.body.touching.none || this.enon.body.embedded) {
                let txt = dialogue.dialogue[this.getRandInt(Object.keys(dialogue.dialogue).length)];
                events.emit("dialogue", { speaker: "Enon, the Catfish King", dialogue: txt });
            }
        });
    }

    loadEventHandlers() {
        events.on("resume", () => {
            this.hero.resetMovements();
        });
    }

    addHero() {
        this.hero = new HeroLegacy(this, this.spawnPos.x, this.spawnPos.y);
        this.groundCollider = this.physics.add.collider(this.hero, this.map.getLayer("Collide").tilemapLayer);

        // We add enon first, so we register the physics overlap in addHero()
        this.physics.add.overlap(this.hero, this.enon, () => {
            if (this.hoverTimer == 0) {
                events.emit("notification", ["Press Q to access OasisSwap", "Press R to speak"]);
                this.hoverTimer++;
            }
        });
    }

    addEnon() {
        this.enon = this.physics.add.sprite(this.enonSpawn.x, this.enonSpawn.y, "enon").setOrigin(0, 1);
        this.physics.add.collider(this.enon, this.map.getLayer("Collide").tilemapLayer);
        // this.enon.body.setSize(90, 153); // @todo Update
        // this.enon.body.setOffset(310, 0); // @todo Update
        // this.enon.body.setAllowGravity(false);
        this.enon.setScale(2);
        this.enon.play("enon-loop");
    }

    addMap() {
        this.map = this.make.tilemap({ key: "oasis" });

        // Background moves in parallax
        const oasisBG = this.add.image(this.map.widthInPixels / 2, 0, "oasis-bg").setOrigin(0.5, 0.1);
        const scaleFactor = this.map.widthInPixels / oasisBG.width;
        oasisBG.setScrollFactor(0.9)
        oasisBG.scale = scaleFactor;

        // Clouds move in parallax
        const oasisClouds = this.add.image(this.map.widthInPixels / 2, 0, "oasis-clouds").setOrigin(0.5, 0);
        oasisClouds.setScrollFactor(0.8);
        oasisClouds.scale = 2;

        
        const foregroundLoop = this.add.sprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2, "oasis-fg")
        foregroundLoop.play("oasis-loop");
        foregroundLoop.scale = scaleFactor;

        const groundTiles = this.map.addTilesetImage("oasis", "oasis-tileset");

        const collisionLayer = this.map.createLayer("Collide", groundTiles);
        const backgroundLayer = this.map.createLayer("Background", groundTiles);

        // Place bottom of foregroundLoop at top of topmost ground tile i.e. sitting on top of ground. 
        foregroundLoop.setPosition(this.map.widthInPixels / 2, collisionLayer.findByIndex(1).getTop()).setOrigin(0.5, 1);
        
        //const decorationLayer = this.map.createStaticLayer('Decoration' , groundTiles)

        collisionLayer.setCollision([1, 2, 3, 4, 5, 6], true);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBoundsCollision(true, true, false, true);

        this.map.getObjectLayer("Objects").objects.forEach(object => {
            if (object.name === "Start") {
                this.spawnPos = { x: object.x, y: object.y };
            }
            if (object.name === "EnonSpawn") {
                this.enonSpawn = { x: object.x, y: object.y };
            }
        });
    }

    update(t, d) {
        super.update(t, d);
        if (this.hoverTimer > 0) {
            this.hoverTimer += d;
            if (this.hoverTimer >= 3000) this.hoverTimer = 0;
        }
    }
}

Object.assign(OasisScene.prototype, baseSceneMixin);
Object.assign(OasisScene.prototype, frontendControlsMixin);
Object.assign(OasisScene.prototype, loadingBar);

export default OasisScene;
