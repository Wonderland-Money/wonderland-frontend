import Phaser from "phaser";
import HeroAttack from "./HeroAttack";

class ParticleGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene, {
            allowGravity: false,
            immovable: true,
        });

        this.createMultiple({
            key: "hero-bullet",
            active: false,
            visible: false,
            classType: HeroAttack,
            frameQuantity: 40,
        });
    }
    fireProjectile(x, y, type, direction) {
        const attack = this.getFirstDead(false);
        if (attack) {
            attack.fireAttack(x, y, type, direction);
        }
    }
}

export default ParticleGroup;
