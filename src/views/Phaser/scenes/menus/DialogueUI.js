import Phaser from "phaser";
import { sharedInstance as events } from "../../managers/EventCenter";

class InGameUI extends Phaser.Scene {
    constructor() {
        super({ key: "DialogueUI" });
    }

    preload() {
        // Heart Dialogue Sprite
        this.load.spritesheet("heart-sprite", "assets/icons/health/heart.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
    }

    create() {
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;
        
        events.on(
            "dialogue",
            data => {
                this.drawDialogue(data);
            },
            this,
        );
    }

    drawDialogue(speaker, dialogue) {
        let maxLineLen = 40;
        let newDialogue = [];
        
        // Will break the text to a new line every 40 chars, no need to manually break
        for(let i = 0; i < (dialogue.length) / maxLineLen; ++i) {
            try {
                newDialogue[i] = dialogue.slice(i*40, i*40 + 40)
            } catch (e) {
                newDialogue[i] = dialogue.slice(i*40)
            }
        }

        // Draw background
        this.name = this.add
            .text(22, 22, speaker, {
                fontSize: 24,
                color: "#000000",
                fontStyle: "bold",
                fontFamily: "compass",
            })
            .setOrigin(0, 0);

        this.dialogue = this.add
            .text(22, 22, newDialogue, {
                fontSize: 22,
                color: "#111111",
                fontStyle: "regular",
                fontFamily: "Cormorant Garamond"
            }
    }

    drawNextPage() {

    }

    update(time, delta) {}
}

export default InGameUI;
