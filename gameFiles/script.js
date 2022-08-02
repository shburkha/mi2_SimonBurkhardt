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

// TODO multiple scenes (start, play, pause)
// TODO add obstacles

let esc;
let player;
let platforms;
let obstacles;
let cursors;
let gameOver = false;
let pauseText;
let gamePaused = false;
let backgroundMusic;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload ()
{
    // loading ground
    // v1
    this.load.spritesheet('block', '../assets/block.png', {frameWidth: 50, frameHeight: 50});
    // this.load.spritesheet('blockv2', '../assets/blockv2.png', {frameWidth: 50, frameHeight: 50}); // v2


    // loading obstacles
    this.load.image('obstacle', '../assets/obstacle.png');
    // loading player character
    this.load.image('ground', '../assets/ground.png');
    // background music
    this.load.audio('music', '../assets/Halvorsen - Wouldn\'t Change It [NCS Release].mp3');
}

function create ()
{
    backgroundMusic = this.sound.add('music');
    backgroundMusic.play();

    // adding esc as a key
    esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // adding ground platform to the game | original ground.png size: 500px * 10px
    platforms = this.physics.add.staticGroup();
    platforms.create(16700, 380, 'ground').setScale(66.8, 1).refreshBody();
    // platform to stop block from falling at the end
    platforms.create(33405, 335, 'ground').setScale(0.002, 10).refreshBody();

    // adding obstacles. block "dies" when hitting obstacles
    obstacles =  this.physics.add.staticGroup();
    obstacles.create(800 , 370, 'obstacle');

    // adding player character to the game and physics
    player = this.physics.add.sprite(400, 350, 'block');
    // player = this.physics.add.sprite(400, 350, 'blockv2'); //v2

    // player gravity
    player.body.setGravityY(300);
    // player collider with world bounds and ground
    // player.setCollideWorldBounds(true);

    // collider
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, obstacles, die, null, this);

    // player block animations
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('block', {start: 0, end: 9}),
        frameRate: 5,
        repeat: 0
    });

    // input
    cursors = this.input.keyboard.createCursorKeys();

    //  pauseButton + score
    pauseText = this.add.text(680, 16, 'Pause', {fontSize: '2rem', fill: '#fff'});
    scoreText = this.add.text(16, 16, 'Versuch 0', {fontSize: '2rem', fill: '#fff'});

    // camera following character
    this.cameras.main.startFollow(player, false, 1, 0, -175  , 150);
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

    // set player movement
    player.setVelocityX(200);
    console.log(player.x);
    // sets position from pauseButton and score relative to player Character
    pauseText.x = player.x + 450;
    scoreText.x = player.x - 200;

    // make camera follow player
    // lerpY: 0; doesn't follow jumps // offsetY: 100; fixes position
    // make transition smooth
    /*if(player.x > 200) {
        console.log("playerX: " + player.x);
        // TODO fix offsetY
        this.cameras.main.startFollow(player, false, 1, 0, 0, 150);
    }*/

    // TODO fix esc pause
    /*if(esc.isDown) {
        pauseGame();
    }*/
}

function pauseGame() {
    if (this.gamePaused) {
        // resumes music
        backgroundMusic.resume();
        this.gamePaused = false;
        pauseText.setText('Pause');
        // resumes scene
        game.scene.resume('default');

    } else {
        // pauses music
        backgroundMusic.pause();
        this.gamePaused = true;
        pauseText.setText('Resume');
        // pauses scene
        game.scene.pause('default');
    }
}

function die() {
    score++;
    scoreText.setText('Versuch ' + score);
    window.alert("game over");
}
