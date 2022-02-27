import Phaser from 'phaser'
import Button from '../../components/Button'

class FreezeScreen extends Phaser.Scene {
    constructor() {
        super({ key: "FreezeScreen" })
    }

    preload() {
        window.addEventListener("message", this.handler, false)
        // If I put this in preload does it only start once?
    }

    create(data) {
        //window.addEventListener("message", this.handler, false)

        this.toScene = data
        this.scene.pause(data)
        this.input.mouse.disableContextMenu();
        let { width, height } = this.sys.game.canvas

        let pauseBg = this.add.rectangle(0, 0, width, height, 0x203055, 0.5)
        pauseBg.setOrigin(0,0)
    }

    handler = (e) => {
        if (e.origin.startsWith('http://localhost:8080') && e.data.toString().startsWith('closeMenu')) {
            this.unpauseGame()
        } else {
            return
        }
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
        window.removeEventListener('message', this.handler, false)
        this.scene.stop()
        this.scene.resume(this.toScene)
    }

    update(time, delta) {
    }
}

export default FreezeScreen