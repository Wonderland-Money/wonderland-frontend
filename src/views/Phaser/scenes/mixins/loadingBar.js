const loadingBarMixin = {
    loadingBar(loadFuncs) {
        let { width, height } = this.sys.game.canvas;

        // PROGRESS BAR
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        let loaderBg = this.add.graphics();
        let loadingText = this.make
            .text({
                x: width / 2,
                y: height / 2,
                text: "Loading...",
                fontSize: 24,
                color: "#0f0f0f",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0.5);
        let loadingItemText = this.make
            .text({
                x: width / 2,
                y: height / 2 + 42,
                text: "",
                fontSize: 24,
                color: "#0f0f0f",
                fontFamily: "Cormorant Garamond",
            })
            .setOrigin(0.5);
        loaderBg.fillStyle(0x0a0a0a, 0.4);
        loaderBg.fillRect(0, 0, width, height);
        progressBox.fillStyle(0xefefef, 0.8);
        progressBox.fillRect(width / 2 - 210, height / 2 - 30, 420, 60);

        loadFuncs();

        this.load.on("progress", function (value) {
            try {
                progressBar.fillStyle(0xffffff, 1);
                progressBar.fillRect(width / 2 - 195, height / 2 - 15, 390 * value, 30);
                loadingText.setText(parseInt(value * 100) + "%");
            } catch (e) {
                // doesn't matter
            }
        });

        this.load.on("fileprogress", function (file) {
            try {
                loadingItemText.setText(file.key);
            } catch (e) {}
        });

        this.load.on("complete", function () {
            progressBar.destroy();
            progressBox.destroy();
            loaderBg.destroy();
            loadingText.destroy();
        });
    },
};

export default loadingBarMixin;
