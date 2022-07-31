const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
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

let esc;
// needed?
let setCam = false;
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
    // adding esc as a key
    esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // adding ground platform to the game
    platforms = this.physics.add.staticGroup();
    platforms.create(1000, 380, 'ground').setScale(4, 1).refreshBody();
    // platform to stop block from falling at the end
    platforms.create(2000, 335, 'ground').setScale(0.002, 10).refreshBody();

    // adding player character to the game and physics
    player = this.physics.add.sprite(25, 300, 'block');

    // player gravity
    player.body.setGravityY(300);
    // player collider with world bounds and ground
    // player.setCollideWorldBounds(true);
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

    if((cursors.up.isDown || cursors.space.isDown) && player.body.touching.down) {
        player.anims.play('jump');
        player.setVelocityY(-330);
    }

    player.setVelocityX(200);

    // make camera follow player
    // lerpY: 0; doesn't follow jumps // offsetY: 100; fixes position
    if(player.x > 200) {
        console.log("playerX: " + player.x);
        // TODO fix offsetY
        this.cameras.main.startFollow(player, false, 1, 0, 0, 150);
    }

    // TODO fix esc pause
    /*if(esc.isDown) {
        pauseGame();
    }*/
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
