class Toast extends RexPlugins.UI.Toast {
    constructor(scene, config) {
        /**
         * @TODO fix dis shite
         */
        super(
            scene,
            config || {
                x: this.harborKeeperSpawn.x,
                y: this.harborKeeperSpawn.y - 80,
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 12, "#222222"),
                text: this.add.text(0, 0, "", {
                    fontSize: "16px",
                    fontFamily: "compass",
                }),
                space: {
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                },
                transitIn: 1,
                transitOut: 1,
            },
        );

        scene.add.existing(this);
    }
    // ...
}
