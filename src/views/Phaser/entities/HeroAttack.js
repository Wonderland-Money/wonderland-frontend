import Phaser from "phaser";

class HeroAttack extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "earth-active");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false);
        this.body.setCircle(8);
        this.setOrigin(0.5);
        this.elementName = ["earth", "air", "water", "fire", "lightning"];
        this.flareColor = ["green", "white", "blue", "red", "yellow"];
        //this.setProperties(type, direction)
        this.speed = 370;
    }

    fireAttack(x, y, type, direction) {
        this.colliding = false;
        //this.body.reset(x, y)
        this.setPosition(x, y);
        this.direction = direction;
        this.type = type;
        this.anims.play(`${this.elementName[type]}-active`);
        this.body.setAllowGravity(false);
        this.setActive(true);
        this.setVisible(true);
        this.setDepth(1);
        this.body.setVelocityX(this.speed * direction);
        //this.body.setAccelerationX(this.speed * direction)
        this.particles = this.scene.add.particles("flares");
        this.particles
            .createEmitter({
                frame: this.flareColor[type],
                x: this.body.center.x,
                y: this.body.center.y,
                lifespan: 80,
                speed: { min: 200, max: 399 },
                angle: this.direction < 0 ? 360 : 180,
                gravityY: 0,
                scale: { start: 0.09, end: 0 },
                quantity: 9,
                blendMode: "ADD",
            })
            .startFollow(this.body.center);
        this.particles.setDepth(0);
    }

    collide() {
        if (!this.colliding) {
            this.colliding = true;
            this.anims.play(`${this.elementName[this.type]}-impact`);
            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
            if (this.particles) this.particles.destroy();
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    this.setActive(false);
                    this.setVisible(false);
                    this.setPosition(-5, -10);
                },
            });
        } else {
        }
    }

    kill() {
        this.setActive(false);
        this.setVisible(false);
        this.particles.destroy();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.x < 0 || this.x > this.scene.map.widthInPixels) {
            this.kill();
        }
    }
}

export default HeroAttack;
