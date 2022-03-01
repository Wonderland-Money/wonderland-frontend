import Phaser from "phaser";
import Hero from "../entities/Hero";

import baseSceneMixin from "./mixins/baseSceneMixin";
import frontendControlsMixin from "./mixins/frontendControlsMixin";
import { sharedInstance as events } from "../managers/EventCenter";

class ForgeScene extends Phaser.Scene {
    constructor() {
        super({ key: "ForgeScene" });
    }
    preload() {
        let { width, height } = this.sys.game.canvas;
        // PROGRESS BAR
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        let loaderBg = this.add.graphics();
        let loadingText = this.make
            .text({
                x: width / 2,
                y: height / 2,
                text: "Loading...",
                fontSize: 34,
                color: "#0f0f0f",
                fontFamily: "compass",
            })
            .setOrigin(0.5);
        let loadingItemText = this.make
            .text({
                x: width / 2,
                y: height / 2 + 42,
                text: "",
                fontSize: 34,
                color: "#0f0f0f",
                fontFamily: "compass",
            })
            .setOrigin(0.5);
        loaderBg.fillStyle(0x0a0a0a, 0.4);
        loaderBg.fillRect(0, 0, width, height);
        progressBox.fillStyle(0xefefef, 0.8);
        progressBox.fillRect(width / 2 - 210, height / 2 - 30, 420, 60);

        this.loadSpritesAndShit();
        this.loadAudioShit();

        this.load.on("progress", function (value) {
            try {
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(width / 2 - 195, height / 2 - 15, 390 * value, 30);
                loadingText.setText(parseInt(value * 100) + "%");
            } catch (e) {
                // doesn't matter
            }
        });

        this.load.on("fileprogress", function (file) {
            try {
                loadingItemText.setText(file.key);
            } catch (e) {}
        });

        this.load.on("complete", function () {
            progressBar.destroy();
            progressBox.destroy();
            loaderBg.destroy();
            loadingText.destroy();
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
        this.load.tilemapTiledJSON("forge", "assets/tilemap/forge.json");
        // Tilesheet
        this.load.image("tileset", "assets/tilesets/castlestone.png");

        // ------ Background ------
        this.load.image("forge", "assets/forge/alchemistforge.png", {
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
    }

    create() {
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.input.mouse.disableContextMenu();

        this.loadEventHandlers();
        this.loadAnims();
        this.addMap();

        this.addHero();

        this.backgroundmusic = this.sound.add("atlantis-song");
        this.playBackgroundMusic();

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.fadeIn(750);
        this.cameras.main.setZoom(1);
        this.cameras.main.startFollow(this.hero, true, 0.08, 0.08);

        // PAUSE MENU CONTROLS
        this.input.keyboard.on("keydown-ESC", () => {
            this.scene.launch("PauseMenu", "ForgeScene");
            this.scene.pause();
        });

        // this.toast = this.rexUI.add.toast({
        //   x: this.harborKeeperSpawn.x,
        //   y: this.harborKeeperSpawn.y - 80,
        //   background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 12, '#222222'),
        //   text: this.add.text(0, 0, '', {
        //       fontSize: '16px',
        //       fontFamily: "compass"
        //   }),
        //   space: {
        //       left: 12,
        //       right: 12,
        //       top: 12,
        //       bottom: 12,
        //   },
        //   transitIn: 1,
        //   transitOut: 1,
        // })
    }

    loadEventHandlers() {
        events.on("resume", () => {
            this.hero.resetMovements();
        });
    }

    addHero() {
        this.hero = new Hero(this, this.spawnPos.x, this.spawnPos.y);
        this.groundCollider = this.physics.add.collider(this.hero, this.map.getLayer("Collide").tilemapLayer);

        this.physics.add.overlap(this.hero, this.harborKeeper, () => {
            if (this.hoverTimer == 0) {
                this.toast.showMessage("Press Q");
                this.hoverTimer++;
                console.log("Sneed");
            } else {
                this.hoverTimer++;
                if (this.hoverTimer == 2000) this.hoverTimer = 0;
            }
        });
    }

    addMap() {
        this.map = this.make.tilemap({ key: "forge" });

        const backgroundImage = this.add.image(this.map.widthInPixels / 2, this.map.heightInPixels / 2, "forge").setOrigin(0.5, 0.5);
        // const backgroundSprite = this.add.sprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2, 'harbor-bg-anim').setOrigin(0.5, 0.5).setScrollFactor(0.7)
        backgroundImage.scale = 0.8;
        // backgroundSprite.play('harbor-bg-anim')
        //backgroundSprite.setFrame(0)

        const groundTiles = this.map.addTilesetImage("castlestone", "tileset");

        const collisionLayer = this.map.createLayer("Collide", groundTiles);
        const backgroundLayer = this.map.createLayer("Background", groundTiles);
        //const decorationLayer = this.map.createStaticLayer('Decoration' , groundTiles)

        collisionLayer.setCollision([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 52, 82], true);

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBoundsCollision(true, true, false, true);

        this.map.getObjectLayer("Objects").objects.forEach(object => {
            if (object.name === "Start") {
                this.spawnPos = { x: object.x, y: object.y };
            }
            if (object.name === "Alchemist") {
                this.harborKeeperSpawn = { x: object.x, y: object.y };
            }
        });
    }

    openStakingMenu() {
        if(!this.scene.isActive("FreezeScreen")) {
            this.showStaking()
            this.scene.launch("FreezeScreen", "ForgeScene");
        } else return
    }

    update(t, d) {
        super.update(t, d);
    }
}

Object.assign(ForgeScene.prototype, baseSceneMixin);
Object.assign(ForgeScene.prototype, frontendControlsMixin);

export default ForgeScene;
