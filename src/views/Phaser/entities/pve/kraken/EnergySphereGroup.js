import Phaser from "phaser";
import EnergySphere from "./EnergySphere";

class EnergySphereGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene, {
            allowGravity: false,
            immovable: true,
        });
    }

    spawnEnergySpheres(x, y, amount, player) {
        this.createMultiple({
            key: "rage-attack",
            active: false,
            visible: false,
            classType: EnergySphere,
            frameQuantity: amount,
        });
        var spheres = this.getChildren();
        this.placementX = x;
        this.placementY = y;

        for (let i = 0; i < amount; ++i) {
            this.scene.time.delayedCall(500 * i, this.spawnSphere(x - 140, y - 100 + 80 * i, player));
        }
        //Phaser.Actions.PlaceOnEllipse(spheres, new Phaser.Geom.Ellipse(x-120, y, 20, 90), 0, 0.5)
    }

    killAll() {
        var spheres = this.getChildren();
        spheres.forEach(sphere => {
            sphere.collide();
        });
    }

    spawnSphere(x, y, player) {
        const attack = this.getFirstDead(false);
        if (attack) {
            attack.spawnEnergySphere(x, y, player);
        }
    }
}

export default EnergySphereGroup;
