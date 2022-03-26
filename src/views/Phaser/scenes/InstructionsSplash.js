import Phaser from "phaser";

import baseSceneMixin from "./mixins/baseSceneMixin";
import frontendControlsMixin from "./mixins/frontendControlsMixin";

class InstructionsSplash extends Phaser.Scene {
    constructor() {
        super({ key: "InstructionsSplash" });
    }

    preload() {
        this.load.spritesheet("arrow-keys", "assets/instructions/arrowkeys.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("number-keys", "assets/instructions/numberkeys.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("pause-keys", "assets/instructions/pause.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet("space-bar", "assets/instructions/spacebar.png", {
            frameWidth: 160,
            frameHeight: 32,
        });
    }

    create(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        this.input.mouse.disableContextMenu();
        this.entered = false;

        let { width, height } = this.sys.game.canvas;
        const PADDING = 100;
        const SPACE_BETWEEN = 4;

        this.add
            .text(
                PADDING,
                height / 2,
                [
                    "Trial of the Trident",
                    " ",
                    "A clan of krakens have been residing in the",
                    "shallow mines of Atlantis, siphoning precious Fraxium",
                    "crystal reserves, and teleporting them back to their home",
                    "world. The Atlantian Royal Guard has placed a bounty",
                    "on their slaughter, a trident claimable on their defeat,",
                    "as well as an invitation to the Atlantian Citizens Militia",
                    " ",
                    "Your mission is to defeat a kraken, and",
                    "retrieve the trident. This won't be easy; the",
                    "kraken is a fearsome foe and won't give up without",
                    "a fight.",
                    " ",
                    "You must dodge the kraken's crystal & tentacle",
                    "attacks, while matching your own attacks to the element",
                    "of the kraken at the time.",
                    " ",
                    "Once you succeed, the real adventure begins...",
                ],
                {
                    fontSize: 22,
                    fontFamily: "Cormorant Garamond",
                },
            )
            .setOrigin(0, 0.5);

        // Num Keys
        this.keyOne = this.add
            .sprite(width - PADDING - 4 * SPACE_BETWEEN - 4 * 64, height / 2 - 128 - SPACE_BETWEEN - 44, "number-keys", 0)
            .setOrigin(1, 0)
            .setScale(2);
        this.keyTwo = this.add
            .sprite(width - PADDING - 3 * SPACE_BETWEEN - 3 * 64, height / 2 - 128 - SPACE_BETWEEN - 44, "number-keys", 1)
            .setOrigin(1, 0)
            .setScale(2);
        this.keyThree = this.add
            .sprite(width - PADDING - 2 * SPACE_BETWEEN - 2 * 64, height / 2 - 128 - SPACE_BETWEEN - 44, "number-keys", 2)
            .setOrigin(1, 0)
            .setScale(2);
        this.keyFour = this.add
            .sprite(width - PADDING - 1 * SPACE_BETWEEN - 1 * 64, height / 2 - 128 - SPACE_BETWEEN - 44, "number-keys", 3)
            .setOrigin(1, 0)
            .setScale(2);
        this.keyFive = this.add
            .sprite(width - PADDING, height / 2 - 128 - SPACE_BETWEEN - 44, "number-keys", 4)
            .setOrigin(1, 0)
            .setScale(2);
        this.add
            .text(width - PADDING - 4 * SPACE_BETWEEN - 4 * 64 - this.keyOne.width * 2, height / 2 - 128 - SPACE_BETWEEN - 44 - 24, "Select Element", {
                fontSize: 24,
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0, 0);

        // Pause Keys
        this.keyEsc = this.add
            .sprite(width - PADDING - (6 + 2) * SPACE_BETWEEN - 6 * 64, height / 2 - 128 - SPACE_BETWEEN - 44, "pause-keys", 0)
            .setOrigin(1, 0)
            .setScale(2);
        this.keyP = this.add
            .sprite(width - PADDING - (5 + 2) * SPACE_BETWEEN - 5 * 64, height / 2 - 128 - SPACE_BETWEEN - 44, "pause-keys", 1)
            .setOrigin(1, 0)
            .setScale(2);
        this.add
            .text(width - PADDING - (6 + 2) * SPACE_BETWEEN - 6 * 64 - this.keyEsc.width * 2, height / 2 - 128 - SPACE_BETWEEN - 44 - 24, "Pause", {
                fontSize: 24,
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0, 0);

        // Movement Keys
        this.lArrow = this.add
            .sprite(width - PADDING - 128 - 2 * SPACE_BETWEEN, height / 2, "arrow-keys", 0)
            .setOrigin(1, 0)
            .setScale(2);
        this.rArrow = this.add
            .sprite(width - PADDING, height / 2, "arrow-keys", 1)
            .setOrigin(1, 0)
            .setScale(2);
        this.uArrow = this.add
            .sprite(width - PADDING - 64 - SPACE_BETWEEN, height / 2 - 64 - SPACE_BETWEEN, "arrow-keys", 2)
            .setOrigin(1, 0)
            .setScale(2);
        this.dArrow = this.add
            .sprite(width - PADDING - 64 - SPACE_BETWEEN, height / 2, "arrow-keys", 3)
            .setOrigin(1, 0)
            .setScale(2);
        this.add
            .text(width - PADDING - 128 - 2 * SPACE_BETWEEN - this.lArrow.width * 2, height / 2 - 64 - SPACE_BETWEEN - 24, "Movement", {
                fontSize: 24,
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0, 0);

        // Space
        this.spaceBar = this.add
            .sprite(width - PADDING, height / 2 + 64 + SPACE_BETWEEN + 24, "space-bar", 0)
            .setOrigin(1, 0)
            .setScale(2);
        this.add
            .text(width - PADDING - this.spaceBar.width * 2, height / 2 + 64 + SPACE_BETWEEN + 24 - 24, "Attack", {
                fontSize: 24,
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0, 0);

        this.setupKeyEvents();

        let rect = this.add.rectangle(0, 0, width, height, 0x000000, 0).setInteractive().setOrigin(0, 0);
        rect.on("pointerdown", () => {
            rect.disableInteractive();
            this.enterGame();
        });

        // Continue text
        this.add.text(width / 2, height - 40, "Press [ENTER] to continue...", { fontSize: 22, fontFamily: "Cormorant Garamond", color: "#444444" }).setOrigin(0.5, 0);

        this.time.delayedCall(25000, () => {
            this.enterGame();
        });
    }

    setupKeyEvents() {
        // 1
        this.input.keyboard.on("keydown-ONE", () => {
            this.keyOne.setFrame(5);
        });
        this.input.keyboard.on("keyup-ONE", () => {
            this.keyOne.setFrame(0);
        });
        // 2
        this.input.keyboard.on("keydown-TWO", () => {
            this.keyTwo.setFrame(6);
        });
        this.input.keyboard.on("keyup-TWO", () => {
            this.keyTwo.setFrame(1);
        });
        // 3
        this.input.keyboard.on("keydown-THREE", () => {
            this.keyThree.setFrame(7);
        });
        this.input.keyboard.on("keyup-THREE", () => {
            this.keyThree.setFrame(2);
        });
        // 4
        this.input.keyboard.on("keydown-FOUR", () => {
            this.keyFour.setFrame(8);
        });
        this.input.keyboard.on("keyup-FOUR", () => {
            this.keyFour.setFrame(3);
        });
        // 4
        this.input.keyboard.on("keydown-FIVE", () => {
            this.keyFive.setFrame(9);
        });
        this.input.keyboard.on("keyup-FIVE", () => {
            this.keyFive.setFrame(4);
        });

        // Esc
        this.input.keyboard.on("keydown-ESC", () => {
            this.keyEsc.setFrame(2);
        });
        this.input.keyboard.on("keyup-ESC", () => {
            this.keyEsc.setFrame(0);
        });

        // P
        this.input.keyboard.on("keydown-P", () => {
            this.keyP.setFrame(3);
        });
        this.input.keyboard.on("keyup-P", () => {
            this.keyP.setFrame(1);
        });

        // Left
        this.input.keyboard.on("keydown-LEFT", () => {
            this.lArrow.setFrame(4);
        });
        this.input.keyboard.on("keyup-LEFT", () => {
            this.lArrow.setFrame(0);
        });
        // Right
        this.input.keyboard.on("keydown-RIGHT", () => {
            this.rArrow.setFrame(5);
        });
        this.input.keyboard.on("keyup-RIGHT", () => {
            this.rArrow.setFrame(1);
        });
        // Up
        this.input.keyboard.on("keydown-UP", () => {
            this.uArrow.setFrame(6);
        });
        this.input.keyboard.on("keyup-UP", () => {
            this.uArrow.setFrame(2);
        });
        // Down
        this.input.keyboard.on("keydown-DOWN", () => {
            this.dArrow.setFrame(7);
        });
        this.input.keyboard.on("keyup-DOWN", () => {
            this.dArrow.setFrame(3);
        });

        // Space
        this.input.keyboard.on("keydown-SPACE", () => {
            this.spaceBar.setFrame(1);
        });
        this.input.keyboard.on("keyup-SPACE", () => {
            this.spaceBar.setFrame(0);
        });

        // Enter Game
        this.input.keyboard.on("keydown-ENTER", () => {
            this.enterGame();
        });
    }

    enterGame() {
        if (!this.entered) {
            this.entered = true;
            this.input.keyboard.off("keydown-ONE");
            this.input.keyboard.off("keyup-ONE");
            // 2
            this.input.keyboard.off("keydown-TWO");
            this.input.keyboard.off("keyup-TWO");
            // 3
            this.input.keyboard.off("keydown-THREE");
            this.input.keyboard.off("keyup-THREE");
            // 4
            this.input.keyboard.off("keydown-FOUR");
            this.input.keyboard.off("keyup-FOUR");
            // 4
            this.input.keyboard.off("keydown-FIVE");
            this.input.keyboard.off("keyup-FIVE");

            // Left
            this.input.keyboard.off("keydown-LEFT");
            this.input.keyboard.off("keyup-LEFT");
            // Right
            this.input.keyboard.off("keydown-RIGHT");
            this.input.keyboard.off("keyup-RIGHT");
            // Up
            this.input.keyboard.off("keydown-UP");
            this.input.keyboard.off("keyup-UP");
            // Down
            this.input.keyboard.off("keydown-DOWN");
            this.input.keyboard.off("keyup-DOWN");

            // Space
            this.input.keyboard.off("keydown-SPACE");
            this.input.keyboard.off("keyup-SPACE");

            this.input.keyboard.off("keydown-ESC");
            this.input.keyboard.off("keydown-ENTER");

            this.cameras.main.fadeOut(1000);
            this.time.delayedCall(1500, () => {
                this.scene.start("GameScene");
            });
        } else return;
    }

    update(time, delta) {}
}

Object.assign(InstructionsSplash.prototype, baseSceneMixin);
Object.assign(InstructionsSplash.prototype, frontendControlsMixin);

export default InstructionsSplash;
