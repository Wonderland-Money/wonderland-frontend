import Phaser from "phaser";
import Hero from "../entities/Hero";

import baseSceneMixin from "./mixins/baseSceneMixin";
import frontendControlsMixin from "./mixins/frontendControlsMixin";
import loadingBar from "./mixins/loadingBar";

import { sharedInstance as events } from "../managers/EventCenter";

import dialogue from "./dialogue/Appraiser.json";

class AppraiserScene extends Phaser.Scene {
    constructor() {
        super({ key: "AppraiserScene" });
    }
    preload() {
        this.loadingBar(() => {
            this.loadSpritesAndShit();
            this.loadAudioShit();
        });
    }

    loadAudioShit() {
        // ========= Audio =========

        // Music Easter-Egg
        this.load.audio("segaaa", "assets/audio/sega.mp3");
        // Music
        this.load.audio("atlantis-song", "assets/audio/atlantis-song.wav");
        this.load.audio("load-arena", "assets/audio/enter-arena.wav");
        // Hurt Sounds
        this.load.audio("player-hurt", "assets/audio/player-hurt.wav");
        // Death
        this.load.audio("evil-laugh", "assets/audio/evil-laugh.wav");
        this.load.audio("player-death", "assets/audio/player-death.wav");
        this.load.audio("kraken-death", "assets/audio/kraken-death.wav");

        this.load.audio("switch-attack-audio", "assets/audio/switch-attacks.wav");
        this.load.audio("player-attack", "assets/audio/player-attack.wav");
        this.load.audio("kraken-attack", "assets/audio/kraken-attack.wav");
        this.load.audio("bullet-break", "assets/audio/bullet-break.wav");
        this.load.audio("orb-death", "assets/audio/orb-death.wav");

        this.load.audio("get-trident", "assets/audio/trident-grab.wav");
    }

