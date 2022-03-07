import Phaser from "phaser";
import StateMachine from "javascript-state-machine";
import { sharedInstance as events } from "../managers/EventCenter";

class Boss extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "boss-run-sheet", 0);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.anims.play("kraken-attackAir");

        this.setOrigin(0.5, 1);
        this.body.setCollideWorldBounds(true);
        this.body.setSize(60, 158);
        this.body.setOffset(100, 130);
        this.body.setMaxVelocity(200, 500);
        this.body.setDragX(550);
        this.setScale(2.7);

        this.setupAnimations();
        this.hitPoints = 25;
        this.krakenGrunt = this.scene.sound.add("kraken-grunt");

        this.isAlive = true;
        this.isHurt = false;
        this.phase = 0; // Phase increases speed of attacks, reduces cooldown
        this.currentElement = 0;
        this.currentElementName = ["Earth", "Air", "Water", "Fire", "Lightning"];
        this.isAttacking = false;
        this.activeAttackCooldown = 0;
        this.attackAnimSpeed = 1680; // 1.55 Seconds (reduced by 130ms each phase in line with animations)
        this.attackProjectileSpeed = 200; // Increases by 20 speed each phase
    }

    setupAnimations() {
        this.animState = new StateMachine({
            init: "idle",
            transitions: [
                { name: "idle", from: ["attackEarth", "attackAir", "attackWater", "attackFire", "attackLightning"], to: "idle" },
                { name: "attackEarth", from: ["idle"], to: "attackEarth" },
                { name: "attackAir", from: ["idle"], to: "attackAir" },
                { name: "attackWater", from: ["idle"], to: "attackWater" },
                { name: "attackFire", from: ["idle"], to: "attackFire" },
                { name: "attackLightning", from: ["idle"], to: "attackLightning" },
                { name: "die", from: "*", to: "dead" },
            ],
            methods: {
                onEnterState: lifecycle => {
                    this.anims.play("kraken-" + lifecycle.to);
                },
            },
        });
        this.animPredicates = {
            idle: () => {
                return this.body.velocity.x == 0 && !this.isAttacking;
            },
            attackEarth: () => {
                return this.isAttacking == true && this.currentElement === 0 && !this.attackCooldownActive;
            },
            attackAir: () => {
                return this.isAttacking == true && this.currentElement === 1 && !this.attackCooldownActive;
            },
            attackWater: () => {
                return this.isAttacking == true && this.currentElement === 2 && !this.attackCooldownActive;
            },
            attackFire: () => {
                return this.isAttacking == true && this.currentElement === 3 && !this.attackCooldownActive;
            },
            attackLightning: () => {
                return this.isAttacking == true && this.currentElement === 4 && !this.attackCooldownActive;
            },
        };
    }

    /**
     * An attack lasts for (this.activeCooldown - (300 * this.phase)) seconds, with a 2.5second cooldown in between attacks.
     * Each attack calls this.switchElement(), which randomly selects a new element to start the next attack cycle with.
     * Each new phase will speed up the frameRate of the played animation by +1
     */
    attack() {
        if (!this.isAttacking && this.activeAttackCooldown > 3500 - 200 * this.phase) {
            this.switchElement();
            this.isAttacking = true;
            this.scene.sound.add("kraken-attack").play();
            events.emit("boss-attack", this.currentElement);
            this.scene.anims.get(`kraken-attack${this.currentElementName[this.currentElement]}`).frameRate = 11 + this.phase;
            this.scene.time.delayedCall(this.attackAnimSpeed - 130 * this.phase, () => {
                this.isAttacking = false;
                this.activeAttackCooldown = 0;
            });
        } else {
            return;
        }
    }

    switchElement() {
        let randInt = Math.floor(Math.random() * 5);
        this.currentElement = randInt;
    }

    kill() {
        this.animState.die();
        this.isAlive = false;
        events.emit("boss-died");
    }

    hit(dmg) {
        let attackChangedPhase = false;
        if (!this.isHurt) {
            this.isHurt = true;
            if (this.isAlive) {
                this.hitPoints = this.hitPoints - dmg || this.hitPoints - 1;
                events.emit("boss-hit", this.hitPoints);
                this.body.setVelocityY(-70);
                if (this.hitPoints <= 20 - this.phase * 5) {
                    this.phase++;
                    events.emit("boss-change-phase", this.phase);
                    attackChangedPhase = true;
                }
                if (dmg > 1 && !attackChangedPhase) this.krakenGrunt.play();
                this.scene.time.delayedCall(250, () => {
                    this.isHurt = false;
                });
            }
            return attackChangedPhase;
        } else return;
    }

    preUpdate(time, delta) {
        // Boss should randomly glide left and right, always returning near a central position (the spawn point)
        if (this.hitPoints <= 0 && this.isAlive) {
            this.kill();
            return;
        }
        super.preUpdate(time, delta);
        this.attack();
        this.activeAttackCooldown += delta;

        for (const t of this.animState.transitions()) {
            if (t in this.animPredicates && this.animPredicates[t]()) {
                this.animState[t]();
                break;
            }
        }
    }
}

export default Boss;
