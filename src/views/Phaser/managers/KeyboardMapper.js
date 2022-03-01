import Phaser from "phaser";

import variables from "./Variables";

class KeyboardMapper {
    assignKey(target, newKey) {
        // Make sure that 'target' and 'newKey' are both valid.
        if (checkIsValid(newKey) && checkIsValid(target)) {
            variables.keybindings[target] = newKey;
            return true;
        } else return false;
    }

    /**
     * Game classes should interact with the keyboard throug the KeyboardMapper class in order to read custom defined keybindings
     * @param {String} key
     * @param {() => void} callback
     */
    getKeyDown(key, callback) {
        if (variables.keybindings[key]) {
            this.input.keyboard.on(variables.keybindings[key], callback);
        } else {
            this.input.keyboard.on(key, callback);
        }
    }

    checkIsValid(newKey) {
        // Should return a string like SPACE or ESC
        const key = newKey.substring(7).capitalize();
        /**
         * @TODO How to iterate through namespace?
         */
        if (Phaser.Input.Keyboard.KeyCodes) {
            return true;
        } else return false;
    }
}

export default KeyboardMapper;
