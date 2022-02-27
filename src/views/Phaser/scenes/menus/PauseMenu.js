import Phaser from 'phaser'
import Button from '../../components/Button'

class PauseMenu extends Phaser.Scene {
    constructor() {
        super({ key: "PauseMenu" })
    }

    preload() {
    }

    create(data) {
        this.toScene = data
        this.scene.pause(data)
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas

        let pauseBg = this.add.rectangle(0, 0, width, height, 0x203055, 0.5)
        pauseBg.setOrigin(0,0)

        const SPACING_HEIGHT = 58
        const SPACING_WIDTH = 110
        // Left Half
        let playButton = new Button(this, (width / 2) - 64 - SPACING_WIDTH, (height / 2) - 52 - SPACING_HEIGHT, "Resume", () => {
            this.unpauseGame()
        })
        let musicButton = new Button(this, (width / 2) - 64 - SPACING_WIDTH, (height / 2), "Music", () => {
            this.unpauseGame()
            this.scene.manager.getScene(this.toScene).toggleMusic()
        })

        // Right Half
        let restartButton = new Button(this, (width / 2) - 64 + SPACING_WIDTH, (height / 2) - 52 - SPACING_HEIGHT, "Retry", () => {
            this.scene.manager.getScene(this.toScene).nukeItAll()
            this.scene.manager.getScene(this.toScene).scene.restart()
            this.scene.stop()
        }, false)
        let fullscreenButton = new Button(this, (width / 2) - 64 + SPACING_WIDTH, (height / 2), "Fullscreen", () => {
            if (this.scale.isFullscreen)
            {
                this.scale.stopFullscreen();
            }
            else
            {
                this.scale.startFullscreen();
            }
        })

        // Bottom 
        let menuButton = new Button(this, (width / 2) - 64, (height / 2) + 52 + SPACING_HEIGHT, "Menu", () => {
            this.scene.manager.getScene(this.toScene).nukeItAll()
            this.scene.manager.stop(this.toScene)
            this.scene.manager.start('MainMenu')
            this.scene.manager.bringToTop('MainMenu')
            this.resetScenes()
            this.scene.stop()
        })

        this.input.keyboard.on('keydown-ESC', () => {
            this.unpauseGame()
        })
    }

    resetScenes() {
        this.scene.manager.sendToBack('InstructionsSplash')
        this.scene.manager.stop('InstructionsSplash')
        this.scene.manager.sendToBack('IngameUI')
        this.scene.manager.stop('IngameUI')
        this.scene.manager.sendToBack('GameScene')
        this.scene.manager.stop('GameScene')
        this.scene.manager.sendToBack('HarborScene')
        this.scene.manager.stop('HarborScene')
        this.scene.manager.sendToBack('ForgeScene')
        this.scene.manager.stop('ForgeScene')
    }

    unpauseGame() {
        this.scene.stop()
        this.scene.resume(this.toScene)
    }

    update(time, delta) {
    }
}

export default PauseMenu