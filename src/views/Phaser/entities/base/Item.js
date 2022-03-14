import Phaser from "phaser";

/**
 * The Item class is a Phaser Sprite object.
 */
class Item extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, groundCollisionEnabled, gravityEnabled) {
        super(scene, x, y, key, 0);
        this.scene = scene;
        // Adds item to scene & scene's Arcade physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // Adds overlap between hero & item
        scene.physics.add.overlap(scene.hero, this);
        // If no preference specified, sets collision between item & ground true by default
        let collision = groundCollisionEnabled || true;
        (collision)
            ? this.groundCollider = this.physics.add.collider(this, scene.map.getLayer("Collide").tilemapLayer)
            : this.groundCollider = null;
        // If no preference specified, sets gravity enabled by default
        let gravity = gravityEnabled || true;
        (gravity)
            ? this.body.setAllowGravity(true)
            : body.setAllowGravity(false);
    }

    setGroundCollision(bool) {
        (bool)
            ? this.groundCollider = this.physics.add.collider(this.hero, this.map.getLayer("Collide").tilemapLayer)
            : this.groundCollider.destroy();
    }
}

export default Item;