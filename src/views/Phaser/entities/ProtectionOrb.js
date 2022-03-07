import Phaser from "phaser";

class ProtectionOrb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "protection-orb-glow");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false);
        this.body.setSize(32, 32);
        this.setScale(2);
        this.setOrigin(0.5);
        this.isAlive = true;
    }

    collide() {
        if (!this.colliding) {
            let collideSound = this.scene.sound.add("orb-death");
            collideSound.play();
            this.colliding = true;
            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 500,
            });
            this.scene.time.addEvent({
                delay: 500,
                callback: () => {
                    this.setActive(false);
                    this.setVisible(false);
                    this.isAlive = false;
                },
            });
        } else {
        }
    }

    kill() {
        this.setActive(false);
        this.setVisible(false);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}

export default ProtectionOrb;
