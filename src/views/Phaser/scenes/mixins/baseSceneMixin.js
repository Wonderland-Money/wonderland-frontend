import Phaser from "phaser";

import variables from "../../managers/Variables";
import { sharedInstance as events } from "../../managers/EventCenter";

const baseSceneMixin = {
    sceneInit() {
        // Removes any scale events from the scale manager
        this.scale.removeAllListeners();
        // Sets the sound settings for the scene
        this.sound.setMute(this.getSoundEnabled());

        // Renders textures as pixel art
        this.textures.getTextureKeys().forEach(item => {
            this.textures.get(item).setFilter(Phaser.Textures.FilterMode.NEAREST);
        });
    },

    toggleMusic() {
        if (variables.preferences.musicEnabled) {
            this.backgroundmusic.stop();
            variables.preferences.musicEnabled = false;
        } else {
            this.backgroundmusic.play({ loop: true });
            variables.preferences.musicEnabled = true;
        }
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

    getSoundEnabled() {
        return variables.preferences.soundEnabled == true;
    },

    getRandInt(max) {
        return Math.floor(Math.random() * max);
    },

    resetSceneOrder() {
        // --- Panels ---
        this.scene.manager.stop("PlayerWinScene");
        this.scene.manager.stop("PlayerWinMenu");
        this.scene.manager.stop("DeathScreen");
        this.scene.manager.stop("FreezeScreen");
        this.scene.manager.stop("PauseScreen");
        this.scene.manager.stop("InstructionsSplash");
        this.scene.manager.stop("GameUI");
        this.scene.manager.stop("SettingsMenu");
        this.scene.manager.stop("PlayerMenu");

        this.scene.manager.bringToTop("PlayerWinScene");
        this.scene.manager.bringToTop("PlayerWinMenu");
        this.scene.manager.bringToTop("DeathScreen");
        this.scene.manager.bringToTop("FreezeScreen");
        this.scene.manager.bringToTop("PauseScreen");
        this.scene.manager.bringToTop("InstructionsSplash");
        this.scene.manager.bringToTop("GameUI");
        this.scene.manager.bringToTop("SettingsMenu");
        this.scene.manager.bringToTop("PlayerMenu");

        // --- Game Scenes ---
        this.scene.manager.stop("KrakenScene");
        this.scene.manager.stop("HarborScene");
        this.scene.manager.stop("ForgeScene");
        this.scene.manager.stop("AppraiserScene");
        this.scene.manager.stop("OasisScene");
        this.scene.manager.stop("LilySanctuaryScene");

        this.scene.manager.bringToTop("KrakenScene");
        this.scene.manager.bringToTop("HarborScene");
        this.scene.manager.bringToTop("ForgeScene");
        this.scene.manager.bringToTop("AppraiserScene");
        this.scene.manager.bringToTop("OasisScene");
        this.scene.manager.bringToTop("LilySanctuaryScene");
        // --- Main Menu ---
        this.scene.manager.stop("MainMenu");
        this.scene.manager.bringToTop("MainMenu");
    },

    // Due to limitations with Phaser garbage collection I need to nuke everything
    nukeItAll() {
        this.backgroundmusic.stop();
        this.physics.world &&
            this.physics.world.bodies.iterate(obj => {
                obj.destroy();
            });
        events.eventNames().forEach(event => {
            events.removeAllListeners(event);
        });
    },
};

export default baseSceneMixin;
