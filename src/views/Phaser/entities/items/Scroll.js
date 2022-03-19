import Phaser from "phaser";
import Item from "../base/Item";

import { sharedInstance as events } from "../../managers/EventCenter";

class Scroll extends Item {
    constructor(scene, x, y, contents, entities) {
        super(scene, x, y, "scroll", false, false, entities);
        this.contents = contents;
        this.entities = entities || [];

        this.addOverlap(entities);
        // When the hero presses "R" and is overlapping the scroll, open the scroll text.
        /**
         * @TODO Update the keybinding to use the KeyboardManager (next release)
         */
        scene.input.keyboard.on("keydown-R", () => {
            if (!this.body.touching.none || this.body.embedded) {
                this.openScroll();
            }
        });
    }

    setEntityCollisions(entities) {
        this.entities = entities;
        this.addOverlap(entities);
    }

    addOverlap(entities) {
        this.scene.physics.add.overlap(entities, this);
    }

    addCollideCallback(entities, callback) {
        this.scene.physics.add.overlap(entities, this, callback);
    }

    setContents(contents) {
        this.contents = contents;
    }

    openScroll() {
        events.emit("scroll", this.contents);
    }

    addParticles(color) {
        this.particles = this.scene.add.particles("flares");
        this.particles
            .createEmitter({
                frame: color,
                x: this.body.center.x,
                y: this.body.center.y,
                lifespan: 400,
                speedY: { min: -40, max: 40 },
                speedX: { min: -40, max: 40 },
                angle: -90,
                gravityY: 20,
                scale: { start: 0.08, end: 0.05 },
                quantity: 1,
                blendMode: "ADD",
            })
            .startFollow(this.body.center);
        this.particles.setDepth(0);
    }
}

export default Scroll;
