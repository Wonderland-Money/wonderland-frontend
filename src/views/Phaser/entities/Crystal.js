import Phaser from "phaser";

class Crystal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "kraken-earth-crystal");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false);
        this.body.setSize(12, 32);
        this.setOrigin(0.5);
        this.elementName = ["earth", "air", "water", "fire", "lightning"];
        //this.setProperties(type, direction)
        this.speed = 120;
    }

    fireAttack(x, y, type) {
        this.alpha = 1;
        this.colliding = false;
        this.setPosition(x, y);
        this.type = type;
        this.elementName[type] && this.anims.play(`kraken-${this.elementName[type]}-crystal`);
        this.body.setAllowGravity(false);
        this.setActive(true);
        this.setVisible(true);
        this.setDepth(1);
        this.body.setVelocityY(this.speed);
        this.body.setAccelerationY(70);
    }

    increaseSpeed() {
        this.speed += 15;
    }

    collide() {
        if (!this.colliding) {
            this.colliding = true;
            this.elementName[this.type] && this.anims.play(`kraken-${this.elementName[this.type]}-impact`);
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 300,
                ease: "Power2",
            });

            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
            this.scene.time.addEvent({
                delay: 400,
                callback: () => {
                    this.setActive(false);
                    // this.setVisible(false);
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
        if (this.y > this.scene.map.heightInPixels) {
            this.kill();
        }
    }
}

export default Crystal;
