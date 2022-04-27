import Phaser from "phaser";
import ProtectionOrb from "./ProtectionOrb";

class ProtectionOrbGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene, {
            allowGravity: false,
            immovable: true,
        });
        this.orbAmount = 3;
    }

    placeOrbs(x, y, amountOrbs) {
        this.createMultiple({
            key: "protection-orb",
            active: false,
            visible: false,
            classType: ProtectionOrb,
            frameQuantity: amountOrbs,
        });
        var orbs = this.getChildren();
        this.placementX = x;
        this.placementY = y;

        this.scene.time.delayedCall(
            300,
            orbs.forEach(orb => {
                orb.body.setCircle(16);
                this.scene.tweens.add({
                    targets: orb,
                    alpha: 1,
                    duration: 500,
                });
                orb.setActive(true);
                orb.setVisible(true);
                orb.setScale(2);
                orb.play("protection-orb-glow");
            }),
        );

        Phaser.Actions.PlaceOnCircle(orbs, new Phaser.Geom.Circle(x, y, 200));
    }

    refresh(amount) {
        this.hideOrbs();
        this.clear();
        this.scene.time.delayedCall(1000, () => {
            this.placeOrbs(this.placementX, this.placementY, this.orbAmount + amount);
        });
    }

    hideOrbs() {
        var orbs = this.getChildren();
        orbs.forEach(orb => {
            orb.collide();
        });
    }
}

export default ProtectionOrbGroup;
