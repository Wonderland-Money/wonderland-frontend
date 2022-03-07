import Phaser from "phaser";
import { sharedInstance as events } from "../managers/EventCenter";

class EnergySphere extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "rage-attack");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false);
        this.setOrigin(0.5);
        //this.setProperties(type, direction)
        this.speed = 120;
    }

    spawnEnergySphere(x, y, player) {
        this.alpha = 0;
        this.setVelocity(0, 0);
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 400,
        });
        let spawnAnim = this.scene.add.sprite(x, y, "spawn-rage");
        spawnAnim.setScale(2);
        spawnAnim.setDepth(2);
        spawnAnim.play("spawn-rage");
        this.scene.time.delayedCall(1200, () => {
            spawnAnim.destroy();
        });
        this.colliding = false;
        this.setPosition(x, y);
        this.anims.play(`rage-attack`);
        this.body.setAllowGravity(false);
        this.body.setCircle(16);
        this.setScale(2);
        this.setActive(true);
        this.setVisible(true);
        this.setDepth(1);
        this.scene.time.delayedCall(1100, () => {
            this.startFollow(player);
        });
    }

    startFollow(player) {
        this.following = true;
        this.player = player;
        this.scene.physics.accelerateToObject(this, this.player, 125, 400, 125);
    }

    collide() {
        if (!this.colliding) {
            this.colliding = true;
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 500,
            });
            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
            this.scene.time.addEvent({
                delay: 500,
                callback: () => {
                    this.kill();
                },
            });
        } else {
        }
    }

    kill() {
        this.body.setVelocityX(0);
        this.body.setAccelerationX(0);
        this.following = false;
        this.setActive(false);
        this.setVisible(false);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > this.scene.map.heightInPixels) {
            this.kill();
        }

        if (this.following) {
            this.scene.physics.accelerateToObject(this, this.player, 125, 400, 125);
        }
    }
}

export default EnergySphere;
