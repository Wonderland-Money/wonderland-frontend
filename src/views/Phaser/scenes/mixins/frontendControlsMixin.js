import variables from "../../managers/Variables";

const frontendControlsMixin = {
    /**
     * Hide or show all of the UI
     */
    hideUI() {
        window.parent.postMessage("hideUI", variables.gameUrl);
    },
    showUI() {
        window.parent.postMessage("showUI", variables.gameUrl);
    },

    /**
     * Hide or show individual components
     */
    // Dashboard
    hideDashboard() {
        window.parent.postMessage("closeDashboard", variables.gameUrl);
    },
    showDashboard() {
        window.parent.postMessage("openDashboard", variables.gameUrl);
    },

    // Staking
    hideStaking() {
        window.parent.postMessage("closeStaking", variables.gameUrl);
    },
    showStaking() {
        window.parent.postMessage("openStaking", variables.gameUrl);
    },

    // Bonding
    hideBonding() {
        window.parent.postMessage("closeBonding", variables.gameUrl);
    },
    showBonding() {
        window.parent.postMessage("openBonding", variables.gameUrl);
    },

    // Connect Button
    hideConnectButton() {
        window.parent.postMessage("closeConnectButton", variables.gameUrl);
    },
    showConnectButton() {
        window.parent.postMessage("openConnectButton", variables.gameUrl);
    },

    // Social
    hideSocial() {
        window.parent.postMessage("closeSocial", variables.gameUrl);
    },
    showSocial() {
        window.parent.postMessage("openSocial", variables.gameUrl);
    },

    // Exit Button
    hideExitButton() {
        window.parent.postMessage("closeExitButton", variables.gameUrl);
    },
    showExitButton() {
        window.parent.postMessage("openExitButton", variables.gameUrl);
    },
};

export default frontendControlsMixin;