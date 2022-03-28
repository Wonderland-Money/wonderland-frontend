import Phaser from "phaser";
import Hero from "../entities/Hero";

import { sharedInstance as events } from "../managers/EventCenter";

import baseSceneMixin from "./mixins/baseSceneMixin";
import frontendControlsMixin from "./mixins/frontendControlsMixin";
import loadingBar from "./mixins/loadingBar";

import dialogue from "./dialogue/Harbor.json";
import denied from "./dialogue/HarborDenied.json";
import secret from "./dialogue/textblocks/secrets/Secret1.json";

import Scroll from "../entities/items/Scroll";

import variables from "../managers/Variables";

class HarborScene extends Phaser.Scene {
    constructor() {
        super({ key: "HarborScene" });
    }

    preload() {
        this.loadingBar(() => {
            this.loadSpritesAndShit();
            this.loadAudioShit();
        });
        // this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
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
        this.load.tilemapTiledJSON("harbor", "assets/tilemap/harbor.json");
        // Tilesheet
        this.load.spritesheet("harbor-tileset", "assets/tilesets/harbor.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.image("void-tileset", "assets/tilesets/void.png");

        // ------ Background ------
        this.load.spritesheet("harbor", "assets/harbor/harbor.png", {
            frameWidth: 480,
            frameHeight: 270,
        });
        // ------ Harbor Keeper ------
        this.load.spritesheet("harbor-keeper-loop", "assets/harbor/harbor_keeper.png", {
            frameWidth: 40,
            frameHeight: 64,
        });
        // ------ Fire ------
        this.load.spritesheet("fire-loop", "assets/harbor/harbor_fire.png", {
            frameWidth: 60,
            frameHeight: 33,
        });
        // ------ Catfish ------
        this.load.spritesheet("catfish-loop", "assets/harbor/presale_catfish.png", {
            frameWidth: 128,
            frameHeight: 128,
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

        // ------ Trident ------
        this.load.spritesheet("trident", "assets/victory_screen/trident.png", {
            frameWidth: 32,
            frameHeight: 64,
        });

        // Scroll
        this.load.spritesheet("scroll", "assets/entities/scroll.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    loadAnims() {
        /*
         * ======== LOAD ANIMATIONS ========
         */
        // Background Animation
        this.anims.create({
            key: "harbor-bg-anim",
            frames: this.anims.generateFrameNumbers("harbor"),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "trident-glow",
            frames: this.anims.generateFrameNumbers("trident"),
            frameRate: 6,
            repeat: -1,
        });
        /**
         * ====== HARBOR ======
         */
        // Harbor Keeper Loop
        this.anims.create({
            key: "harbor-keeper-loop",
            frames: this.anims.generateFrameNumbers("harbor-keeper-loop"),
            frameRate: 12,
            repeat: -1,
        });
        // Fire
        this.anims.create({
            key: "fire-loop",
            frames: this.anims.generateFrameNumbers("fire-loop"),
            frameRate: 12,
            repeat: -1,
        });
        // Catfish
        this.anims.create({
            key: "catfish-loop",
            frames: this.anims.generateFrameNames("catfish-loop"),
            frameRate: 12,
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

        this.anims.create({
            key: "scroll",
            frames: this.anims.generateFrameNames("scroll"),
            frameRate: 1,
            repeat: -1,
        });
    }

    create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.input.mouse.disableContextMenu();

        this.loadEventHandlers();
        this.loadAnims();
        this.addMap();

        this.addHarborKeeper();
        this.addFire();
        this.addHero();
        this.addCatfish();
        this.addItems();

        this.catfishMoveTimer = 0;

        this.lights.enable();
        this.lights.setAmbientColor(0x808080);

        this.heroSpotlight = this.lights.addLight(this.hero.body.x, this.hero.body.y, 400, 0xffcf51).setIntensity(1.5);
        this.fireLight = this.lights.addLight(this.fire.body.center.x, this.fire.body.center.y, 300, 0xffcf51, 2);
        this.catfishGlow = this.lights.addLight(this.catfish.body.center.x, this.catfish.body.center.y, 300, 0xffcf51, 2);
        this.storedLights = {};
        this.storedLights.orbs = [];
        this.storedLights.lanterns = [];

        // Adds subtle purple lights to orbs
        this.lightLocations.forEach(loc => {
            this.storedLights.orbs.push(this.lights.addLight(loc[0], loc[1], 120, 0x7b359e, 1));
        });
        this.lanterns.getChildren().forEach(lantern => {
            this.storedLights.lanterns.push(this.lights.addLight(lantern.body.center.x, lantern.body.center.y, 100, 0xffcf51, 3));
        });

        this.backgroundmusic = this.sound.add("atlantis-song");
        this.playBackgroundMusic();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.fadeIn(750);
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(this.hero, true, 0.08, 0.08);

        this.hoverTimer = 0;

        this.input.keyboard.on("keydown-Q", () => {
            if (!this.harborKeeper.body.touching.none || this.harborKeeper.body.embedded) {
                if (variables.gameState.accountIsGoatedWithTheSauce) this.openBondingMenu();
                else {
                    let txt = denied.dialogue[this.getRandInt(Object.keys(denied.dialogue).length)];
                    events.emit("dialogue", { speaker: "Mysterious Monk", dialogue: txt });
                }
            }
            if (!this.catfish.body.touching.none || this.catfish.body.embedded) {
                this.openPresaleMenu();
            }
        });
        this.input.keyboard.on("keydown-R", () => {
            if (!this.harborKeeper.body.touching.none || this.harborKeeper.body.embedded) {
                if (variables.gameState.accountIsGoatedWithTheSauce) {
                    let txt = dialogue.dialogue[this.getRandInt(Object.keys(dialogue.dialogue).length)];
                    events.emit("dialogue", { speaker: "Tidemaster Logii", dialogue: txt });
                } else {
                    let txt = denied.dialogue[this.getRandInt(Object.keys(denied.dialogue).length)];
                    events.emit("dialogue", { speaker: "Mysterious Monk", dialogue: txt });
                }
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
        // this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.groundCollider = this.physics.add.collider(this.hero, this.map.getLayer("Collide").tilemapLayer);

        this.physics.add.overlap(this.hero, this.harborKeeper, () => {
            if (this.hoverTimer == 0) {
                events.emit("notification", ["Press Q to access Bonding", "Press R to speak"]);
                this.hoverTimer++;
            }
        });
    }

    addHarborKeeper() {
        this.harborKeeper = this.physics.add.sprite(this.harborKeeperSpawn.x, this.harborKeeperSpawn.y, "harbor-keeper").setOrigin(0.5, 1).setPipeline("Light2D");
        this.harborKeeper.body.setSize(40, 64);
        this.harborKeeper.body.setOffset(0, 0);
        this.harborKeeper.play("harbor-keeper-loop");
        this.physics.add.collider(this.harborKeeper, this.map.getLayer("Collide").tilemapLayer);
    }

    addFire() {
        this.fire = this.physics.add
            .sprite(this.harborKeeperSpawn.x - 50, this.harborKeeperSpawn.y, "fire")
            .setOrigin(0.5, 1)
            .setPipeline("Light2D");
        this.fire.play("fire-loop");
        this.physics.add.collider(this.fire, this.map.getLayer("Collide").tilemapLayer);
    }

    addCatfish() {
        this.catfish = this.physics.add.sprite(this.catfishSpawn.x, this.catfishSpawn.y - 30, "catfish").setOrigin(0.5, 1);
        this.catfish.body.setMaxVelocity(150, 600);
        this.catfish.body.setDragX(650);
        this.catfish.body.setSize(128, 128);
        this.catfish.body.setOffset(0, 0);
        this.catfish.body.setCollideWorldBounds(true);
        this.catfish.setScale(0.5);
        this.catfish.play("catfish-loop");
        this.physics.add.collider(this.catfish, this.map.getLayer("Collide").tilemapLayer);
        this.physics.add.overlap(this.catfish, this.hero, () => {
            if (this.hoverTimer == 0) {
                events.emit("notification", "Press Q to access Claiming");
                this.hoverTimer++;
            }
        });
    }

    addItems() {
        if (variables.gameState.accountIsGoatedWithTheSauce) {
            this.scroll = new Scroll(this, this.scrollSpawn.x, this.scrollSpawn.y, secret, [this.hero]);
            this.scroll.addParticles("yellow");
            this.scroll.addCollideCallback(this.hero, () => {
                if (this.hoverTimer == 0) {
                    events.emit("notification", "Press R to read scroll");
                    this.hoverTimer++;
                }
            });
        } else return;
    }

    addMap() {
        this.map = this.make.tilemap({ key: "harbor" });

        const backgroundSprite = this.add
            .sprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2, "harbor-bg-anim")
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0.9)
            .setPipeline("Light2D");
        backgroundSprite.scale = 3.8;
        backgroundSprite.play("harbor-bg-anim");
        //backgroundSprite.setFrame(0)

        const groundTiles = this.map.addTilesetImage("harbor", "harbor-tileset");
        const voidTiles = this.map.addTilesetImage("void", "void-tileset");

        const collisionLayer = this.map.createLayer("Collide", groundTiles).setPipeline("Light2D");

        const backgroundLayer = this.map.createLayer("Background", groundTiles).setPipeline("Light2D");
        //const decorationLayer = this.map.createStaticLayer('Decoration' , groundTiles)

        collisionLayer.setCollision([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 52, 82], true);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBoundsCollision(true, true, false, true);

        this.lightLocations = [];

        collisionLayer.forEachTile(tile => {
            if (tile.index == 19) {
                this.lightLocations.push([tile.getCenterX(this.cameras.main), tile.getCenterY(this.cameras.main)]);
            }
        }, this);

        this.lanterns = this.physics.add.group({ immovable: true, allowGravity: false });

        this.map.getObjectLayer("Objects").objects.forEach(object => {
            if (object.name === "Start") {
                this.spawnPos = { x: object.x, y: object.y };
            }
            if (object.name === "HarborKeeper") {
                this.harborKeeperSpawn = { x: object.x, y: object.y };
            }
            if (object.name === "Catfish") {
                this.catfishSpawn = { x: object.x, y: object.y };
            }
            if (object.name === "Scroll") {
                this.scrollSpawn = { x: object.x, y: object.y }; // 1/100 chance of spawning the 1st secret scroll.
            }
            if (object.type === "Lantern") {
                let l = this.lanterns.create(object.x, object.y, "harbor-tileset", object.gid - 1).setOrigin(0, 1);
                l.body.setSize(16, 16);
                l.body.setOffset(8, 16);
            }
        });
    }

    update(t, d) {
        super.update(t, d);
        if (this.hoverTimer > 0) {
            this.hoverTimer += d;
            if (this.hoverTimer >= 3000) this.hoverTimer = 0;
        }

        this.catfishMoveTimer += d;
        if (this.catfishMoveTimer >= 1000) {
            let rand = this.getRandInt(100);
            let flip;
            rand > 50 ? ((flip = 1), this.catfish.setFlipX(true)) : ((flip = -1), this.catfish.setFlipX(false));
            this.catfish.body.setAccelerationX(50 * flip);
            this.catfishMoveTimer = 0;
        }

        this.heroSpotlight.setPosition(this.hero.body.center.x, this.hero.body.center.y);
        this.catfishGlow.setPosition(this.catfish.body.center.x, this.catfish.body.center.y);
    }
}

Object.assign(HarborScene.prototype, baseSceneMixin);
Object.assign(HarborScene.prototype, frontendControlsMixin);
Object.assign(HarborScene.prototype, loadingBar);

export default HarborScene;
