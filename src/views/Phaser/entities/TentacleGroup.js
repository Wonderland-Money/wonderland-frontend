import Phaser from "phaser";
import Tentacle from "./Tentacle";

class TentacleGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene, {
            allowGravity: false,
            immovable: true,
        });

        this.createMultiple({
            key: "tentacle-earth",
            active: false,
            visible: false,
            classType: Tentacle,
            frameQuantity: 40,
        });
    }

    placeTentacle(x, y, type) {
        const tentacle = this.getFirstDead(false);
        if (tentacle) {
            tentacle.placeTentacle(x, y, type);
            tentacle.attack();
        }
    }
}

export default TentacleGroup;
