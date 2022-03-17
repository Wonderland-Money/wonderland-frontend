/**
 * @TODO Game variables should be saved to localstorage and/or browser cookies
 *
 * @TODO LANG | Game should read text from language sources
 */

export default {
    musicEnabled: true,
    soundEnabled: true,
    fullscreenEnabled: false,
    currentAccount: "",
    accountIsGoatedWithTheSauce: false,
    lang: "en-US",
    keybindings: {
        "keydown-LEFT": "keydown-LEFT",
        "keydown-RIGHT": "keydown-RIGHT",
        "keydown-UP": "keydown-UP",
        "keydown-DOWN": "keydown-DOWN",
    },
    inputPaused: false,
    gameUrl: window.location.origin,
};
