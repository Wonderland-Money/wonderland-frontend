/**
 * @TODO Game variables should be saved to localstorage and/or browser cookies
 *
 * @TODO LANG | Game should read text from language sources
 */

const data = {
    gameState: {
        inputPaused: false,
        accountIsGoatedWithTheSauce: false,
        currentAccount: "",
        fullscreenEnabled: false,
    },
    preferences: {
        musicEnabled: true,
        soundEnabled: true,
        lang: "en-US",
        languages: {
            "en-US": "English",
        },
    },
    keybindings: {
        "keydown-LEFT": "keydown-LEFT",
        "keydown-RIGHT": "keydown-RIGHT",
        "keydown-UP": "keydown-UP",
        "keydown-DOWN": "keydown-DOWN",
    },
    gameUrl: window.location.origin,
    /**
     * Resets any gameState variables to their defaults.
     */
    resetStateVariables: () => {
        data.gameState.inputPaused = false;
        data.gameState.currentAccount = "";
        data.gameState.fullscreenEnabled = false;
    },
    setPreference: (key, value) => {
        if (data.preferences[key]) {
            data.preferences[key] = value;
            window.localStorage.setItem(key, value);
        }
    },
    setPreferences: () => {
        window.localStorage.setItem("musicEnabled", data.preferences.musicEnabled);
        window.localStorage.setItem("soundEnabled", data.preferences.soundEnabled);
        window.localStorage.setItem("lang", data.preferences.lang);
    },
    loadFromPreferences: () => {
        data.preferences.musicEnabled = window.localStorage.getItem("musicEnabled") == 'true';
        data.preferences.soundEnabled = window.localStorage.getItem("soundEnabled") == 'true';
        data.preferences.lang = window.localStorage.getItem("lang");
    },
};

export default data;