    loadSpritesAndShit() {
        // ========= Tilemaps & Spritesheets =========
        this.load.tilemapTiledJSON("appraiser-map", "assets/tilemap/appraiser.json");
        // Tilesheet
        this.load.image("appraiser-tileset", "assets/tilesets/appraiser.png");

        // ------ Background ------
        this.load.spritesheet("appraiser-sprite", "assets/appraiser/backdrop.png", {
            frameWidth: 480,
            frameHeight: 240,
        });

        // ------ Bilgwater ------
        this.load.spritesheet("bilgewater", "assets/appraiser/bilgewater.png", {
            frameWidth: 120,
            frameHeight: 134,
        });

        // ------ Fire ------
        this.load.spritesheet("fire-loop", "assets/harbor/harbor_fire.png", {
            frameWidth: 60,
            frameHeight: 33,
        });
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
        // ------ Hero Attacking ------
        // Earth
        this.load.spritesheet("player-attack-earth", "assets/player_assets/player_attack/earth.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Air
        this.load.spritesheet("player-attack-air", "assets/player_assets/player_attack/air.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Water
        this.load.spritesheet("player-attack-water", "assets/player_assets/player_attack/water.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Fire
        this.load.spritesheet("player-attack-fire", "assets/player_assets/player_attack/fire.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // Lightning
        this.load.spritesheet("player-attack-lightning", "assets/player_assets/player_attack/lightning.png", {
            frameWidth: 57,
            frameHeight: 51,
        });
        // ------ Hero Projectiles (Active + Impact) ------
        // Earth
        this.load.spritesheet("earth-active", "assets/player_assets/player_projectiles/player_projectile/merfolkprojectileearth.png", {
            frameWidth: 20,
            frameHeight: 20,
        });
        this.load.spritesheet("earth-impact", "assets/player_assets/player_projectiles/projectile_impact/earthimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        // Fire
        this.load.spritesheet("fire-active", "assets/player_assets/player_projectiles/player_projectile/merfolkprojectilefire.png", {
            frameWidth: 20,
            frameHeight: 20,
        });
        this.load.spritesheet("fire-impact", "assets/player_assets/player_projectiles/projectile_impact/fireimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        // Water
        this.load.spritesheet("water-active", "assets/player_assets/player_projectiles/player_projectile/merfolkprojectilewater.png", {
            frameWidth: 20,
            frameHeight: 20,
        });
        this.load.spritesheet("water-impact", "assets/player_assets/player_projectiles/projectile_impact/waterimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        // Air
        this.load.spritesheet("air-active", "assets/player_assets/player_projectiles/player_projectile/merfolkprojectileair.png", {
            frameWidth: 20,
            frameHeight: 20,
        });
        this.load.spritesheet("air-impact", "assets/player_assets/player_projectiles/projectile_impact/airimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        // Lightning
        this.load.spritesheet("lightning-active", "assets/player_assets/player_projectiles/player_projectile/merfolkprojectilelightning.png", {
            frameWidth: 20,
            frameHeight: 20,
        });
        this.load.spritesheet("lightning-impact", "assets/player_assets/player_projectiles/projectile_impact/lightningimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        // Flares
        this.load.atlas("flares", "assets/particles/flares.png", "assets/particles/flares.json");
        // Appraiser Scale
        this.load.spritesheet("scale", "assets/appraiser/scale.png", {
            frameWidth: 128,
            frameHeight: 128,
        });

        // ------ Trident ------
        this.load.spritesheet("trident", "assets/victory_screen/trident.png", {
            frameWidth: 32,
            frameHeight: 64,
        });
    }

    loadAnims() {
        /*
         * ======== LOAD ANIMATIONS ========
         */
        // Background Animation
        // this.anims.create({
        //     key: "harbor-bg-anim",
        //     frames: this.anims.generateFrameNumbers("harbor"),
        //     frameRate: 5,
        //     repeat: -1,
        // });
        this.anims.create({
            key: "appraiser-loop",
            frames: this.anims.generateFrameNames("appraiser-sprite"),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: "bilgewater-loop",
            frames: this.anims.generateFrameNames("bilgewater"),
            frameRate: 8,
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
        // ------ ATTACKING ------
        this.anims.create({
            key: "player-attackEarth",
            frames: this.anims.generateFrameNumbers("player-attack-earth"),
            frameRate: 11,
            repeat: 0,
        });
        this.anims.create({
            key: "player-attackAir",
            frames: this.anims.generateFrameNumbers("player-attack-air"),
            frameRate: 11,
            repeat: 0,
        });
        this.anims.create({
            key: "player-attackWater",
            frames: this.anims.generateFrameNumbers("player-attack-water"),
            frameRate: 11,
            repeat: 0,
        });
        this.anims.create({
            key: "player-attackFire",
            frames: this.anims.generateFrameNumbers("player-attack-fire"),
            frameRate: 11,
            repeat: 0,
        });
        this.anims.create({
            key: "player-attackLightning",
            frames: this.anims.generateFrameNumbers("player-attack-lightning"),
            frameRate: 11,
            repeat: 0,
        });

        // ====== BULLETS ======
        this.anims.create({
            key: "earth-active",
            frames: this.anims.generateFrameNumbers("earth-active"),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "earth-impact",
            frames: this.anims.generateFrameNumbers("earth-impact"),
            frameRate: 16,
            repeat: 0,
        });
        // Air
        this.anims.create({
            key: "air-active",
            frames: this.anims.generateFrameNumbers("air-active"),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "air-impact",
            frames: this.anims.generateFrameNumbers("air-impact"),
            frameRate: 16,
            repeat: 0,
        });
        // Water
        this.anims.create({
            key: "water-active",
            frames: this.anims.generateFrameNumbers("water-active"),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: "water-impact",
            frames: this.anims.generateFrameNumbers("water-impact"),
            frameRate: 8,
            repeat: 0,
        });
        // Fire
        this.anims.create({
            key: "fire-active",
            frames: this.anims.generateFrameNumbers("fire-active"),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "fire-impact",
            frames: this.anims.generateFrameNumbers("fire-impact"),
            frameRate: 8,
            repeat: 0,
        });
        // Lightning
        this.anims.create({
            key: "lightning-active",
            frames: this.anims.generateFrameNumbers("lightning-active"),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "lightning-impact",
            frames: this.anims.generateFrameNumbers("lightning-impact"),
            frameRate: 8,
            repeat: 0,
        });

        // Scale Loop
        this.anims.create({
            key: "scale-loop",
            frames: this.anims.generateFrameNumbers("scale"),
            frameRate: 8,
            repeat: -1,
        });
    }

    create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.input.mouse.disableContextMenu();

        this.loadEventHandlers();
        this.loadAnims();
        this.addMap();

        this.addScaleObject();
        this.addFatass();
        this.addHero();

        this.backgroundmusic = this.sound.add("atlantis-song");
        this.playBackgroundMusic();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.fadeIn(750);
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(this.hero, true, 0.08, 0.08);
        this.cameras.main.setFollowOffset(-40, 140);

        this.hoverTimer = 0;

        this.input.keyboard.on("keydown-Q", () => {
            if (!this.scaleObject.body.touching.none || this.scaleObject.body.embedded) {
                this.openDashboard();
            }
        });
        this.input.keyboard.on("keydown-R", () => {
            if (!this.scaleObject.body.touching.none || this.scaleObject.body.embedded) {
                let txt = dialogue.dialogue[this.getRandInt(Object.keys(dialogue.dialogue).length)];
                events.emit("dialogue", { speaker: "Bilgeworth Tendermint, Treasury Financier", dialogue: txt });
            }
        });
    }

    loadEventHandlers() {
        events.on("resume", () => {
            this.hero.resetMovements();
        });
    }

    addHero() {
        this.hero = new Hero(this, this.spawnPos.x, this.spawnPos.y);
        this.groundCollider = this.physics.add.collider(this.hero, this.map.getLayer("Collide").tilemapLayer);
        this.physics.add.overlap(this.hero, this.scaleObject, () => {
            if (this.hoverTimer == 0) {
                events.emit("notification", ["Press Q to access Dashboard", "Press R to speak"]);
                this.hoverTimer++;
            }
        });
    }

    addFatass() {
        this.bilgewater = this.physics.add.sprite(this.bilgewaterSpawn.x, this.bilgewaterSpawn.y, "bilgewater");
        this.physics.add.collider(this.bilgewater, this.map.getLayer("Collide").tilemapLayer);
        this.bilgewater.play("bilgewater-loop");
        this.bilgewater.setScale(2);
    }

    addScaleObject() {
        this.scaleObject = this.physics.add.sprite(this.scaleSpawn.x, this.scaleSpawn.y - 32, "scale");
        this.scaleObject.play("scale-loop");
        this.scaleObject.body.setSize(256, 32);
        this.scaleObject.body.setOffset(-64, 100);
        this.scaleObject.setImmovable(true);
        this.physics.add.collider(this.scaleObject, this.map.getLayer("Collide").tilemapLayer);
        this.scaleObject.setScale(0.5);
    }

    addMap() {
        this.map = this.make.tilemap({ key: "appraiser-map" });

        const backgroundLoop = this.add.sprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2 - 120, "appraiser-sprite").setOrigin(0.5, 0.5);
        backgroundLoop.play("appraiser-loop");
        backgroundLoop.scale = 3.2;

        const groundTiles = this.map.addTilesetImage("appraiser", "appraiser-tileset");

        const collisionLayer = this.map.createLayer("Collide", groundTiles);
        const backgroundLayer = this.map.createLayer("Background", groundTiles);
        //const decorationLayer = this.map.createStaticLayer('Decoration' , groundTiles)

        collisionLayer.setCollision([0, 1, 2, 3, 4, 8, 9, 10, 11, 12], true);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBoundsCollision(true, true, false, true);

        this.map.getObjectLayer("Objects").objects.forEach(object => {
            if (object.name === "Start") {
                this.spawnPos = { x: object.x, y: object.y };
            }
            if (object.name === "ScaleSpawn") {
                this.scaleSpawn = { x: object.x, y: object.y };
            }
            if (object.name === "Fatty") {
                this.bilgewaterSpawn = { x: object.x, y: object.y };
            }
        });
    }

    openStakingMenu() {
        if (!this.scene.isActive("FreezeScreen")) {
            this.showStaking();
            this.scene.launch("FreezeScreen", "AppraiserScene");
        } else return;
    }

    update(t, d) {
        super.update(t, d);
        if (this.hoverTimer > 0) {
            this.hoverTimer += d;
            if (this.hoverTimer >= 3000) this.hoverTimer = 0;
        }
    }
}

Object.assign(AppraiserScene.prototype, baseSceneMixin);
Object.assign(AppraiserScene.prototype, frontendControlsMixin);
Object.assign(AppraiserScene.prototype, loadingBar);

export default AppraiserScene;
