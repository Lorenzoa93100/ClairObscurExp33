// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1e1e1e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [BootScene, BattleScene]
};

// BootScene: preload assets
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // TODO: Replace with real assets if available
        this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        this.load.image('boss', 'https://labs.phaser.io/assets/sprites/metalface78x92.png');
        this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/ball.png');
    }

    create() {
        this.scene.start('BattleScene');
    }
}

// BattleScene: main combat loop
class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
        this.player = null;
        this.boss = null;
        this.bullets = null;

        this.playerMaxHP = 100;
        this.bossMaxHP = 300;
        this.playerHP = this.playerMaxHP;
        this.bossHP = this.bossMaxHP;
        this.isPlayerInvincible = false;
    }

    create() {
        // Create player
        this.player = this.physics.add.sprite(400, 500, 'player').setScale(1.2);

        // Create boss sprite
        this.boss = this.physics.add.sprite(400, 100, 'boss');

        // Bullets group
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 50,
            runChildUpdate: true
        });

        // Input keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Collisions
        this.physics.add.overlap(this.player, this.bullets, this.handlePlayerHit, null, this);

        // Boss attack loop
        this.time.addEvent({
            delay: 1000, // frequency of attack
            callback: this.bossAttack,
            callbackScope: this,
            loop: true
        });
    }

    bossAttack() {
        // Fire 5 bullets in spread
        const bulletSpeed = 200;
        const spread = 200;
        for (let i = 0; i < 5; i++) {
            const bullet = this.bullets.get(this.boss.x, this.boss.y, 'bullet');
            if (bullet) {
                bullet.setActive(true).setVisible(true);
                bullet.body.enable = true;
                this.physics.velocityFromAngle(-90 + (i - 2) * spread / 4, bulletSpeed, bullet.body.velocity);
                bullet.setCollideWorldBounds(false);
            }
        }
    }

    handlePlayerHit(player, bullet) {
        bullet.setActive(false).setVisible(false);
        bullet.body.enable = false;

        if (this.isPlayerInvincible) return;

        this.playerHP = Math.max(0, this.playerHP - 10);
        this.updateHealthBars();

        // Brief invincibility frames
        this.isPlayerInvincible = true;
        this.player.setTint(0xff0000);
        this.time.delayedCall(500, () => {
            this.isPlayerInvincible = false;
            this.player.clearTint();
        });

        if (this.playerHP <= 0) {
            this.scene.restart();
        }
    }

    update(time, delta) {
        this.handlePlayerMovement();
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.handlePlayerAttack();
        }
    }

    handlePlayerMovement() {
        const speed = 250;
        this.player.body.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
        }

        // Normalize speed for diagonal movement
        this.player.body.velocity.normalize().scale(speed);
    }

    handlePlayerAttack() {
        // Simple melee/ranged attack: Detect boss within range and reduce HP
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
        if (distance < 100) {
            this.bossHP = Math.max(0, this.bossHP - 20);
            this.updateHealthBars();

            // Visual feedback
            this.boss.setTint(0xffe066);
            this.time.delayedCall(200, () => {
                this.boss.clearTint();
            });

            if (this.bossHP <= 0) {
                // Boss defeated => restart for looped combat
                this.scene.restart();
            }
        }
    }

    updateHealthBars() {
        const playerPercent = this.playerHP / this.playerMaxHP;
        const bossPercent = this.bossHP / this.bossMaxHP;

        document.getElementById('player-health').style.width = `${playerPercent * 100}%`;
        document.getElementById('boss-health').style.width = `${bossPercent * 100}%`;
    }
}

// Start game
window.onload = () => {
    new Phaser.Game(config);
};
