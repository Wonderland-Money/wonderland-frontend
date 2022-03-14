import Phaser from "phaser";
import Item from "../base/Item";

import { sharedInstance as events } from "../../managers/EventCenter";

class Scroll extends Item {
    constructor(scene, x, y, text) {
        super(scene, x, y, "scroll", true, true);
        this.contents = text;
        // When the hero presses "R" and is overlapping the scroll, open the scroll text.
        /**
         * @TODO Update the keybinding to use the KeyboardManager (next release)
         */
        this.input.keyboard.on("keydown-R", () => {
            if(!this.body.touching.none || this.body.embedded) {
                this.openScroll();
            }
        });
    }

    setCollideCallback(callback) {
        this.scene.physics.add.overlap(this.scene.hero, this, callback);
    }

    setContents(text) {
        this.contents = text;
    }

    openScroll() {
        events.emit("scroll", this.contents);
    }
}

export default Scroll;