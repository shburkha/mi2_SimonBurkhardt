const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let platforms;
let cursors;
let gameOver = false;
let pauseText;
let gamePaused = false;

const game = new Phaser.Game(config);

function preload ()
{
    // loading ground
    this.load.spritesheet('block', '../assets/block.png', {frameWidth: 50, frameHeight: 50});
    // loading player character
    this.load.image('ground', '../assets/ground.png');
}

function create ()
{
    // adding ground platform to the game
    platforms = this.physics.add.staticGroup();
    platforms.create(1000, 568, 'ground').setScale(4, 1).refreshBody();

    // adding player character to the game and physics
    player = this.physics.add.sprite(100, 450, 'block');

    // player gravity
    player.body.setGravityY(300);
    // player collider with world bounds and ground
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    // player block animations
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('block', {start: 0, end: 4}),
        frameRate: 5,
        repeat: 0
    });

    // input
    cursors = this.input.keyboard.createCursorKeys();

    //  pauseButton
    pauseText = this.add.text(680, 16, 'Pause', {fontSize: '2rem', fill: '#fff'}, pauseGame);
}

function update ()
{
    if(gameOver) {
        return;
    }

    if(cursors.up.isDown && player.body.touching.down) {
        player.anims.play('jump');
        player.setVelocityY(-330);
    }

}

function pauseGame() {
    if (this.gamePaused) {
        this.gamePaused = false;
        pauseText.setText('Pause');
        game.scene.resume('default');
    } else {
        this.gamePaused = true;
        pauseText.setText('Resume');
        game.scene.pause('default');
    }
}
