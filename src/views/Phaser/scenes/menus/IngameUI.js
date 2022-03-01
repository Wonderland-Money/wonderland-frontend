import Phaser from "phaser";
import { sharedInstance as events } from "../../managers/EventCenter";

class InGameUI extends Phaser.Scene {
    constructor() {
        super({ key: "GameUI" });
    }

    preload() {
        // Heart Sprite
        this.load.spritesheet("heart-sprite", "assets/icons/health/heart.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        // Hotbar
        this.load.spritesheet("hotbar-sprite", "assets/icons/hotbar/hotbar3.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
    }

    create() {
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        /**
         * === DRAW ATTACK HOTBAR ===
         */
        this.currentActive = 0;
        this.drawHotbar();

        /**
         * === DRAW PLAYER & BOSS HEALTH ===
         */
        this.playerHp = 4;
        this.drawPlayerHearts();
        this.bossHp = 25;
        this.drawBossHearts();

        this.heartBeatTween = this.tweens
            .add({
                targets: this.playerHearts[0],
                scale: 1.1,
                duration: 250,
                yoyo: true,
                repeat: -1,
                ease: "Sine.easeInOut",
            })
            .pause();

        this.playerHPShadow = this.add
            .text(22, 22, "Health", {
                fontSize: 24,
                color: "#000000",
                fontStyle: "bold",
                fontFamily: "compass",
            })
            .setOrigin(0, 0);
        this.playerHPText = this.add
            .text(20, 20, "Health", {
                fontSize: 24,
                color: "#ffffff",
                fontStyle: "bold",
                fontFamily: "compass",
            })
            .setOrigin(0, 0);

        this.bossHPShadow = this.add
            .text(this.width - 18, 22, "Health", {
                fontSize: 24,
                color: "#000000",
                fontStyle: "bold",
                fontFamily: "compass",
            })
            .setOrigin(1, 0);
        this.bossHPText = this.add
            .text(this.width - 20, 20, "Health", {
                fontSize: 24,
                color: "#ffffff",
                fontStyle: "bold",
                fontFamily: "compass",
            })
            .setOrigin(1, 0);

        // Register hit events and adjust displayed HP
        events.on(
            "player-hit",
            hp => {
                this.tweens.add({
                    targets: this.playerHearts[hp],
                    scale: 1.2,
                    duration: 100,
                    yoyo: true,
                    repeat: 0,
                    ease: "Sine.easeInOut",
                });
                this.playerHearts[hp].setFrame(1);
                if (hp == 1) {
                    this.playerHearts[0].setTint(0xff0000);
                    this.heartBeatTween.restart();
                }
            },
            this,
        );
        events.on("player-died", () => {
            this.heartBeatTween.stop();
            this.playerHearts[0].clearTint();
        });
        events.on(
            "boss-hit",
            hp => {
                let diff = this.bossHp - hp;
                this.bossHp -= diff;
                for (let i = 0; i < diff; ++i) {
                    this.tweens.add({
                        targets: this.bossHearts[hp + i],
                        scale: 1.2,
                        duration: 100,
                        yoyo: true,
                        repeat: 0,
                        ease: "Sine.easeInOut",
                    });
                    if (hp >= 0) this.bossHearts[hp + i].setFrame(1);
                }
                if (hp <= 5) {
                    this.bossHearts.forEach(item => item.setTint(0xf0f000));
                }
            },
            this,
        );
        /**
         * === DRAW PLAYER ATTACK SWITCHING ===
         */
        events.on(
            "switch-attack",
            attack => {
                this.setActive(attack);
            },
            this,
        );
    }

    drawHotbar() {
        this.hotbarSlots = [5];
        let j = 0;
        for (let i = 0; i < 5; i++) {
            this.hotbarSlots[i] = this.add
                .sprite(this.width / 2 + i * 48 - (48 * 2 + 4), this.height, "hotbar-sprite", j)
                .setOrigin(0.5, 1)
                .setScale(3);
            j += 2;
        }
        this.setActive(0);
    }

    /**
     * hotbarSlots - corresponding sprite frames
     * 0 - 01
     * 1 - 23
     * 2 - 45
     * 3 - 67
     * 4 - 89
     */

    setActive(item) {
        // Previous active slot should be reset
        this.hotbarSlots[this.currentActive].setFrame(this.currentActive * 2);
        // Set slot "item" active
        this.hotbarSlots[item].setFrame(item * 2 + 1);
        // Set currentActive to "item"
        this.currentActive = item;
    }

    drawPlayerHearts() {
        this.playerHearts = [];
        for (let i = 0; i < this.playerHp; i++) {
            this.playerHearts[i] = this.add.sprite(20 + i * 16, 50, "heart-sprite").setOrigin(0, 0.5);
        }
    }

    drawBossHearts() {
        this.bossHearts = [];
        let j = -1;
        for (let i = 0; i < this.bossHp; i++) {
            if (i % 5 == 0) j++;
            this.bossHearts[i] = this.add.sprite(this.width - 20 - i * 16 + j * 80, 50 + j * 16, "heart-sprite").setOrigin(1, 0.5);
        }
    }

    update(time, delta) {}
}

export default InGameUI;
