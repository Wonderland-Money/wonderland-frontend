import Phaser from "phaser";
import Hero from "../entities/Hero";
import Boss from "../entities/Boss";

import HeroAttackGroup from "../entities/HeroAttackGroup";
import ProtectionOrbGroup from "../entities/ProtectionOrbGroup";
import CrystalGroup from "../entities/CrystalGroup";
import TentacleGroup from "../entities/TentacleGroup";
import EnergySphereGroup from "../entities/EnergySphereGroup";

import baseSceneMixin from "./mixins/baseSceneMixin";
import frontendControlsMixin from "./mixins/frontendControlsMixin";
import loadingBar from "./mixins/loadingBar";

import { sharedInstance as events } from "../managers/EventCenter";
import variables from "../managers/Variables";

class Game extends Phaser.Scene {
    constructor() {
        super({ key: "GameScene" });
    }

    preload() {
        this.loadingBar(() => {
            this.loadAudioShit();
            this.loadSpritesAndShit();
        });
    }

    loadAudioShit() {
        // ========= Audio =========

        // Music Easter-Egg
        this.load.audio("segaaa", "assets/audio/sega.mp3");
        // Music
        this.load.audio("background-music", "assets/audio/background-music 2.wav");
        this.load.audio("load-arena", "assets/audio/enter-arena.wav");
        // Hurt Sounds
        this.load.audio("player-hurt", "assets/audio/player-hurt.wav");
        this.load.audio("kraken-hurt", "assets/audio/kraken-hurt.wav");
        // Death
        this.load.audio("evil-laugh", "assets/audio/evil-laugh.wav");
        this.load.audio("player-death", "assets/audio/player-death.wav");
        this.load.audio("kraken-death", "assets/audio/kraken-death.wav");
        // Kraken Growls
        this.load.audio("kraken-growl-1", "assets/audio/kraken-growl-1.wav");
        this.load.audio("kraken-growl-2", "assets/audio/kraken-growl-2.wav");
        this.load.audio("kraken-growl-3", "assets/audio/kraken-growl-3.wav");
        this.load.audio("kraken-growl-4", "assets/audio/kraken-growl-4.wav");
        // Kraken Grunts
        this.load.audio("kraken-grunt", "assets/audio/kraken-grunt.wav");

        this.load.audio("switch-attack-audio", "assets/audio/switch-attacks.wav");
        this.load.audio("player-attack", "assets/audio/player-attack.wav");
        this.load.audio("kraken-attack", "assets/audio/kraken-attack.wav");
        this.load.audio("bullet-break", "assets/audio/bullet-break.wav");
        this.load.audio("orb-death", "assets/audio/orb-death.wav");

        this.load.audio("get-trident", "assets/audio/trident-grab.wav");
    }

