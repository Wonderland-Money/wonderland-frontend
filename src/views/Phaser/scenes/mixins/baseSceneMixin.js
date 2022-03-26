import Phaser from "phaser";

import variables from "../../managers/Variables";
import { sharedInstance as events } from "../../managers/EventCenter";

const baseSceneMixin = {
    toggleMusic() {
        if (variables.preferences.musicEnabled) {
            this.backgroundmusic.stop();
            variables.preferences.musicEnabled = false;
        } else {
            this.backgroundmusic.play({ loop: true });
            variables.preferences.musicEnabled = true;
        }
    },

    getMusicEnabled() {
        return variables.preferences.musicEnabled;
    },

    toggleSound() {
        if (variables.preferences.soundEnabled) {
            this.sound.setMute(true);
            variables.preferences.soundEnabled = false;
        } else {
            this.sound.setMute(false);
            variables.preferences.soundEnabled = true;
        }
    },

    getMusicEnabled() {
        return variables.preferences.musicEnabled == true;
    },

    playBackgroundMusic() {
        if (this.getMusicEnabled()) {
            this.backgroundmusic.play({ loop: true });
        }
    },

    getRandInt(max) {
        return Math.floor(Math.random() * max);
    },

    // Due to limitations with Phaser garbage collection I need to nuke everything
    nukeItAll() {
        this.backgroundmusic.stop();
        this.physics.world && this.physics.world.bodies.iterate(obj => {
            obj.destroy();
        });
        events.eventNames().forEach(event => {
            events.removeAllListeners(event);
        });
    },
};

export default baseSceneMixin;
