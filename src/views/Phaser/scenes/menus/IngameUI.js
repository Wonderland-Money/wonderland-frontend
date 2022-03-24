import { useForkRef } from "@material-ui/core";
import Phaser from "phaser";
import { sharedInstance as events } from "../../managers/EventCenter";

import { TextArea, Toast, Label, RoundRectangle } from "phaser3-rex-plugins/templates/ui/ui-components.js";

class InGameUI extends Phaser.Scene {
    constructor() {
        super({ key: "GameUI" });
    }

    preload() {
        // Heart Sprite
        this.load.spritesheet("heart-sprite", "assets/playerUI/health/heart.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        // Hotbar
        this.load.spritesheet("hotbar-sprite", "assets/playerUI/hotbar/hotbar3.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.image("dialogue-box", "assets/playerUI/dialogue_box.png");

        this.load.image("text-scroller", "assets/playerUI/scroller.png");

        this.load.image("scroll-ribbon", "assets/playerUI/scroll-ribbon.png");
    }

    create(data) {
        this.playerAttackEnabled = data.attackEnabled;
        this.playerHp = data.hp;
        this.dialogueActive = false;
        this.dialogueTriggered = false;

        this.textScrollerActive = false;
        this.textScrollerTriggered = false;

        this.currentHeader = "Scroll";

        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;

        this.playerAttackEnabled ? this.drawPlayerAttackEnabled() : this.drawPlayerAttackDisabled();

        this.input.keyboard.on("keydown-R", () => {
            if (this.dialogueActive) {
                this.clearDialogue();
            }
            if (this.textScrollerActive) {
                this.clearTextScroller();
            }
        });
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
            this.playerHearts[i] = this.add.sprite(20 + i * 16, 52, "heart-sprite").setOrigin(0, 0.5);
        }
    }

    drawBossHearts() {
        this.bossHearts = [];
        let j = -1;
        for (let i = 0; i < this.bossHp; i++) {
            if (i % 5 == 0) j++;
            this.bossHearts[i] = this.add.sprite(this.width - 20 - i * 16 + j * 80, 52 + j * 16, "heart-sprite").setOrigin(1, 0.5);
        }
    }

    showNotification(data) {
        if (this.dialogueActive || this.textScrollerActive) return;
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; ++i) {
                // let notif = this.rexUI.add.toast({
                let notif = new Toast(this, {
                    x: this.width / 2,
                    y: 40 + i * 44,
                    background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 8, 0x132217),
                    // background: new RoundRectangle(this, 0, 0, 2, 2, 8, "#132217"),
                    text: this.add.text(0, 0, data[i], {
                        fontSize: "16px",
                        fontFamily: "Cormorant Garamond",
                        color: "#ffe7bc",
                    }),
                    space: {
                        left: 12,
                        right: 12,
                        top: 12,
                        bottom: 12,
                    },
                    transitIn: 1,
                    transitOut: 1,
                }).showMessage(data[i]);
            }
        } else this.notif.showMessage(data);
    }

    setupNotifs() {
        // this.notif = this.rexUI.add.toast({
        this.notif = new Toast(this, {
            x: this.width / 2,
            y: 40,
            background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 8, 0x132217),
            // background: new RoundRectangle(this, 0, 0, 2, 2, 8, "#132217"),
            text: this.add.text(0, 0, "", {
                fontSize: "16px",
                fontFamily: "Cormorant Garamond",
                color: "#ffe7bc",
            }),
            space: {
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
            },
            transitIn: 1,
            transitOut: 1,
        });

        events.on(
            "notification",
            data => {
                this.showNotification(data);
            },
            this,
        );
    }

    drawDialogueBox() {
        this.dialogueBox = this.add
            .image(this.width / 2, this.height, "dialogue-box")
            .setOrigin(0.5, 1)
            .setScale(2);
        this.dialogueBox.setAlpha(0); // Hidden until dialogue event

        events.on(
            "dialogue",
            data => {
                if (!this.dialogueActive) this.beginDialogue(data.speaker, data.dialogue);
                else this.clearDialogue();
            },
            this,
        );
    }

    breakText(dialogue) {
        let maxLineLen = 83;
        let finalizedText = [];
        let words = dialogue.split(" ");

        let tempStr = "";
        let counter = 0;
        for (let i = 0; i < words.length; ++i) {
            tempStr += words[i] + " ";
            if (tempStr.length > maxLineLen) {
                finalizedText[counter] = tempStr;
                tempStr = "";
                ++counter;
            }
        }
        finalizedText[counter] = tempStr;
        return finalizedText;
    }

    beginDialogue(speaker, dialogue) {
        if (this.dialogueTriggered) return;
        this.dialogueTriggered = true;
        this.time.delayedCall(200, () => {
            this.dialogueActive = true;
        });

        let newDialogue = this.breakText(dialogue);

        this.tweens.add({
            targets: this.dialogueBox,
            alpha: 1,
            duration: 300,
            ease: "Power2",
        });

        // Text
        this.dialogueSender = this.add
            .text(this.dialogueBox.getTopLeft().x + 28, this.dialogueBox.getTopLeft().y + 24, speaker, {
                fontSize: 24,
                color: "#000000",
                fontStyle: "bold",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0, 0)
            .setDepth(3);

        this.dialogueContent = this.add
            .text(this.dialogueBox.getTopLeft().x + 28, this.dialogueBox.getTopLeft().y + 54, newDialogue, {
                fontSize: 21,
                color: "#222222",
                fontStyle: "normal",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0, 0)
            .setDepth(3);

        this.dialogueToolTip = this.add
            .text(this.width / 2, this.height - 24, "Press [R] to close dialogue.", {
                fontSize: 18,
                color: "#444444",
                fontStyle: "bold",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0.5, 0)
            .setDepth(3);
    }

    clearDialogue() {
        this.dialogueTriggered = false;
        this.dialogueActive = false;
        this.tweens.add({
            targets: [this.dialogueBox, this.dialogueSender, this.dialogueContent, this.dialogueToolTip],
            alpha: 0,
            duration: 300,
            ease: "Power2",
        });
    }

    drawTextScroller() {
        // this.textScroller = this.rexUI.add.textArea({
        this.textScroller = new TextArea(this, {
            x: this.width / 2,
            y: this.height / 2,
            width: 474, // Width of scroller top & bottom (parchment portion)
            height: this.height - 208 - 48,
            // Elements
            background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0, 0xe5e4d2),
            // background: new RoundRectangle(this, 0, 0, 20, 20, 0, 0xe5e4d2),
            text: this.add.text(0, 0, "", {
                fontFamily: "Cormorant Garamond",
                fontSize: 18,
                fontStyle: "bold",
                color: "#333333",
                align: "justify",
            }),
            // header: this.rexUI.add.label({
            header: new Label(this, {
                height: 36,

                orientation: 0,

                text: this.add.text(474 / 2, 0, this.currentHeader, {
                    fontFamily: "Cormorant Garamond",
                    fontSize: 24,
                    fontStyle: "bold",
                    color: "#000000",
                    align: "center",
                }),
            }),

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0x9e9c7b),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x333333),
                // track: new RoundRectangle(this, 0, 0, 20, 10, 10, 0x9e9c7b),
                // thumb: new RoundRectangle(this, 0, 0, 0, 0, 13, 0x333333),
                input: "drag",
                position: "right",
            },
            scroller: {
                threshold: 10,
                slidingDeceleration: 5000,
                backDeceleration: 2000,
                pointerOutRelease: true,
            },
            mouseWheelScroller: {
                focus: false,
                speed: 0.2,
            },

            clamplChildOY: false,

            space: {
                left: 20,
                right: 20,
                top: 6,
                bottom: 6,

                text: 6,
                // text: {
                //    top: 0,
                //    bottom: 0,
                //    left: 0,
                //    right: 0,
                //},
                header: 0,
                footer: 0,
            },
            content: "",
            draggable: false,
        })
            .layout()
            .setOrigin(0.5, 0.5)
            .setAlpha(0);

        this.scrollComponents = {
            top: this.add.image(this.width / 2, 104, "text-scroller"),
            bottom: this.add.image(this.width / 2, this.height - 104, "text-scroller"),
            ribbon: this.add.image(this.width / 2 + 474 / 2, 130, "scroll-ribbon"),
        };

        this.scrollComponents.ribbon.setOrigin(0, 0).setScale(2);
        this.scrollerToolTip = this.add
            .text(this.width / 2, this.height - 104, "Press [R] to close scroll.", {
                fontSize: 18,
                color: "#444444",
                fontStyle: "bold",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0.5, 0.5)
            .setDepth(3)
            .setAlpha(0);
        this.scrollComponents.top.setAlpha(0);
        this.scrollComponents.bottom.setAlpha(0);
        this.scrollComponents.ribbon.setAlpha(0);

        events.on(
            "scroll",
            data => {
                this.setTextScroller(data);
            },
            this,
        );
    }

    setTextScroller(data) {
        if (this.textScrollerActive) return;
        this.textScrollerTriggered = true;
        this.time.delayedCall(200, () => {
            this.textScrollerActive = true;
        });
        this.currentHeader = data.title;
        this.currentText = data.text;

        // Set new text
        this.textScroller.setText(this.currentText);
        this.textScroller.getElement("header").setText(this.currentHeader);

        this.tweens.add({
            targets: [this.textScroller, this.scrollComponents.top, this.scrollComponents.bottom, this.scrollComponents.ribbon, this.scrollerToolTip],
            alpha: 1,
            duration: 300,
            ease: "Power2",
        });
    }

    clearTextScroller() {
        this.textScrollerTriggered = false;
        this.textScrollerActive = false;
        this.tweens.add({
            targets: [this.textScroller, this.scrollComponents.top, this.scrollComponents.bottom, this.scrollComponents.ribbon, this.scrollerToolTip],
            alpha: 0,
            duration: 300,
            ease: "Power2",
        });
        this.textScroller.setText("");
    }

    drawPlayerAttackDisabled() {
        this.drawDialogueBox();
        this.drawTextScroller();
        this.setupNotifs();
    }

    drawPlayerAttackEnabled() {
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
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0, 0);
        this.playerHPText = this.add
            .text(20, 20, "Health", {
                fontSize: 24,
                color: "#ffffff",
                fontStyle: "bold",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0, 0);

        this.bossHPShadow = this.add
            .text(this.width - 18, 22, "Health", {
                fontSize: 24,
                color: "#000000",
                fontStyle: "bold",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(1, 0);
        this.bossHPText = this.add
            .text(this.width - 20, 20, "Health", {
                fontSize: 24,
                color: "#ffffff",
                fontStyle: "bold",
                fontFamily: "Cormorant Garamond",
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
                if (hp < 0)
                    this.bossHearts.forEach(heart => {
                        heart.setFrame(1);
                    });
                if (hp <= 5) {
                    this.bossHearts.forEach(item => item.setTint(0xf4f000));
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

    update(time, delta) {}
}

export default InGameUI;