    loadSpritesAndShit() {
        // ========= Tilemaps & Spritesheets =========

        // Map JSON
        this.load.tilemapTiledJSON("atlantis", "assets/tilemap/kraken_lair.json");
        // Tilesheet
        this.load.image("atlantis-tilemap", "assets/tilesets/castlestone.png");

        // ------ Kraken Character ------
        // Idle
        this.load.spritesheet("boss-idle", "assets/kraken_assets/krakengatekeeperidle.png", {
            frameWidth: 300,
            frameHeight: 300,
        });
        // Earth
        this.load.spritesheet("boss-attack-earth", "assets/kraken_assets/attack/attackearth.png", {
            frameWidth: 300,
            frameHeight: 300,
        });
        // Air
        this.load.spritesheet("boss-attack-air", "assets/kraken_assets/attack/attackair.png", {
            frameWidth: 300,
            frameHeight: 300,
        });
        // Water
        this.load.spritesheet("boss-attack-water", "assets/kraken_assets/attack/attackwater.png", {
            frameWidth: 300,
            frameHeight: 300,
        });
        // Fire
        this.load.spritesheet("boss-attack-fire", "assets/kraken_assets/attack/attackfire.png", {
            frameWidth: 300,
            frameHeight: 300,
        });
        // Lightning
        this.load.spritesheet("boss-attack-lightning", "assets/kraken_assets/attack/attacklightning.png", {
            frameWidth: 300,
            frameHeight: 300,
        });
        // Death
        this.load.spritesheet("boss-death", "assets/kraken_assets/krakengatekeeperdeath.png", {
            frameWidth: 300,
            frameHeight: 300,
        });
        // ------ Kraken Crystals Falling ------
        this.load.spritesheet("kraken-earth-crystal", "assets/kraken_assets/crystal_falling/earthcrystal.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("kraken-air-crystal", "assets/kraken_assets/crystal_falling/aircrystal.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("kraken-water-crystal", "assets/kraken_assets/crystal_falling/watercrystal.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("kraken-fire-crystal", "assets/kraken_assets/crystal_falling/firecrystal.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("kraken-lightning-crystal", "assets/kraken_assets/crystal_falling/lightningcrystal.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        // ------ Kraken Crystals Impact ------
        this.load.spritesheet("kraken-earth-impact", "assets/kraken_assets/crystal_impact/earthimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("kraken-air-impact", "assets/kraken_assets/crystal_impact/airimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("kraken-water-impact", "assets/kraken_assets/crystal_impact/waterimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("kraken-fire-impact", "assets/kraken_assets/crystal_impact/fireimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("kraken-lightning-impact", "assets/kraken_assets/crystal_impact/lightningimpact.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        // ------ Tentacles ------
        this.load.spritesheet("tentacle-earth", "assets/tentacle/tentacleattackearth.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("tentacle-air", "assets/tentacle/tentacleattackair.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("tentacle-water", "assets/tentacle/tentacleattackwater.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("tentacle-fire", "assets/tentacle/tentacleattackfire.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        this.load.spritesheet("tentacle-lightning", "assets/tentacle/tentacleattacklightning.png", {
            frameWidth: 64,
            frameHeight: 64,
        });
        // ------ Energy Spheres ------
        this.load.spritesheet("spawn-rage", "assets/kraken_assets/rage_attack/spawn-rage.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("rage-attack", "assets/kraken_assets/rage_attack/rage-attack.png", {
            frameWidth: 32,
            frameHeight: 32,
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
        // ------ Protection Orb ------
        this.load.spritesheet("protection-orb", "assets/kraken_assets/protection-orb.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        // ------ Background ------
        this.load.spritesheet("bg-sprite", "assets/kraken_assets/krakenstagesmall.png", {
            frameWidth: 480,
            frameHeight: 270,
        });
    }

    create(data) {
        this.hideUI();
        this.hideExitButton();

        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.input.mouse.disableContextMenu();
        // if (!this.scene.isActive("DeathScreen")) {
        //     this.scene.launch("GameUI").moveAbove("GameScene");
        // }

        this.loadAnims();
        this.loadEventHandlers();
        this.addMap();
        this.addBoss();
        this.addHero();
        this.addBullets();
        this.addEnergySpheres();
        this.addKrakenTentacles();
        this.addKrakenCrystals();

        this.graphicsManager = this.add.graphics();

        this.gameover = false;
        this.nextCycle();
        // Green, White, Blue, Red, Yellow
        this.elementColors = [0x00ff00, 0xffffff, 0x0000ff, 0xff5555, 0xffff00];
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.fadeIn(1500);

        this.cameras.main.pan(1050, 400, 1300, "Sine.easeIn");
        this.time.addEvent({
            delay: 1300,
            callback: () => {
                this.cameras.main.pan(this.hero.x, this.hero.y - 140, 700, "Sine.easeIn", true);
            },
        });

        this.cameras.main.startFollow(this.hero, true, 0.06, 0.06);
        this.cameras.main.setFollowOffset(-90, 140);
        //this.cameras.main.setZoom(0.9)
    }

    loadAnims() {
        /*
         * ======== LOAD ANIMATIONS ========
         */
        // Background Animation
        this.anims.create({
            key: "background-anim",
            frames: this.anims.generateFrameNumbers("bg-sprite"),
            frameRate: 5,
            repeat: -1,
        });
        this.anims.create({
            key: "trident-glow",
            frames: this.anims.generateFrameNumbers("trident"),
            frameRate: 6,
            repeat: -1,
        });
        this.anims.create({
            key: "protection-orb-glow",
            frames: this.anims.generateFrameNumbers("protection-orb"),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "rage-attack",
            frames: this.anims.generateFrameNumbers("rage-attack"),
            frameRate: 8,
            repeat: -1,
        });
        this.anims.create({
            key: "spawn-rage",
            frames: this.anims.generateFrameNumbers("spawn-rage"),
            frameRate: 8,
            repeat: 0,
        });
        /**
         * ====== BOSS ======
         */
        // Idle
        this.anims.create({
            key: "kraken-idle",
            frames: this.anims.generateFrameNumbers("boss-idle"),
            frameRate: 8,
            repeat: -1,
        });
        // Earth
        this.anims.create({
            key: "kraken-attackEarth",
            frames: this.anims.generateFrameNumbers("boss-attack-earth"),
            frameRate: 10,
            repeat: 0,
        });
        // Air Attack
        this.anims.create({
            key: "kraken-attackAir",
            frames: this.anims.generateFrameNumbers("boss-attack-air"),
            frameRate: 10,
            repeat: 0,
        });
        // Water Attack
        this.anims.create({
            key: "kraken-attackWater",
            frames: this.anims.generateFrameNumbers("boss-attack-water"),
            frameRate: 10,
            repeat: 0,
        });
        // Fire Attack
        this.anims.create({
            key: "kraken-attackFire",
            frames: this.anims.generateFrameNumbers("boss-attack-fire"),
            frameRate: 10,
            repeat: 0,
        });
        // Lightning Attack
        this.anims.create({
            key: "kraken-attackLightning",
            frames: this.anims.generateFrameNumbers("boss-attack-lightning"),
            frameRate: 10,
            repeat: 0,
        });
        // Death
        this.anims.create({
            key: "kraken-dead",
            frames: this.anims.generateFrameNumbers("boss-death"),
            frameRate: 8,
            repeat: 0,
        });
        // ------ BOSS CRYSTALS ------
        // Earth
        this.anims.create({
            key: "kraken-earth-crystal",
            frames: this.anims.generateFrameNumbers("kraken-earth-crystal"),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: "kraken-earth-impact",
            frames: this.anims.generateFrameNumbers("kraken-earth-impact"),
            frameRate: 12,
            repeat: 0,
        });
        // air
        this.anims.create({
            key: "kraken-air-crystal",
            frames: this.anims.generateFrameNumbers("kraken-air-crystal"),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: "kraken-air-impact",
            frames: this.anims.generateFrameNumbers("kraken-air-impact"),
            frameRate: 12,
            repeat: 0,
        });
        // water
        this.anims.create({
            key: "kraken-water-crystal",
            frames: this.anims.generateFrameNumbers("kraken-water-crystal"),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: "kraken-water-impact",
            frames: this.anims.generateFrameNumbers("kraken-water-impact"),
            frameRate: 12,
            repeat: 0,
        });
        // fire
        this.anims.create({
            key: "kraken-fire-crystal",
            frames: this.anims.generateFrameNumbers("kraken-fire-crystal"),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: "kraken-fire-impact",
            frames: this.anims.generateFrameNumbers("kraken-fire-impact"),
            frameRate: 12,
            repeat: 0,
        });
        // lightning
        this.anims.create({
            key: "kraken-lightning-crystal",
            frames: this.anims.generateFrameNumbers("kraken-lightning-crystal"),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: "kraken-lightning-impact",
            frames: this.anims.generateFrameNumbers("kraken-lightning-impact"),
            frameRate: 12,
            repeat: 0,
        });
        // ------ Tentacles ------
        // Earth
        this.anims.create({
            key: "tentacle-earth",
            frames: this.anims.generateFrameNumbers("tentacle-earth"),
            frameRate: 10,
            repeat: 0,
        });
        // Air
        this.anims.create({
            key: "tentacle-air",
            frames: this.anims.generateFrameNumbers("tentacle-air"),
            frameRate: 10,
            repeat: 0,
        });
        // Water
        this.anims.create({
            key: "tentacle-water",
            frames: this.anims.generateFrameNumbers("tentacle-water"),
            frameRate: 10,
            repeat: 0,
        });
        // Fire
        this.anims.create({
            key: "tentacle-fire",
            frames: this.anims.generateFrameNumbers("tentacle-fire"),
            frameRate: 10,
            repeat: 0,
        });
        // Lightning
        this.anims.create({
            key: "tentacle-lightning",
            frames: this.anims.generateFrameNumbers("tentacle-lightning"),
            frameRate: 8,
            repeat: 0,
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

    loadEventHandlers() {
        // LOAD AUDIOS
        let loadArena = this.sound.add("load-arena");

        loadArena.play();
        this.krakenGrowls = [];
        this.krakenGrowls.push(this.sound.add("kraken-growl-1"), this.sound.add("kraken-growl-2"), this.sound.add("kraken-growl-3"), this.sound.add("kraken-growl-4"));
        this.krakenGrunt = this.sound.add("kraken-grunt");
        this.backgroundmusic = this.sound.add("background-music");
        if (this.getRandInt(1000) === 1) {
            //this.getRandInt(200)
            // if(1 === 1)
            this.backgroundmusic = this.sound.add("segaaa");
            let baseStyles = ["color: #0000ff", "background-color: #ffffff", "font-size: 18px", "padding: 2px 4px", "border-radius: 2px", "font-weight: bold"].join(";");
            console.log("%c- S E G A -", baseStyles);
        }

        this.backgroundmusic.loop = true;

        this.playBackgroundMusic();

        let bossHurtSound = this.sound.add("kraken-hurt");
        let bossDeathSound = this.sound.add("kraken-death");

        let deathLaughter = this.sound.add("evil-laugh");
        let playerHurtSound = this.sound.add("player-hurt");
        let playerDeathSound = this.sound.add("player-death");

        let switchSound = this.sound.add("switch-attack-audio");

        /**
         * EVENTS
         */
        // ON PLAYER ATTACK
        events.on("player-attack", type => {
            //let attack = new Particle(this, this.hero.body.center, this.hero.body.center, type, this.hero.flip)
            this.heroBullets.fireProjectile(this.hero.body.center.x + this.hero.flip * 5, this.hero.body.center.y - 15, type, this.hero.flip);
        });
        // ON RESUME GAME
        this.events.on("resume", () => {
            this.sound.resumeAll();
            this.hero.resetMovements();
        });

        // PLAYER DEATH
        events.on("player-died", () => {
            this.cameras.main.zoomTo(1.42, 2000);
            this.krakenRageAttacking = false;
            //this.physics.world.removeCollider(this.groundCollider)
            /*
      this.time.addEvent({
        delay: 200,
        callback: () => {
          this.hero.body.allowGravity = false
        }
      }, this)
      */
            this.tweens.add({
                targets: this.hero,
                alpha: 0,
                ease: "Linear",
                duration: 1700,
            });
            this.tweens.add({
                targets: this.backgroundmusic,
                volume: 0,
                ease: "Linear",
                duration: 250,
            });
            this.scene.launch("DeathScreen");
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    deathLaughter.play();
                    this.scene.pause();
                    this.backgroundmusic.stop();
                },
            });
        });
        // PLAYER HIT
        events.on("player-hit", hp => {
            this.hero.setTint(0xff0000);
            if (hp <= 0) {
                playerDeathSound.play();
            } else {
                playerHurtSound.play();
            }
            this.cameras.main.flash(150);
            this.cameras.main.shake(150, 0.02);

            this.time.addEvent({
                delay: 200,
                callback: () => {
                    this.hero.clearTint();
                },
            });
        });
        // PLAYER SWITCH ATTACK
        events.on("switch-attack", () => {
            switchSound.play();
        });
        // RESET ORBS
        events.on("boss-change-phase", phase => {
            this.phase = phase;
            if (!this.gameover) {
                this.krakenRageAttacking = true;
                this.orbGroup.refresh(phase);
            }
            if (phase <= 4) {
                this.krakenGrowls[phase - 1].play();
                this.cameras.main.shake(800 + phase * 50, 0.01 + 0.0025 * phase);
                this.krakenCrystals.increaseSpeed();
            }
        });
        // BOSS ATTACK
        events.on("boss-attack", element => {
            if (this.krakenRageAttacking) {
                this.krakenRageAttack(this.phase);
            } else {
                this.fireKrakenCrystals(element, 0, this.cycle);
                this.fireTentacles(element);
            }
        });
        // BOSS HIT
        events.on("boss-hit", hp => {
            this.boss.setTint(0xff0000);
            if (hp <= 0) {
                this.bossKilled();
            } else {
                bossHurtSound.play();
            }
            this.time.addEvent({
                delay: 200,
                callback: () => {
                    this.boss.clearTint();
                },
            });
        });
        events.on("boss-died", () => {
            bossDeathSound.play();
            this.orbGroup.hideOrbs();
            this.energySpheres.killAll();
            if (!this.gameover) this.bossKilled();
        });
    }

    addHero() {
        this.hero = new Hero(this, this.spawnPos.x, this.spawnPos.y, true);
        this.hero.setDepth(1);
        this.hero.setTeleporting(true);
        this.hero.anims.play("player-teleporting");
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.hero.setTeleporting(false);
            },
        });
        this.groundCollider = this.physics.add.collider(this.hero, this.map.getLayer("Collide").tilemapLayer);
    }

    addBoss() {
        this.boss = new Boss(this, this.bossSpawnPos.x, this.bossSpawnPos.y);
        this.groundColliderBoss = this.physics.add.collider(this.boss, this.map.getLayer("Collide").tilemapLayer);
        // ORB
        this.orbGroup = new ProtectionOrbGroup(this);
        this.orbGroup.placeOrbs(this.boss.body.center.x - 80, this.boss.body.center.y - 280, 3);
        this.orbGroup.allowGravity = false;
    }

    addBullets() {
        this.heroBullets = new HeroAttackGroup(this);
        this.heroBullets.allowGravity = false;
        // Add bullet colliders
        this.groundColliderBullets = this.physics.add.collider(this.heroBullets, this.map.getLayer("Collide").tilemapLayer, bullet => {
            bullet.collide();
        });
        this.physics.add.overlap(this.heroBullets, this.boss, this.attackHitBoss);
        this.physics.add.overlap(this.heroBullets, this.orbGroup, (bullet, orb) => {
            if (orb.isAlive) {
                bullet.collide();
                orb.collide();
            }
        });
    }

    addMap() {
        this.map = this.make.tilemap({ key: "atlantis" });

        const backgroundSprite = this.add
            .sprite(this.map.widthInPixels / 2 - 40, this.map.heightInPixels / 2 + 50, "bg-sprite")
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0.9);
        backgroundSprite.scale = 3.9;
        backgroundSprite.play("background-anim");
        //backgroundSprite.setFrame(0)

        const groundTiles = this.map.addTilesetImage("Castlestone", "atlantis-tilemap");
        const backgroundLayer = this.map.createLayer("Background", groundTiles);
        this.collisionLayer = this.map.createLayer("Collide", groundTiles);
        const decorationLayer = this.map.createLayer("Decoration", groundTiles).setDepth(2);
        this.collisionLayer.setCollision([1, 2, 3, 4, 11, 12, 13, 14, 17, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44], true);
        console.log("Map Dimensions: " + this.map.widthInPixels + ", " + this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBoundsCollision(true, true, false, true);

        this.tentacleSpawns = [];
        this.groundTentacleSpawns = [];

        this.map.getObjectLayer("Objects").objects.forEach(object => {
            if (object.name === "Start") {
                this.spawnPos = { x: object.x, y: object.y };
            }
            if (object.name === "BossSpawn") {
                this.bossSpawnPos = { x: object.x, y: object.y };
            }
            if (object.name === "TSpawn" || object.name === "GroundTSpawn") {
                this.tentacleSpawns.push({ x: object.x, y: object.y });
            }
            if (object.name === "GroundTSpawn") {
                this.groundTentacleSpawns.push({ x: object.x, y: object.y });
            }
        });
    }

    addEnergySpheres() {
        this.energySpheres = new EnergySphereGroup(this);
        this.energySpheres.allowGravity = false;

        this.physics.add.overlap(this.energySpheres, this.hero, (hero, sphere) => {
            if (!sphere.colliding && !sphere.isActive) {
                hero.hit();
                sphere.collide();
            }
        });
        this.physics.add.overlap(this.energySpheres, this.heroBullets, (bullet, sphere) => {
            if (!bullet.colliding && sphere.alpha > 0.5) {
                bullet.collide();
                sphere.collide();
            }
        });
    }

    addKrakenTentacles() {
        this.tentacleGroup = new TentacleGroup(this);
        this.tentacleGroup.allowGravity = false;

        this.physics.add.overlap(this.tentacleGroup, this.hero, (hero, tentacle) => {
            if (tentacle.attacking) {
                tentacle.kill();
                hero.hit();
            }
        });
    }

    addKrakenCrystals() {
        this.krakenCrystals = new CrystalGroup(this);
        this.krakenCrystals.allowGravity = false;

        this.physics.add.overlap(this.krakenCrystals, this.hero, (hero, crystal) => {
            crystal.collide();
            hero.hit();
        });
        this.physics.add.overlap(this.krakenCrystals, this.heroBullets, (bullet, crystal) => {
            if (crystal.body.center.x > 0 && bullet.type != crystal.type) {
                crystal.collide();
                bullet.collide();
                crystal.scene.sound.add("bullet-break").play();
            } else bullet.collide();
        });
    }

    teleportHero() {
        this.hero.setTeleporting(true);
        this.hero.anims.play("player-teleporting");
        this.time.addEvent({
            delay: 1600,
            callback: () => {
                this.hero.setPosition(this.spawnPos.x, this.spawnPos.y);
                this.hero.setTeleporting(false);
            },
        });
    }

    attackHitBoss(kraken, attack) {
        if (attack.type == kraken.currentElement) {
            if (attack.body.y < 380) {
                kraken.scene.cameras.main.shake(100, 0.01);
                kraken.hit(2);
                //this.krakenGrunts[this.getRandInt(3)].play()
            } else {
                kraken.hit();
            }
        } else {
            kraken.scene.sound.add("bullet-break").play();
        }
        attack?.collide();
    }

    fireAllGroundTentacles(element) {
        for (let i = 0; i < this.groundTentacleSpawns.length; ++i) {
            if (this.groundTentacleSpawns[i].x < this.gap || this.groundTentacleSpawns[i].x > this.gap + 120) {
                this.tentacleGroup.placeTentacle(this.groundTentacleSpawns[i].x, this.groundTentacleSpawns[i].y - 26, element);
            }
        }
        return;
    }

    fireTentacles(element) {
        const chance = this.getRandInt(10);

        if (chance === 1) {
            this.fireAllGroundTentacles(element);
        } else {
            for (let i = 0; i < 5; ++i) {
                const randSpawn = this.getRandInt(this.tentacleSpawns.length);
                if (this.tentacleSpawns[randSpawn].x < this.gap - 20 || this.tentacleSpawns[randSpawn].x > this.gap + 120 + 20) {
                    this.tentacleGroup.placeTentacle(this.tentacleSpawns[randSpawn].x, this.tentacleSpawns[randSpawn].y - 26, element);
                } else {
                    --i;
                }
            }
        }
    }

    fireKrakenCrystals(element, iteration, cycle) {
        let xCoord = cycle !== 2 ? (25 - this.boss.phase) * iteration + this.getRandInt(25) : 20;
        const MAX = 950;
        if (iteration === 0 && cycle !== 2) {
            this.clearSafeZone();
            this.drawSafeZone(element);
        }
        if (xCoord > MAX || iteration > 50) {
            this.nextCycle();
            return;
        }
        let i = iteration + 1;
        switch (cycle) {
            case 0:
                if (900 - xCoord < this.gap || 870 - xCoord > this.gap + 120) this.krakenCrystals.fireCrystal(900 - xCoord, -30, element);
                break;
            case 1:
                if (xCoord < this.gap || xCoord > this.gap + 120) this.krakenCrystals.fireCrystal(xCoord, -30, element);
                break;
            case 2:
                this.clearSafeZone();
                this.krakenCrystals.fireCrystal(this.getRandInt(MAX), -30, element);
                break;
            case 3:
                if (900 - xCoord < this.gap || 870 - xCoord > this.gap + 120) this.krakenCrystals.fireCrystal(900 - xCoord, -30, element);
                break;
            case 4:
                if (xCoord < this.gap || xCoord > this.gap + 120) this.krakenCrystals.fireCrystal(xCoord, -30, element);
                break;
        }
        this.time.delayedCall(cycle !== 2 ? 15 : 50, () => {
            this.fireKrakenCrystals(element, i, cycle);
        });
    }

    krakenRageAttack(phase) {
        this.energySpheres.spawnEnergySpheres(this.boss.body.center.x, this.boss.body.center.y, phase, this.hero);
        this.krakenRageAttacking = false;
    }

    drawSafeZone(ele) {
        this.graphicsManager.fillStyle(this.elementColors[ele], 0.2);
        this.graphicsManager.fillRect(this.gap + 8, 0, 130 - 8, this.map.heightInPixels);
        this.graphicsManager.alpha = 0;
        this.tweens.add({
            targets: this.graphicsManager,
            alpha: 1,
            duration: 750,
            yoyo: true,
            ease: "Sine.easeIn",
        });
        /*
    this.collisionLayer.forEachTile((tile) => {
      let centerX = tile.getCenterX()
      
      if(centerX > this.gap && centerX < (this.gap + 130)) {
        console.log("Tile found")
        let y = tile.getTop()
        this.graphicsManager.lineBetween(this.gap, y, this.gap + 130, y)
      }
    })*/
    }

    clearSafeZone() {
        // this.tweens.add({
        //   targets: this.graphicsManager,
        //   alpha: 0,
        //   duration: 500,
        //   ease: 'Sine.easeIn'
        // })
        this.time.delayedCall(1500, () => {
            this.graphicsManager.clear();
        });
    }

    nextCycle() {
        this.cycle = this.getRandInt(5);
        let rand = this.getRandInt(675) + 75;
        if (Math.abs(this.gap - rand) < 100) this.nextCycle();
        else this.gap = rand;
    }

    bossKilled() {
        let baseStyles = ["color: #bb2222", "background-color: #222222", "font-size: 18px", "padding: 2px 4px", "border-radius: 2px"].join(";");
        console.log("%cThe boss is dead w00t!", baseStyles);

        // Spawn Trident sprite with bounce
        let trident = this.physics.add.sprite(this.boss.body.center.x, this.boss.body.center.y - 50, "trident");
        this.physics.add.collider(trident, this.map.getLayer("Collide").tilemapLayer);
        trident.setBounce(0.4);
        trident.anims.play("trident-glow");
        this.krakenRageAttacking = false;
        this.phase = 0;
        this.gameover = true;
        this.physics.add.overlap(this.hero, trident, (hero, trident) => {
            trident.body.setAllowGravity(false);
            trident.body.setAccelerationY(-400);
            this.sound.add("get-trident").play();
            this.cameras.main.fadeOut(1800, 255, 255, 255);
            this.scene.get("GameUI").cameras.main.fadeOut(1800, 255, 255, 255);
            // Opens menu to go to next screen
            this.tweens.add({
                targets: this.backgroundmusic,
                volume: 0,
                ease: "Linear",
                duration: 2000,
            });
            this.time.delayedCall(5000, () => {
                this.scene.start("PlayerWinScene");
            });
        });
        this.time.delayedCall(1800, () => {
            this.boss.destroy();
            // Set player win cookies
        });
    }

    update(time, delta) {
        super.update(time, delta);
        if (!this.gameover && this.hero.body.right >= 870 && !this.hero.isTeleporting) {
            this.teleportHero();
        }
        Phaser.Actions.RotateAroundDistance(this.orbGroup.getChildren(), { x: this.orbGroup.placementX, y: this.orbGroup.placementY }, 0.005 + 0.006 * this.boss.phase, 200);
    }
}

Object.assign(Game.prototype, baseSceneMixin);
Object.assign(Game.prototype, frontendControlsMixin);
Object.assign(Game.prototype, loadingBar);

export default Game;
