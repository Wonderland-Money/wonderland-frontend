import Phaser from "phaser";
import StateMachine from "javascript-state-machine";
import { sharedInstance as events } from "../managers/EventCenter";
import variables from "../managers/Variables";

class Hero extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, attackEnabled) {
        super(scene, x, y, "hero-running", 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        //this.scene = scene
        this.anims.play("player-running");

        this.setOrigin(0.5, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(7, 23);
        this.setScale(2);
        this.body.setOffset(25, 28);
        this.body.setMaxVelocity(300, 600);
        this.body.setDragX(650);
        this.keys = scene.cursorKeys;
        this.attackEnabled = attackEnabled;
        this.input = {};
        this.keyboard = this.scene.input.keyboard;
        this.setupMovement();
        this.setupAnimations();
        this.hitPoints = 4;
        this.flip = 1;
        this.currentAttackSelection = 0;
        this.isAlive = true;
        this.isHit = false;
        this.isTeleporting = false;
        this.isAttacking = false;

        if (!this.scene.scene.isActive("DeathScreen")) {
            this.scene.scene.launch("GameUI", { attackEnabled: this.attackEnabled, hp: this.hitPoints }).moveAbove(scene.key);
        }

        scene.input.keyboard.on("keydown-ESC", () => {
            scene.scene.launch("PauseMenu", scene);
            scene.scene.pause();
        });
        scene.input.keyboard.on("keydown-P", () => {
            scene.scene.launch("PauseMenu", scene);
            scene.scene.pause();
        });
    }

    setupAnimations() {
        this.animState = new StateMachine({
            init: "idle",
            transitions: [
                { name: "idle", from: ["falling", "jumping", "running", "teleporting", "attackEarth", "attackAir", "attackWater", "attackFire", "attackLightning"], to: "idle" },
                { name: "jump", from: ["idle", "jumping", "running", "falling", "attackEarth", "attackAir", "attackWater", "attackFire", "attackLightning"], to: "jumping" },
                { name: "fall", from: ["idle", "jumping", "running"], to: "falling" },
                { name: "run", from: ["idle", "falling", "teleporting"], to: "running" },
                // { name: 'pivot', from: ['idle', 'falling', 'teleporting', 'running'], to: 'pivoting' },
                { name: "teleport", from: ["idle", "falling", "jumping", "running"], to: "teleporting" },
                { name: "attackEarth", from: ["idle", "falling", "running"], to: "attackEarth" },
                { name: "attackAir", from: ["idle", "falling", "running"], to: "attackAir" },
                { name: "attackWater", from: ["idle", "falling", "running"], to: "attackWater" },
                { name: "attackFire", from: ["idle", "falling", "running"], to: "attackFire" },
                { name: "attackLightning", from: ["idle", "running"], to: "attackLightning" },
                { name: "die", from: "*", to: "dead" },
            ],
            methods: {
                onEnterState: lifecycle => {
                    this.anims.play("player-" + lifecycle.to, true);
                    //console.log(lifecycle.to)
                },
            },
        });
        this.animPredicates = {
            idle: () => {
                return this.body.onFloor() && this.body.velocity.x == 0 && !this.isTeleporting && !this.isAttacking;
            },
            jump: () => {
                return this.body.velocity.y < 0;
            },
            fall: () => {
                return this.body.velocity.y > 0;
            },
            run: () => {
                return this.body.onFloor() && this.body.velocity.x != 0;
            },
            // run: () => {
            //     return this.body.onFloor() && Math.sign(this.body.velocity.x) === (this.flipX ? -1 : 1);
            // },
            // pivot: () => {
            //     return this.body.onFloor() && Math.sign(this.body.velocity.x) === (this.flipX ? 1 : -1);
            // },
            teleport: () => {
                return this.isTeleporting;
            },
            attackEarth: () => {
                return this.isAttacking && this.currentAttackSelection == 0;
            },
            attackAir: () => {
                return this.isAttacking && this.currentAttackSelection == 1;
            },
            attackWater: () => {
                return this.isAttacking && this.currentAttackSelection == 2;
            },
            attackFire: () => {
                return this.isAttacking && this.currentAttackSelection == 3;
            },
            attackLightning: () => {
                return this.isAttacking && this.currentAttackSelection == 4;
            },
        };
    }

    resetMovements() {
        this.keys.left.isDown = false;
        this.keys.right.isDown = false;
    }

    setupMovement() {
        this.moveState = new StateMachine({
            init: "standing",
            transitions: [
                { name: "jump", from: ["standing", "attacking"], to: "jumping" },
                { name: "doublejump", from: ["jumping", "falling", "attacking"], to: "doublejumping" },
                { name: "fall", from: ["standing"], to: "falling" },
                { name: "touchdown", from: ["jumping", "doublejumping", "falling", "attacking"], to: "standing" },
                { name: "die", from: "*", to: "dead" },
            ],
            methods: {
                onEnterState: lifecycle => {
                    //console.log(lifecycle)
                },
                onJump: () => {
                    this.body.setVelocityY(-450);
                },
                onDoublejump: () => {
                    this.body.setVelocityY(-450);
                },
            },
        });

        this.movePredicates = {
            jump: () => {
                return this.input.didPressJump && !this.isTeleporting && !this.isAttacking;
            },
            doublejump: () => {
                return this.input.didPressJump && !this.isTeleporting && !this.isAttacking;
            },
            fall: () => {
                return !this.body.onFloor() && !this.isAttacking;
            },
            touchdown: () => {
                return this.body.onFloor() && !this.isAttacking;
            },
        };
    }

    kill() {
        this.moveState.die();
        this.animState.die();
        this.isAlive = false;
        this.body.setBounce(0.6);
        events.emit("player-died");
        const deathMsg = ["RIP BOZO 💔", "No maidens? 😢", "Git gud", "NGMI 😈", "You are not goated with the sauce.", "F 💀", "💀💀💀", "🪦"];
        const styles = ["font-size: 18px", "padding: 2px 4px", "background-color: #000000"].join(";");
        const index = this.scene.getRandInt(deathMsg.length);
        console.log("%c" + deathMsg[index], styles);
        this.body.setVelocityY(-300);
    }

    hit() {
        if (this.hitPoints <= 0 && this.isAlive) {
            this.kill();
        } else if (this.isAlive && !this.isHit) {
            this.hitPoints -= 1;
            this.isHit = true;
            events.emit("player-hit", this.hitPoints);
            this.body.touching.right ? this.body.setVelocity(-150) : this.body.setVelocity(150);
            setTimeout(() => {
                this.body.setVelocityY(-100);
            }, 0);
            this.scene.time.delayedCall(400, () => {
                this.isHit = false;
                //this.resetMovements()
            });
        }
    }

    setAttackEnabled(bool) {
        this.attackEnabled = bool;
    }

    isAlive() {
        return this.isAlive;
    }

    getHealth() {
        return this.hitPoints;
    }

    setTeleporting(bool) {
        this.isTeleporting = bool;
    }

    switchAttack(attack) {
        if (this.attackEnabled) {
            this.currentAttackSelection = attack;
            events.emit("switch-attack", attack);
        }
    }

    setPauseInput(bool) {
        variables.gameState.inputPaused = bool;
        this.keyboard.clearCaptures();
    }

    /**
     * 0 - Earth
     * 1 - Air
     * 2 - Water
     * 3 - Fire
     * 4 - Lightning
     *
     * @TODO This shit needs to animate the character and freeze them in place for like 1/5 of a second
     */
    attack() {
        if (this.movePredicates.jump() || this.movePredicates.fall() || this.movePredicates.doublejump() || this.isAttacking) {
            return;
        } else {
            this.isAttacking = true;
            let element = this.currentAttackSelection;
            let playerAttackSound = this.scene.sound.add("player-attack");
            this.scene.time.delayedCall(650, () => {
                this.isAttacking = false;
                events.emit("player-attack", element);
                playerAttackSound.play();
            });
        }
    }

    preUpdate(time, delta) {
        if (this.isHit) {
            return;
        }

        if (this.hitPoints <= 0 && this.isAlive) {
            this.kill();
        }
        super.preUpdate(time, delta);

        if (!variables.gameState.inputPaused) {
            this.keyboard = this.scene.input.keyboard;
            this.input.didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);
            let key1 = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
            let key2 = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
            let key3 = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
            let key4 = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
            let key5 = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);

            // Switching Attack
            if (Phaser.Input.Keyboard.JustDown(key1) && this.currentAttackSelection != 0) {
                this.switchAttack(0);
            } else if (Phaser.Input.Keyboard.JustDown(key2) && this.currentAttackSelection != 1) {
                this.switchAttack(1);
            } else if (Phaser.Input.Keyboard.JustDown(key3) && this.currentAttackSelection != 2) {
                this.switchAttack(2);
            } else if (Phaser.Input.Keyboard.JustDown(key4) && this.currentAttackSelection != 3) {
                this.switchAttack(3);
            } else if (Phaser.Input.Keyboard.JustDown(key5) && this.currentAttackSelection != 4) {
                this.switchAttack(4);
            }

            let spaceBar = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            if (this.attackEnabled && Phaser.Input.Keyboard.JustDown(spaceBar)) {
                this.attack();
            }

            if (this.isAlive && this.keys.left.isDown && !this.isTeleporting && !this.isAttacking) {
                this.body.setAccelerationX(-700);
                this.setFlipX(true);
                this.flip = -1;
                //this.body.offset.x = 13;
            } else if (this.isAlive && this.keys.right.isDown && !this.isTeleporting && !this.isAttacking) {
                this.body.setAccelerationX(700);
                this.setFlipX(false);
                this.flip = 1;
                //this.body.offset.x = 22;
            } else {
                this.body.setAccelerationX(0);
                //this.body.offset.x = 18;
            }
        }

        for (const t of this.moveState.transitions()) {
            if (t in this.movePredicates && this.movePredicates[t]()) {
                this.moveState[t]();
                break;
            }
        }
        for (const t of this.animState.transitions()) {
            //console.log(this.animState.transitions())
            if (t in this.animPredicates && this.animPredicates[t]()) {
                this.animState[t]();
                break;
            }
        }
    }
}

export default Hero;
