import Phaser from "phaser";
import Crystal from "./Crystal";

class CrystalGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene, {
            allowGravity: false,
            immovable: true,
        });

        this.createMultiple({
            key: "kraken-earth-crystal",
            active: false,
            visible: false,
            classType: Crystal,
            frameQuantity: 60,
        });
    }

    fireCrystal(x, y, type) {
        const attack = this.getFirstDead(false);
        if (attack) {
            attack.fireAttack(x, y, type);
        }
    }

    increaseSpeed() {
        this.getChildren().forEach(crystal => {
            crystal.increaseSpeed();
        });
    }
}

export default CrystalGroup;
