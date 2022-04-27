import Phaser from "phaser";

class Tentacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "tentacle-earth"); // tentacle anim
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false);
        this.setOrigin(0.5, 0);
        this.body.setSize(64, 6);
        this.body.setOffset(0, 60);
        this.elementName = ["earth", "air", "water", "fire", "lightning"];
    }

    placeTentacle(x, y, type) {
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 500,
        });
        this.attacking = false;
        this.setPosition(x, y);
        this.type = type;
        this.anims.play(`tentacle-${this.elementName[type]}`); // tentacle anim
        this.body.setAllowGravity(false);
        this.setActive(true);
        this.setVisible(true);
        this.setDepth(0);
    }

    attack() {
        if (!this.attacking) {
            this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    this.attacking = true;
                },
            });
            this.scene.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.kill();
                },
            });
        } else {
        }
    }

    kill() {
        this.attacking = false;
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
        });
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.setActive(false);
                this.setVisible(false);
            },
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.y > this.scene.map.heightInPixels) {
            this.kill();
        }
    }
}

export default Tentacle;
